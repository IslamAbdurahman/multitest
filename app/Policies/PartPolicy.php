<?php

namespace App\Policies;

use App\Models\Part;
use App\Models\User\User;
use Illuminate\Auth\Access\Response;

class PartPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Part $part): bool
    {
        return $part->test->is_public || $user->id === $part->test->user_id;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('Teacher');
    }

    public function update(User $user, Part $part): bool
    {
        return $user->id === $part->test->user_id;
    }

    public function delete(User $user, Part $part): bool
    {
        return $user->id === $part->test->user_id;
    }

    public function restore(User $user, Part $part): bool
    {
        return $user->id === $part->test->user_id;
    }

    public function forceDelete(User $user, Part $part): bool
    {
        return $user->id === $part->test->user_id;
    }
}
