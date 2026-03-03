<?php

namespace App\Observers;

use App\Jobs\EvaluateSpeakingJob;
use App\Models\AttemptAnswer;
use Illuminate\Support\Facades\Auth;

class AttemptAnswerObserver
{
    /**
     * Handle the AttemptAnswer "created" event.
     */
    public function created(AttemptAnswer $attemptAnswer): void
    {
        if ($attemptAnswer->audio_path) {
            EvaluateSpeakingJob::dispatch($attemptAnswer->id);
        }
    }

    /**
     * Handle the AttemptAnswer "updated" event.
     */
    public function updating(AttemptAnswer $attemptAnswer): void
    {
        //
    }

    /**
     * Handle the AttemptAnswer "deleted" event.
     */
    public function deleting(AttemptAnswer $attemptAnswer): void
    {
        //
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
