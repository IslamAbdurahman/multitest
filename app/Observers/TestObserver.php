<?php

namespace App\Observers;

use App\Models\Test;
use Illuminate\Support\Facades\Auth;

class TestObserver
{
    /**
     * Handle the Test "created" event.
     */
    public function created(Test $test): void
    {
        $parts = [
            [
                'name' => 'Part 1.1',
                'description' => 'Part one. In this part, I’m going to ask you three short questions about yourself and your interests. And then, you will see some photos and answer some questions about them. You will have 30 seconds to reply to each question. Begin speaking when you hear this sound',
                'audio_path' => '/' . $test->language->code . '/audio/part-1.1-voice.mp3',
            ],
            [
                'name' => 'Part 1.2',
                'description' => 'Moving to the next section of the multitest.uz exam. Now, I’m going to ask you to compare two pictures and I will ask you two questions about them. Look at the photographs.',
                'audio_path' => '/' . $test->language->code . '/audio/part-1.2-voice.mp3',
            ],
            [
                'name' => 'Part 2',
                'description' => 'Part two. This original content is created for multitest.uz users. In this part, I’m going to show you a picture and ask you three questions. You will have one minute to think about your answers before you start speaking. You will have two minutes to answer all three questions. Begin speaking when you hear this sound. Look at the photograph.',
                'audio_path' => '/' . $test->language->code . '/audio/part-2-voice.mp3',
            ],
            [
                'name' => 'Part 3',
                'description' => 'Part three. Final section of the multitest.uz speaking system. In this part, you are going to speak on a topic for two minutes. You can see the topic on the screen and two lists of points related to the topic. Choose two items from each list and give a balanced argument. You have one minute to prepare and two minutes to speak. Begin speaking when you hear this sound.',
                'audio_path' => '/' . $test->language->code . '/audio/part-3-voice.mp3',
            ]
        ];

        // Massiv shaklida saqlash uchun createMany ishlatgan ma'qul
        $test->parts()->createMany($parts);

        if (!$test->audio_path && $test->is_public == 1) {
            $test->audio_path = '/' . $test->language->code . '/audio/test-intro.mp3';
        }

        if (!$test->description && $test->is_public == 1) {
            $test->description = 'This speaking test is powered by multitest.uz. All audio recordings are the exclusive property of this platform and are designed specifically for our users. Please follow the instructions carefully.';
        }
    }

    /**
     * Handle the Test "updated" event.
     */
    public function updating(Test $test): void
    {
        if (!Auth::user()->hasRole('Admin')) {
            if ($test->user_id != Auth::id()) {
                throw new \Exception('You are not allowed to edit this test.');
            }
        }

        if (!$test->audio_path && $test->is_public == 1) {
            $test->audio_path = '/' . $test->language->code . '/audio/test-intro.mp3';
        }

        if (!$test->description && $test->is_public == 1) {
            $test->description = 'This speaking test is powered by multitest.uz. All audio recordings are the exclusive property of this platform and are designed specifically for our users. Please follow the instructions carefully.';
        }
    }

    /**
     * Handle the Test "deleted" event.
     */
    public function deleting(Test $test): void
    {
        if (!Auth::user()->hasRole('Admin')) {
            if ($test->user_id != Auth::id()) {
                throw new \Exception('You are not allowed to edit this test.');
            }
        }
    }

    /**
     * Handle the Test "restored" event.
     */
    public function restored(Test $test): void
    {
        //
    }

    /**
     * Handle the Test "force deleted" event.
     */
    public function forceDeleted(Test $test): void
    {
        //
    }
}
