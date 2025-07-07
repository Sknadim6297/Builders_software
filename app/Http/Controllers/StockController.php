<?php

namespace App\Http\Controllers;

use App\Models\Stock;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Exports\StocksExport;
use App\Exports\StockMovementsExport;
use Maatwebsite\Excel\Facades\Excel;

class StockController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Stock::query();

        // Search functionality
        if ($request->has('search') && $request->search) {
            $query->where('item_name', 'like', '%' . $request->search . '%')
                  ->orWhere('item_description', 'like', '%' . $request->search . '%');
        }

        // Filter by low stock
        if ($request->has('low_stock') && $request->low_stock) {
            $query->whereRaw('quantity_on_hand <= reorder_level');
        }

        // Handle export requests
        if ($request->has('export')) {
            $exportType = $request->get('export');
            $search = $request->get('search');
            $lowStock = $request->get('low_stock');

            if ($exportType === 'excel') {
                return Excel::download(new StocksExport($search, $lowStock), 'stock-report-' . date('Y-m-d') . '.xlsx');
            }

            if ($exportType === 'pdf') {
                $stocks = $query->orderBy('item_name')->get();
                $pdf = Pdf::loadView('stocks.pdf', compact('stocks', 'search', 'lowStock'));
                return $pdf->download('stock-report-' . date('Y-m-d') . '.pdf');
            }
        }

        $stocks = $query->orderBy('item_name')
                       ->paginate(10)
                       ->appends($request->all());

        return Inertia::render('Stock/Index', [
            'stocks' => $stocks,
            'filters' => [
                'search' => $request->search,
                'low_stock' => $request->low_stock
            ]
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Stock $stock)
    {
        $stock->load(['stockMovements' => function($query) {
            $query->with('createdBy')->orderBy('created_at', 'desc');
        }]);

        // Handle export requests for movement history
        if ($request->has('export')) {
            $exportType = $request->get('export');

            if ($exportType === 'excel') {
                return Excel::download(new StockMovementsExport($stock), 'stock-movement-' . $stock->item_name . '-' . date('Y-m-d') . '.xlsx');
            }

            if ($exportType === 'pdf') {
                $pdf = Pdf::loadView('stocks.movement-pdf', compact('stock'));
                return $pdf->download('stock-movement-' . $stock->item_name . '-' . date('Y-m-d') . '.pdf');
            }
        }

        return Inertia::render('Stock/Show', [
            'stock' => $stock
        ]);
    }
}
