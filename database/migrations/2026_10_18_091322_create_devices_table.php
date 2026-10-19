<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('devices', function (Blueprint $table) {
            $table->id();
            // Kode bisnis: wajib & unik — dua perangkat tidak boleh berbagi kode yang sama
            $table->string('asset_code', 30)->unique();
            $table->string('name');
            $table->string('brand', 100)->nullable();
            $table->string('serial_number', 100)->nullable();
            // FK ke tabel categories (relasi many-side dari 1:N)
            $table->foreignId('category_id')->constrained()->restrictOnDelete();
            $table->string('status', 20); // enum: aktif | perbaikan | rusak | tidak_dipakai
            $table->string('assigned_to', 150)->nullable(); // penanggung jawab (opsional)
            $table->date('purchase_date')->nullable();       // harus tanggal valid
            $table->unsignedBigInteger('purchase_price')->nullable(); // >= 0
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('devices');
    }
};
