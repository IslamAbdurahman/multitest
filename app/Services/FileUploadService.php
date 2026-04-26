<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadService
{
    /**
     * Upload an audio file.
     *
     * @param UploadedFile $file
     * @param string $directory
     * @return string The public path to the uploaded file.
     */
    public function uploadAudio(UploadedFile $file, string $directory): string
    {
        $fileName = Str::uuid() . '_' . time() . '_' . $file->getClientOriginalName();
        $filePath = $file->storeAs($directory, $fileName, 'public');
        
        return '/storage/' . $filePath;
    }

    /**
     * Delete a file if it exists.
     *
     * @param string|null $path
     * @return void
     */
    public function deleteFile(?string $path): void
    {
        if ($path) {
            $cleanPath = str_replace('/storage/', '', $path);
            if (Storage::disk('public')->exists($cleanPath)) {
                Storage::disk('public')->delete($cleanPath);
            }
        }
    }
}
