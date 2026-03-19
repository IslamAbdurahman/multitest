<?php

namespace App\Observers;

use App\Jobs\EvaluateSpeakingJob;
use App\Models\AttemptAnswer;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class AttemptAnswerObserver
{
    /**
     * Handle the AttemptAnswer "saved" event.
     */
    public function saved(AttemptAnswer $attemptAnswer): void
    {
        // Dispatch if audio_path is newly provided (created) or changed (updated)
        if ($attemptAnswer->audio_path && ($attemptAnswer->wasRecentlyCreated || $attemptAnswer->wasChanged('audio_path'))) {
            // Clear previous AI results to allow Job to run again
            $attemptAnswer->score_ai = null;
            $attemptAnswer->transcript = null;
            $attemptAnswer->review_ai = null;
            $attemptAnswer->saveQuietly();

            EvaluateSpeakingJob::dispatch($attemptAnswer->id);
        }
    }

    /**
     * Handle the AttemptAnswer "deleted" event.
     */
    public function deleting(AttemptAnswer $attemptAnswer): void
    {
        if ($attemptAnswer->audio_path) {
            Storage::disk('public')->delete($attemptAnswer->audio_path);
        }
    }

    /**
     * Handle the AttemptAnswer "restored" event.
     */
    public function restored(AttemptAnswer $attemptAnswer): void
    {
        //
    }

    /**
     * Handle the AttemptAnswer "force deleted" event.
     */
    public function forceDeleted(AttemptAnswer $attemptAnswer): void
    {
        //
    }
}
