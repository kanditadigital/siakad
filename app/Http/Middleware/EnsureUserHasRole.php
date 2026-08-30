<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(401);
        }

        $userRole = $user->role;

        if (! $userRole) {
            abort(403);
        }

        $allowedRoles = array_map(fn (string $role) => UserRole::tryFrom($role), $roles);
        $allowedRoles = array_filter($allowedRoles);

        if (! in_array($userRole, $allowedRoles)) {
            abort(403);
        }

        return $next($request);
    }
}
