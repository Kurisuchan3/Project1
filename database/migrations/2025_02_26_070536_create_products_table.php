<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id(); // Primary Key
            $table->unsignedBigInteger('subcategory_id')->nullable();
            $table->unsignedBigInteger('inventory_id')->nullable();
            $table->string('name')->notNullable();
            $table->decimal('price', 10, 2)->notNullable(); // 10 digits total, 2 decimal places
            $table->text('description')->nullable();
            $table->text('specifications')->nullable();
            $table->string('image_url')->notNullable();
            $table->unsignedBigInteger('statuses_id')->nullable();
            $table->timestamps();

            // ✅ Fixed Foreign Key Constraints
            $table->foreign('subcategory_id')->references('id')->on('subcategories')->onDelete('set null'); // ✅ FIXED
            $table->foreign('inventory_id')->references('id')->on('inventory')->onDelete('set null');
            $table->foreign('statuses_id')->references('id')->on('statuses')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
