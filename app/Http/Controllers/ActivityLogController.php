<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Exports\ActivityLogsExport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        // Only super admin can access activity logs
        if (!Auth::user()->isSuperAdmin()) {
            return redirect()->route('dashboard')
                ->with('error', 'Access denied. Only super administrators can view activity logs.');
        }

        $query = ActivityLog::with(['causer', 'subject'])
            ->orderBy('created_at', 'desc');

        // Filter by log name (category)
        if ($request->filled('log_name')) {
            $query->where('log_name', $request->log_name);
        }

        // Filter by event type
        if ($request->filled('event')) {
            $query->where('event', $request->event);
        }

        // Filter by date range
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Filter by user
        if ($request->filled('user_id')) {
            $query->where('causer_id', $request->user_id);
        }

        // Search in description
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('log_name', 'like', "%{$search}%")
                  ->orWhere('event', 'like', "%{$search}%");
            });
        }

        $logs = $query->paginate(20)->withQueryString();

        // Get filter options
        $logNames = ActivityLog::distinct()->pluck('log_name')->filter()->sort()->values();
        $events = ActivityLog::distinct()->pluck('event')->filter()->sort()->values();
        $users = ActivityLog::with('causer')
            ->whereNotNull('causer_id')
            ->get()
            ->pluck('causer')
            ->filter()
            ->unique('id')
            ->values();

        return Inertia::render('ActivityLogs/Index', [
            'logs' => $logs,
            'filters' => $request->only(['log_name', 'event', 'date_from', 'date_to', 'user_id', 'search']),
            'logNames' => $logNames,
            'events' => $events,
            'users' => $users,
        ]);
    }

    public function show(ActivityLog $activityLog)
    {
        if (!Auth::user()->isSuperAdmin()) {
            return redirect()->route('dashboard')
                ->with('error', 'Access denied. Only super administrators can view activity logs.');
        }

        $activityLog->load(['causer', 'subject']);

        return Inertia::render('ActivityLogs/Show', [
            'log' => $activityLog
        ]);
    }

    public function export(Request $request)
    {
        if (!Auth::user()->isSuperAdmin()) {
            return redirect()->route('dashboard')
                ->with('error', 'Access denied. Only super administrators can export activity logs.');
        }

        $request->validate([
            'format' => 'required|in:csv,excel,pdf'
        ]);

        $query = ActivityLog::query()->orderBy('created_at', 'desc');

        // Apply same filters as index method
        if ($request->filled('log_name')) {
            $query->where('log_name', $request->log_name);
        }

        if ($request->filled('event')) {
            $query->where('event', $request->event);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->filled('user_id')) {
            $query->where('causer_id', $request->user_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('log_name', 'like', "%{$search}%")
                  ->orWhere('event', 'like', "%{$search}%");
            });
        }

        $format = $request->format;
        $timestamp = now()->format('Y_m_d_H_i_s');
        
        try {
            switch ($format) {
                case 'excel':
                    return Excel::download(new ActivityLogsExport($query), "activity_logs_{$timestamp}.xlsx");
                    
                case 'csv':
                    return Excel::download(new ActivityLogsExport($query), "activity_logs_{$timestamp}.csv");
                    
                case 'pdf':
                    $logs = $query->with(['causer', 'subject'])->get();
                    $filters = $request->only(['log_name', 'event', 'date_from', 'date_to', 'user_id', 'search']);
                    
                    $pdf = Pdf::loadView('activity-logs-pdf', compact('logs', 'filters'))
                        ->setPaper('a4', 'landscape')
                        ->setOptions(['defaultFont' => 'arial']);
                        
                    return $pdf->download("activity_logs_{$timestamp}.pdf");
                    
                default:
                    return redirect()->route('activity-logs.index')
                        ->with('error', 'Invalid export format.');
            }
        } catch (\Exception $e) {
            Log::error('Export failed: ' . $e->getMessage(), [
                'format' => $format,
                'user_id' => Auth::id(),
                'filters' => $request->all()
            ]);
            
            return redirect()->route('activity-logs.index')
                ->with('error', 'Export failed. Please try again.');
        }
    }

    public function clear(Request $request)
    {
        if (!Auth::user()->isSuperAdmin()) {
            return redirect()->route('dashboard')
                ->with('error', 'Access denied. Only super administrators can clear activity logs.');
        }

        $request->validate([
            'older_than_days' => 'required|integer|min:1'
        ]);

        $cutoffDate = now()->subDays($request->older_than_days);
        $deletedCount = ActivityLog::where('created_at', '<', $cutoffDate)->delete();

        return redirect()->route('activity-logs.index')
            ->with('success', "Deleted {$deletedCount} activity logs older than {$request->older_than_days} days.");
    }
}
