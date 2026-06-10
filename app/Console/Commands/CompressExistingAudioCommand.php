<?php

namespace App\Console\Commands;

use App\Jobs\CompressAudioJob;
use App\Models\AttemptAnswer;
use Illuminate\Console\Command;

class CompressExistingAudioCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'audio:compress-existing';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Compress all existing non-MP3 audio files to 32kbps mono MP3 format';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $answers = AttemptAnswer::whereNotNull('audio_path')
            ->where('audio_path', '!=', '')
            ->get()
            ->filter(function ($answer) {
                return !str_ends_with(strtolower($answer->audio_path), '.mp3');
            });

        if ($answers->isEmpty()) {
            $this->info('No uncompressed audio files found.');
            return Command::SUCCESS;
        }

        $this->info("Found {$answers->count()} uncompressed audio files. Starting compression...");

        $bar = $this->output->createProgressBar($answers->count());
        $bar->start();

        foreach ($answers as $answer) {
            try {
                CompressAudioJob::dispatchSync($answer->id, false);
            } catch (\Throwable $e) {
                $this->error("\nError compressing Answer #{$answer->id}: " . $e->getMessage());
            }
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->info('Compression completed.');

        return Command::SUCCESS;
    }
}
