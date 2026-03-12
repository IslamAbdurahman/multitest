<?php

namespace App\Http\Controllers;

use App\Models\Attempt;
use App\Models\AttemptPart;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class PracticeController extends Controller
{
    public function index(Attempt $attempt)
    {
        try {
            $attempt->load([
                'mock',
                'test',
                'attempt_parts.part.questions'
            ]);

            if ($attempt->finished_at) {
                return redirect()->route('home.index', [
                    'slug' => $attempt->mock->slug,
                ])->with('success', 'Answers saved successfully.');
            }

            return inertia('practice/index', [
                'attempt' => $attempt,
            ]);


        } catch (\Exception $exception) {
            // Proper Inertia error response
            throw ValidationException::withMessages([
                'error' => [$exception->getMessage()],
            ]);
        }

    }

    public function show(AttemptPart $attemptPart)
    {
        try {
            $attemptPart->load([
                'attempt.attempt_parts.part',
                'part.questions'
            ]);

            return inertia('practice/show', [
                'attempt_part' => $attemptPart,
            ]);
        } catch (\Exception $exception) {
            // Proper Inertia error response
            throw ValidationException::withMessages([
                'error' => [$exception->getMessage()],
            ]);
        }
    }

    public function save_answers(AttemptPart $attemptPart, Request $request)
    {
        try {
            $data = $request->validate([
                'answers' => ['required', 'array'],
                'answers.*.question_id' => ['required', 'integer', 'exists:questions,id'],
                'answers.*.started_at' => ['nullable', 'date'],
                'answers.*.finished_at' => ['nullable', 'date'],
                'answers.*.audio_path' => ['nullable', 'file', 'max:200000', 'mimetypes:audio/mpeg,audio/wav,audio/ogg,audio/x-wav,audio/webm,video/webm'], // Validating inside the array
                'next_attempt_part_id' => ['nullable', 'integer', 'exists:attempt_parts,id'],
            ]);

            DB::beginTransaction();

            foreach ($data['answers'] as $index => $answerData) {
                $audioPath = null;

                // Access the file correctly from the nested array
                if ($request->hasFile("answers.$index.audio_path")) {
                    $file = $request->file("answers.$index.audio_path");
                    $filename = time() . '_' . $file->getClientOriginalName();
                    $audioPath = $file->storeAs('attempt_answers_audio', $filename, 'public');
                }

                \App\Models\AttemptAnswer::updateOrCreate(
                    [
                        'attempt_part_id' => $attemptPart->id,
                        'question_id' => $answerData['question_id'],
                    ],
                    [
                        'started_at' => $answerData['started_at'] ?? null,
                        'finished_at' => $answerData['finished_at'] ?? null,
                        'audio_path' => '/storage/' . $audioPath,
                    ]
                );
            }

            DB::commit();

            if (!empty($data['next_attempt_part_id'])) {
                return redirect()->route('practice.show', $data['next_attempt_part_id']);
            }

            $attemptPart->attempt()->update(['finished_at' => now()]);

            if ($attemptPart->attempt->mock) {
                return redirect()->route('home.index', ['slug' => $attemptPart->attempt->mock?->slug])
                    ->with('success', 'Answers saved successfully.');
            }

            return redirect()->route('attempt.index')
                ->with('success', 'Answers saved successfully.');


        } catch (\Exception $exception) {
            DB::rollBack();
            Log::error($exception->getMessage());
            throw \Illuminate\Validation\ValidationException::withMessages(['error' => [$exception->getMessage()]]);
        }
    }
}
