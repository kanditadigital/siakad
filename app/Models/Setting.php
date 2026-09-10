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
     * Self-heals if the cached entry is unreadable (e.g. a stale/corrupted
     * serialized value that unserializes to something other than a Collection),
     * so a bad cache entry degrades to a fresh query instead of a hard 500.
     *
     * @return Collection<string, mixed>
     */
    public static function allSettings(): Collection
    {
        $query = fn () => static::query()->pluck('value', 'key');

        $cached = Cache::rememberForever('settings.all', $query);

        if (! $cached instanceof Collection) {
            Cache::forget('settings.all');
            $cached = Cache::rememberForever('settings.all', $query);
        }

        return $cached;
    }
}
