<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            // For storing the product image (e.g., URL or file path)
            $table->string('image')->nullable();
            $table->string('name');
            $table->decimal('price', 8, 2);
            $table->text('description')->nullable();
            $table->text('specifications')->nullable();
            // Using 'status_id' to reference the statuses table
            $table->unsignedBigInteger('status_id')->nullable();
            $table->foreign('status_id')
                  ->references('id')
                  ->on('statuses')
                  ->onDelete('set null');
            $table->timestamps();
            // Soft deletion for archiving
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
}
