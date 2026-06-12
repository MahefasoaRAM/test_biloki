<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\StockMovementController;
use App\Models\Product;
use App\Models\Client;
use App\Models\StockMovement;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'totalProducts' => Product::count(),
        'totalClients' => Client::count(),
        'outOfStock' => Product::where('active', true)->where('stock_quantity', '<=', 0)->count(),
        'lowStock' => Product::where('active', true)->where('stock_quantity', '<=', 'stock_minimum')->where('stock_quantity', '>', 0)->count(),
        'lastMovements' => StockMovement::with('product')->latest()->take(10)->get(),
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::resource('products', ProductController::class);
    Route::resource('clients', ClientController::class);
    Route::get('stock-movements', [StockMovementController::class, 'index'])->name('stock-movements.index');
    Route::post('stock-movements', [StockMovementController::class, 'store'])->name('stock-movements.store');
});

require __DIR__.'/auth.php';
