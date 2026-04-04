<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\GSTController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\PurchaseBillController;
use App\Http\Controllers\SubAdminController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\DailyReportController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use Illuminate\Support\Facades\Artisan;

Route::get('/run-migrate', function () {
    Artisan::call('migrate', [
        '--force' => true
    ]);

    return "Migration completed successfully!";
});

Route::get('/csrf-token', function () {
    return response()->json(['csrf_token' => csrf_token()]);
})->name('csrf.token');

Route::get('/api/company-settings', [SettingsController::class, 'getCompanySettings'])->name('api.company-settings');

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Customer routes - require customer permission
    Route::middleware('permission:customers')->group(function () {
        Route::resource('customers', CustomerController::class);
    });
    
    // Categories routes - require categories permission
    Route::middleware('permission:categories')->group(function () {
        Route::resource('categories', CategoryController::class);
        Route::patch('categories/{category}/toggle-status', [CategoryController::class, 'toggleStatus'])->name('categories.toggle-status');
    });
    
    // Vendor routes - require vendor permission
    Route::middleware('permission:vendors')->group(function () {
        Route::resource('vendors', VendorController::class);
    });
    
    // Item Master routes
    Route::resource('items', ItemController::class);
    Route::get('items-api/active', [ItemController::class, 'getActive'])->name('items.active');

    // Purchase Bills routes - require purchase_bills permission
    Route::middleware('permission:purchase_bills')->group(function () {
        Route::resource('purchase-bills', PurchaseBillController::class);
    });

    // Billing routes (no permission gate)
    Route::get('billing/{billing}/download', [BillingController::class, 'download'])->name('billing.download');
    Route::post('billing/{billing}/payments', [BillingController::class, 'addPayment'])->name('billing.payments.add');
    Route::get('payments/{payment}/receipt', [BillingController::class, 'downloadPaymentReceipt'])->name('payments.receipt');
    Route::resource('billing', BillingController::class)->only(['index', 'create', 'store', 'show', 'edit', 'update']);
    
    // GST Management routes - require gst_management permission
    Route::get('gst', [GSTController::class, 'index'])->name('gst.index')->middleware('permission:gst_management');

    // Daily Reports routes
    Route::get('daily-reports', [DailyReportController::class, 'index'])->name('daily-reports.index');
    Route::get('daily-reports/export', [DailyReportController::class, 'export'])->name('daily-reports.export');
    
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

    // Sub-Admin Management routes (only for super admin)
    Route::resource('sub-admins', SubAdminController::class)->parameters([
        'sub-admins' => 'user'
    ]);
    
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

    // Settings routes - only for super admin
    Route::get('settings', [SettingsController::class, 'edit'])->name('settings.edit'); // legacy
    Route::patch('settings', [SettingsController::class, 'update'])->name('settings.update'); // legacy

    Route::get('settings/website', [SettingsController::class, 'editWebsite'])->name('settings.website.edit');
    Route::patch('settings/website', [SettingsController::class, 'updateWebsite'])->name('settings.website.update');

    Route::get('settings/invoice', [SettingsController::class, 'editInvoice'])->name('settings.invoice.edit');
    Route::patch('settings/invoice', [SettingsController::class, 'updateInvoice'])->name('settings.invoice.update');
});

require __DIR__.'/auth.php';
