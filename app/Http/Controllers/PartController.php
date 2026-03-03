<?php

namespace App\Http\Controllers;

use App\Models\Part;
use App\Http\Requests\StorePartRequest;
use App\Http\Requests\UpdatePartRequest;
use Illuminate\Validation\ValidationException;

class PartController extends Controller
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
    public function store(StorePartRequest $request)
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

            Part::create($data);
            return redirect()->back()->with('success', 'Part created successfully');

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
    public function show(Part $part)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Part $part)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePartRequest $request, Part $part)
    {
        try {
            $data = $request->validated();
            $oldFilePath = null;
            if ($request->hasFile('audio_path')) {
                $oldFilePath = str_replace('/storage/', '', $part->audio_path);
                $file = $request->file('audio_path');
                $fileName = uniqid() . '_' . time() . '_' . $file->getClientOriginalName();
                $filePath = $file->storeAs('parts/audio', $fileName, 'public');
                $data['audio_path'] = '/storage/' . $filePath;
            } else {
                $data['audio_path'] = $part->audio_path;
            }

            $part->update($data);

            if ($oldFilePath) {
                \Storage::disk('public')->delete($oldFilePath);
            }

            return redirect()->back()->with('success', 'Part updated successfully.');

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
    public function destroy(Part $part)
    {
        try {
            $part->delete();

            if ($part->audio_path) {
                $filePath = str_replace('/storage/', '', $part->audio_path);
                \Storage::disk('public')->delete($filePath);
            }

            return redirect()->back()->with('success', 'Part deleted successfully.');

        } catch (\Exception $exception) {
            // Proper Inertia error response
            throw ValidationException::withMessages([
                'error' => [$exception->getMessage()],
            ]);
        }
    }
}
