<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\JsonResponse;

class CategoryController extends Controller
{
    /** GET /api/categories — dipakai oleh dropdown pada form tambah/ubah dan filter. */
    public function index(): JsonResponse
    {
        $categories = Category::withCount('devices')->orderBy('name')->get()
            ->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'device_count' => $category->devices_count,
            ]);

        return response()->json(['data' => $categories]);
    }
}
