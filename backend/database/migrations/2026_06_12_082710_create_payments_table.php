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
        Schema::create('payments', function (Blueprint $table) {
           $table->id();
 
            $table->foreignId('user_id')
                  ->constrained()
                  ->onDelete('cascade');
 
            $table->foreignId('service_id')
                  ->constrained()
                  ->onDelete('cascade');
 
            $table->foreignId('service_request_id')
                  ->nullable()
                  ->constrained('service_requests')
                  ->onDelete('set null');
 
            
            $table->string('stripe_payment_intent_id')->unique()->nullable();
            $table->string('stripe_client_secret')->nullable();
 
            
            $table->unsignedBigInteger('amount');
            $table->unsignedBigInteger('processing_fee')->default(0);
            $table->unsignedBigInteger('total_amount');
            $table->string('currency', 3)->default('usd');
 
        
            $table->enum('payment_status', ['progress', 'completed', 'failed'])
                  ->default('progress');
 
            $table->string('customer_name')->nullable();
            $table->string('customer_email')->nullable();
            $table->string('customer_phone')->nullable();
            $table->string('reference_number')->nullable();
            $table->text('failure_reason')->nullable();
            $table->timestamp('paid_at')->nullable();
 
            $table->timestamps();

            $table->index(['user_id', 'payment_status']);
            $table->index('stripe_payment_intent_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
