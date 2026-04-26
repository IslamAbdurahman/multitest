<?php

namespace App\Policies;

use App\Models\Attempt;
use App\Models\User\User;
use Illuminate\Auth\Access\Response;

class AttemptPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Attempt $attempt): bool
    {
        return $user->id === $attempt->user_id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Attempt $attempt): bool
    {
        return $user->id === $attempt->user_id;
    }

    public function delete(User $user, Attempt $attempt): bool
    {
        return $user->id === $attempt->user_id;
    }

    public function restore(User $user, Attempt $attempt): bool
    {
        return $user->id === $attempt->user_id;
    }

    public function forceDelete(User $user, Attempt $attempt): bool
    {
        return $user->id === $attempt->user_id;
    }
}
