<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('complaints', function (Blueprint $table) {
           $table->id();
        $table->string('token_number')->unique();
        $table->string('full_name');
        $table->string('ward');
        $table->string('citizenship_id');
        $table->string('phone');
        $table->string('email')->nullable();
        $table->string('subject');
        $table->longText('complaint');
        $table->enum('status', ['Pending', 'Process', 'Completed'])
              ->default('Pending');
        $table->timestamps();
        
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
