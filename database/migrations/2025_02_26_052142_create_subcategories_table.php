<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('subcategories', function (Blueprint $table) {
            $table->id(); // Default primary key "id"
            $table->unsignedBigInteger('category_id'); 
            $table->foreign('category_id')->references('id')->on('categories')->onDelete('cascade'); // Reference "id" now
            $table->string('name')->unique()->notNullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subcategories');
    }
};
