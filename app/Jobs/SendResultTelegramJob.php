<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\User\User;
use App\Models\Attempt;
use App\Models\AttemptAnswer;
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

            $score = $attempt->ai_score_avg !== null ? number_format($attempt->ai_score_avg, 1) : '0.0';

            // Load all answers for this attempt with their questions
            $answers = AttemptAnswer::whereHas('attempt_part', function ($q) use ($attempt) {
                $q->where('attempt_id', $attempt->id);
            })
                ->with('question')
                ->orderBy('id')
                ->get();

            Log::info("SendResultTelegramJob: attempt #{$attempt->id} has {$answers->count()} answers.");

            // Build single message with all questions
            $message = "🎉 *Natijangiz tayyor!*\n\n"
                . "👤 {$this->user->name}\n"
                . "📊 *AI bahosi:* {$score} / 75\n\n";

            $questionNumber = 1;
            $imageUrls = [];

            foreach ($answers as $answer) {
                $question = $answer->question;
                if (!$question) {
                    Log::warning("SendResultTelegramJob: answer #{$answer->id} has no question.");
                    continue;
                }

                $questionText = $this->extractText($question->textarea ?? '');
                $answerScore = $answer->score_ai ?? 0;

                $message .= "📝 *Savol {$questionNumber}:* {$questionText}\n"
                    . "📊 *AI bahosi:* {$answerScore}\n\n";

                // Collect image URLs for later
                $imgUrl = $this->extractImageUrl($question->textarea ?? '');
                if ($imgUrl) {
                    $imageUrls[] = [
                        'url' => $imgUrl,
                        'number' => $questionNumber,
                    ];
                }

                $questionNumber++;
            }

            // Add donation info
            $message .= "💳 *Bizni Qo'llab-quvvatlang:*\n\n"
                . "`9860600402432220`\n\n"
                . "Donat qilishingiz mumkin.";

            // 1️⃣ Send the main text message
            $this->safeSendMessage($telegram, $chatId, $message);

            // 2️⃣ Send question images separately (if any)
            foreach ($imageUrls as $img) {
                try {
                    $telegram->sendPhoto([
                        'chat_id' => $chatId,
                        'photo' => $img['url'],
                        'caption' => "📝 Savol {$img['number']} rasmi",
                    ]);
                } catch (\Exception $imgError) {
                    Log::warning("Image send failed for question {$img['number']}: " . $imgError->getMessage());
                }
            }

            Log::info("Telegram result sent to user {$chatId} for attempt #{$attempt->id}");

        } catch (\Exception $e) {
            Log::error("SendResultTelegramJob failed: " . $e->getMessage());
        }
    }

    /**
     * Extract plain text from HTML, stripping tags.
     */
    protected function extractText(string $html): string
    {
        $text = strip_tags($html);
        $text = html_entity_decode($text, ENT_QUOTES, 'UTF-8');
        $text = trim(preg_replace('/\s+/', ' ', $text));

        if (mb_strlen($text) > 200) {
            $text = mb_substr($text, 0, 200) . '...';
        }

        return $text ?: '—';
    }

    /**
     * Extract first image URL from HTML content.
     */
    protected function extractImageUrl(string $html): ?string
    {
        if (preg_match('/<img[^>]+src=["\']([^"\']+)["\']/i', $html, $matches)) {
            $url = $matches[1];
            if (!str_starts_with($url, 'http')) {
                $url = url($url);
            }
            return $url;
        }
        return null;
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
