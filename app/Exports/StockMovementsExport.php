<?php

namespace App\Exports;

use App\Models\Stock;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class StockMovementsExport implements WithMultipleSheets
{
    protected $stock;

    public function __construct(Stock $stock)
    {
        $this->stock = $stock;
    }

    public function sheets(): array
    {
        return [
            'Stock Information' => new StockInformationSheet($this->stock),
            'Movement History' => new StockMovementHistorySheet($this->stock),
        ];
    }
}

class StockInformationSheet implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $stock;

    public function __construct(Stock $stock)
    {
        $this->stock = $stock;
    }

    public function collection()
    {
        return collect([$this->stock]);
    }

    public function headings(): array
    {
        return [
            'Item Name',
            'Description',
            'Unit',
            'Current Quantity',
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

class StockMovementHistorySheet implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    protected $stock;

    public function __construct(Stock $stock)
    {
        $this->stock = $stock;
    }

    public function collection()
    {
        return $this->stock->stockMovements()->with('createdBy')->orderBy('created_at', 'desc')->get();
    }

    public function headings(): array
    {
        return [
            'Date',
            'Movement Type',
            'Quantity',
            'Unit Cost',
            'Source',
            'Reference',
            'Notes',
            'Updated By',
            'Created At'
        ];
    }

    public function map($movement): array
    {
        return [
            $movement->created_at ? $movement->created_at->format('Y-m-d H:i:s') : '',
            ucfirst($movement->movement_type),
            number_format($movement->quantity, 2),
            '₹' . number_format($movement->unit_cost ?? 0, 2),
            $movement->source ?? '',
            $movement->reference ?? '',
            $movement->notes ?? '',
            $movement->createdBy->name ?? 'System',
            $movement->created_at ? $movement->created_at->format('Y-m-d H:i:s') : ''
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
