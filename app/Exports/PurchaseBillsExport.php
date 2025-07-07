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
    protected $search;

    public function __construct($search = null)
    {
        $this->search = $search;
    }

    public function collection()
    {
        $query = PurchaseBill::with(['vendor'])->orderBy('created_at', 'desc');

        if ($this->search) {
            $query->where(function($q) {
                $q->where('po_number', 'like', "%{$this->search}%")
                  ->orWhere('reference', 'like', "%{$this->search}%")
                  ->orWhereHas('vendor', function($vendorQuery) {
                      $vendorQuery->where('name', 'like', "%{$this->search}%");
                  });
            });
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
