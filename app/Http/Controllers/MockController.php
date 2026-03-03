<?php

namespace App\Http\Controllers;

use App\Models\Mock;
use App\Http\Requests\StoreMockRequest;
use App\Http\Requests\UpdateMockRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class MockController extends Controller
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


            if (!Auth::user()->hasRole(['Admin', 'Teacher'])) {
                return back()->with('error', "You are not allowed to access this page");
            }

            $mocks = Mock::query()
                ->with([
                    'mock_tests' => function ($query) {
                        $query->with('test');
                    }
                ]);

            if ($request->has('search')) {
                $search = $request->input('search');
                $mocks->where('name', 'like', '%' . $search . '%');
            }

            if ($request->has('from') && $request->has('to')) {
                $from = $request->input('from');
                $to = $request->input('to');
                $mocks->whereBetween('created_at', [$from, $to . ' 23:59:59']);
            }

            if ($request->has('active')) {
                $mocks->where('active', '=', $request->input('active'));
            }

            if ($request->has('open')) {
                $mocks->where('open', '=', $request->input('open'));
            }

            if (!Auth::user()->hasRole('Admin')) {
                $mocks->where('user_id', Auth::id());
            }

            $mock = $mocks->paginate($per_page);

            return Inertia::render('mock/index', [
                'mock' => $mock,
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
    public function store(StoreMockRequest $request)
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

            Mock::create($data);

            return redirect()->back()->with('success', 'Mock created successfully.');

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
    public function show(Mock $mock)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Mock $mock)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMockRequest $request, Mock $mock)
    {
        try {

            $data = $request->validated();
            $oldFilePath = null;
            if ($request->hasFile('audio_path')) {
                $oldFilePath = str_replace('/storage/', '', $mock->audio_path);
                $file = $request->file('audio_path');
                $fileName = uniqid() . '_' . time() . '_' . $file->getClientOriginalName();
                $filePath = $file->storeAs('mocks/audio', $fileName, 'public');
                $data['audio_path'] = '/storage/' . $filePath;
            } else {
                $data['audio_path'] = $mock->audio_path;
            }

            $mock->update($data);

            if ($oldFilePath) {
                \Storage::disk('public')->delete($oldFilePath);
            }

            return redirect()->back()->with('success', 'Mock updated successfully.');

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
    public function destroy(Mock $mock)
    {
        try {
            $mock->delete();

            if ($mock->audio_path) {
                $filePath = str_replace('/storage/', '', $mock->audio_path);
                \Storage::disk('public')->delete($filePath);
            }

            return redirect()->back()->with('success', 'Mock deleted successfully.');

        } catch (\Exception $exception) {
            // Proper Inertia error response
            throw ValidationException::withMessages([
                'error' => [$exception->getMessage()],
            ]);
        }
    }
}
