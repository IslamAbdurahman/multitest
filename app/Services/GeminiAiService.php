<?php

namespace App\Services;

use Gemini;
use Gemini\Data\Blob;
use Gemini\Data\GenerationConfig;
use Gemini\Data\Schema;
use Gemini\Enums\MimeType;
use Gemini\Enums\DataType;
use Gemini\Enums\ResponseMimeType;

class GeminiAiService
{
    protected $client;
    // Update this to the current stable model (e.g., gemini-2.0-flash or gemini-2.5-flash)
    protected string $model = 'gemini-2.5-flash-lite';

    public function __construct()
    {
        $apiKey = env('GEMINI_API_KEY');
        if (empty($apiKey)) {
            \Illuminate\Support\Facades\Log::error('GEMINI_API_KEY is not set in .env file');
        }
        $this->client = Gemini::client($apiKey ?? '');
    }

    public function evaluateEssay(string $taskPrompt, string $questionText, string $essayText): string
    {
        $essayText = mb_substr($essayText, 0, 4000);
        $questionText = strip_tags($questionText);

        $promptText = "You are an IELTS examiner. Evaluate the following essay based on:
1. Task Response, 2. Coherence & Cohesion, 3. Lexical Resource, 4. Grammatical Range & Accuracy.
Give band scores (0–9) for each and overall, plus feedback 250 words.

Task: {$taskPrompt}
Question: {$questionText}
Essay: {$essayText}";

        try {
            $response = $this->client->generativeModel(model: $this->model)
                ->withGenerationConfig(new GenerationConfig(
                    responseMimeType: ResponseMimeType::APPLICATION_JSON,
                    responseSchema: new Schema(
                        type: DataType::OBJECT,
                        properties: [
                            'task_response' => new Schema(type: DataType::NUMBER),
                            'coherence_cohesion' => new Schema(type: DataType::NUMBER),
                            'lexical_resource' => new Schema(type: DataType::NUMBER),
                            'grammatical_accuracy' => new Schema(type: DataType::NUMBER),
                            'overall' => new Schema(type: DataType::NUMBER),
                            'feedback' => new Schema(type: DataType::STRING),
                        ],
                        required: ['overall', 'feedback']
                    )
                ))
                ->generateContent($promptText);

            return $response->text();
        } catch (\Exception $e) {
            return json_encode(['error' => $e->getMessage()]);
        }
    }

    public function transcribeAudio(string $relativePath): string
    {
        try {
            $fullPath = $this->getPhysicalPath($relativePath);
            if (!file_exists($fullPath)) return json_encode(['error' => "File not found."]);

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
            return json_encode(['error' => $e->getMessage()]);
        }
    }

    public function evaluateSpeaking(string $questionText, string $transcript): string
    {
        $promptText = "You are an expert IELTS Speaking examiner. Evaluate:
1. Fluency, 2. Lexical Resource, 3. Grammar, 4. Pronunciation.
Provide scores (0–9) and overall feedback.

Question: {$questionText}
Transcript: {$transcript}";

        try {
            $response = $this->client->generativeModel(model: $this->model)
                ->withGenerationConfig(new GenerationConfig(
                    responseMimeType: ResponseMimeType::APPLICATION_JSON,
                    responseSchema: new Schema(
                        type: DataType::OBJECT,
                        properties: [
                            'fluency' => new Schema(type: DataType::NUMBER),
                            'lexical_resource' => new Schema(type: DataType::NUMBER),
                            'grammar' => new Schema(type: DataType::NUMBER),
                            'pronunciation' => new Schema(type: DataType::NUMBER),
                            'overall' => new Schema(type: DataType::NUMBER),
                            'feedback' => new Schema(type: DataType::STRING),
                        ],
                        required: ['overall', 'feedback']
                    )
                ))
                ->generateContent($promptText);
            return $response->text();
        } catch (\Exception $e) {
            return json_encode(['error' => $e->getMessage()]);
        }
    }

    public function evaluateSpeakingDirectly(string $audioPath, object $question): string
    {
        try {
            $fullPath = $this->getPhysicalPath($audioPath);
            if (!file_exists($fullPath)) return json_encode(['error' => "Error: File not found."]);

            $mimeType = $this->getMimeType($fullPath);

            $instruction = "
You are an expert Uzbekistan Multilevel (CEFR) Speaking Examiner.
Your task is to evaluate the provided audio response based on official scientific CEFR descriptors.

TARGET LANGUAGE:
- Language code: {$question->part->test->language->code}
- Language name (English): {$question->part->test->language->name_en}

SCORING CRITERIA (Total: 0–75 points, 15 points each):
1. Fluency and Coherence (0–15): Speech flow, hesitations, linking of ideas.
2. Lexical Resource (0–15): Range and accuracy of vocabulary.
3. Grammatical Range & Accuracy (0–15): Variety and correctness of structures.
4. Pronunciation (0–15): Intelligibility, stress, and intonation.
5. Interactive Communication / Relevance (0–15): Directly answering the question and maintaining interaction.

CEFR LEVEL DESCRIPTORS FOR REFERENCE:
- C1 (65–75): Fluent, spontaneous, complex subjects, almost no searching for words.
- B2 (51–64): Regular interaction with native speakers possible without strain. Clear, detailed descriptions on wide range of subjects.
- B1 (38–50): Can deal with most situations. Narrate dreams, hopes, ambitions. Simple connected phrases.
- A2 (16–37): Simple and routine tasks. Direct exchange of information on familiar topics.
- A1 (0–15): Basic expressions, very simple phrases about personal details.

CRITICAL RULES:
- RELEVANCE IS MANDATORY: If the response is off-topic, irrelevant, singing, or fails to address the specific question, assign a score of 0 and level 'Below A1', even if fluent.
- STRICT LANGUAGE ENFORCEMENT: You MUST verify if the spoken language matches the TARGET LANGUAGE ({$question->part->test->language->name_en}). If the candidate speaks in any other language, you MUST assign a total `score` of 0, set `level` to \"Below A1\", and explain the language mismatch in the feedback fields.
- AUDIO QUALITY & SILENCE: If the audio is silent, contains only background noise, static, breathing, or unintelligible sounds, you MUST set the `transcript` to \"[SILENCE]\", assign a total `score` of 0, and set `level` to \"Below A1\". 
- NO HALLUCINATION: Do NOT guess, invent, or hallucinate speech if it is not clearly and distinctly audible. If there is any doubt about the existence of speech, treat the audio as noise. 
- No positive feedback for 0 scores. All feedback fields should state the reason for the zero score (e.g., \"Wrong language detected\" or \"No speech detected\").
- ALWAYS provide a verbatim `transcript`. If no speech, use \"[SILENCE]\".
- IDENTIFY LANGUAGE: You must identify the `detected_language` in the response.

QUESTION:
{$question->textarea}
";
            $response = $this->client->generativeModel(model: $this->model)
                ->withGenerationConfig(new GenerationConfig(
                    responseMimeType: ResponseMimeType::APPLICATION_JSON,
                    responseSchema: new Schema(
                        type: DataType::OBJECT,
                        properties: [
                            'fluency' => new Schema(type: DataType::STRING),
                            'vocabulary' => new Schema(type: DataType::STRING),
                            'grammar' => new Schema(type: DataType::STRING),
                            'pronunciation' => new Schema(type: DataType::STRING),
                            'interaction' => new Schema(type: DataType::STRING),
                            'score' => new Schema(type: DataType::NUMBER),
                            'level' => new Schema(type: DataType::STRING),
                            'transcript' => new Schema(type: DataType::STRING),
                            'detected_language' => new Schema(type: DataType::STRING),
                        ],
                        required: ['score', 'level', 'transcript', 'fluency', 'vocabulary', 'grammar', 'pronunciation', 'interaction', 'detected_language']
                    )
                ))
                ->generateContent([
                    $instruction,
                    new Blob(
                        mimeType: $mimeType,
                        data: base64_encode(file_get_contents($fullPath))
                    )
                ]);

            return $response->text();
        } catch (\Exception $e) {
            return json_encode(['error' => $e->getMessage()]);
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
