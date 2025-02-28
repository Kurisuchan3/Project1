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
        Schema::create('profiles', function (Blueprint $table) {
            $table->id('profile_id'); // Primary Key
            $table->unsignedBigInteger('user_id')->unique()->notNullable();
            $table->string('first_name')->notNullable();
            $table->string('last_name')->notNullable();
            $table->char('middle_initial', 1)->nullable();
            $table->date('birthdate')->nullable();
            $table->string('phone')->nullable();
            $table->string('profile_picture')->nullable();
            $table->timestamps();

            // Foreign Key Constraint
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
