<?php

namespace App\Http\Controllers;

use App\Models\Attempt;
use App\Http\Requests\StoreAttemptRequest;
use App\Http\Requests\UpdateAttemptRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AttemptController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            if ($request->per_page) {
                $per_page = $request->per_page;
            } else {
                $per_page = 10;
            }

            $attempt = Attempt::query()
                ->select(
                    'attempts.*',
                    DB::raw("aiScoreAvg(attempts.id,null) as ai_score_avg")
                )
                ->with([
                    'user',
                    'mock',
                    'test',
                    'attempt_parts' => function ($query) {
                        $query->addSelect(DB::raw("aiScoreAvg(null, attempt_parts.id) as ai_score_avg"));
                    },
                ])
                ->orderByDesc('created_at');

            if ($request->has('user_id')) {
                $user_id = $request->input('user_id');
                $attempt->where('user_id', $user_id);
            }

            if ($request->has('mock_id')) {
                $mock_id = $request->input('mock_id');
                $attempt->where('mock_id', $mock_id);
            }

            if ($request->has('test_id')) {
                $test_id = $request->input('test_id');
                $attempt->where('test_id', $test_id);
            }

            if (Auth::user()->hasRole('Teacher')) {
                $attempt->where(function ($query) {
                    $query->whereHas('mock', function ($query) {
                        $query->where('user_id', Auth::id());
                    })
                        ->orWhere('user_id', Auth::id());
                });
            }

            if (Auth::user()->hasRole('Student')) {
                $attempt->where('user_id', Auth::id());
            }

            $attempt = $attempt->paginate($per_page);

            return Inertia::render('attempt/index', [
                'attempt' => $attempt
            ]);

        } catch (\Exception $exception) {
            // Proper Inertia error response
            throw ValidationException::withMessages([
                'error' => [$exception->getMessage()],
            ]);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAttemptRequest $request)
    {
        try {
            $data = $request->validated();

            DB::beginTransaction();

            // Eager load parts with test
            $attempt = Attempt::create($data);
            $attempt->load('test.parts');

            if ($attempt->test->parts->isEmpty()) {
                throw new \Exception('The selected test has no parts defined.');
            }

            // Create attempt parts
            $attemptParts = $attempt->test->parts->map(function ($part) {
                return [
                    'part_id' => $part->id,
                    'started_at' => now(),
                ];
            })->toArray();

            $attempt->attempt_parts()->createMany($attemptParts);

            DB::commit();

            return redirect()->route('practice.index', $attempt->id)
                ->with('success', 'Attempt created successfully.');

        } catch (\Exception $exception) {
            // Proper Inertia error response
            throw ValidationException::withMessages([
                'error' => [$exception->getMessage()],
            ]);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Attempt $attempt)
    {
        try {
            $resAttempt = Attempt::query()
                ->where('id', '=', $attempt->id)
                ->select('attempts.*')
                ->addSelect(DB::raw("aiScoreAvg(attempts.id, null) as ai_score_avg"))
                ->with([
                    'user',
                    'mock',
                    'test',
                    'attempt_parts.attempt_answers.question',
                    'attempt_parts.part',
                    'attempt_parts' => function ($query) {
                        $query->select('attempt_parts.*')
                            ->addSelect(DB::raw("aiScoreAvg(null, attempt_parts.id) as ai_score_avg"));
                    },
                ])
                ->firstOrFail();

            return Inertia::render('attempt/show', [
                'attempt' => $resAttempt,
            ]);

        } catch (\Exception $exception) {
            throw ValidationException::withMessages([
                'error' => [$exception->getMessage()],
            ]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Attempt $attempt)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAttemptRequest $request, Attempt $attempt)
    {
        //
    }

    public function evaluate(Request $request, Attempt $attempt)
    {
        try {
            $request->validate([
                'score' => 'required|numeric|min:0|max:75',
                'review' => 'nullable|string',
            ]);

            $attempt->score = $request->input('score');
            $attempt->review = $request->input('review');
            $attempt->evaluated_at = now();
            $attempt->save();

        } catch (\Exception $exception) {
            throw ValidationException::withMessages([
                'error' => [$exception->getMessage()],
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attempt $attempt)
    {
        try {
            $attempt->delete();

            return redirect()->back()->with('success', 'Attempt deleted successfully.');

        } catch (\Exception $exception) {
            throw ValidationException::withMessages([
                'error' => [$exception->getMessage()],
            ]);
        }
    }
}
