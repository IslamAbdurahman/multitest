<?php

namespace App\Services;

use Gemini;
use Gemini\Data\Blob;
use Gemini\Enums\MimeType;

class GeminiAiService
{
    protected $client;
    // Update this to the current stable model (e.g., gemini-2.0-flash or gemini-2.5-flash)
    protected string $model = 'gemini-2.5-flash-lite';

    public function __construct()
    {
        $this->client = Gemini::client(env('GEMINI_API_KEY'));
    }

    public function evaluateEssay(string $taskPrompt, string $questionText, string $essayText): string
    {
        $essayText = mb_substr($essayText, 0, 4000);
        $questionText = strip_tags($questionText);

        $promptText = "You are an IELTS examiner. Evaluate the following essay based on:
1. Task Response, 2. Coherence & Cohesion, 3. Lexical Resource, 4. Grammatical Range & Accuracy.
Give band scores (0–9) for each and overall, plus feedback 250 words.
End with JSON: ```json {\"overall\": X} ```

Task: {$taskPrompt}
Question: {$questionText}
Essay: {$essayText}";

        try {
            // Using the newer generativeModel() method which is more stable across SDK updates
            $response = $this->client->generativeModel(model: $this->model)
                ->generateContent($promptText);

            return $response->text();
        } catch (\Exception $e) {
            return "Error: " . $e->getMessage();
        }
    }

    public function transcribeAudio(string $relativePath): string
    {
        try {
            $fullPath = $this->getPhysicalPath($relativePath);
            if (!file_exists($fullPath)) return "File not found.";

            $mimeType = $this->getMimeType($fullPath);

            $response = $this->client->generativeModel(model: $this->model)
                ->generateContent([
                    'Please provide a word-for-word transcription of this audio.',
                    new Blob(
                        mimeType: $mimeType,
                        data: base64_encode(file_get_contents($fullPath))
                    )
                ]);

            return $response->text();
        } catch (\Exception $e) {
            return "Transcription Error: " . $e->getMessage();
        }
    }

    public function evaluateSpeaking(string $questionText, string $transcript): string
    {
        $promptText = "You are an expert IELTS Speaking examiner. Evaluate:
1. Fluency, 2. Lexical Resource, 3. Grammar, 4. Pronunciation.
Provide scores (0–9) and JSON: ```json {\"overall\": X} ```

Question: {$questionText}
Transcript: {$transcript}";

        try {
            $response = $this->client->generativeModel(model: $this->model)
                ->generateContent($promptText);
            return $response->text();
        } catch (\Exception $e) {
            return "Evaluation Error: " . $e->getMessage();
        }
    }

    public function evaluateSpeakingDirectly(string $audioPath, object $question): string
    {
        try {
            $fullPath = $this->getPhysicalPath($audioPath);
            if (!file_exists($fullPath)) return "Error: File not found.";

            $mimeType = $this->getMimeType($fullPath);

            $instruction = "
You are an official Uzbekistan Multilevel (CEFR) Speaking Examiner.

TARGET LANGUAGE:
- Language code: {$question->part->test->language->code}
- Language name (English): {$question->part->test->language->name_en}

IMPORTANT RULES:
- Evaluate ONLY the provided audio response.
- The response MUST be entirely in the TARGET LANGUAGE.
- The response MUST directly and clearly answer the given question.
- If the response is NOT in the target language (fully or partially), assign a score of 0 and level 'Below A1'.
- If the response is off-topic, irrelevant, memorized, or does not answer the question, assign a score of 0 and level 'Below A1'.
- Do NOT translate or interpret speech from any other language.
- Do NOT evaluate content spoken in any other language.
- If score is 0, do NOT provide any positive feedback.

EVALUATION CRITERIA (Total: 0–75 points):
- Fluency
- Vocabulary
- Grammar
- Pronunciation

SCORING GUIDELINES:
- Fluency: smoothness, pauses, coherence
- Vocabulary: range, accuracy, appropriateness
- Grammar: correctness, complexity, sentence structure
- Pronunciation: clarity, intelligibility, stress, intonation

CEFR LEVEL MAPPING:
- 0–15   → Below A1
- 16–37  → A2
- 38–50  → B1
- 51–64  → B2
- 65–75  → C1

QUESTION:
{$question->textarea}

FINAL OUTPUT RULES:
1. First, return brief evaluations for:
   - Fluency
   - Vocabulary
   - Grammar
   - Pronunciation
2. Then return ONLY the following JSON and nothing else:

```json
{
  'score': X,
  'level': 'Below A1/A2/B1/B2/C1'
}

";
            $response = $this->client->generativeModel(model: $this->model)
                ->generateContent([
                    $instruction,
                    new Blob(
                        mimeType: $mimeType,
                        data: base64_encode(file_get_contents($fullPath))
                    )
                ]);

            return $response->text();
        } catch (\Exception $e) {
            return "Evaluation Error: " . $e->getMessage();
        }
    }

    private function getPhysicalPath(string $path): string
    {
        $cleanPath = str_replace(['/storage/', 'storage/'], '', $path);
        return storage_path('app/public/' . ltrim($cleanPath, '/'));
    }

    private function getMimeType(string $filePath): MimeType
    {
        $extension = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        return match ($extension) {
            'mp3' => MimeType::AUDIO_MP3,
            'wav' => MimeType::AUDIO_WAV,
            'ogg' => MimeType::AUDIO_OGG,
            default => MimeType::AUDIO_MP3,
        };
    }
}
