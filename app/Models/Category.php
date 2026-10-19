<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    /** Relasi 1:N: satu kategori punya banyak perangkat. */
    public function devices(): HasMany
    {
        return $this->hasMany(Device::class);
    }
}
