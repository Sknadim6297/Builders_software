<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\PurchaseBill;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class GSTController extends Controller
{
    /**
     * Display GST management dashboard
     */
    public function index(Request $request)
    {
        $request->validate([
            'filter_type' => 'nullable|in:daily,monthly,custom',
            'report_date' => 'nullable|date',
            'report_month' => ['nullable', 'regex:/^\d{4}-\d{2}$/'],
            'from_date' => 'nullable|date',
            'to_date' => 'nullable|date',
            'gst_rate' => 'nullable|numeric|min:0|max:100'
        ]);

        $filterType = $request->input('filter_type', 'monthly');
        $range = $this->resolveDateRange($request, $filterType);
        $fromDate = $range['from'];
        $toDate = $range['to'];
        $gstRate = $request->gst_rate;

        // Calculate Output GST (from Sales Invoices)
        $outputGST = $this->calculateOutputGST($fromDate, $toDate, $gstRate);

        // Calculate Input GST (from Purchase Bills)
        $inputGST = $this->calculateInputGST($fromDate, $toDate, $gstRate);

        // Calculate Net GST
        $netGST = $outputGST['total'] - $inputGST['total'];
        $status = $netGST > 0 ? 'payable' : ($netGST < 0 ? 'refund' : 'balanced');

        return Inertia::render('GST/Index', [
            'gstSummary' => [
                'output_gst' => $outputGST['total'],
                'input_gst' => $inputGST['total'],
                'net_gst' => abs($netGST),
                'status' => $status,
                'output_count' => $outputGST['count'],
                'input_count' => $inputGST['count'],
                'output_taxable' => $outputGST['taxable_total'],
                'input_taxable' => $inputGST['taxable_total'],
                'period' => [
                    'from' => $fromDate->format('Y-m-d'),
                    'to' => $toDate->format('Y-m-d')
                ]
            ],
            'outputGSTDetails' => $outputGST['details'],
            'inputGSTDetails' => $inputGST['details'],
            'outputRateSummary' => $outputGST['rate_summary'],
            'inputRateSummary' => $inputGST['rate_summary'],
            'filters' => [
                'filter_type' => $filterType,
                'report_date' => $request->input('report_date', Carbon::today()->format('Y-m-d')),
                'report_month' => $request->input('report_month', Carbon::today()->format('Y-m')),
                'from_date' => $request->input('from_date'),
                'to_date' => $request->input('to_date'),
                'gst_rate' => $request->input('gst_rate')
            ]
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

    /**
     * Calculate Output GST from sales invoices
     */
    private function calculateOutputGST($fromDate, $toDate, $gstRate = null)
    {
        $query = Invoice::whereDate('invoice_date', '>=', $fromDate->toDateString())
            ->whereDate('invoice_date', '<=', $toDate->toDateString())
            ->where('payment_status', '!=', 'cancelled')
            ->with('customer');

        $invoices = $query->get();
        $totalGST = 0;
        $totalTaxable = 0;
        $rateSummary = [];
        $details = [];

        foreach ($invoices as $invoice) {
            // Keep GST computation consistent with billing/invoice total logic:
            // GST is calculated on subtotal, while discount is applied separately.
            $taxable = max(0, (float) $invoice->subtotal);
            $effectiveRate = (float) ($invoice->gst_percentage ?? 0);
            $invoiceGST = round($taxable * ($effectiveRate / 100), 2);

            if ($gstRate !== null && $effectiveRate != (float) $gstRate) {
                continue;
            }

            if ($invoiceGST > 0) {
                $totalGST += $invoiceGST;
                $totalTaxable += $taxable;

                $rateKey = number_format($effectiveRate, 2, '.', '');
                if (!isset($rateSummary[$rateKey])) {
                    $rateSummary[$rateKey] = [
                        'rate' => (float) $rateKey,
                        'taxable' => 0,
                        'gst' => 0,
                        'count' => 0,
                    ];
                }

                $rateSummary[$rateKey]['taxable'] += $taxable;
                $rateSummary[$rateKey]['gst'] += $invoiceGST;
                $rateSummary[$rateKey]['count'] += 1;

                $details[] = [
                    'invoice_number' => $invoice->invoice_number,
                    'invoice_date' => $invoice->invoice_date->format('Y-m-d'),
                    'customer_name' => $invoice->customer->name ?? 'N/A',
                    'gst_rate' => $effectiveRate,
                    'taxable_amount' => round($taxable, 2),
                    'gst_amount' => round($invoiceGST, 2),
                    'total_amount' => $invoice->total
                ];
            }
        }

        usort($details, function ($a, $b) {
            return strcmp($a['invoice_date'], $b['invoice_date']);
        });

        $rateSummary = array_values($rateSummary);
        usort($rateSummary, function ($a, $b) {
            return $a['rate'] <=> $b['rate'];
        });

        foreach ($rateSummary as &$summary) {
            $summary['taxable'] = round($summary['taxable'], 2);
            $summary['gst'] = round($summary['gst'], 2);
        }
        unset($summary);

        return [
            'total' => round($totalGST, 2),
            'taxable_total' => round($totalTaxable, 2),
            'count' => count($details),
            'details' => $details,
            'rate_summary' => $rateSummary,
        ];
    }

    /**
     * Calculate Input GST from purchase bills
     */
    private function calculateInputGST($fromDate, $toDate, $gstRate = null)
    {
        $query = PurchaseBill::whereDate('po_date', '>=', $fromDate->toDateString())
            ->whereDate('po_date', '<=', $toDate->toDateString())
            ->where('status', '!=', 'cancelled')
            ->with('vendor');

        $purchaseBills = $query->get();
        $totalGST = 0;
        $totalTaxable = 0;
        $rateSummary = [];
        $details = [];

        foreach ($purchaseBills as $bill) {
            $billGST = 0;
            $billTaxable = (float) ($bill->gross_amount ?? $bill->subtotal ?? 0);

            $effectiveRate = null;
            if ((float) ($bill->igst_percentage ?? 0) > 0) {
                $effectiveRate = (float) $bill->igst_percentage;
            } else {
                $effectiveRate = (float) (($bill->cgst_percentage ?? 0) + ($bill->sgst_percentage ?? 0));
            }

            if ($gstRate !== null && $effectiveRate != (float) $gstRate) {
                continue;
            }

            if ((float) ($bill->cgst_amount ?? 0) || (float) ($bill->sgst_amount ?? 0) || (float) ($bill->igst_amount ?? 0)) {
                $billGST = (float) ($bill->cgst_amount ?? 0) + (float) ($bill->sgst_amount ?? 0) + (float) ($bill->igst_amount ?? 0);
            } else {
                $items = $bill->items ?? [];
                $billGST = 0;
                $billTaxable = 0;

                if (is_array($items)) {
                    foreach ($items as $item) {
                        $gstPercentage = (float) ($item['gst_percentage'] ?? 0);
                        $itemAmount = (float) ($item['amount'] ?? $item['total'] ?? 0);

                        if ($gstPercentage > 0 && $itemAmount > 0) {
                            if ($gstRate === null || $gstPercentage == (float) $gstRate) {
                                $itemTaxable = $itemAmount;
                                $gstAmount = $itemTaxable * ($gstPercentage / 100);
                                $billGST += $gstAmount;
                                $billTaxable += $itemTaxable;
                            }
                        }
                    }
                }
            }

            if ($billGST > 0) {
                $totalGST += $billGST;
                $totalTaxable += $billTaxable;

                $rateKey = number_format((float) $effectiveRate, 2, '.', '');
                if (!isset($rateSummary[$rateKey])) {
                    $rateSummary[$rateKey] = [
                        'rate' => (float) $rateKey,
                        'taxable' => 0,
                        'gst' => 0,
                        'count' => 0,
                    ];
                }

                $rateSummary[$rateKey]['taxable'] += $billTaxable;
                $rateSummary[$rateKey]['gst'] += $billGST;
                $rateSummary[$rateKey]['count'] += 1;

                $details[] = [
                    'po_number' => $bill->po_number,
                    'po_date' => $bill->po_date->format('Y-m-d'),
                    'vendor_name' => $bill->vendor->name ?? 'N/A',
                    'gst_rate' => $effectiveRate,
                    'taxable_amount' => round($billTaxable, 2),
                    'gst_amount' => round($billGST, 2),
                    'total_amount' => $bill->total
                ];
            }
        }

        usort($details, function ($a, $b) {
            return strcmp($a['po_date'], $b['po_date']);
        });

        $rateSummary = array_values($rateSummary);
        usort($rateSummary, function ($a, $b) {
            return $a['rate'] <=> $b['rate'];
        });

        foreach ($rateSummary as &$summary) {
            $summary['taxable'] = round($summary['taxable'], 2);
            $summary['gst'] = round($summary['gst'], 2);
        }
        unset($summary);

        return [
            'total' => round($totalGST, 2),
            'taxable_total' => round($totalTaxable, 2),
            'count' => count($details),
            'details' => $details,
            'rate_summary' => $rateSummary,
        ];
    }
}