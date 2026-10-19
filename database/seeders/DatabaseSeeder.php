<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Device;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Seeder untuk 20 data resmi inventaris perangkat TI (dataset 01-inventaris-perangkat).
 */
class DatabaseSeeder extends Seeder
{
    /** @var list<array<string, mixed>> */
    private array $categories = [
        ['name' => 'Laptop'],
        ['name' => 'Printer'],
        ['name' => 'Jaringan'],
    ];

    /** @var list<array<mixed>> */
    private array $devices = [
        ['IT1-001', 'Laptop administrasi', 'Laptop', 'tersedia', 'Sekretariat', '2026-10-01', 250000, 'Data sintetis untuk latihan nomor 1.'],
        ['IT1-002', 'Printer loket', 'Printer', 'digunakan', 'Dinas A', '2026-10-02', 500000, 'Data sintetis untuk latihan nomor 2.'],
        ['IT1-003', 'Switch ruang server', 'Jaringan', 'perbaikan', 'Dinas B', '2026-10-03', 750000, 'Data sintetis untuk latihan nomor 3.'],
        ['IT1-004', 'Komputer pelayanan', 'Laptop', 'tersedia', 'Unit Teknis', '2026-10-04', 1000000, null],
        ['IT1-005', 'Access point lantai dua', 'Printer', 'digunakan', 'Sekretariat', '2026-10-05', 1250000, 'Data sintetis untuk latihan nomor 5.'],
        ['IT1-006', 'Scanner arsip', 'Jaringan', 'perbaikan', 'Dinas A', '2026-10-06', 0, 'Data sintetis untuk latihan nomor 6.'],
        ['IT1-007', 'UPS ruang operator', 'Laptop', 'tersedia', 'Dinas B', '2026-10-07', 250000, 'Data sintetis untuk latihan nomor 7.'],
        ['IT1-008', 'Monitor petugas', 'Printer', 'digunakan', 'Unit Teknis', '2026-10-08', 500000, null],
        ['IT1-009', 'Router kantor', 'Jaringan', 'perbaikan', 'Sekretariat', '2026-10-09', 750000, 'Data sintetis untuk latihan nomor 9.'],
        ['IT1-010', 'Laptop teknisi', 'Laptop', 'tersedia', 'Dinas A', '2026-10-10', 1000000, 'Data sintetis untuk latihan nomor 10.'],
        ['IT1-011', 'Printer sekretariat', 'Printer', 'digunakan', 'Dinas B', '2026-10-11', 1250000, 'Data sintetis untuk latihan nomor 11.'],
        ['IT1-012', 'Komputer keuangan', 'Jaringan', 'perbaikan', 'Unit Teknis', '2026-10-12', 0, null],
        ['IT1-013', 'Switch lantai satu', 'Laptop', 'tersedia', 'Sekretariat', '2026-10-13', 250000, 'Data sintetis untuk latihan nomor 13.'],
        ['IT1-014', 'Access point aula', 'Printer', 'digunakan', 'Dinas A', '2026-10-14', 500000, 'Data sintetis untuk latihan nomor 14.'],
        ['IT1-015', 'Scanner pelayanan', 'Jaringan', 'perbaikan', 'Dinas B', '2026-10-15', 750000, 'Data sintetis untuk latihan nomor 15.'],
        ['IT1-016', 'UPS jaringan', 'Laptop', 'tersedia', 'Unit Teknis', '2026-10-01', 1000000, null],
        ['IT1-017', 'Monitor layanan', 'Printer', 'digunakan', 'Sekretariat', '2026-10-02', 1250000, 'Data sintetis untuk latihan nomor 17.'],
        ['IT1-018', 'Router cadangan', 'Jaringan', 'perbaikan', 'Dinas A', '2026-10-03', 0, 'Data sintetis untuk latihan nomor 18.'],
        ['IT1-019', 'Laptop perencanaan', 'Laptop', 'tersedia', 'Dinas B', '2026-10-04', 250000, 'Data sintetis untuk latihan nomor 19.'],
        ['IT1-020', 'Printer pelaporan', 'Printer', 'digunakan', 'Unit Teknis', '2026-10-05', 500000, null],
    ];

    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@probolinggokota.go.id'],
            [
                'name' => 'Administrator Diskominfo',
                'password' => 'password123',
                'email_verified_at' => now(),
            ],
        );

        foreach ($this->categories as $category) {
            Category::firstOrCreate(['name' => $category['name']]);
        }

        foreach ($this->devices as [$code, $name, $category, $status, $assigned, $date, $price, $notes]) {
            Device::updateOrCreate(
                ['asset_code' => $code],
                [
                    'name' => $name,
                    'category_id' => Category::where('name', $category)->firstOrFail()->id,
                    'status' => $status,
                    'assigned_to' => $assigned,
                    'purchase_date' => $date,
                    'purchase_price' => $price,
                    'notes' => $notes,
                ],
            );
        }
    }
}
