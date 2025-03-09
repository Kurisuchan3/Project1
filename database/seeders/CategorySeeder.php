<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run()
    {
        // ✅ Disable foreign key checks before deleting
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // ✅ Delete instead of truncate (to keep foreign key constraints)
        DB::table('categories')->delete();

        // ✅ Enable foreign key checks again
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Insert categories
        DB::table('categories')->insert([
            ['name' => 'Brands'],
            ['name' => 'Peripherals'],
            ['name' => 'Smart'],
        ]);
    }
}
