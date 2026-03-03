<?php

namespace App\Http\Controllers;

use App\Models\Part;
use App\Models\Question;
use App\Http\Requests\StoreQuestionRequest;
use App\Http\Requests\UpdateQuestionRequest;

class QuestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
    public function store(StoreQuestionRequest $request)
    {
        try {
            $data = $request->validated();

            if ($request->hasFile('audio_path')) {
                $file = $request->file('audio_path');
                $fileName = uniqid() . '_' . time() . '_' . $file->getClientOriginalName();
                $filePath = $file->storeAs('parts/audio', $fileName, 'public');
                $data['audio_path'] = '/storage/' . $filePath;
            } else {
                $data['audio_path'] = null;
            }

            Question::create($data);
            return redirect()->back()->with('success', 'Question created successfully');

        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Question $question)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Question $question)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateQuestionRequest $request, Question $question)
    {
        try {
            $data = $request->validated();
            $oldFilePath = null;
            if ($request->hasFile('audio_path')) {
                $oldFilePath = str_replace('/storage/', '', $question->audio_path);
                $file = $request->file('audio_path');
                $fileName = uniqid() . '_' . time() . '_' . $file->getClientOriginalName();
                $filePath = $file->storeAs('questions/audio', $fileName, 'public');
                $data['audio_path'] = '/storage/' . $filePath;
            } else {
                $data['audio_path'] = $question->audio_path;
            }

            $question->update($data);

            if ($oldFilePath) {
                \Storage::disk('public')->delete($oldFilePath);
            }

            return redirect()->back()->with('success', 'Question updated successfully.');

        } catch (\Exception $exception) {
            return redirect()->back()->with('error', $exception->getMessage());
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Question $question)
    {
        try {
            $question->delete();

            if ($question->audio_path) {
                $filePath = str_replace('/storage/', '', $question->audio_path);
                \Storage::disk('public')->delete($filePath);
            }

            return redirect()->back()->with('success', 'Question deleted successfully.');

        } catch (\Exception $exception) {
            return redirect()->back()->with('error', $exception->getMessage());
        }
    }
}
