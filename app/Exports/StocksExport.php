<?php

namespace App\Exports;

use App\Models\Stock;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class StocksExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $search;
    protected $lowStock;

    public function __construct($search = null, $lowStock = false)
    {
        $this->search = $search;
        $this->lowStock = $lowStock;
    }

    public function collection()
    {
        $query = Stock::query();

        // Search functionality
        if ($this->search) {
            $query->where('item_name', 'like', '%' . $this->search . '%')
                  ->orWhere('item_description', 'like', '%' . $this->search . '%');
        }

        // Filter by low stock
        if ($this->lowStock) {
            $query->whereRaw('quantity_on_hand <= reorder_level');
        }

        return $query->orderBy('item_name')->get();
    }

    public function headings(): array
    {
        return [
            'Item Name',
            'Description',
            'Unit',
            'Quantity on Hand',
            'Unit Cost',
            'Total Value',
            'Reorder Level',
            'Status',
            'Last Updated',
            'Created At'
        ];
    }

    public function map($stock): array
    {
        $isLowStock = $stock->quantity_on_hand <= $stock->reorder_level;
        
        return [
            $stock->item_name,
            $stock->item_description ?? '',
            strtoupper($stock->unit),
            number_format($stock->quantity_on_hand, 2),
            '₹' . number_format($stock->unit_cost ?? 0, 2),
            '₹' . number_format($stock->total_value ?? 0, 2),
            number_format($stock->reorder_level, 2),
            $isLowStock ? 'Low Stock' : 'In Stock',
            $stock->updated_at ? $stock->updated_at->format('Y-m-d H:i:s') : '',
            $stock->created_at ? $stock->created_at->format('Y-m-d H:i:s') : ''
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
