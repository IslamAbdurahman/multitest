<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test Natijasi</title>
</head>
<body style="margin:0; padding:0; background-color:#f1f5f9; font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9; padding:40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px; background-color:#ffffff; border-radius:24px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                    {{-- Header --}}
                    <tr>
                        <td style="background-color:#0f172a; padding:32px; text-align:center;">
                            <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:800; letter-spacing:-0.02em;">
                                🎉 Natijangiz tayyor!
                            </h1>
                        </td>
                    </tr>

                    {{-- Body --}}
                    <tr>
                        <td style="padding:32px;">
                            <p style="margin:0 0 16px; color:#334155; font-size:16px; line-height:1.6;">
                                Assalomu alaykum, <strong>{{ $user->name }}</strong>!
                            </p>

                            <p style="margin:0 0 24px; color:#64748b; font-size:14px; line-height:1.6;">
                                AI sizning barcha javoblaringizni baholashni tugatdi.
                            </p>

                            {{-- Result Card --}}
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f8fafc; border-radius:16px; border:1px solid #e2e8f0;">
                                <tr>
                                    <td style="padding:24px;">
                                        <p style="margin:0 0 8px; color:#94a3b8; font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:0.1em;">
                                            Test nomi
                                        </p>
                                        <p style="margin:0 0 20px; color:#0f172a; font-size:18px; font-weight:700;">
                                            {{ $attempt->mock?->name ?? $attempt->test?->name ?? '—' }}
                                        </p>

                                        <p style="margin:0 0 8px; color:#94a3b8; font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:0.1em;">
                                            Urinish nomi
                                        </p>
                                        <p style="margin:0 0 20px; color:#0f172a; font-size:16px; font-weight:600;">
                                            {{ $attempt->name ?? '—' }}
                                        </p>

                                        <p style="margin:0 0 8px; color:#94a3b8; font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:0.1em;">
                                            AI bahosi (o'rtacha)
                                        </p>
                                        <p style="margin:0; color:#4f46e5; font-size:28px; font-weight:900;">
                                            {{ $attempt->ai_score_avg !== null ? number_format($attempt->ai_score_avg, 1) : '—' }}
                                            <span style="color:#94a3b8; font-size:14px; font-weight:600;">/ 75</span>
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            {{-- CTA Button --}}
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:28px;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ route('attempt.show', $attempt->id) }}"
                                           style="display:inline-block; padding:14px 32px; background-color:#4f46e5; color:#ffffff; text-decoration:none; font-size:14px; font-weight:700; border-radius:14px; letter-spacing:0.02em;">
                                            Natijani ko'rish →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    {{-- Footer --}}
                    <tr>
                        <td style="padding:20px 32px; border-top:1px solid #f1f5f9; text-align:center;">
                            <p style="margin:0; color:#94a3b8; font-size:11px;">
                                © {{ date('Y') }} Multitest.uz — Barcha huquqlar himoyalangan.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
