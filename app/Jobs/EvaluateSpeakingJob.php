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
use Illuminate\Support\Facades\Log;

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
            // 1. Transcribe audio
            $transcript = $aiService->transcribeAudio($answer->audio_path);
            $answer->transcript = $transcript;

            // 2. Language & Content validation
            if ($this->isNonSpeechResponse($transcript)) {
                $answer->score_ai = 0;
                $answer->review_ai = json_encode([
                    'score' => 0,
                    'level' => 'Below A1',
                    'feedback' => 'The audio contains no discernible speech or only background noise.',
                ]);
                $answer->save();
                return;
            }

            if (!$this->isMostlyEnglish($transcript)) {
                $answer->score_ai = 0;
                $answer->review_ai = json_encode([
                    'score' => 0,
                    'level' => 'Below A1',
                    'feedback' => 'Non-English response. Automatically scored as 0.',
                ]);
                $answer->save();
                return;
            }

            // 3. Evaluate speaking (audio-based CEFR)
            $questionText = strip_tags($answer->question->textarea ?? 'General Speaking Task');
            $resultText = $aiService->evaluateSpeakingDirectly(
                $answer->audio_path,
                $answer->question
            );

            // 4. Parse Result
            $data = json_decode($resultText, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($data)) {
                $answer->score_ai = (int) ($data['score'] ?? 0);
                $answer->review_ai = $resultText; // Store raw JSON for the frontend helper
            } else {
                // Fallback for non-JSON or weird output
                if (preg_match('/"score"\s*:\s*(\d+)/', $resultText, $matches)) {
                    $answer->score_ai = (int) $matches[1];
                }
                $answer->review_ai = $resultText;
            }
            $answer->save();

        } catch (\Throwable $e) {
            $answer->review_ai = 'AI Error: ' . $e->getMessage();
            $answer->save();
        }
    }

    public function isMostlyEnglish(string $text): bool
    {
        // 1. Reject if contains Cyrillic or specialized Uzbek Krill letters
        if (preg_match('/[А-Яа-яЎўҚқҒғҲҳ]/u', $text)) {
            return false;
        }

        // 2. Reject if it looks like Uzbek Latin (common markers like o', g', sh, ch prefixes or specific letter frequencies)
        // This is a heuristic: check for common Uzbek Latin specific markers.
        // Actually, many Uzbek words are distinct. Let's look for common Uzbek words.
        $uzbekWords = ['bo\'lib', 'emas', 'uchun', 'bo\'lgan', 'bilan', 'hamda', 'qilish', 'tomonidan', 'o\'zbekiston', 'assalomu', 'alaykum'];
        $lowerText = strtolower($text);
        foreach ($uzbekWords as $word) {
            if (preg_match('/\b' . preg_quote($word) . '\b/', $lowerText)) {
                 return false;
            }
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
