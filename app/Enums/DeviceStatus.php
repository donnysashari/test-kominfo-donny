<?php

namespace App\Enums;

/**
 * Daftar status perangkat sesuai dataset resmi Seleksi TIK Diskominfo:
 * - Tersedia
 * - Digunakan
 * - Perbaikan
 */
enum DeviceStatus: string
{
    case Tersedia = 'tersedia';
    case Digunakan = 'digunakan';
    case Perbaikan = 'perbaikan';

    public function label(): string
    {
        return match ($this) {
            self::Tersedia => 'Tersedia',
            self::Digunakan => 'Digunakan',
            self::Perbaikan => 'Perbaikan',
        };
    }

    /** @return array<string, string> value => label, untuk dropdown & aturan validasi */
    public static function options(): array
    {
        $options = [];
        foreach (self::cases() as $case) {
            $options[$case->value] = $case->label();
        }

        return $options;
    }

    public static function tryFromAny(string $value): ?self
    {
        return self::tryFrom(strtolower(trim($value)));
    }
}
