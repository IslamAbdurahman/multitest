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
            $chatId = $this->user->telegram_id;

            // Reload attempt with all related data
            $attempt = Attempt::query()
                ->where('id', $this->attempt->id)
                ->withAiScoreAvg()
                ->with(['mock', 'test'])
                ->firstOrFail();

            $testName = $attempt->mock?->name ?? $attempt->test?->name ?? 'Test';
            $score = $attempt->ai_score_avg !== null ? number_format($attempt->ai_score_avg, 1) : '0.0';

            // Send summary message with donation info
            $message = "🎉 *Natijangiz tayyor!*\n\n"
                . "👤 {$this->user->name}\n"
                . "📊 *AI o'rtacha bahosi:* {$score} / 75\n\n"
                . "💳 *Bizni Qo'llab-quvvatlang:*\n\n"
                . "`9860600402432220`\n\n"
                . "Donat qilishingiz mumkin.";

            $this->safeSendMessage($telegram, $chatId, $message);

            Log::info("Telegram final summary sent to user {$chatId} for attempt #{$attempt->id}");

        } catch (\Exception $e) {
            Log::error("SendResultTelegramJob failed: " . $e->getMessage());
        }
    }

    /**
     * Safe Telegram message sender.
     */
    protected function safeSendMessage(Api $telegram, $chatId, string $text): void
    {
        try {
            $telegram->sendMessage([
                'chat_id' => $chatId,
                'text' => $text,
                'parse_mode' => 'Markdown',
            ]);
        } catch (\Exception $e) {
            Log::error("Telegram sendMessage error: " . $e->getMessage());
        }
    }
}
