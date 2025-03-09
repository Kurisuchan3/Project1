<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubcategorySeeder extends Seeder
{
    public function run(): void
    {
        // ✅ Get the actual category ID dynamically
        $category = DB::table('categories')->where('name', 'Brands')->first();

        if ($category) {
            DB::table('subcategories')->delete(); // Use delete() instead of truncate()

            DB::table('subcategories')->insert([
                ['category_id' => $category->id, 'name' => 'MSI'],
                ['category_id' => $category->id, 'name' => 'GigaBytes'],
                ['category_id' => $category->id, 'name' => 'Acer'],
                ['category_id' => $category->id, 'name' => 'Asus'],
                ['category_id' => $category->id, 'name' => 'Lenovo'],
            ]);
        } else {
            echo "❌ ERROR: 'Brands' category not found. Subcategories were not seeded.\n";
        }
    }
}
