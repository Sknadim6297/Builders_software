<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\ActivityLogController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

Route::get('/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
})->name('csrf.token');

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Service routes - require service permission
    Route::middleware('permission:services')->group(function () {
        Route::resource('services', ServiceController::class);
    });
    
    // Customer routes - require customer permission
    Route::middleware('permission:customers')->group(function () {
        Route::resource('customers', CustomerController::class);
    });
    
    // Vendor routes - require vendor permission
    Route::middleware('permission:vendors')->group(function () {
        Route::resource('vendors', VendorController::class);
    });
    
    // Purchase Bills routes - require purchase_bills permission
    Route::middleware('permission:purchase_bills')->group(function () {
        Route::resource('purchase-bills', \App\Http\Controllers\PurchaseBillController::class);
    });
    
    // Stock Management routes - require stock_management permission (Read-only)
    Route::middleware('permission:stock_management')->group(function () {
        Route::get('stocks', [\App\Http\Controllers\StockController::class, 'index'])->name('stocks.index');
        Route::get('stocks/{stock}', [\App\Http\Controllers\StockController::class, 'show'])->name('stocks.show');
    });
    
    // Admin User Management routes - require admin-users permission (only for super admin)
    Route::middleware('permission:admin-users')->group(function () {
        Route::resource('admin-users', AdminUserController::class)->parameters([
            'admin-users' => 'user'
        ]);
    });
    
    // Activity Logs routes - require activity-logs permission (only for super admin)
    Route::middleware('permission:activity-logs')->group(function () {
        Route::get('activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');
        Route::get('activity-logs/{activityLog}', [ActivityLogController::class, 'show'])->name('activity-logs.show');
        Route::post('activity-logs/export', [ActivityLogController::class, 'export'])->name('activity-logs.export');
        Route::delete('activity-logs/clear', [ActivityLogController::class, 'clear'])->name('activity-logs.clear');
        Route::post('activity-logs/request-delete-otp', [ActivityLogController::class, 'requestDeleteOtp'])->name('activity-logs.request-delete-otp');
        Route::post('activity-logs/verify-delete-otp', [ActivityLogController::class, 'verifyDeleteOtp'])->name('activity-logs.verify-delete-otp');
        Route::delete('activity-logs/{activityLog}', [ActivityLogController::class, 'destroy'])->name('activity-logs.destroy');
    });
});

require __DIR__.'/auth.php';
