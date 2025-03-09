<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        // ✅ Get role IDs dynamically
        $adminRole = DB::table('roles')->where('role_name', 'Admin')->first();
        $customerRole = DB::table('roles')->where('role_name', 'Customer')->first();

        if (!$adminRole || !$customerRole) {
            echo "❌ ERROR: Roles not found. Users were not seeded.\n";
            return;
        }

        DB::table('users')->delete(); // Use delete() instead of truncate()

        DB::table('users')->insert([
            [
                'username' => 'Admin',
                'email' => 'admin@example.com',
                'password' => Hash::make('password123'), // ✅ Use 'password', not 'password_hash'
                'roles_id' => $adminRole->id,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'username' => 'Customer',
                'email' => 'customer@example.com',
                'password' => Hash::make('password123'), // ✅ Fix column name
                'roles_id' => $customerRole->id,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
