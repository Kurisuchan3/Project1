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
        $statuses = [
            'Pending',
            'Processing',
            'Shipped',
            'Delivered',
            'Cancelled',
            'Instock',
            'Out of stock',
            'Active',
            'Inactive',
            'Deactivated', // ✅ Fixed spelling (was 'Deactiveted')
        ];

        foreach ($statuses as $status) {
            // ✅ Insert only if status doesn't already exist
            DB::table('statuses')->updateOrInsert(
                ['status_name' => $status], // Check if this status already exists
                ['created_at' => Carbon::now()]
            );
        }
    }
}
