<?php

use App\Enums\UserRole;
use App\Http\Middleware\HandleInertiaRequests;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

/**
 * Institution-wide pending-work counts behind the header bell.
 *
 * @see HandleInertiaRequests::PERAN_STAF
 */
Broadcast::channel('tugas', function (User $user): bool {
    return in_array($user->role, [UserRole::Admin, UserRole::AdminProdi, UserRole::Pimpinan], true);
});
