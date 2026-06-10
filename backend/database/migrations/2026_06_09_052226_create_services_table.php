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
        Schema::create('services', function (Blueprint $table) {
             $table->id();
             $table->string('icon');
             $table->string('title');
             $table->text('description');
             $table->string('btn_text')->default('Apply Now');
             $table->string('color')->nullable();
             $table->integer('status')->default(1);
             $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};
