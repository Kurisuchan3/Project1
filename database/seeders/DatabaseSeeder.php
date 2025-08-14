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
            ProductsSeeder::class,  // Moved up
            InventorySeeder::class, // Now runs after ProductsSeeder
            UsersSeeder::class,
            ProfilesSeeder::class,
            NotificationMessagesSeeder::class,
        ]);
    }
}