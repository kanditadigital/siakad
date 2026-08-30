<?php

namespace App\Http\Responses;

use App\Enums\UserRole;
use App\Http\Responses\Concerns\RedirectsToCurrentTeam;
use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Fortify;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
{
    use RedirectsToCurrentTeam;

    public function toResponse($request): Response
    {
        $user = $request->user();

        if ($request->wantsJson()) {
            return new JsonResponse(['two_factor' => false], 200);
        }

        $redirectPath = $user?->role instanceof UserRole
            ? route('dashboard')
            : Fortify::redirects('login');

        return redirect()->intended($redirectPath);
    }
}
