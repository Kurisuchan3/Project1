<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProductsSeeder extends Seeder
{
    public function run(): void
    {
        // ✅ Get existing IDs dynamically
        $subcategory = DB::table('subcategories')->where('name', 'MSI')->first();
        $inventory = DB::table('inventory')->first();
        $status = DB::table('statuses')->where('status_name', 'Instock')->first();

        if (!$subcategory || !$inventory || !$status) {
            echo "❌ ERROR: Missing required data. Products were not seeded.\n";
            return;
        }

        DB::table('products')->delete();

        DB::table('products')->insert([
            [
                'subcategory_id' => $subcategory->id,
                'inventory_id' => $inventory->id,
                'name' => 'Apple MacBook Pro M2',
                'price' => 1999.99,
                'description' => 'A powerful laptop with the latest M2 chip from Apple.',
                'specifications' => '16GB RAM, 512GB SSD, macOS, 13-inch Retina Display',
                'image_url' => 'https://example.com/macbook.jpg',
                'statuses_id' => $status->id,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
