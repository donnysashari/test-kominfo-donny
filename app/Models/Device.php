<?php

namespace App\Models;

use App\Enums\DeviceStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Device extends Model
{
    use HasFactory;

    /**
     * Kolom yang boleh terisi lewat mass assignment.
     *
     * @var list<string>
     */
    protected $fillable = [
        'asset_code',
        'name',
        'brand',
        'serial_number',
        'category_id',
        'status',
        'assigned_to',
        'purchase_date',
        'purchase_price',
        'notes',
    ];

    /** @var array<string, string> */
    protected $casts = [
        'purchase_date' => 'date',
        'purchase_price' => 'integer',
        'status' => DeviceStatus::class,
    ];

    /** Relasi 1:N: setiap perangkat punya SATU kategori. */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
