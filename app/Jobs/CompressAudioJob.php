<?php

namespace App\Jobs;

use App\Models\AttemptAnswer;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CompressAudioJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $answerId;
    protected $shouldEvaluate;
    
    public $tries = 3;

    public function __construct($answerId, $shouldEvaluate = true)
    {
        $this->answerId = $answerId;
        $this->shouldEvaluate = $shouldEvaluate;
    }

    public function handle()
    {
        $answer = AttemptAnswer::find($this->answerId);
        if (!$answer || !$answer->audio_path) return;

        // Skip if already MP3
        if (str_ends_with(strtolower($answer->audio_path), '.mp3')) {
            if ($this->shouldEvaluate) {
                EvaluateSpeakingJob::dispatch($answer->id);
            }
            return;
        }

        try {
            $cleanInputPath = str_replace(['/storage/', 'storage/'], '', $answer->audio_path);
            $physicalInputPath = Storage::disk('public')->path(ltrim($cleanInputPath, '/'));

            if (!file_exists($physicalInputPath)) {
                Log::error("Compression failed: Original file not found at {$physicalInputPath}");
                // Fallback: Dispatch evaluation directly even if original file is missing
                if ($this->shouldEvaluate) {
                    EvaluateSpeakingJob::dispatch($answer->id);
                }
                return;
            }

            $directory = 'attempt_answers_audio';
            $outputFileName = Str::uuid() . '_' . time() . '.mp3';
            $outputFilePath = $directory . '/' . $outputFileName;
            $physicalOutputPath = Storage::disk('public')->path($outputFilePath);

            // Execute FFmpeg to compress to 32kbps mono MP3
            $command = "ffmpeg -y -i " . escapeshellarg($physicalInputPath) . " -codec:a libmp3lame -b:a 32k -ac 1 " . escapeshellarg($physicalOutputPath) . " 2>&1";
            exec($command, $output, $returnVar);

            if ($returnVar === 0 && file_exists($physicalOutputPath)) {
                // Delete original uncompressed file
                if (file_exists($physicalInputPath)) {
                    unlink($physicalInputPath);
                }

                // Update model quietly to prevent firing the observer saved event again
                $answer->audio_path = '/storage/' . $outputFilePath;
                $answer->saveQuietly();
                
                Log::info("Audio file successfully compressed to MP3 for Answer #{$answer->id}");

                // Dispatch evaluation job only if requested
                if ($this->shouldEvaluate) {
                    EvaluateSpeakingJob::dispatch($answer->id);
                }
            } else {
                throw new \Exception("FFmpeg failed with exit code {$returnVar}. Output: " . implode("\n", $output));
            }

        } catch (\Throwable $e) {
            Log::error("CompressAudioJob fatal error for Answer #{$this->answerId}: " . $e->getMessage());
            
            if ($this->attempts() >= $this->tries) {
                if ($this->shouldEvaluate) {
                    Log::warning("Fallback: Evaluating speaking with uncompressed audio for Answer #{$answer->id}");
                    EvaluateSpeakingJob::dispatch($answer->id);
                }
            } else {
                $this->release(15);
            }
        }
    }
}
