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
        Schema::create('inventory', function (Blueprint $table) {
            $table->id(); // Primary Key
            $table->string('itemname', 100);
            $table->integer('stock_quantity')->default(0)->notNullable();
            $table->decimal('cost', 10, 2)->notNullable(); // 10 digits total, 2 decimal places
            $table->string('warehouse_location', 255)->nullable();
            $table->timestamp('last_restock_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory');
    }
};
