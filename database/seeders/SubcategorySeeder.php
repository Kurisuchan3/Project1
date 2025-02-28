<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SubcategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('subcategories')->insert([
            ['category_id' => 1, 'name' => 'MSI'],
            ['category_id' => 1, 'name' => 'GigaBytes'],
            ['category_id' => 1, 'name' => 'Acer'],
            ['category_id' => 1, 'name' => 'Asus'],
            ['category_id' => 1, 'name' => 'Lenovo'],
        ]);
    }
}
