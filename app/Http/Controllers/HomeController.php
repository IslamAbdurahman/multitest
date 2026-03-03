<?php

namespace App\Http\Controllers;

use App\Models\User\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {

        if ($request->slug) {
            $mock = \App\Models\Mock::query()
                ->with([

                ])
                ->where('slug', $request->slug)->where('open', true)
                ->first();
            if ($mock) {
                return Inertia::render('welcome', [
                    'mock' => $mock,
                ]);
            }
        }

        return Inertia::render('welcome');

    }

    public function dashboard(Request $request)
    {
        $user = User::query()
            ->with([
                'last_attempt' => function ($query) {
                    $query->with([
                        'attempt_parts' => function ($query) {
                            $query->withSum('attempt_answers as score_ai', 'score_ai')
                                ->withCount('attempt_answers as total_questions');
                        },
                    ]);
                },
                'attempts' => function ($query) {
                    $query->whereYear('finished_at', now()->year)
                        ->whereMonth('finished_at', now()->month)
                        ->orderBy('finished_at', 'asc')
                        ->with([
                            'attempt_parts' => function ($query) {
                                $query->withSum('attempt_answers as score_ai', 'score_ai')
                                    ->withCount('attempt_answers as total_questions');
                            },
                        ]);
                },
            ])
            ->find(Auth::id());

        return Inertia::render('dashboard', [
            'user' => $user
        ]);

    }
}
