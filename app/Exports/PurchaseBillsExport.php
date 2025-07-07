<?php

namespace App\Exports;

use App\Models\PurchaseBill;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class PurchaseBillsExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $filters;

    public function __construct($filters = [])
    {
        $this->filters = $filters;
    }

    public function collection()
    {
        $query = PurchaseBill::with(['vendor'])->orderBy('created_at', 'desc');

        // Search functionality
        if (!empty($this->filters['search'])) {
            $search = $this->filters['search'];
            $query->where(function($q) use ($search) {
                $q->where('po_number', 'like', "%{$search}%")
                  ->orWhere('reference', 'like', "%{$search}%")
                  ->orWhereHas('vendor', function($vendorQuery) use ($search) {
                      $vendorQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Vendor filter
        if (!empty($this->filters['vendor_id'])) {
            $query->where('vendor_id', $this->filters['vendor_id']);
        }

        // Status filter
        if (!empty($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }

        // PO Date range filter
        if (!empty($this->filters['po_date_from'])) {
            $query->where('po_date', '>=', $this->filters['po_date_from']);
        }
        if (!empty($this->filters['po_date_to'])) {
            $query->where('po_date', '<=', $this->filters['po_date_to']);
        }

        // Expected delivery date range filter
        if (!empty($this->filters['expected_delivery_from'])) {
            $query->where('expected_delivery', '>=', $this->filters['expected_delivery_from']);
        }
        if (!empty($this->filters['expected_delivery_to'])) {
            $query->where('expected_delivery', '<=', $this->filters['expected_delivery_to']);
        }

        // Amount range filter
        if (!empty($this->filters['min_amount'])) {
            $query->where('total', '>=', $this->filters['min_amount']);
        }
        if (!empty($this->filters['max_amount'])) {
            $query->where('total', '<=', $this->filters['max_amount']);
        }

        return $query->get();
    }

    public function headings(): array
    {
        return [
            'PO Number',
            'Vendor',
            'PO Date',
            'Expected Delivery',
            'Total Amount',
            'Status',
            'Reference',
            'Notes',
            'Created At'
        ];
    }

    public function map($purchaseBill): array
    {
        return [
            $purchaseBill->po_number,
            $purchaseBill->vendor->name ?? 'N/A',
            $purchaseBill->po_date ? date('Y-m-d', strtotime($purchaseBill->po_date)) : '',
            $purchaseBill->expected_delivery ? date('Y-m-d', strtotime($purchaseBill->expected_delivery)) : '',
            '$' . number_format($purchaseBill->total ?? 0, 2),
            ucfirst($purchaseBill->status ?? 'draft'),
            $purchaseBill->reference ?? '',
            $purchaseBill->notes ?? '',
            $purchaseBill->created_at ? $purchaseBill->created_at->format('Y-m-d H:i:s') : ''
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
