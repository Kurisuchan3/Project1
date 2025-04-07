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
            $table->string('image')->nullable();
            $table->string('name');
            $table->decimal('price', 8, 2);
            $table->integer('quantity')->default(0);
            $table->text('description')->nullable();
            $table->text('specifications')->nullable();
            $table->unsignedBigInteger('status_id')->nullable();
            $table->foreign('status_id')
                  ->references('id')
                  ->on('statuses')
                  ->onDelete('set null');
            // Add subcategory_id foreign key
            $table->unsignedBigInteger('subcategory_id')->nullable();
            $table->foreign('subcategory_id')
                  ->references('id')
                  ->on('subcategories')
                  ->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
}