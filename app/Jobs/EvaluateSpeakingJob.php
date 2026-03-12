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

            // 2. Language validation (ENGLISH ONLY)
            if (!$this->isMostlyEnglish($transcript)) {
                $answer->score_ai = 0;
                $answer->review_ai = 'Non-English response. Automatically scored as 0 (Below A1).';
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
        // If contains Cyrillic or Uzbek-specific letters → reject
        if (preg_match('/[А-Яа-яЎўҚқҒғҲҳ]/u', $text)) {
            return false;
        }

        // Must contain English letters
        return preg_match('/[a-zA-Z]/', $text) === 1;
    }



}
