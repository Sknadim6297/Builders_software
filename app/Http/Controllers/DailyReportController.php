<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Payment;
use App\Models\PurchaseBill;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DailyReportController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'filter_type' => 'nullable|in:daily,monthly,custom',
            'report_date' => 'nullable|date',
            'report_month' => ['nullable', 'regex:/^\d{4}-\d{2}$/'],
            'from_date' => 'nullable|date',
            'to_date' => 'nullable|date',
        ]);

        $filterType = $request->input('filter_type', 'monthly');
        $range = $this->resolveDateRange($request, $filterType);
        $fromDate = $range['from'];
        $toDate = $range['to'];

        $reportData = $this->buildReportData($fromDate, $toDate);

        return Inertia::render('DailyReports/Index', [
            'report' => $reportData,
            'filters' => [
                'filter_type' => $filterType,
                'report_date' => $request->input('report_date', Carbon::today()->format('Y-m-d')),
                'report_month' => $request->input('report_month', Carbon::today()->format('Y-m')),
                'from_date' => $request->input('from_date'),
                'to_date' => $request->input('to_date'),
            ],
        ]);
    }

    public function export(Request $request)
    {
        $request->validate([
            'filter_type' => 'nullable|in:daily,monthly,custom',
            'report_date' => 'nullable|date',
            'report_month' => ['nullable', 'regex:/^\d{4}-\d{2}$/'],
            'from_date' => 'nullable|date',
            'to_date' => 'nullable|date',
            'format' => 'nullable|in:csv',
        ]);

        $filterType = $request->input('filter_type', 'monthly');
        $range = $this->resolveDateRange($request, $filterType);
        $fromDate = $range['from'];
        $toDate = $range['to'];
        $report = $this->buildReportData($fromDate, $toDate);

        $csv = $this->generateCsv($report, $fromDate, $toDate);
        $filename = 'daily-reports-' . $fromDate->format('Ymd') . '-to-' . $toDate->format('Ymd') . '.csv';

        return response($csv, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    private function resolveDateRange(Request $request, string $filterType): array
    {
        if ($filterType === 'daily') {
            $date = $request->filled('report_date')
                ? Carbon::parse($request->report_date)
                : Carbon::today();

            return [
                'from' => $date->copy()->startOfDay(),
                'to' => $date->copy()->endOfDay(),
            ];
        }

        if ($filterType === 'custom' && $request->filled('from_date') && $request->filled('to_date')) {
            return [
                'from' => Carbon::parse($request->from_date)->startOfDay(),
                'to' => Carbon::parse($request->to_date)->endOfDay(),
            ];
        }

        $month = $request->filled('report_month')
            ? Carbon::createFromFormat('Y-m', $request->report_month)
            : Carbon::today();

        return [
            'from' => $month->copy()->startOfMonth()->startOfDay(),
            'to' => $month->copy()->endOfMonth()->endOfDay(),
        ];
    }

    private function buildReportData(Carbon $fromDate, Carbon $toDate): array
    {
        $purchaseQuery = PurchaseBill::with('vendor')
            ->whereDate('po_date', '>=', $fromDate->toDateString())
            ->whereDate('po_date', '<=', $toDate->toDateString())
            ->where('status', '!=', 'cancelled')
            ->orderBy('po_date');

        $purchases = $purchaseQuery->get();
        $purchaseTotal = (float) $purchases->sum(fn ($bill) => (float) ($bill->total ?? 0));

        $supplierBreakdown = $purchases
            ->groupBy(fn ($bill) => $bill->vendor->name ?? 'Unknown Vendor')
            ->map(fn ($group, $supplierName) => [
                'supplier_name' => $supplierName,
                'count' => $group->count(),
                'total_amount' => round((float) $group->sum(fn ($bill) => (float) ($bill->total ?? 0)), 2),
            ])
            ->values()
            ->sortByDesc('total_amount')
            ->values();

        $salesQuery = Invoice::with('customer')
            ->whereDate('invoice_date', '>=', $fromDate->toDateString())
            ->whereDate('invoice_date', '<=', $toDate->toDateString())
            ->where('payment_status', '!=', 'cancelled')
            ->orderBy('invoice_date');

        $sales = $salesQuery->get();
        $salesTotal = (float) $sales->sum(fn ($invoice) => (float) ($invoice->total ?? 0));

        $dueInvoices = Invoice::with('customer')
            ->where('due_amount', '>', 0)
            ->whereIn('payment_status', ['unpaid', 'partial'])
            ->whereDate('invoice_date', '<=', $toDate->toDateString())
            ->orderBy('invoice_date')
            ->get();

        $dueDetails = $dueInvoices->map(function ($invoice) use ($toDate) {
            $invoiceDate = Carbon::parse($invoice->invoice_date);
            $daysOverdue = $invoiceDate->diffInDays($toDate);

            return [
                'invoice_number' => $invoice->invoice_number,
                'invoice_date' => $invoiceDate->format('Y-m-d'),
                'customer_name' => $invoice->customer->name ?? 'Unknown Customer',
                'total_amount' => round((float) ($invoice->total ?? 0), 2),
                'amount_paid' => round((float) ($invoice->amount_paid ?? 0), 2),
                'due_amount' => round((float) ($invoice->due_amount ?? 0), 2),
                'days_overdue' => $daysOverdue,
                'payment_status' => $invoice->payment_status,
            ];
        })->values();

        $dueTotal = (float) $dueDetails->sum('due_amount');

        $cashReceivedInRange = Payment::whereDate('payment_date', '>=', $fromDate->toDateString())
            ->whereDate('payment_date', '<=', $toDate->toDateString())
            ->where('payment_method', 'cash')
            ->sum('amount');

        $cashPaidInRange = PurchaseBill::whereDate('po_date', '>=', $fromDate->toDateString())
            ->whereDate('po_date', '<=', $toDate->toDateString())
            ->where('status', '!=', 'cancelled')
            ->sum('total');

        $cashReceivedBefore = Payment::whereDate('payment_date', '<', $fromDate->toDateString())
            ->where('payment_method', 'cash')
            ->sum('amount');

        $cashPaidBefore = PurchaseBill::whereDate('po_date', '<', $fromDate->toDateString())
            ->where('status', '!=', 'cancelled')
            ->sum('total');

        $openingCash = (float) $cashReceivedBefore - (float) $cashPaidBefore;
        $cashReceived = (float) $cashReceivedInRange;
        $cashPaid = (float) $cashPaidInRange;
        $closingCash = $openingCash + $cashReceived - $cashPaid;

        return [
            'period' => [
                'from' => $fromDate->format('Y-m-d'),
                'to' => $toDate->format('Y-m-d'),
            ],
            'purchase' => [
                'total_amount' => round($purchaseTotal, 2),
                'count' => $purchases->count(),
                'details' => $purchases->map(fn ($bill) => [
                    'po_number' => $bill->po_number,
                    'po_date' => optional($bill->po_date)->format('Y-m-d'),
                    'supplier_name' => $bill->vendor->name ?? 'Unknown Vendor',
                    'status' => $bill->status,
                    'amount' => round((float) ($bill->total ?? 0), 2),
                ])->values(),
                'supplier_breakdown' => $supplierBreakdown,
            ],
            'sales' => [
                'total_amount' => round($salesTotal, 2),
                'count' => $sales->count(),
                'details' => $sales->map(fn ($invoice) => [
                    'invoice_number' => $invoice->invoice_number,
                    'invoice_date' => optional($invoice->invoice_date)->format('Y-m-d'),
                    'customer_name' => $invoice->customer->name ?? 'Unknown Customer',
                    'payment_status' => $invoice->payment_status,
                    'amount' => round((float) ($invoice->total ?? 0), 2),
                    'due_amount' => round((float) ($invoice->due_amount ?? 0), 2),
                ])->values(),
            ],
            'due' => [
                'total_outstanding' => round($dueTotal, 2),
                'count' => $dueDetails->count(),
                'details' => $dueDetails,
            ],
            'cash' => [
                'opening_balance' => round($openingCash, 2),
                'cash_received' => round($cashReceived, 2),
                'cash_paid' => round($cashPaid, 2),
                'closing_balance' => round($closingCash, 2),
                'received_details' => Payment::with('invoice')
                    ->whereDate('payment_date', '>=', $fromDate->toDateString())
                    ->whereDate('payment_date', '<=', $toDate->toDateString())
                    ->where('payment_method', 'cash')
                    ->orderBy('payment_date')
                    ->get()
                    ->map(fn ($payment) => [
                        'payment_number' => $payment->payment_number,
                        'payment_date' => optional($payment->payment_date)->format('Y-m-d'),
                        'invoice_number' => $payment->invoice->invoice_number ?? '-',
                        'amount' => round((float) ($payment->amount ?? 0), 2),
                    ])
                    ->values(),
                'paid_details' => $purchases->map(fn ($bill) => [
                    'po_number' => $bill->po_number,
                    'po_date' => optional($bill->po_date)->format('Y-m-d'),
                    'supplier_name' => $bill->vendor->name ?? 'Unknown Vendor',
                    'amount' => round((float) ($bill->total ?? 0), 2),
                ])->values(),
            ],
        ];
    }

    private function generateCsv(array $report, Carbon $fromDate, Carbon $toDate): string
    {
        $rows = [];

        $rows[] = ['Daily Reports'];
        $rows[] = ['Period', $fromDate->format('Y-m-d') . ' to ' . $toDate->format('Y-m-d')];
        $rows[] = [];

        $rows[] = ['Purchase Summary'];
        $rows[] = ['Total Purchases', $report['purchase']['count']];
        $rows[] = ['Total Purchase Amount', $report['purchase']['total_amount']];
        $rows[] = [];

        $rows[] = ['Sales Summary'];
        $rows[] = ['Total Sales', $report['sales']['count']];
        $rows[] = ['Total Sales Amount', $report['sales']['total_amount']];
        $rows[] = [];

        $rows[] = ['Due Summary'];
        $rows[] = ['Total Due Invoices', $report['due']['count']];
        $rows[] = ['Total Outstanding', $report['due']['total_outstanding']];
        $rows[] = [];

        $rows[] = ['Cash Summary'];
        $rows[] = ['Opening Balance', $report['cash']['opening_balance']];
        $rows[] = ['Cash Received', $report['cash']['cash_received']];
        $rows[] = ['Cash Paid', $report['cash']['cash_paid']];
        $rows[] = ['Closing Balance', $report['cash']['closing_balance']];
        $rows[] = [];

        $rows[] = ['Purchase Details'];
        $rows[] = ['PO Number', 'Date', 'Supplier', 'Status', 'Amount'];
        foreach ($report['purchase']['details'] as $row) {
            $rows[] = [$row['po_number'], $row['po_date'], $row['supplier_name'], $row['status'], $row['amount']];
        }
        $rows[] = [];

        $rows[] = ['Sales Details'];
        $rows[] = ['Invoice Number', 'Date', 'Customer', 'Status', 'Amount', 'Due'];
        foreach ($report['sales']['details'] as $row) {
            $rows[] = [$row['invoice_number'], $row['invoice_date'], $row['customer_name'], $row['payment_status'], $row['amount'], $row['due_amount']];
        }
        $rows[] = [];

        $rows[] = ['Due Details'];
        $rows[] = ['Invoice Number', 'Date', 'Customer', 'Total', 'Paid', 'Due', 'Days Overdue'];
        foreach ($report['due']['details'] as $row) {
            $rows[] = [$row['invoice_number'], $row['invoice_date'], $row['customer_name'], $row['total_amount'], $row['amount_paid'], $row['due_amount'], $row['days_overdue']];
        }

        $stream = fopen('php://temp', 'r+');
        foreach ($rows as $row) {
            fputcsv($stream, $row);
        }
        rewind($stream);
        $csv = stream_get_contents($stream);
        fclose($stream);

        return (string) $csv;
    }
}
