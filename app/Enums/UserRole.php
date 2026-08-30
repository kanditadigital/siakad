<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case AdminProdi = 'admin_prodi';
    case Dosen = 'dosen';
    case Mahasiswa = 'mahasiswa';
    case Pimpinan = 'pimpinan';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Administrator',
            self::AdminProdi => 'Admin Program Studi',
            self::Dosen => 'Dosen',
            self::Mahasiswa => 'Mahasiswa',
            self::Pimpinan => 'Pimpinan',
        };
    }

    public static function routePattern(): string
    {
        return collect(self::cases())->map->value->implode('|');
    }
}
