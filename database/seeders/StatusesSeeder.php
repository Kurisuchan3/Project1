<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class StatusesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('statuses')->insert([
            ['status_name' => 'Pending', 'created_at' => Carbon::now()],
            ['status_name' => 'Processing', 'created_at' => Carbon::now()],
            ['status_name' => 'Shipped', 'created_at' => Carbon::now()],
            ['status_name' => 'Delivered', 'created_at' => Carbon::now()],
            ['status_name' => 'Cancelled', 'created_at' => Carbon::now()],
            ['status_name' => 'Instock', 'created_at' => Carbon::now()],
            ['status_name' => 'Out of stock', 'created_at' => Carbon::now()],
            ['status_name' => 'Active', 'created_at' => Carbon::now()],
            ['status_name' => 'Inactive', 'created_at' => Carbon::now()],
            ['status_name' => 'Deactiveted', 'created_at' => Carbon::now()],
        ]);
    }
}
