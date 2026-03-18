<?php

namespace App\Mail;

use App\Models\Attempt;
use App\Models\User\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SendResultMail extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;
    public Attempt $attempt;

    public function __construct(User $user, Attempt $attempt)
    {
        $this->user = $user;
        $this->attempt = $attempt;
    }

    public function envelope(): Envelope
    {
        $testName = $this->attempt->mock?->name ?? $this->attempt->test?->name ?? 'Test';

        return new Envelope(
            subject: "🎉 Natijangiz tayyor: {$testName}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.result',
        );
    }
}
