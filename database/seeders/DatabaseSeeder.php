<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call([
            CategorySeeder::class,
            SubcategorySeeder::class,
            RolesSeeder::class,
            StatusesSeeder::class,
            InventorySeeder::class,
            UsersSeeder::class,
            ProfilesSeeder::class,
            ProductsSeeder::class,
            
        ]);
    }
}
