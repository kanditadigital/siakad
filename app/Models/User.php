<?php

namespace App\Models;

use App\Concerns\HasTeams;
use App\Enums\UserRole;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property UserRole $role
 * @property string|null $nim
 * @property string|null $nidn
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read Mahasiswa|null $mahasiswa
 * @property-read Dosen|null $dosen
 * @property-read ProgramStudi|null $programStudi
 */
#[Fillable(['name', 'email', 'password', 'role', 'nim', 'nidn', 'program_studi_id', 'photo'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, HasTeams, Notifiable, PasskeyAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'role' => UserRole::class,
        ];
    }

    /**
     * @return HasOne<Mahasiswa, $this>
     */
    public function mahasiswa(): HasOne
    {
        return $this->hasOne(Mahasiswa::class);
    }

    /**
     * @return HasOne<Dosen, $this>
     */
    public function dosen(): HasOne
    {
        return $this->hasOne(Dosen::class);
    }

    /**
     * @return BelongsTo<ProgramStudi, $this>
     */
    public function programStudi(): BelongsTo
    {
        return $this->belongsTo(ProgramStudi::class);
    }

    public function getLoginIdentifier(): string
    {
        return match ($this->role) {
            UserRole::Mahasiswa => $this->nim ?? $this->email,
            UserRole::Dosen => $this->nidn ?? $this->email,
            UserRole::AdminProdi => $this->email,
            default => $this->email,
        };
    }

    protected static function booted(): void
    {
        static::saved(function (User $user): void {
            if ($user->wasChanged('nim') && $user->mahasiswa !== null) {
                $user->mahasiswa->forceFill(['nim' => $user->nim])->saveQuietly();
            }

            if ($user->wasChanged('nidn') && $user->dosen !== null) {
                $user->dosen->forceFill(['nidn' => $user->nidn])->saveQuietly();
            }
        });
    }
}
