<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class RolesSeeder extends Seeder
{
    public function run(): void
    {
        // ✅ Disable foreign key checks before deleting
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('roles')->delete(); // Use delete() instead of truncate()
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        DB::table('roles')->insert([
            ['role_name' => 'Admin', 'created_at' => Carbon::now()],
            ['role_name' => 'Customer', 'created_at' => Carbon::now()],
        ]);
    }
}
