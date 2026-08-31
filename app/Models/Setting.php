<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = ['key', 'value'];

    protected static function booted(): void
    {
        static::saved(fn () => Cache::forget('settings.all'));
        static::deleted(fn () => Cache::forget('settings.all'));
    }

    /**
     * Get a single setting value by key, falling back to $default when unset.
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        return static::allSettings()->get($key, $default);
    }

    /**
     * Persist a single setting value.
     */
    public static function set(string $key, mixed $value): void
    {
        static::query()->updateOrCreate(['key' => $key], ['value' => $value]);
    }

    /**
     * Persist multiple settings at once.
     *
     * @param  array<string, mixed>  $values
     */
    public static function setMany(array $values): void
    {
        foreach ($values as $key => $value) {
            static::set($key, $value);
        }
    }

    /**
     * All settings as a flat key => value collection, cached.
     *
     * @return Collection<string, mixed>
     */
    public static function allSettings(): Collection
    {
        return Cache::rememberForever(
            'settings.all',
            fn () => static::query()->pluck('value', 'key')
        );
    }
}
