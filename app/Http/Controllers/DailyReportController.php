<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\PurchaseBill;
use App\Models\Setting;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DailyReportController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'filter_type' => 'nullable|in:daily,monthly,custom,all_time',
            'report_type' => 'nullable|in:all,purchase,sales,due,payments',
            'report_date' => 'nullable|date',
            'report_month' => ['nullable', 'regex:/^\d{4}-\d{2}$/'],
            'from_date' => 'nullable|date',
            'to_date' => 'nullable|date',
        ]);

        $filterType = $request->input('filter_type', 'all_time');
        $range = $this->resolveDateRange($request, $filterType);
        $fromDate = $range['from'];
        $toDate = $range['to'];

        $reportData = $this->buildReportData($fromDate, $toDate);

        return Inertia::render('DailyReports/Index', [
            'report' => $reportData,
            'filters' => [
                'filter_type' => $filterType,
                'report_type' => $request->input('report_type', 'all'),
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
            'filter_type' => 'nullable|in:daily,monthly,custom,all_time',
            'report_type' => 'nullable|in:all,purchase,sales,due,payments',
            'report_date' => 'nullable|date',
            'report_month' => ['nullable', 'regex:/^\d{4}-\d{2}$/'],
            'from_date' => 'nullable|date',
            'to_date' => 'nullable|date',
            'format' => 'nullable|in:csv,pdf',
        ]);

        $filterType = $request->input('filter_type', 'all_time');
        $reportType = $request->input('report_type', 'all');
        $range = $this->resolveDateRange($request, $filterType);
        $fromDate = $range['from'];
        $toDate = $range['to'];
        $report = $this->buildReportData($fromDate, $toDate);
        $format = $request->input('format', 'csv');

        if ($format === 'pdf') {
            $filename = $fromDate && $toDate
                ? 'daily-reports-' . $fromDate->format('Ymd') . '-to-' . $toDate->format('Ymd') . '.pdf'
                : 'daily-reports-all-time.pdf';

            $companySettings = Setting::getCompanySettings();
            $companyLogoForPdf = $this->resolveCompanyLogoForPdf(Setting::getValue('company_logo', ''));

            $pdf = Pdf::loadView('daily-reports.pdf', [
                'report' => $report,
                'companySettings' => $companySettings,
                'companyLogoForPdf' => $companyLogoForPdf,
                'filters' => [
                    'filter_type' => $filterType,
                    'report_type' => $reportType,
                    'report_date' => $request->input('report_date', Carbon::today()->format('Y-m-d')),
                    'report_month' => $request->input('report_month', Carbon::today()->format('Y-m')),
                    'from_date' => $request->input('from_date'),
                    'to_date' => $request->input('to_date'),
                ],
            ]);

            return $pdf->download($filename);
        }

        $csv = $this->generateCsv($report, $fromDate, $toDate);
        $filename = $fromDate && $toDate
            ? 'daily-reports-' . $fromDate->format('Ymd') . '-to-' . $toDate->format('Ymd') . '.csv'
            : 'daily-reports-all-time.csv';

        return response($csv, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    private function resolveDateRange(Request $request, string $filterType): array
    {
        if ($filterType === 'all_time') {
            return [
                'from' => null,
                'to' => null,
            ];
        }

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

    private function buildReportData(?Carbon $fromDate, ?Carbon $toDate): array
    {
        $purchaseQuery = PurchaseBill::with('vendor')
            ->where('status', '!=', 'cancelled');

        if ($fromDate && $toDate) {
            $purchaseQuery->whereDate('po_date', '>=', $fromDate->toDateString())
                ->whereDate('po_date', '<=', $toDate->toDateString());
        }

        $purchaseQuery->orderBy('po_date');

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
            ->where('payment_status', '!=', 'cancelled');

        if ($fromDate && $toDate) {
            $salesQuery->whereDate('invoice_date', '>=', $fromDate->toDateString())
                ->whereDate('invoice_date', '<=', $toDate->toDateString());
        }

        $salesQuery->orderBy('invoice_date');

        $sales = $salesQuery->get();
        $salesDetails = $sales->map(function ($invoice) {
            $subtotal = (float) ($invoice->subtotal ?? 0);
            $cgstRate = (float) ($invoice->cgst_percentage ?? 0);
            $sgstRate = (float) ($invoice->sgst_percentage ?? 0);
            $gstRate = (float) ($invoice->gst_percentage ?? 0);

            if ($gstRate <= 0) {
                $gstRate = $cgstRate + $sgstRate;
            }

            if (($cgstRate <= 0 || $sgstRate <= 0) && $gstRate > 0) {
                $cgstRate = $gstRate / 2;
                $sgstRate = $gstRate / 2;
            }

            $cgstAmount = round($subtotal * ($cgstRate / 100), 2);
            $sgstAmount = round($subtotal * ($sgstRate / 100), 2);
            $totalGstAmount = round($cgstAmount + $sgstAmount, 2);

            return [
                'invoice_number' => $invoice->invoice_number,
                'invoice_date' => optional($invoice->invoice_date)->format('Y-m-d'),
                'customer_name' => $invoice->customer->name ?? 'Unknown Customer',
                'payment_status' => $invoice->payment_status,
                'taxable_amount' => round($subtotal, 2),
                'cgst_amount' => $cgstAmount,
                'sgst_amount' => $sgstAmount,
                'gst_amount' => $totalGstAmount,
                'amount' => round((float) ($invoice->total ?? 0), 2),
                'due_amount' => round((float) ($invoice->due_amount ?? 0), 2),
            ];
        })->values();

        $salesTotal = (float) $salesDetails->sum('amount');
        $salesTaxableTotal = (float) $salesDetails->sum('taxable_amount');
        $salesCgstTotal = (float) $salesDetails->sum('cgst_amount');
        $salesSgstTotal = (float) $salesDetails->sum('sgst_amount');
        $salesGstTotal = (float) $salesDetails->sum('gst_amount');

        $dueInvoicesQuery = Invoice::with('customer')
            ->where('due_amount', '>', 0)
            ->whereIn('payment_status', ['unpaid', 'partial']);

        if ($toDate) {
            $dueInvoicesQuery->whereDate('invoice_date', '<=', $toDate->toDateString());
        }

        $dueInvoices = $dueInvoicesQuery->orderBy('invoice_date')->get();

        $dueReferenceDate = $toDate ?? Carbon::today();

        $dueDetails = $dueInvoices->map(function ($invoice) use ($dueReferenceDate) {
            $invoiceDate = Carbon::parse($invoice->invoice_date);
            $daysOverdue = $invoiceDate->diffInDays($dueReferenceDate);

            return [
                'invoice_number' => $invoice->invoice_number,
                'invoice_date' => $invoiceDate->format('Y-m-d'),
                'customer_name' => $invoice->customer->name ?? 'Unknown Customer',
                'total_amount' => round((float) ($invoice->total ?? 0), 2),
                'amount_paid' => round((float) ($invoice->amount_paid ?? 0), 2),
                'due_amount' => round((float) ($invoice->due_amount ?? 0), 2),
                'days_overdue' => (int) round($daysOverdue),
                'payment_status' => $invoice->payment_status,
            ];
        })->values();

        $dueTotal = (float) $dueDetails->sum('due_amount');

        $paymentQuery = Payment::with('invoice.customer');

        if ($fromDate && $toDate) {
            $paymentQuery->whereDate('payment_date', '>=', $fromDate->toDateString())
                ->whereDate('payment_date', '<=', $toDate->toDateString());
        }

        $payments = $paymentQuery->orderBy('payment_date')->get();
        $paymentTotal = (float) $payments->sum(fn ($payment) => (float) ($payment->amount ?? 0));

        $paymentMethodBreakdown = $payments
            ->groupBy(fn ($payment) => $payment->payment_method ?: 'other')
            ->map(fn ($group, $method) => [
                'payment_method' => $method,
                'payment_method_label' => $this->formatPaymentMethodLabel($method),
                'count' => $group->count(),
                'total_amount' => round((float) $group->sum(fn ($payment) => (float) ($payment->amount ?? 0)), 2),
            ])
            ->values()
            ->sortByDesc('total_amount')
            ->values();

        $cashReceivedInRange = (float) $payments
            ->where('payment_method', 'cash')
            ->sum('amount');

        $cashPaidQuery = PurchaseBill::where('status', '!=', 'cancelled');
        if ($fromDate && $toDate) {
            $cashPaidQuery->whereDate('po_date', '>=', $fromDate->toDateString())
                ->whereDate('po_date', '<=', $toDate->toDateString());
        }
        $cashPaidInRange = (float) $cashPaidQuery->sum('total');

        $cashReceivedBefore = 0.0;
        $cashPaidBefore = 0.0;

        if ($fromDate) {
            $cashReceivedBefore = (float) Payment::whereDate('payment_date', '<', $fromDate->toDateString())
                ->where('payment_method', 'cash')
                ->sum('amount');

            $cashPaidBefore = (float) PurchaseBill::whereDate('po_date', '<', $fromDate->toDateString())
                ->where('status', '!=', 'cancelled')
                ->sum('total');
        }

        $openingCash = (float) $cashReceivedBefore - (float) $cashPaidBefore;
        $cashReceived = (float) $cashReceivedInRange;
        $cashPaid = (float) $cashPaidInRange;
        $closingCash = $openingCash + $cashReceived - $cashPaid;

        return [
            'period' => [
                'from' => $fromDate ? $fromDate->format('Y-m-d') : 'All Time',
                'to' => $toDate ? $toDate->format('Y-m-d') : 'All Time',
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
                'taxable_amount' => round($salesTaxableTotal, 2),
                'total_cgst' => round($salesCgstTotal, 2),
                'total_sgst' => round($salesSgstTotal, 2),
                'total_gst' => round($salesGstTotal, 2),
                'count' => $sales->count(),
                'details' => $salesDetails,
            ],
            'due' => [
                'total_outstanding' => round($dueTotal, 2),
                'count' => $dueDetails->count(),
                'details' => $dueDetails,
            ],
            'payments' => [
                'total_amount' => round($paymentTotal, 2),
                'count' => $payments->count(),
                'method_breakdown' => $paymentMethodBreakdown,
                'details' => $payments->map(fn ($payment) => [
                    'payment_number' => $payment->payment_number,
                    'payment_date' => optional($payment->payment_date)->format('Y-m-d'),
                    'invoice_number' => $payment->invoice->invoice_number ?? '-',
                    'customer_name' => $payment->invoice->customer->name ?? 'Unknown Customer',
                    'payment_method' => $payment->payment_method ?: 'other',
                    'payment_method_label' => $this->formatPaymentMethodLabel($payment->payment_method ?: 'other'),
                    'amount' => round((float) ($payment->amount ?? 0), 2),
                    'transaction_reference' => $payment->transaction_reference ?? '-',
                ])->values(),
            ],
            'cash_flow' => [
                'opening_balance' => round($openingCash, 2),
                'cash_received' => round($cashReceived, 2),
                'cash_paid' => round($cashPaid, 2),
                'closing_balance' => round($closingCash, 2),
                'received_details' => Payment::with('invoice.customer')
                    ->where('payment_method', 'cash')
                    ->when($fromDate && $toDate, function ($query) use ($fromDate, $toDate) {
                        $query->whereDate('payment_date', '>=', $fromDate->toDateString())
                            ->whereDate('payment_date', '<=', $toDate->toDateString());
                    })
                    ->orderBy('payment_date')
                    ->get()
                    ->map(fn ($payment) => [
                        'payment_number' => $payment->payment_number,
                        'payment_date' => optional($payment->payment_date)->format('Y-m-d'),
                        'invoice_number' => $payment->invoice->invoice_number ?? '-',
                        'customer_name' => $payment->invoice->customer->name ?? 'Unknown Customer',
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

    private function resolveCompanyLogoForPdf(?string $logoPath): string
    {
        $logoPath = trim((string) $logoPath);

        if ($logoPath === '') {
            return public_path('images/sayan-sita-logo.png');
        }

        if (str_starts_with($logoPath, 'http://') || str_starts_with($logoPath, 'https://')) {
            return $logoPath;
        }

        if (str_starts_with($logoPath, '/storage/') || str_starts_with($logoPath, 'storage/')) {
            return public_path(ltrim(str_replace('/storage/', 'storage/', $logoPath), '/'));
        }

        if (str_starts_with($logoPath, '/')) {
            return public_path(ltrim($logoPath, '/'));
        }

        return public_path($logoPath);
    }

    private function generateCsv(array $report, ?Carbon $fromDate, ?Carbon $toDate): string
    {
        $rows = [];

        $rows[] = ['Daily Reports'];
        $rows[] = ['Period', $fromDate && $toDate ? $fromDate->format('Y-m-d') . ' to ' . $toDate->format('Y-m-d') : 'All Time'];
        $rows[] = [];

        $rows[] = ['Purchase Summary'];
        $rows[] = ['Total Purchases', $report['purchase']['count']];
        $rows[] = ['Total Purchase Amount', $report['purchase']['total_amount']];
        $rows[] = [];

        $rows[] = ['Sales Summary'];
        $rows[] = ['Total Sales', $report['sales']['count']];
        $rows[] = ['Total Taxable Sales', $report['sales']['taxable_amount'] ?? 0];
        $rows[] = ['Total CGST', $report['sales']['total_cgst'] ?? 0];
        $rows[] = ['Total SGST', $report['sales']['total_sgst'] ?? 0];
        $rows[] = ['Total GST', $report['sales']['total_gst'] ?? 0];
        $rows[] = ['Total Sales Amount', $report['sales']['total_amount']];
        $rows[] = [];

        $rows[] = ['Due Summary'];
        $rows[] = ['Total Due Invoices', $report['due']['count']];
        $rows[] = ['Total Outstanding', $report['due']['total_outstanding']];
        $rows[] = [];

        $rows[] = ['Payment Summary'];
        $rows[] = ['Total Payments', $report['payments']['count']];
        $rows[] = ['Total Payment Amount', $report['payments']['total_amount']];
        $rows[] = [];

        $rows[] = ['Payment Method Breakdown'];
        $rows[] = ['Payment Method', 'Count', 'Amount'];
        foreach ($report['payments']['method_breakdown'] as $row) {
            $rows[] = [$row['payment_method_label'], $row['count'], $row['total_amount']];
        }
        $rows[] = [];

        $rows[] = ['Purchase Details'];
        $rows[] = ['PO Number', 'Date', 'Supplier', 'Status', 'Amount'];
        foreach ($report['purchase']['details'] as $row) {
            $rows[] = [$row['po_number'], $row['po_date'], $row['supplier_name'], $row['status'], $row['amount']];
        }
        $rows[] = [];

        $rows[] = ['Sales Details'];
        $rows[] = ['Invoice Number', 'Date', 'Customer', 'Status', 'Taxable', 'CGST', 'SGST', 'Total GST', 'Amount', 'Due'];
        foreach ($report['sales']['details'] as $row) {
            $rows[] = [
                $row['invoice_number'],
                $row['invoice_date'],
                $row['customer_name'],
                $row['payment_status'],
                $row['taxable_amount'] ?? 0,
                $row['cgst_amount'] ?? 0,
                $row['sgst_amount'] ?? 0,
                $row['gst_amount'] ?? 0,
                $row['amount'],
                $row['due_amount'],
            ];
        }
        $rows[] = [];

        $rows[] = ['Due Details'];
        $rows[] = ['Invoice Number', 'Date', 'Customer', 'Total', 'Paid', 'Due', 'Days Overdue'];
        foreach ($report['due']['details'] as $row) {
            $rows[] = [$row['invoice_number'], $row['invoice_date'], $row['customer_name'], $row['total_amount'], $row['amount_paid'], $row['due_amount'], $row['days_overdue']];
        }

        $rows[] = [];
        $rows[] = ['Payment Details'];
        $rows[] = ['Payment Number', 'Date', 'Invoice', 'Customer', 'Method', 'Amount', 'Reference'];
        foreach ($report['payments']['details'] as $row) {
            $rows[] = [$row['payment_number'], $row['payment_date'], $row['invoice_number'], $row['customer_name'], $row['payment_method_label'], $row['amount'], $row['transaction_reference']];
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

    private function formatPaymentMethodLabel(?string $paymentMethod): string
    {
        return match ($paymentMethod) {
            'cash' => 'Cash',
            'card' => 'Card',
            'upi' => 'UPI',
            'bank_transfer' => 'Bank Transfer',
            'cheque' => 'Cheque',
            'other' => 'Other',
            default => ucfirst(str_replace('_', ' ', (string) $paymentMethod)),
        };
    }
}
