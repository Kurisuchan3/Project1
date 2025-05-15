<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Status;

class NotificationMessagesSeeder extends Seeder
{
    public function run(): void
    {
        $messages = [
            ['status_name' => 'Pending', 'message' => 'Your order is now pending, thank you for ordering!'],
            ['status_name' => 'Processing', 'message' => 'Your order is being processed. We’ll notify you once it’s ready to ship.'],
            ['status_name' => 'Shipped', 'message' => 'Good news! Your order has been shipped. You’ll receive it soon.'],
            ['status_name' => 'Delivered', 'message' => 'Your order has been delivered. Enjoy your purchase!'],
            ['status_name' => 'Cancelled', 'message' => 'Your order has been cancelled. Please contact support for assistance.'],
        ];

        foreach ($messages as $message) {
            $status = Status::where('status_name', $message['status_name'])->first();
            if ($status) {
                DB::table('notification_messages')->updateOrInsert(
                    ['status_id' => $status->id],
                    [
                        'message_template' => $message['message'],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }
        }
    }
}