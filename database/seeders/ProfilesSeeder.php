<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProfilesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ✅ Fetch the actual user IDs
        $adminUser = DB::table('users')->where('username', 'Admin')->first();
        $customerUser = DB::table('users')->where('username', 'Customer')->first();

        if (!$adminUser || !$customerUser) {
            echo "❌ ERROR: Users not found. Profiles were not seeded.\n";
            return;
        }

        DB::table('profiles')->delete(); // Use delete() instead of truncate()

        DB::table('profiles')->insert([
            [
                'user_id' => $adminUser->user_id, // ✅ Use fetched user_id
                'first_name' => 'John',
                'last_name' => 'Doe',
                'middle_initial' => 'A',
                'birthdate' => '1990-05-15',
                'phone' => '123-456-7890',
                'profile_picture' => 'https://www.reddit.com/r/furinamains/comments/16quuqp/splash_art_of_furina_done_deal_here_we_go/',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'user_id' => $customerUser->user_id, // ✅ Use fetched user_id
                'first_name' => 'Jane',
                'last_name' => 'Smith',
                'middle_initial' => 'B',
                'birthdate' => '1995-08-22',
                'phone' => '987-654-3210',
                'profile_picture' => 'https://www.reddit.com/r/RaidenMains/comments/us6tff/my_art_of_raiden_ei_and_her_eternal_partner/',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
