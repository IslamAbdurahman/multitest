<?php

namespace App\Console\Commands;

use App\Models\Attempt;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class CleanOldAttemptsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'attempts:clean-old {days=10}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Force delete attempts and their audio files older than specified number of days';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $days = (int) $this->argument('days');
        $dateThreshold = now()->subDays($days);

        $attempts = Attempt::withTrashed()
            ->where('started_at', '<', $dateThreshold)
            ->get();

        if ($attempts->isEmpty()) {
            $this->info("No attempts found older than {$days} days.");
            return Command::SUCCESS;
        }

        $this->info("Found {$attempts->count()} attempts older than {$days} days. Starting cleanup...");

        $bar = $this->output->createProgressBar($attempts->count());
        $bar->start();

        foreach ($attempts as $attempt) {
            foreach ($attempt->attempt_parts as $part) {
                foreach ($part->attempt_answers as $answer) {
                    if ($answer->audio_path) {
                        $cleanPath = str_replace(['/storage/', 'storage/'], '', $answer->audio_path);
                        Storage::disk('public')->delete($cleanPath);
                    }
                    $answer->forceDelete();
                }
                $part->delete();
            }
            $attempt->forceDelete();
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->info("Cleanup completed successfully.");

        return Command::SUCCESS;
    }
}
