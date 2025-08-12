<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;
use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\StoreController;
use Illuminate\Support\Facades\Route;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Store routes (public)
Route::get('/', [StoreController::class, 'index'])->name('home');
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/products/{product:slug}', [ProductController::class, 'show'])->name('products.show');

// Cart routes (public)
Route::controller(CartController::class)->group(function () {
    Route::get('/cart', 'index')->name('cart.index');
    Route::post('/cart', 'store')->name('cart.store');
    Route::put('/cart/{cartItem}', 'update')->name('cart.update');
    Route::delete('/cart/{cartItem}', 'destroy')->name('cart.destroy');
});

// Authenticated user routes
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [OrderController::class, 'index'])->name('dashboard');
    
    // Checkout routes
    Route::controller(CheckoutController::class)->group(function () {
        Route::get('/checkout', 'index')->name('checkout.index');
        Route::post('/checkout', 'store')->name('checkout.store');
    });
    
    // Order routes
    Route::controller(OrderController::class)->group(function () {
        Route::get('/orders', 'index')->name('orders.index');
        Route::get('/orders/{order}', 'show')->name('orders.show');
    });
});

// Admin routes
Route::middleware(['auth', 'verified', \App\Http\Middleware\EnsureUserIsAdmin::class])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    
    // Admin product management
    Route::resource('products', AdminProductController::class);
    
    // Admin order management
    Route::controller(AdminOrderController::class)->group(function () {
        Route::get('/orders', 'index')->name('orders.index');
        Route::get('/orders/{order}', 'show')->name('orders.show');
        Route::put('/orders/{order}', 'update')->name('orders.update');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
