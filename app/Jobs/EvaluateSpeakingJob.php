<?php

namespace App\Jobs;

use App\Models\AttemptAnswer;
use App\Services\GeminiAiService;
use App\Services\OpenAIService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Telegram\Bot\Api;

class EvaluateSpeakingJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $answerId;

    public function __construct($answerId)
    {
        $this->answerId = $answerId;
    }

    public function handle()
    {
        $answer = AttemptAnswer::find($this->answerId);
        if (!$answer || !$answer->audio_path) return;

        $aiService = new GeminiAiService();

        try {
            // 1. Evaluate speaking directly (Consolidated: Audio -> Transcript + CEFR)
            $resultText = $aiService->evaluateSpeakingDirectly(
                $answer->audio_path,
                $answer->question
            );

            // 2. Parse Result
            $data = json_decode($resultText, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($data)) {
                $transcript = $data['transcript'] ?? '';
                $answer->transcript = $transcript;
                $answer->review_ai = $resultText; // Store raw JSON for the frontend helper

                $answer->score_ai = (int) ($data['score'] ?? 0);

                // 3. Language & Silence Enforcement
                $targetLanguage = strtolower($answer->question->part->test->language->name_en);
                $detectedLanguage = strtolower($data['detected_language'] ?? '');

                // Ensure score is 0 if language mismatch (excluding noise/silence which is handled below)
                if ($detectedLanguage !== 'noise' && $detectedLanguage !== 'silence' && !empty($detectedLanguage)) {
                    // Check if detected language contains target language or vice versa (e.g. "English" vs "English (US)")
                    if (!str_contains($detectedLanguage, $targetLanguage) && !str_contains($targetLanguage, $detectedLanguage)) {
                        $answer->score_ai = 0;
                    }
                }

                // 4. Relevance Enforcement: If AI says answer is not relevant to the question, force score to 0
                $isRelevant = $data['is_relevant'] ?? true;
                if ($isRelevant === false) {
                    $answer->score_ai = 0;
                    Log::info("Answer #{$answer->id}: Score set to 0 due to irrelevant response.");
                }

                if ($this->isNonSpeechResponse($transcript) || $detectedLanguage === 'noise' || $detectedLanguage === 'silence') {
                    $answer->score_ai = 0;
                }
            } else {
                // Fallback for non-JSON or weird output
                if (preg_match('/"score"\s*:\s*(\d+)/', $resultText, $matches)) {
                    $answer->score_ai = (int) $matches[1];
                }
                $answer->review_ai = $resultText;
            }

            $answer->save();

            // Send per-question Telegram notification immediately
            $this->sendPerQuestionTelegram($answer);

            // Check if all answers for this attempt are now AI-evaluated
            $this->checkAndNotifyIfComplete($answer);

        } catch (\Throwable $e) {
            $answer->review_ai = 'AI Error: ' . $e->getMessage();
            $answer->save();
        }
    }

    /**
     * Send Telegram notification for this specific question right after AI evaluation.
     */
    protected function sendPerQuestionTelegram(AttemptAnswer $answer): void
    {
        try {
            $attemptPart = $answer->attempt_part;
            if (!$attemptPart) return;

            $attempt = $attemptPart->attempt;
            if (!$attempt) return;

            $user = $attempt->user;
            if (!$user || !$user->telegram_id) return;

            $question = $answer->question;
            if (!$question) return;

            $telegram = new Api(env('MultitestUzBot_TOKEN'));
            $chatId = $user->telegram_id;

            // Extract text and image from question
            $questionText = $this->extractText($question->textarea ?? '');
            $imageUrl = $this->extractImageUrl($question->textarea ?? '');
            $scoreAi = $answer->score_ai ?? 0;

            // If question has an image, send as photo with caption
            if ($imageUrl) {
                try {
                    $caption = "📝 *savol :* {$questionText}\n"
                        . "📊 *AI bahosi:* {$scoreAi}";

                    $telegram->sendPhoto([
                        'chat_id' => $chatId,
                        'photo' => $imageUrl,
                        'caption' => $caption,
                        'parse_mode' => 'Markdown',
                    ]);
                    return;
                } catch (\Exception $imgErr) {
                    Log::warning("Image send failed, sending text: " . $imgErr->getMessage());
                }
            }

            // Send as text message
            $msg = "📝 *savol :* {$questionText}\n"
                . "📊 *AI bahosi:* {$scoreAi}";

            $telegram->sendMessage([
                'chat_id' => $chatId,
                'text' => $msg,
                'parse_mode' => 'Markdown',
            ]);

        } catch (\Throwable $e) {
            Log::error("sendPerQuestionTelegram failed: " . $e->getMessage());
        }
    }

    /**
     * Extract plain text from HTML.
     */
    protected function extractText(string $html): string
    {
        $text = strip_tags($html);
        $text = html_entity_decode($text, ENT_QUOTES, 'UTF-8');
        $text = trim(preg_replace('/\s+/', ' ', $text));
        if (mb_strlen($text) > 200) {
            $text = mb_substr($text, 0, 200) . '...';
        }
        return $text ?: '—';
    }

    /**
     * Extract first image URL from HTML.
     */
    protected function extractImageUrl(string $html): ?string
    {
        if (preg_match('/<img[^>]+src=["\']([^"\']+)["\']/i', $html, $matches)) {
            $url = $matches[1];
            if (!str_starts_with($url, 'http')) {
                $url = url($url);
            }
            return $url;
        }
        return null;
    }

    /**
     * Check if all answers for the parent attempt have been AI-evaluated.
     * If yes, dispatch notification to the user (Telegram or Email).
     */
    protected function checkAndNotifyIfComplete(AttemptAnswer $answer): void
    {
        try {
            $attemptPart = $answer->attempt_part;
            if (!$attemptPart) return;

            $attempt = $attemptPart->attempt;
            if (!$attempt) return;

            // Count total answers with audio and unevaluated ones
            $totalAudioAnswers = AttemptAnswer::whereHas('attempt_part', function ($q) use ($attempt) {
                $q->where('attempt_id', $attempt->id);
            })->whereNotNull('audio_path')->count();

            $unevaluatedAnswers = AttemptAnswer::whereHas('attempt_part', function ($q) use ($attempt) {
                $q->where('attempt_id', $attempt->id);
            })->whereNotNull('audio_path')->whereNull('score_ai')->count();

            // Only proceed if there were audio answers and all are now evaluated
            if ($totalAudioAnswers === 0 || $unevaluatedAnswers > 0) {
                return;
            }

            // Use cache lock to prevent duplicate notifications from concurrent jobs
            $lockKey = "attempt_notification_{$attempt->id}";
            $lock = Cache::lock($lockKey, 60);

            if ($lock->get()) {
                $user = $attempt->user;
                if (!$user) {
                    $lock->release();
                    return;
                }

                Log::info("All AI evaluations complete for attempt #{$attempt->id}. Sending notification to user {$user->id}.");

                if ($user->telegram_id) {
                    SendResultTelegramJob::dispatch($user, $attempt)->delay(now()->addSeconds(5));
                    Log::info("Dispatched SendResultTelegramJob for user {$user->id}");
                } elseif ($user->email) {
                    SendResultEmailJob::dispatch($user, $attempt)->delay(now()->addSeconds(5));
                    Log::info("Dispatched SendResultEmailJob for user {$user->id}");
                } else {
                    Log::info("User {$user->id} has neither telegram_id nor email. No notification sent.");
                }
            }
        } catch (\Throwable $e) {
            Log::error("checkAndNotifyIfComplete failed: " . $e->getMessage());
        }
    }

    public function isMostlyEnglish(string $text): bool
    {
        // 1. Reject if contains Cyrillic or specialized Uzbek Krill letters
        if (preg_match('/[А-Яа-яЎўҚқҒғҲҳ]/u', $text)) {
            return false;
        }

        // 2. Reject if contains Turkish/Azeri special characters (ğ, ü, ş, ı, ö, ç)
        if (preg_match('/[ğüşıöçĞÜŞİÖÇ]/u', $text)) {
            return false;
        }

        // 3. Must contain English letters or numbers/symbols typical of noise/silence (which we handled above)
        return preg_match('/[a-zA-Z]/', $text) === 1;
    }

    /**
     * Detect if the transcript indicates a non-speech response.
     */
    public function isNonSpeechResponse(string $text): bool
    {
        $text = strtolower(trim($text));
        
        $nonSpeechPatterns = [
            '/\bsilence\b/i',
            '/\bbackground noise\b/i',
            '/\bno discernible speech\b/i',
            '/\bno speech\b/i',
            '/\bcontains no speech\b/i',
            '/\bnot possible to transcribe\b/i',
            '/\bupbeat music\b/i',
            '/\bstrong beat\b/i',
            '/\[SILENCE\]/i',
            '/\[NOISE\]/i',
            '/^\(.*\)$/', // Transcriptions in parentheses like (Silence)
            '/^[0-9: ]+$/', // Just timestamps or numbers
        ];

        foreach ($nonSpeechPatterns as $pattern) {
            if (preg_match($pattern, $text)) {
                return true;
            }
        }

        // If the string contains NO letters or numbers (only symbols/punctuation), it's noise
        if (!preg_match('/[a-z0-9]/i', $text)) {
            return true;
        }

        // Extremely short transcripts (1-2 characters) that aren't letters are likely noise
        if (strlen($text) < 3 && !preg_match('/[a-z]/i', $text)) {
            return true;
        }

        return false;
    }



}
