<?php

namespace App\Providers;

use App\Actions\Fortify\ResetUserPassword;
use App\Http\Requests\LoginRequest;
use App\Http\Responses\LoginResponse;
use App\Http\Responses\PasskeyLoginResponse;
use App\Models\TeamInvitation;
use App\Models\User;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;
use Laravel\Fortify\Http\Requests\LoginRequest as FortifyLoginRequest;
use Laravel\Passkeys\Contracts\PasskeyLoginResponse as PasskeyLoginResponseContract;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(LoginResponseContract::class, LoginResponse::class);
        $this->app->singleton(PasskeyLoginResponseContract::class, PasskeyLoginResponse::class);
        $this->app->bind(FortifyLoginRequest::class, LoginRequest::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureActions();
        $this->configureViews();
        $this->configureRateLimiting();
    }

    /**
     * Configure Fortify actions.
     */
    private function configureActions(): void
    {
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);

        Fortify::authenticateUsing(function (Request $request) {
            $loginValue = $request->input('login_value') ?? $request->input('email');

            if (! is_string($loginValue) || $loginValue === '') {
                return null;
            }

            // Explicit login_field (if the frontend ever sends one) wins; otherwise
            // auto-detect from the shape of the value: email → NIM → NIDN, in that order.
            $loginField = $request->input('login_field') ?? $this->detectLoginField($loginValue);

            $user = match ($loginField) {
                'nim' => User::query()
                    ->where(function ($query) use ($loginValue): void {
                        $query->where('nim', $loginValue)
                            ->orWhereHas('mahasiswa', fn ($mahasiswa) => $mahasiswa->where('nim', $loginValue));
                    })
                    ->first(),
                'nidn' => User::query()
                    ->where(function ($query) use ($loginValue): void {
                        $query->where('nidn', $loginValue)
                            ->orWhereHas('dosen', fn ($dosen) => $dosen->where('nidn', $loginValue));
                    })
                    ->first(),
                default => User::query()->where('email', $loginValue)->first(),
            };

            if ($user === null || ! Hash::check($request->password, $user->password)) {
                return null;
            }

            return $user;
        });
    }

    /**
     * Auto-detect whether a login value is an email, NIM, or NIDN based on its shape
     * and whether it matches an existing record — so the login form can stay a single
     * generic field without the frontend needing to know which type it is.
     */
    private function detectLoginField(string $loginValue): string
    {
        if (str_contains($loginValue, '@')) {
            return 'email';
        }

        $matchesNim = User::query()->where('nim', $loginValue)
            ->orWhereHas('mahasiswa', fn ($mahasiswa) => $mahasiswa->where('nim', $loginValue))
            ->exists();

        if ($matchesNim) {
            return 'nim';
        }

        $matchesNidn = User::query()->where('nidn', $loginValue)
            ->orWhereHas('dosen', fn ($dosen) => $dosen->where('nidn', $loginValue))
            ->exists();

        if ($matchesNidn) {
            return 'nidn';
        }

        return 'email';
    }

    /**
     * Configure Fortify views.
     */
    private function configureViews(): void
    {
        Fortify::loginView(fn (Request $request) => Inertia::render('auth/login', [
            'canResetPassword' => Features::enabled(Features::resetPasswords()),
            'status' => $request->session()->get('status'),
            'teamInvitation' => $this->teamInvitation($request),
        ]));

        Fortify::resetPasswordView(fn (Request $request) => Inertia::render('auth/reset-password', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]));

        Fortify::requestPasswordResetLinkView(fn (Request $request) => Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::confirmPasswordView(fn () => Inertia::render('auth/confirm-password'));
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {

        RateLimiter::for('login', function (Request $request) {
            $identity = $request->input('login_value') ?? $request->input(Fortify::username());
            $throttleKey = Str::transliterate(Str::lower((string) $identity).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });

        RateLimiter::for('passkeys', function (Request $request) {
            $credentialId = $request->input('credential.id');

            return Limit::perMinute(10)->by(
                ($credentialId ?: $request->session()->getId()).'|'.$request->ip(),
            );
        });
    }

    /**
     * Get the pending team invitation context for auth pages.
     *
     * @return array{code: string, teamName: string}|null
     */
    private function teamInvitation(Request $request): ?array
    {
        $invitationCode = $request->query('invitation');

        if (! is_string($invitationCode)) {
            return null;
        }

        $invitation = TeamInvitation::query()
            ->with('team')
            ->where('code', $invitationCode)
            ->whereNull('accepted_at')
            ->where(fn ($query) => $query
                ->whereNull('expires_at')
                ->orWhere('expires_at', '>=', now()))
            ->first();

        if (! $invitation) {
            return null;
        }

        return [
            'code' => $invitation->code,
            'teamName' => $invitation->team->name,
        ];
    }
}
