<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Stock;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Service::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('serv_id', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Date range filtering
        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $services = $query->orderBy('created_at', 'desc')->paginate(10);
        
        return Inertia::render('Services/Index', [
            'services' => $services,
            'filters' => $request->only(['search', 'from_date', 'to_date'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $stocks = Stock::select('id', 'item_name', 'unit')->orderBy('item_name')->get();

        return Inertia::render('Services/Create', [
            'stocks' => $stocks
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'gst_percentage' => 'nullable|numeric|min:0|max:100',
            'is_active' => 'boolean',
            'consumables' => 'nullable|array',
            'consumables.*.stock_id' => 'required_with:consumables|exists:stocks,id',
            'consumables.*.quantity' => 'required_with:consumables|numeric|min:0.01'
        ]);

        $service = Service::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'gst_percentage' => $request->gst_percentage,
            'is_active' => $request->is_active ?? true
        ]);

        $consumables = $request->input('consumables', []);
        if (!empty($consumables)) {
            $syncData = [];
            foreach ($consumables as $item) {
                $syncData[$item['stock_id']] = ['quantity' => $item['quantity']];
            }
            $service->consumables()->sync($syncData);
        }

        return redirect()->route('services.index')
            ->with('success', 'Service created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Service $service)
    {
        return Inertia::render('Services/Show', [
            'service' => $service
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Service $service)
    {
        $service->load('consumables');
        $stocks = Stock::select('id', 'item_name', 'unit')->orderBy('item_name')->get();

        return Inertia::render('Services/Edit', [
            'service' => $service,
            'stocks' => $stocks
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Service $service)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'gst_percentage' => 'nullable|numeric|min:0|max:100',
            'is_active' => 'boolean',
            'consumables' => 'nullable|array',
            'consumables.*.stock_id' => 'required_with:consumables|exists:stocks,id',
            'consumables.*.quantity' => 'required_with:consumables|numeric|min:0.01'
        ]);

        $service->update([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'gst_percentage' => $request->gst_percentage,
            'is_active' => $request->is_active ?? true
        ]);

        $consumables = $request->input('consumables', []);
        $syncData = [];
        foreach ($consumables as $item) {
            $syncData[$item['stock_id']] = ['quantity' => $item['quantity']];
        }
        $service->consumables()->sync($syncData);

        return redirect()->route('services.index')
            ->with('success', 'Service updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $service)
    {
        $service->delete();

        return redirect()->route('services.index')
            ->with('success', 'Service deleted successfully.');
    }
}
