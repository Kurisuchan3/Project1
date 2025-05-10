<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('address_id')->nullable();
            $table->string('barangay');
            $table->string('city');
            $table->string('province');
            $table->string('country');
            $table->text('order_notes')->nullable();
            $table->decimal('subtotal', 10, 2);
            $table->decimal('shipping_fee', 10, 2)->default(80.00);
            $table->decimal('total', 10, 2);
            $table->unsignedBigInteger('status_id');
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('address_id')->references('address_id')->on('addresses')->onDelete('set null');
            $table->foreign('status_id')->references('id')->on('statuses')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};