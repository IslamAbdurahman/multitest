<?php

use App\Services\FileUploadService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->fileUploadService = new FileUploadService();
    Storage::fake('public');
});

test('can upload audio file successfully', function () {
    $file = UploadedFile::fake()->create('test-audio.mp3', 100, 'audio/mpeg');
    
    $result = $this->fileUploadService->uploadAudio($file, 'test_dir/audio');
    
    expect($result)->toBeString()
        ->toContain('/storage/test_dir/audio/')
        ->toContain('test-audio.mp3');
        
    $cleanPath = str_replace('/storage/', '', $result);
    Storage::disk('public')->assertExists($cleanPath);
});

test('can delete file successfully', function () {
    $file = UploadedFile::fake()->create('test-audio.mp3', 100, 'audio/mpeg');
    $path = $this->fileUploadService->uploadAudio($file, 'test_dir/audio');
    
    $cleanPath = str_replace('/storage/', '', $path);
    Storage::disk('public')->assertExists($cleanPath);
    
    $this->fileUploadService->deleteFile($path);
    
    Storage::disk('public')->assertMissing($cleanPath);
});

test('delete file does nothing when path is null', function () {
    // This should not throw any exceptions
    $this->fileUploadService->deleteFile(null);
    expect(true)->toBeTrue();
});
