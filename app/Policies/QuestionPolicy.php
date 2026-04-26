<?php

namespace App\Policies;

use App\Models\Question;
use App\Models\User\User;
use Illuminate\Auth\Access\Response;

class QuestionPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Question $question): bool
    {
        return $question->part->test->is_public || $user->id === $question->part->test->user_id;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('Teacher');
    }

    public function update(User $user, Question $question): bool
    {
        return $user->id === $question->part->test->user_id;
    }

    public function delete(User $user, Question $question): bool
    {
        return $user->id === $question->part->test->user_id;
    }

    public function restore(User $user, Question $question): bool
    {
        return $user->id === $question->part->test->user_id;
    }

    public function forceDelete(User $user, Question $question): bool
    {
        return $user->id === $question->part->test->user_id;
    }
}
