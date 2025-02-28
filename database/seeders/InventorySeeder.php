<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class InventorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('inventory')->insert([
            [
                'itemname' => 'Apple MacBook Pro M2',
                'stock_quantity' => 15,
                'cost' => 1999.99,
                'warehouse_location' => 'Warehouse A - Section 1',
                'last_restock_date' => Carbon::now()->subDays(10),
            ],
            [
                'itemname' => 'Dell XPS 15',
                'stock_quantity' => 20,
                'cost' => 1599.99,
                'warehouse_location' => 'Warehouse B - Shelf 3',
                'last_restock_date' => Carbon::now()->subDays(7),
            ],
            [
                'itemname' => 'ASUS ROG Strix G16',
                'stock_quantity' => 12,
                'cost' => 1799.99,
                'warehouse_location' => 'Warehouse C - Rack 5',
                'last_restock_date' => Carbon::now()->subDays(5),
            ],
            [
                'itemname' => 'HP Spectre x360',
                'stock_quantity' => 18,
                'cost' => 1399.99,
                'warehouse_location' => 'Warehouse D - Row 2',
                'last_restock_date' => Carbon::now()->subDays(3),
            ],
            [
                'itemname' => 'Lenovo ThinkPad X1 Carbon',
                'stock_quantity' => 25,
                'cost' => 1699.99,
                'warehouse_location' => 'Warehouse A - Section 4',
                'last_restock_date' => Carbon::now()->subDays(8),
            ],
        ]);
    }
}
