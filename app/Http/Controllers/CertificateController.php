<?php

namespace App\Http\Controllers;

use App\Models\Attempt;
use Illuminate\Http\Request;
use Spatie\LaravelPdf\Facades\Pdf;

class CertificateController extends Controller
{
    public function download(Attempt $attempt)
    {
        // Security check
        if (auth()->id() !== $attempt->user_id && !auth()->user()->hasRole(['Admin', 'Teacher'])) {
            abort(403);
        }

        if (!$attempt->score && !$attempt->ai_score_avg) {
            return back()->with('error', 'Test results are not ready yet.');
        }

        return Pdf::view('pdf.certificate', ['attempt' => $attempt])
            ->name("certificate-{$attempt->id}.pdf")
            ->download();
    }
}
