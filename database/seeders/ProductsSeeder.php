<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProductsSeeder extends Seeder
{
    public function run(): void
    {
        // Fetch subcategories
        $msi = DB::table('subcategories')->where('name', 'MSI')->first();
        $gigabyte = DB::table('subcategories')->where('name', 'GigaBytes')->first();
        $acer = DB::table('subcategories')->where('name', 'Acer')->first();
        $asus = DB::table('subcategories')->where('name', 'Asus')->first();
        $lenovo = DB::table('subcategories')->where('name', 'Lenovo')->first();

        $status = DB::table('statuses')->where('status_name', 'Instock')->first();

        if (!$msi || !$gigabyte || !$acer || !$asus || !$lenovo || !$status) {
            echo "❌ ERROR: Missing required data (subcategories or status). Products were not seeded.\n";
            return;
        }

        // Remove existing products
        DB::table('products')->delete();

        // Insert products with varied subcategories
        DB::table('products')->insert([
            [
                'subcategory_id' => $msi->id,
                'name' => 'Apple MacBook Pro M2',
                'price' => 1999.99,
                'quantity' => 15,
                'description' => 'A powerful laptop with the latest M2 chip from Apple.',
                'specifications' => '16GB RAM, 512GB SSD, macOS, 13-inch Retina Display',
                'image' => '/images/macbook.jpg', // Use a local placeholder
                'status_id' => $status->id,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'subcategory_id' => $gigabyte->id,
                'name' => 'Dell XPS 13',
                'price' => 1499.99,
                'quantity' => 20,
                'description' => 'A sleek and powerful ultrabook.',
                'specifications' => '16GB RAM, 1TB SSD, Windows 11, 13.4-inch Display',
                'image' => '/images/dellxps.jpg',
                'status_id' => $status->id,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'subcategory_id' => $acer->id,
                'name' => 'HP Spectre x360',
                'price' => 1799.99,
                'quantity' => 12,
                'description' => 'A versatile 2-in-1 convertible laptop.',
                'specifications' => '16GB RAM, 512GB SSD, Windows 11, 13.5-inch OLED',
                'image' => '/images/spectre.jpg',
                'status_id' => $status->id,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'subcategory_id' => $lenovo->id,
                'name' => 'Lenovo ThinkPad X1 Carbon',
                'price' => 1699.99,
                'quantity' => 18,
                'description' => 'A business-class laptop with top-tier performance.',
                'specifications' => '16GB RAM, 1TB SSD, Windows 11, 14-inch Display',
                'image' => '/images/thinkpad.jpg',
                'status_id' => $status->id,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'subcategory_id' => $asus->id,
                'name' => 'Asus ROG Zephyrus G14',
                'price' => 1899.99,
                'quantity' => 25,
                'description' => 'A gaming laptop with exceptional portability.',
                'specifications' => '32GB RAM, 1TB SSD, Windows 11, 14-inch QHD Display',
                'image' => '/images/zephyrus.jpg',
                'status_id' => $status->id,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}