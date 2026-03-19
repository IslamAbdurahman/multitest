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
                ->with([
                    'mock',
                    'test',
                    'attempt_parts.attempt_answers.question',
                ])
                ->firstOrFail();

            $testName = $attempt->mock?->name ?? $attempt->test?->name ?? 'Test';
            $score = $attempt->ai_score_avg !== null ? number_format($attempt->ai_score_avg, 1) : '0.0';

            // 1️⃣ Send header message
            $header = "🎉 *Natijangiz tayyor!*\n\n"
                . "👤 {$this->user->name}\n"
                . "📊 *AI bahosi:* {$score} / 75\n";

            $this->safeSendMessage($telegram, $chatId, $header);

            // 2️⃣ Send each question with its score
            $questionNumber = 1;
            foreach ($attempt->attempt_parts as $part) {
                foreach ($part->attempt_answers as $answer) {
                    $question = $answer->question;
                    if (!$question) continue;

                    // Extract plain text from textarea HTML
                    $questionText = $this->extractText($question->textarea ?? '');
                    $answerScore = $answer->score_ai ?? 0;

                    // Extract image URL from textarea HTML
                    $imageUrl = $this->extractImageUrl($question->textarea ?? '');

                    // If question has an image, send it as a photo
                    if ($imageUrl) {
                        try {
                            $caption = "📝 *Savol {$questionNumber}:* {$questionText}\n"
                                . "📊 *AI bahosi:* {$answerScore}";

                            $telegram->sendPhoto([
                                'chat_id' => $chatId,
                                'photo' => $imageUrl,
                                'caption' => $caption,
                                'parse_mode' => 'Markdown',
                            ]);
                        } catch (\Exception $imgError) {
                            // If image fails, send as text
                            Log::warning("Image send failed for question {$questionNumber}: " . $imgError->getMessage());
                            $msg = "📝 *Savol {$questionNumber}:* {$questionText}\n"
                                . "📊 *AI bahosi:* {$answerScore}";
                            $this->safeSendMessage($telegram, $chatId, $msg);
                        }
                    } else {
                        $msg = "📝 *Savol {$questionNumber}:* {$questionText}\n"
                            . "📊 *AI bahosi:* {$answerScore}";
                        $this->safeSendMessage($telegram, $chatId, $msg);
                    }

                    $questionNumber++;
                }
            }

            // 3️⃣ Send footer with donation info
            $footer = "💳 *Bizni Qo'llab-quvvatlang:*\n\n"
                . "`9860600402432220`\n\n"
                . "Donat qilishingiz mumkin.";

            $this->safeSendMessage($telegram, $chatId, $footer);

            Log::info("Telegram result messages sent to user {$chatId} for attempt #{$attempt->id}");

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

        // Truncate very long text
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

            // Make relative URLs absolute
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
