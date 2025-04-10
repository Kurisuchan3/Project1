<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ProfilesSeeder extends Seeder
{
    public function run(): void
    {
        // Fetch all users
        $users = DB::table('users')->get();

        if ($users->isEmpty()) {
            echo "❌ ERROR: No users found. Profiles were not seeded.\n";
            return;
        }

        DB::table('profiles')->delete(); // Clear existing profiles

        $profiles = [];
        foreach ($users as $user) {
            $profiles[] = [
                'user_id' => $user->user_id,
                'first_name' => $user->username === 'Admin' ? 'John' : ($user->username === 'Customer' ? 'Jane' : ''),
                'last_name' => $user->username === 'Admin' ? 'Doe' : ($user->username === 'Customer' ? 'Smith' : ''),
                'middle_initial' => $user->username === 'Admin' ? 'A' : ($user->username === 'Customer' ? 'B' : null),
                'birthdate' => $user->username === 'Admin' ? '1990-05-15' : ($user->username === 'Customer' ? '1995-08-22' : null),
                'phone' => $user->username === 'Admin' ? '123-456-7890' : ($user->username === 'Customer' ? '987-654-3210' : null),
                'profile_picture' => $user->username === 'Admin' ? 'https://www.reddit.com/r/furinamains/comments/16quuqp/splash_art_of_furina_done_deal_here_we_go/' : ($user->username === 'Customer' ? 'https://www.reddit.com/r/RaidenMains/comments/us6tff/my_art_of_raiden_ei_and_her_eternal_partner/' : null),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ];
        }

        DB::table('profiles')->insert($profiles);
    }
}