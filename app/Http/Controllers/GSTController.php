<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\PurchaseBill;
use App\Models\InvoiceServiceItem;
use App\Models\InvoiceProductItem;
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
            'from_date' => 'nullable|date',
            'to_date' => 'nullable|date',
            'gst_rate' => 'nullable|numeric|min:0|max:100'
        ]);

        $fromDate = $request->from_date ? Carbon::parse($request->from_date)->startOfDay() : Carbon::now()->startOfMonth();
        $toDate = $request->to_date ? Carbon::parse($request->to_date)->endOfDay() : Carbon::now()->endOfMonth();
        $gstRate = $request->gst_rate;

        // Calculate Output GST (from Sales Invoices)
        $outputGST = $this->calculateOutputGST($fromDate, $toDate, $gstRate);

        // Calculate Input GST (from Purchase Bills)
        $inputGST = $this->calculateInputGST($fromDate, $toDate, $gstRate);

        // Calculate Net GST
        $netGST = $outputGST['total'] - $inputGST['total'];
        $status = $netGST > 0 ? 'payable' : 'credit';

        return Inertia::render('GST/Index', [
            'gstSummary' => [
                'output_gst' => $outputGST['total'],
                'input_gst' => $inputGST['total'],
                'net_gst' => abs($netGST),
                'status' => $status,
                'period' => [
                    'from' => $fromDate->format('Y-m-d'),
                    'to' => $toDate->format('Y-m-d')
                ]
            ],
            'outputGSTDetails' => $outputGST['details'],
            'inputGSTDetails' => $inputGST['details'],
            'filters' => $request->only(['from_date', 'to_date', 'gst_rate'])
        ]);
    }

    /**
     * Calculate Output GST from sales invoices
     */
    private function calculateOutputGST($fromDate, $toDate, $gstRate = null)
    {
        $query = Invoice::where('invoice_date', '>=', $fromDate)
            ->where('invoice_date', '<=', $toDate)
            ->where('payment_status', '!=', 'cancelled')
            ->with(['invoiceServiceItems.service', 'customer']);

        $invoices = $query->get();
        $totalGST = 0;
        $details = [];

        foreach ($invoices as $invoice) {
            $invoiceGST = 0;

            // Calculate GST from service items only
            foreach ($invoice->invoiceServiceItems as $item) {
                if ($item->service && $item->service->gst_percentage > 0) {
                    $gstPercentage = $item->service->gst_percentage;
                    if ($gstRate === null || $gstPercentage == $gstRate) {
                        $gstAmount = ($item->total * $gstPercentage) / (100 + $gstPercentage);
                        $invoiceGST += $gstAmount;
                    }
                }
            }

            if ($invoiceGST > 0) {
                $totalGST += $invoiceGST;
                $details[] = [
                    'invoice_number' => $invoice->invoice_number,
                    'invoice_date' => $invoice->invoice_date->format('Y-m-d'),
                    'customer_name' => $invoice->customer->name ?? 'N/A',
                    'gst_amount' => round($invoiceGST, 2),
                    'total_amount' => $invoice->total
                ];
            }
        }

        return [
            'total' => round($totalGST, 2),
            'details' => $details
        ];
    }

    /**
     * Calculate Input GST from purchase bills
     */
    private function calculateInputGST($fromDate, $toDate, $gstRate = null)
    {
        $query = PurchaseBill::where('po_date', '>=', $fromDate)
            ->where('po_date', '<=', $toDate)
            ->where('status', '!=', 'cancelled')
            ->with('vendor');

        $purchaseBills = $query->get();
        $totalGST = 0;
        $details = [];

        foreach ($purchaseBills as $bill) {
            $items = $bill->items ?? [];
            $billGST = 0;

            if (is_array($items)) {
                foreach ($items as $item) {
                    $gstPercentage = $item['gst_percentage'] ?? 0;
                    $total = $item['total'] ?? 0;

                    if ($gstPercentage > 0 && $total > 0) {
                        if ($gstRate === null || $gstPercentage == $gstRate) {
                            $gstAmount = ($total * $gstPercentage) / (100 + $gstPercentage);
                            $billGST += $gstAmount;
                        }
                    }
                }
            }

            if ($billGST > 0) {
                $totalGST += $billGST;
                $details[] = [
                    'po_number' => $bill->po_number,
                    'po_date' => $bill->po_date->format('Y-m-d'),
                    'vendor_name' => $bill->vendor->name ?? 'N/A',
                    'gst_amount' => round($billGST, 2),
                    'total_amount' => $bill->total
                ];
            }
        }

        return [
            'total' => round($totalGST, 2),
            'details' => $details
        ];
    }
}