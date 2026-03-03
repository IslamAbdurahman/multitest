<?php

namespace App\Http\Controllers;

use App\Models\Test;
use App\Http\Requests\StoreTestRequest;
use App\Http\Requests\UpdateTestRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class TestController extends Controller
{

    public function allJson(Request $request)
    {
        try {

            $tests = Test::query();

            if ($request->has('mock_id')) {
                $mock_id = $request->input('mock_id');
                $tests->whereDoesntHave('mock_tests', function ($query) use ($mock_id) {
                    $query->where('mock_id', $mock_id);
                });
            }

            $tests = $tests->get();

            return response()->json([
                'status' => 'success',
                'data' => $tests
            ]);
        } catch (\Exception $exception) {
            return response()->json([
                'status' => 'error',
                'message' => $exception->getMessage()
            ], 500);
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            if ($request->per_page) {
                $per_page = $request->per_page;
            } else {
                $per_page = 25;
            }

            $testQuery = Test::query()
                ->with([
                    'language'
                ]);

            if ($request->search) {
                $search = $request->search;
                $testQuery->where(function ($query) use ($search) {
                    $query->where('name', 'like', '%' . $search . '%')
                        ->orWhere('description', 'like', '%' . $search . '%');
                });
            }

            if (Auth::user()->hasRole('Student') || Auth::user()->hasRole('Teacher')) {
                $testQuery->where(function ($query) {
                    $query->where('is_public', true)
                        ->orWhere('user_id', '=', Auth::id());
                });
            }

            $test = $testQuery->paginate($per_page);

            return Inertia::render('test/index', [
                'test' => $test,
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
    public function store(StoreTestRequest $request)
    {
        try {
            $data = $request->validated();

            if ($request->hasFile('audio_path')) {
                $file = $request->file('audio_path');
                $fileName = uniqid() . '_' . time() . '_' . $file->getClientOriginalName();
                $filePath = $file->storeAs('tests/audio', $fileName, 'public');
                $data['audio_path'] = '/storage/' . $filePath;
            } else {
                $data['audio_path'] = '/en/audio/test-intro.mp3';
            }

            Test::create($data);

            return redirect()->back()->with('success', 'Test created successfully.');
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
    public function show(Test $test)
    {
        try {

            if (!Auth::user()->hasRole(['Admin', 'Teacher'])) {
                return back()->with('error', "You are not allowed to access this page");
            }

            return Inertia::render('test/show', [
                'test' => $test->load([
                    'user',
                    'parts' => function ($query) {
                        $query->with([
                            'questions'
                        ]);
                    },
                ]),
            ]);

        } catch (\Exception $exception) {
            // Proper Inertia error response
            throw ValidationException::withMessages([
                'error' => [$exception->getMessage()],
            ]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Test $test)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTestRequest $request, Test $test)
    {
        try {
            $data = $request->validated();
            $oldFilePath = null;
            if ($request->hasFile('audio_path')) {
                $oldFilePath = str_replace('/storage/', '', $test->audio_path);
                $file = $request->file('audio_path');
                $fileName = uniqid() . '_' . time() . '_' . $file->getClientOriginalName();
                $filePath = $file->storeAs('tests/audio', $fileName, 'public');
                $data['audio_path'] = '/storage/' . $filePath;
            } else {
                $data['audio_path'] = $test->audio_path;
            }

            $test->update($data);

            if ($oldFilePath) {
                \Storage::disk('public')->delete($oldFilePath);
            }

            return redirect()->back()->with('success', 'Test updated successfully.');

        } catch (\Exception $exception) {
            // Proper Inertia error response
            throw ValidationException::withMessages([
                'error' => [$exception->getMessage()],
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Test $test)
    {
        try {
            $test->delete();

            if ($test->audio_path) {
                $filePath = str_replace('/storage/', '', $test->audio_path);
                \Storage::disk('public')->delete($filePath);
            }

            return redirect()->back()->with('success', 'Test deleted successfully.');
        } catch (\Exception $exception) {
            // Proper Inertia error response
            throw ValidationException::withMessages([
                'error' => [$exception->getMessage()],
            ]);
        }
    }
}
