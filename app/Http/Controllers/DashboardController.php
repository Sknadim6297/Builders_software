<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Invoice;
use App\Models\Service;
use App\Models\PurchaseBill;
use App\Models\Customer;
use App\Models\ActivityLog;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
        
        // Get today's revenue
        $todayRevenue = Invoice::whereDate('invoice_date', $today)
            ->sum('total');
        
        // Get yesterday's revenue for comparison
        $yesterdayRevenue = Invoice::whereDate('invoice_date', $today->copy()->subDay())
            ->sum('total');
        
        // Calculate revenue percentage change
        $revenueChange = 0;
        if ($yesterdayRevenue > 0) {
            $revenueChange = round(((($todayRevenue - $yesterdayRevenue) / $yesterdayRevenue) * 100), 1);
        } elseif ($todayRevenue > 0) {
            $revenueChange = 100;
        }
        
        // Get today's services completed
        $todayServicesCount = Invoice::whereDate('invoice_date', $today)->count();
        
        // Get yesterday's services for comparison
        $yesterdayServicesCount = Invoice::whereDate('invoice_date', $today->copy()->subDay())->count();
        $servicesChange = $todayServicesCount - $yesterdayServicesCount;
        
        // Get today's purchase bills
        $todayPurchasesCount = PurchaseBill::whereDate('created_at', $today)->count();
        
        // Get yesterday's purchases for comparison
        $yesterdayPurchasesCount = PurchaseBill::whereDate('created_at', $today->copy()->subDay())->count();
        $purchasesChange = $todayPurchasesCount - $yesterdayPurchasesCount;
        
        // Get total customers
        $totalCustomers = Customer::count();
        
        // Get new customers today
        $newCustomersToday = Customer::whereDate('created_at', $today)->count();
        
        // Get recent activities (last 5)
        $recentActivities = ActivityLog::with(['subject', 'causer'])
            ->latest('created_at')
            ->limit(5)
            ->get()
            ->map(function ($activity) {
                $detail = $this->getActivityDetail($activity);
                return [
                    'id' => $activity->id,
                    'action' => $activity->event,
                    'detail' => $detail,
                    'time' => $activity->created_at->diffForHumans(),
                    'type' => $this->getActivityType($activity->log_name),
                ];
            });
        
        // If no activities, provide empty array
        if ($recentActivities->isEmpty()) {
            $recentActivities = collect();
        }
        
        return Inertia::render('Dashboard', [
            'todayRevenue' => $todayRevenue,
            'revenueChange' => $revenueChange,
            'todayServices' => $todayServicesCount,
            'servicesChange' => $servicesChange,
            'todayPurchases' => $todayPurchasesCount,
            'purchasesChange' => $purchasesChange,
            'totalCustomers' => $totalCustomers,
            'customersChange' => $newCustomersToday,
            'recentActivities' => $recentActivities,
        ]);
    }
    
    private function getActivityType($logName)
    {
        $types = [
            'invoice' => 'invoice',
            'service' => 'create',
            'customer' => 'customer',
            'purchase' => 'purchase',
            'default' => 'create'
        ];
        
        return $types[$logName] ?? $types['default'];
    }
    
    private function getActivityDetail($activity)
    {
        $subject = $activity->subject;
        
        if ($activity->log_name === 'invoice') {
            $amount = $subject->total ?? 0;
            $invoiceNumber = $subject->invoice_number ?? 'N/A';
            return "Invoice " . $invoiceNumber . " - ₹" . number_format($amount, 2);
        }
        
        if ($activity->log_name === 'service') {
            $name = $subject->name ?? 'N/A';
            return "Service: " . $name;
        }
        
        if ($activity->log_name === 'customer') {
            $name = $subject->name ?? 'N/A';
            return "Customer: " . $name;
        }
        
        if ($activity->log_name === 'purchase') {
            $amount = $subject->total ?? 0;
            $poNumber = $subject->po_number ?? 'N/A';
            return "Purchase Bill " . $poNumber . " - ₹" . number_format($amount, 2);
        }
        
        return $activity->description ?? 'Activity recorded';
    }
}
