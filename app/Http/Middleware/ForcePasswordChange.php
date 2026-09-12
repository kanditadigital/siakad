<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ForcePasswordChange
{
    /**
     * Redirect any authenticated request to the mandatory password-change
     * page while the account still has its default (NIM/NIDN) password.
     *
     * `dashboard` is exempt too: it renders normally, and the dashboard's
     * layout shows the same change-password form as a blocking modal instead
     * of a redirect — this middleware is just the fallback for every other
     * route a user might otherwise reach (deep link, back button, etc.).
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && $user->must_change_password && ! $request->routeIs('password.force-change.*', 'logout', 'dashboard')) {
            return redirect()->route('password.force-change.edit');
        }

        return $next($request);
    }
}
