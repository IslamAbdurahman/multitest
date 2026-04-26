<?php

namespace App\Services;

use OpenAI;

class OpenAIService
{
    protected $client;

    public function __construct()
    {
        $this->client = OpenAI::client(config('services.openai.api_key'));
    }

    public function evaluateEssay(string $taskPrompt, string $questionText, string $essayText): string
    {
        // Limit essay text to avoid token overflow (example: 4000 characters)
        $essayText = mb_substr($essayText, 0, 4000);

        $questionText = strip_tags($questionText); // removes all HTML tags

        $promptText = <<<EOT
You are an IELTS examiner. Evaluate the following essay based on:

1. Task Response
2. Coherence & Cohesion
3. Lexical Resource
4. Grammatical Range & Accuracy

Give band scores (0–9) for each and overall, plus feedback 250 words. and end of response need json {overall : 1-9 }

Task: {$taskPrompt}
Question: {$questionText}
Essay: {$essayText}
EOT;

        try {
            $response = $this->client->chat()->create([
                'model' => 'gpt-4o-mini', // lightweight & cheap
                'messages' => [
                    ['role' => 'system', 'content' => 'You are a helpful IELTS examiner.'],
                    ['role' => 'user', 'content' => $promptText],
                ],
                'max_tokens' => 1000, // control output length
            ]);

            return $response->choices[0]->message->content ?? 'No response from AI';
        } catch (\Exception $e) {
            return "Error: " . $e->getMessage();
        }
    }


    public function transcribeAudio(string $relativePath): string
    {
        try {
            // 1. Path normalization
            $cleanPath = str_replace('/storage/', '', $relativePath);
            $fullPath = storage_path('app/public/' . ltrim($cleanPath, '/'));

            \Log::info('Attempting to transcribe: ' . $fullPath);

            if (!file_exists($fullPath)) {
                return "File not found: " . $fullPath;
            }

            // 2. Open the file
            $fileStream = fopen($fullPath, 'r');

            // 3. Request
            $response = $this->client->audio()->transcribe([
                'model' => 'whisper-1',
                'file' => $fileStream,
            ]);

            /** * FIX: Check if the resource is still open before trying to close it.
             * Some versions of the OpenAI client close the stream automatically.
             */
            if (is_resource($fileStream)) {
                fclose($fileStream);
            }

            return $response->text ?? '';
        } catch (\Exception $e) {
            // If an exception happens, try to close the stream if it's still open
            if (isset($fileStream) && is_resource($fileStream)) {
                fclose($fileStream);
            }
            return "Transcription Error: " . $e->getMessage();
        }
    }

    public function evaluateSpeaking(string $questionText, string $transcript): string
    {
        $promptText = <<<EOT
You are an IELTS Speaking examiner. Evaluate the following transcript based on:
1. Fluency and Coherence
2. Lexical Resource
3. Grammatical Range and Accuracy
4. Pronunciation (based on transcript flow)

Provide specific feedback and band scores (0–9).
At the end, provide a JSON block: ```json {"overall": X} ```

Question: {$questionText}
Student Transcript: {$transcript}
EOT;

        $response = $this->client->chat()->create([
            'model' => 'gpt-4o-mini',
            'messages' => [
                ['role' => 'system', 'content' => 'You are an expert IELTS Speaking examiner.'],
                ['role' => 'user', 'content' => $promptText],
            ],
        ]);

        return $response->choices[0]->message->content ?? '';
    }

    // Note: This requires the latest OpenAI PHP client version
    public function evaluateSpeakingDirectly(string $audioPath, object $question): string
    {
        try {
            $cleanPath = str_replace(['/storage/', 'storage/'], '', $audioPath);
            $fullPath = storage_path('app/public/' . ltrim($cleanPath, '/'));

            if (!file_exists($fullPath)) throw new \Exception("Audio file not found: " . $fullPath);

            $extension = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));
            if (!in_array($extension, ['mp3', 'wav'])) {
                throw new \Exception("Unsupported format [$extension].");
            }

            $audioData = base64_encode(file_get_contents($fullPath));
            /**
             * Note: OpenAI gpt-4o-audio-preview is a multimodal model.
             * It can handle audio input directly.
             */
            $response = $this->client->chat()->create([
                'model' => 'gpt-4o-audio-preview',
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => "You are an official Uzbekistan Multilevel (CEFR) Speaking Examiner.
                            Evaluate the provided audio response based on CEFR criteria.
                            TARGET LANGUAGE: {$question->part->test->language->name_en}
                            SCORING CRITERIA (0-75 total, 15 each): Fluency, Vocabulary, Grammar, Pronunciation, Interaction.
                            RELEVANCE CHECK: Is the answer relevant to the question?
                            If wrong language or silence, score 0.
                            OUTPUT: You MUST return a JSON object with: fluency, vocabulary, grammar, pronunciation, interaction, score, level, transcript, detected_language, is_relevant."
                    ],
                    [
                        'role' => 'user',
                        'content' => [
                            ['type' => 'text', 'text' => "Evaluate this answer to the question: '{$question->textarea}'"],
                            [
                                'type' => 'input_audio',
                                'input_audio' => [
                                    'data' => $audioData,
                                    'format' => $extension === 'mp3' ? 'mp3' : 'wav'
                                ]
                            ],
                        ],
                    ],
                ],
                'modalities' => ['text'],
                'response_format' => ['type' => 'json_get'], // Use structured output if possible, but for simplicity let's stick to JSON request
            ]);

            return $response->choices[0]->message->content ?? '';
        } catch (\Exception $e) {
            throw $e;
        }
    }

}
