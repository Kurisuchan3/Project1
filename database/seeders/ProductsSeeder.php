<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProductsSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('products')->delete();

        DB::table('products')->insert([
            [
                'name' => 'Apple MacBook Pro M2',
                'price' => 1999.99,
                'description' => 'A powerful laptop with the latest M2 chip from Apple.',
                'specifications' => '16GB RAM, 512GB SSD, macOS, 13-inch Retina Display',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Dell XPS 15',
                'price' => 1599.99,
                'description' => 'High-performance Windows laptop by Dell.',
                'specifications' => '16GB RAM, 1TB SSD, Windows 11 Pro, 15.6-inch 4K display',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'ASUS ROG Strix G16',
                'price' => 1799.99,
                'description' => 'A powerful gaming laptop from ASUS.',
                'specifications' => '32GB RAM, 1TB SSD, NVIDIA RTX 4060, RGB keyboard',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'HP Spectre x360',
                'price' => 1399.99,
                'description' => 'A stylish and versatile 2-in-1 laptop.',
                'specifications' => '16GB RAM, 512GB SSD, Touchscreen, Windows 11 Home',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Lenovo ThinkPad X1 Carbon',
                'price' => 1699.99,
                'description' => 'An ultra-light business laptop from Lenovo.',
                'specifications' => '16GB RAM, 1TB SSD, Windows 11 Pro, Fingerprint reader',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
