<?php

namespace App\Policies;

use App\Models\Mock;
use App\Models\User\User;
use Illuminate\Auth\Access\Response;

class MockPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Mock $mock): bool
    {
        return $mock->open || $user->id === $mock->user_id;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('Teacher');
    }

    public function update(User $user, Mock $mock): bool
    {
        return $user->id === $mock->user_id;
    }

    public function delete(User $user, Mock $mock): bool
    {
        return $user->id === $mock->user_id;
    }

    public function restore(User $user, Mock $mock): bool
    {
        return $user->id === $mock->user_id;
    }

    public function forceDelete(User $user, Mock $mock): bool
    {
        return $user->id === $mock->user_id;
    }
}
