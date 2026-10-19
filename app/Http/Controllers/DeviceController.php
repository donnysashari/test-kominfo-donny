<?php

namespace App\Http\Controllers;

use App\Enums\DeviceStatus;
use App\Models\Device;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DeviceController extends Controller
{
    /** GET /api/devices */
    public function index(Request $request): JsonResponse
    {
        $devices = Device::with('category')
            ->orderByDesc('id')
            ->get()
            ->map(fn (Device $device) => $this->transform($device));

        return response()->json(['data' => $devices]);
    }

    /** GET /api/devices/{device} */
    public function show(Device $device): JsonResponse
    {
        return response()->json(['data' => $this->transform($device->load('category'))]);
    }

    /** POST /api/devices */
    public function store(Request $request): JsonResponse
    {
        $device = Device::create($this->validated($request));

        return response()->json(['data' => $this->transform($device->load('category'))], 201);
    }

    /** PUT /api/devices/{device} */
    public function update(Request $request, Device $device): JsonResponse
    {
        $device->update($this->validated($request, $device));

        return response()->json(['data' => $this->transform($device->load('category'))]);
    }

    /** DELETE /api/devices/{device} */
    public function destroy(Device $device): JsonResponse
    {
        $device->delete();

        return response()->json(['message' => 'Data berhasil dihapus.']);
    }

    /**
     * Aturan validasi untuk create dan update.
     *
     * @return array<string, mixed>
     */
    private function validated(Request $request, ?Device $device = null): array
    {
        if ($request->has('status') && is_string($request->input('status'))) {
            $request->merge(['status' => strtolower(trim($request->input('status')))]);
        }

        return $request->validate([
            'asset_code' => [
                'required', 'string', 'max:30',
                Rule::unique('devices', 'asset_code')->ignore($device?->id),
            ],
            'name' => ['required', 'string', 'max:255'],
            'brand' => ['nullable', 'string', 'max:100'],
            'serial_number' => ['nullable', 'string', 'max:100'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'status' => ['required', Rule::enum(DeviceStatus::class)],
            'assigned_to' => ['nullable', 'string', 'max:150'],
            'purchase_date' => ['nullable', 'date'],
            'purchase_price' => ['nullable', 'integer', 'min:0'],
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);
    }

    /**
     * Transform model ke bentuk respons API terstruktur.
     *
     * @return array<string, mixed>
     */
    private function transform(Device $device): array
    {
        return [
            'id' => $device->id,
            'asset_code' => $device->asset_code,
            'name' => $device->name,
            'brand' => $device->brand,
            'serial_number' => $device->serial_number,
            'category_id' => $device->category_id,
            'category_name' => $device->category?->name,
            'status' => $device->status?->value,
            'status_label' => $device->status?->label(),
            'assigned_to' => $device->assigned_to,
            'purchase_date' => $device->purchase_date?->toDateString(),
            'purchase_price' => $device->purchase_price,
            'notes' => $device->notes,
            'created_at' => $device->created_at?->toIso8601String(),
            'updated_at' => $device->updated_at?->toIso8601String(),
        ];
    }
}
