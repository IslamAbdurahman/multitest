<?php

namespace App\Console\Commands;

use App\Jobs\EvaluateSpeakingJob;
use App\Models\AttemptAnswer;
use Illuminate\Console\Command;

class EvaluateRecentAttemptsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'attempts:evaluate-recent {days=10}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Dispatch AI evaluation jobs for unrated speaking attempt answers from the last X days';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $days = (int) $this->argument('days');
        $dateThreshold = now()->subDays($days);

        $answers = AttemptAnswer::whereHas('attempt_part.attempt', function ($query) use ($dateThreshold) {
            $query->where('started_at', '>=', $dateThreshold);
        })
        ->whereNotNull('audio_path')
        ->where('audio_path', '!=', '')
        ->whereNull('score_ai')
        ->get();

        if ($answers->isEmpty()) {
            $this->info("No unrated attempt answers found in the last {$days} days.");
            return Command::SUCCESS;
        }

        $this->info("Found {$answers->count()} unrated attempt answers from the last {$days} days. Dispatching to queue...");

        $bar = $this->output->createProgressBar($answers->count());
        $bar->start();

        foreach ($answers as $answer) {
            EvaluateSpeakingJob::dispatch($answer->id);
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->info("Successfully dispatched {$answers->count()} evaluation jobs to the queue.");

        return Command::SUCCESS;
    }
}
