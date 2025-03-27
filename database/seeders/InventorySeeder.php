<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class InventorySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('inventories')->insert([
            [
                'product_id' => 1,
                'stock_quantity' => 15,
                'stock_status' => 'In Stock',
                'last_restock' => Carbon::now()->subDays(10),
            ],
            [
                'product_id' => 2,
                'stock_quantity' => 20,
                'stock_status' => 'In Stock',
                'last_restock' => Carbon::now()->subDays(7),
            ],
            [
                'product_id' => 3,
                'stock_quantity' => 12,
                'stock_status' => 'In Stock',
                'last_restock' => Carbon::now()->subDays(5),
            ],
            [
                'product_id' => 4,
                'stock_quantity' => 18,
                'stock_status' => 'In Stock',
                'last_restock' => Carbon::now()->subDays(3),
            ],
            [
                'product_id' => 5,
                'stock_quantity' => 25,
                'stock_status' => 'In Stock',
                'last_restock' => Carbon::now()->subDays(8),
            ],
        ]);
    }
}
