<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\User\User;
use App\Models\Attempt;
use Telegram\Bot\Api;
use Telegram\Bot\FileUpload\InputFile;
use Illuminate\Support\Facades\Log;

class SendResultTelegramJob implements ShouldQueue
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
            if (!$this->user->telegram_id) {
                Log::info("SendResultTelegramJob skipped: user {$this->user->id} has no telegram_id.");
                return;
            }

            $telegram = new Api(env('MultitestUzBot_TOKEN'));

            // Reload attempt with ai_score_avg
            $attempt = Attempt::query()
                ->where('id', $this->attempt->id)
                ->withAiScoreAvg()
                ->with(['mock', 'test'])
                ->firstOrFail();

            $testName = $attempt->mock?->name ?? $attempt->test?->name ?? 'Test';
            $score = $attempt->ai_score_avg !== null ? number_format($attempt->ai_score_avg, 1) : '—';
            $resultUrl = url('/attempt/' . $attempt->id);

            // Build message
            $caption = "🎉 *Natijangiz tayyor!*\n\n"
                . "👤 {$this->user->name}\n"
                . "📝 *Test:* {$testName}\n"
                . "📊 *AI bahosi:* {$score} / 75\n\n"
                . "📋 [Natijani ko'rish]({$resultUrl})";

            // Try sending PDF first
            try {
                $pdfUrl = url('/attempt-pdf/' . $attempt->id);
                $document = InputFile::create($pdfUrl, "TestResult_{$attempt->id}.pdf");

                $telegram->sendDocument([
                    'chat_id' => $this->user->telegram_id,
                    'document' => $document,
                    'caption' => $caption,
                    'parse_mode' => 'Markdown',
                ]);

                Log::info("Telegram PDF sent to user {$this->user->telegram_id} for attempt #{$attempt->id}");
            } catch (\Exception $pdfError) {
                // If PDF fails, send just the text message
                Log::warning("PDF send failed, sending text only: " . $pdfError->getMessage());

                $telegram->sendMessage([
                    'chat_id' => $this->user->telegram_id,
                    'text' => $caption,
                    'parse_mode' => 'Markdown',
                ]);

                Log::info("Telegram text message sent to user {$this->user->telegram_id} for attempt #{$attempt->id}");
            }

        } catch (\Exception $e) {
            Log::error("SendResultTelegramJob failed: " . $e->getMessage());
        }
    }
}
