<?php
// app/Jobs/SendResultEmailJob.php
namespace App\Jobs;

use App\Mail\SendResultMail;
use App\Models\Attempt;
use App\Models\User\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendResultEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected User $user;
    protected Attempt $attempt;

    public function __construct(User $user, Attempt $attempt)
    {
        $this->user = $user;
        $this->attempt = $attempt;
    }

    public function handle(): void
    {
        try {
            if (!$this->user->email) {
                Log::info("SendResultEmailJob skipped: user {$this->user->id} has no email.");
                return;
            }

            // Reload attempt with ai_score_avg
            $attempt = Attempt::query()
                ->where('id', $this->attempt->id)
                ->withAiScoreAvg()
                ->with(['mock', 'test'])
                ->firstOrFail();

            Mail::to($this->user->email)->send(new SendResultMail($this->user, $attempt));

            Log::info("Result email sent to {$this->user->email} for attempt #{$this->attempt->id}");
        } catch (\Exception $e) {
            Log::error("SendResultEmailJob failed: " . $e->getMessage());
        }
    }
}
