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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->text('ingredients')->nullable();
            $table->decimal('price', 8, 2);
            $table->integer('stock_quantity')->default(0);
            $table->string('image')->nullable();
            $table->json('images')->nullable();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->boolean('is_active')->default(true);
            $table->boolean('is_featured')->default(false);
            $table->decimal('weight', 8, 2)->nullable()->comment('Weight in grams');
            $table->enum('status', ['available', 'out_of_stock', 'discontinued'])->default('available');
            $table->timestamps();
            
            $table->index('slug');
            $table->index('category_id');
            $table->index('is_active');
            $table->index('is_featured');
            $table->index('status');
            $table->index(['category_id', 'is_active']);
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