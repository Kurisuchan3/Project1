<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProductsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('products')->insert([
            [
                'subcategory_id' => 1, // Ensure this exists in 'subcategories'
                'inventory_id' => 1, // Ensure this exists in 'inventory'
                'name' => 'Apple MacBook Pro M2',
                'price' => 1999.99,
                'description' => 'A powerful laptop with the latest M2 chip from Apple.',
                'specifications' => '16GB RAM, 512GB SSD, macOS, 13-inch Retina Display',
                'image_url' => 'https://example.com/macbook.jpg',
                'statuses_id' => 6, // Ensure this exists in 'statuses'
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'subcategory_id' => 2,
                'inventory_id' => 2,
                'name' => 'Dell XPS 15',
                'price' => 1599.99,
                'description' => 'A sleek and high-performance laptop for professionals.',
                'specifications' => '16GB RAM, 1TB SSD, Windows 11, 15.6-inch OLED Display',
                'image_url' => 'https://example.com/dell-xps.jpg',
                'statuses_id' => 6,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'subcategory_id' => 3,
                'inventory_id' => 3,
                'name' => 'ASUS ROG Strix G16',
                'price' => 1799.99,
                'description' => 'A gaming beast with high refresh rate display.',
                'specifications' => '32GB RAM, 1TB SSD, RTX 4070, 16-inch 240Hz Display',
                'image_url' => 'https://example.com/asus-rog.jpg',
                'statuses_id' => 6,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
