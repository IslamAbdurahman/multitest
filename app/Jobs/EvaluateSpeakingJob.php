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

use Telegram\Bot\FileUpload\InputFile;

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
        if (!$answer || !$answer->audio_path || $answer->score_ai !== null) return;

        $aiService = new GeminiAiService();

        try {
            // 1. Evaluate speaking directly
            $resultText = $aiService->evaluateSpeakingDirectly(
                $answer->audio_path,
                $answer->question
            );

            // 2. Parse Result
            $data = json_decode($resultText, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($data)) {
                $transcript = $data['transcript'] ?? '';
                $answer->transcript = $transcript;
                $answer->review_ai = $resultText;

                $answer->score_ai = (int) ($data['score'] ?? 0);

                // 3. Language & Silence Enforcement
                $targetLanguage = strtolower($answer->question->part->test->language->name_en);
                $detectedLanguage = strtolower($data['detected_language'] ?? '');

                if ($detectedLanguage !== 'noise' && $detectedLanguage !== 'silence' && !empty($detectedLanguage)) {
                    if (!str_contains($detectedLanguage, $targetLanguage) && !str_contains($targetLanguage, $detectedLanguage)) {
                        $answer->score_ai = 0;
                    }
                }

                $isRelevant = $data['is_relevant'] ?? true;
                if ($isRelevant === false) {
                    $answer->score_ai = 0;
                    Log::info("Answer #{$answer->id}: Score set to 0 due to irrelevant response.");
                }

                if ($this->isNonSpeechResponse($transcript) || $detectedLanguage === 'noise' || $detectedLanguage === 'silence') {
                    $answer->score_ai = 0;
                }
            } else {
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

            // Extract text and images from question
            $questionText = $this->extractText($question->textarea ?? '');
            $imageUrls = $this->extractImageUrls($question->textarea ?? '');
            $scoreAi = $answer->score_ai ?? 0;

            $caption = "🎉 *Natijangiz tayyor!*\n\n"
                . "👤 {$user->name}\n"
                . "📝 *Savol :* {$questionText}\n"
                . "📊 *AI bahosi:* {$scoreAi}\n\n"
                . "💳 *Bizni Qo'llab-quvvatlang:*\n\n"
                . "`9860600402432220`\n\n"
                . "Donat qilishingiz mumkin.";

            Log::info("Telegram notify start for Answer #{$answer->id}. Images: " . count($imageUrls));

            if (count($imageUrls) > 1) {
                // Send as media group (Album)
                try {
                    Log::info("Sending MediaGroup for Answer #{$answer->id} with " . count($imageUrls) . " images.");
                    $media = [];
                    $attachments = [];

                    foreach ($imageUrls as $index => $imgData) {
                        $attachmentName = "photo{$index}";
                        
                        if ($imgData['type'] === 'local') {
                            $attachments[$attachmentName] = InputFile::create($imgData['path'], basename($imgData['path']));
                            $mediaId = "attach://{$attachmentName}";
                        } else {
                            $mediaId = $imgData['path'];
                        }

                        $media[] = [
                            'type' => 'photo',
                            'media' => $mediaId,
                            'caption' => $index === 0 ? $caption : '',
                            'parse_mode' => 'Markdown',
                        ];
                    }

                    $params = [
                        'chat_id' => $chatId,
                        'media' => json_encode($media),
                    ];

                    // Merge attachments directly into params for multipart upload
                    foreach ($attachments as $key => $file) {
                        $params[$key] = $file;
                    }

                    $telegram->sendMediaGroup($params);
                    Log::info("MediaGroup sent successfully for Answer #{$answer->id}");
                    return;
                } catch (\Exception $grpErr) {
                    Log::error("MediaGroup send failed for Answer #{$answer->id}: " . $grpErr->getMessage());
                    // Fall through to fallback
                }
            } elseif (count($imageUrls) === 1) {
                // Single image
                try {
                    Log::info("Sending single photo for Answer #{$answer->id}");
                    $imgData = $imageUrls[0];
                    $photo = $imgData['type'] === 'local' 
                        ? InputFile::create($imgData['path'], basename($imgData['path'])) 
                        : $imgData['path'];

                    $telegram->sendPhoto([
                        'chat_id' => $chatId,
                        'photo' => $photo,
                        'caption' => $caption,
                        'parse_mode' => 'Markdown',
                    ]);
                    Log::info("Single photo sent successfully for Answer #{$answer->id}");
                    return;
                } catch (\Exception $imgErr) {
                    Log::error("Single photo send failed for Answer #{$answer->id}: " . $imgErr->getMessage());
                    // Fall through to fallback
                }
            }

            // Ultimate fallback (text only)
            Log::info("Falling back to text-only message for Answer #{$answer->id}");
            $this->sendFallbackText($telegram, $chatId, $caption);

        } catch (\Throwable $e) {
            Log::error("sendPerQuestionTelegram fatal failure for Answer #{$answer->id}: " . $e->getMessage());
        }
    }

    /**
     * Fallback text sender
     */
    protected function sendFallbackText(Api $telegram, $chatId, string $caption): void
    {
        try {
            $telegram->sendMessage([
                'chat_id' => $chatId,
                'text' => $caption,
                'parse_mode' => 'Markdown',
            ]);
        } catch (\Exception $e) {
            Log::error("Telegram fallback text error: " . $e->getMessage());
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
     * Extract all image URLs from HTML and convert to local paths if applicable.
     */
    protected function extractImageUrls(string $html): array
    {
        $images = [];
        if (preg_match_all('/<img[^>]+src=["\']([^"\']+)["\']/i', $html, $matches)) {
            foreach ($matches[1] as $src) {
                // If it's a relative /storage/ path
                if (str_starts_with($src, '/storage/')) {
                    $path = storage_path('app/public/' . substr($src, 9)); // removed /storage/
                    if (file_exists($path)) {
                        $images[] = ['type' => 'local', 'path' => $path];
                    }
                }
                // If it's an absolute URL pointing to our app
                elseif (str_starts_with($src, env('APP_URL') . '/storage/')) {
                    $path = storage_path('app/public/' . substr(parse_url($src, PHP_URL_PATH), 9));
                    if (file_exists($path)) {
                        $images[] = ['type' => 'local', 'path' => $path];
                    }
                }
                // external URL
                elseif (str_starts_with($src, 'http')) {
                    $images[] = ['type' => 'url', 'path' => $src];
                }
            }
        }
        return $images;
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
                    Log::info("Telegram notifications were sent per-question, skipping final summary for user {$user->id}");
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
