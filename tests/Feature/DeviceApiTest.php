<?php

namespace Tests\Feature;

use App\Enums\DeviceStatus;
use App\Models\Category;
use App\Models\Device;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeviceApiTest extends TestCase
{
    use RefreshDatabase;

    protected Category $category;

    protected function setUp(): void
    {
        parent::setUp();

        $this->category = Category::create([
            'name' => 'Laptop',
        ]);
    }

    public function test_can_list_devices(): void
    {
        Device::create([
            'asset_code' => 'IT1-TEST-001',
            'name' => 'Laptop Uji',
            'category_id' => $this->category->id,
            'status' => DeviceStatus::Tersedia,
        ]);

        $response = $this->getJson('/api/devices');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'asset_code',
                        'name',
                        'brand',
                        'serial_number',
                        'category_id',
                        'category_name',
                        'status',
                        'status_label',
                        'assigned_to',
                        'purchase_date',
                        'purchase_price',
                        'notes',
                        'created_at',
                        'updated_at',
                    ],
                ],
            ]);
    }

    public function test_can_show_single_device(): void
    {
        $device = Device::create([
            'asset_code' => 'IT1-TEST-002',
            'name' => 'Laptop Kadis',
            'category_id' => $this->category->id,
            'status' => DeviceStatus::Tersedia,
            'assigned_to' => 'Sekretariat',
            'purchase_price' => 15000000,
        ]);

        $response = $this->getJson("/api/devices/{$device->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.asset_code', 'IT1-TEST-002')
            ->assertJsonPath('data.name', 'Laptop Kadis')
            ->assertJsonPath('data.purchase_price', 15000000);
    }

    public function test_can_create_device(): void
    {
        $payload = [
            'asset_code' => 'IT1-NEW-001',
            'name' => 'Server Ruang Rapat',
            'brand' => 'Dell PowerEdge',
            'serial_number' => 'SN-DEL-999',
            'category_id' => $this->category->id,
            'status' => 'tersedia',
            'assigned_to' => 'Dinas A',
            'purchase_date' => '2026-10-10',
            'purchase_price' => 35000000,
            'notes' => 'Server utama untuk sistem rapat.',
        ];

        $response = $this->postJson('/api/devices', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('data.asset_code', 'IT1-NEW-001')
            ->assertJsonPath('data.name', 'Server Ruang Rapat');

        $this->assertDatabaseHas('devices', [
            'asset_code' => 'IT1-NEW-001',
            'name' => 'Server Ruang Rapat',
        ]);
    }

    public function test_device_validation_rules(): void
    {
        // 1. Missing required fields
        $response = $this->postJson('/api/devices', []);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['asset_code', 'name', 'category_id', 'status']);

        // 2. Negative purchase price
        $response = $this->postJson('/api/devices', [
            'asset_code' => 'IT1-VAL-001',
            'name' => 'Validasi Device',
            'category_id' => $this->category->id,
            'status' => 'tersedia',
            'purchase_price' => -500,
        ]);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['purchase_price']);

        // 3. Duplicate asset_code
        Device::create([
            'asset_code' => 'IT1-EXISTING',
            'name' => 'Perangkat Ada',
            'category_id' => $this->category->id,
            'status' => DeviceStatus::Tersedia,
        ]);

        $response = $this->postJson('/api/devices', [
            'asset_code' => 'IT1-EXISTING',
            'name' => 'Duplikat Kode',
            'category_id' => $this->category->id,
            'status' => 'tersedia',
        ]);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['asset_code']);

        // 4. Invalid status enum
        $response = $this->postJson('/api/devices', [
            'asset_code' => 'IT1-VAL-002',
            'name' => 'Status Salah',
            'category_id' => $this->category->id,
            'status' => 'status_ngawur',
        ]);
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['status']);
    }

    public function test_can_update_device(): void
    {
        $device = Device::create([
            'asset_code' => 'IT1-UPDATE-001',
            'name' => 'Nama Lama',
            'category_id' => $this->category->id,
            'status' => DeviceStatus::Tersedia,
        ]);

        $response = $this->putJson("/api/devices/{$device->id}", [
            'asset_code' => 'IT1-UPDATE-001', // tetap sama, tidak boleh kena unique collision
            'name' => 'Nama Baru Diperbarui',
            'category_id' => $this->category->id,
            'status' => 'perbaikan',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'Nama Baru Diperbarui')
            ->assertJsonPath('data.status', 'perbaikan');

        $this->assertDatabaseHas('devices', [
            'id' => $device->id,
            'name' => 'Nama Baru Diperbarui',
            'status' => 'perbaikan',
        ]);
    }

    public function test_can_delete_device(): void
    {
        $device = Device::create([
            'asset_code' => 'IT1-DEL-001',
            'name' => 'Perangkat Akan Dihapus',
            'category_id' => $this->category->id,
            'status' => DeviceStatus::Perbaikan,
        ]);

        $response = $this->deleteJson("/api/devices/{$device->id}");

        $response->assertStatus(200)
            ->assertJsonPath('message', 'Data berhasil dihapus.');

        $this->assertDatabaseMissing('devices', [
            'id' => $device->id,
        ]);
    }

    public function test_can_list_categories(): void
    {
        $response = $this->getJson('/api/categories');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'device_count'],
                ],
            ]);
    }
}
