<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInventoriesTable extends Migration
{
    public function up()
    {
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();
            // Foreign key to products table
            $table->unsignedBigInteger('product_id');
            // Stock quantity for the product
            $table->integer('stock_quantity')->default(0);
            // New stock_status column (default "In Stock")
            $table->string('stock_status')->default('In Stock');
            // Last restock date (nullable)
            $table->timestamp('last_restock')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('product_id')
                  ->references('id')->on('products')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('inventories');
    }
}
