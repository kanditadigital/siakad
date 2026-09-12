<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\PasswordUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class ForcePasswordChangeController extends Controller
{
    /**
     * Show the mandatory password-change form for a first-login account
     * (default password still equal to the NIM/NIDN it was created with).
     */
    public function edit(): Response
    {
        return Inertia::render('auth/force-password-change', [
            'passwordRules' => Password::defaults()->toPasswordRulesString(),
        ]);
    }

    /**
     * Replace the default password and lift the forced-change gate so the
     * user reaches the rest of the app on their next request.
     */
    public function update(PasswordUpdateRequest $request): RedirectResponse
    {
        $request->user()->update([
            'password' => $request->password,
            'must_change_password' => false,
        ]);

        return redirect()->route('dashboard');
    }
}
