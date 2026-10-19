<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DeviceController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Endpoint dibungkus prefix /api otomatis oleh Laravel.
| Route {device} melakukan model binding: Laravel mencari record sesuai id,
| lalu mengirim 404 JSON otomatis jika tidak ketemu — tidak perlu cek manual.
*/

Route::get('/categories', [CategoryController::class, 'index']);
Route::apiResource('devices', DeviceController::class);
