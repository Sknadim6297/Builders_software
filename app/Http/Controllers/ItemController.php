<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ItemController extends Controller
{
    /**
     * Display a listing of items.
     */
    public function index(Request $request)
    {
        $query = Item::orderBy('created_at', 'desc');

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('item_code', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%")
                  ->orWhere('unit_type', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $items = $query->paginate(15);

        return Inertia::render('Items/Index', [
            'items' => $items,
            'filters' => $request->only(['search', 'status'])
        ]);
    }

    /**
     * Show the form for creating a new item.
     */
    public function create()
    {
        return Inertia::render('Items/Create');
    }

    /**
     * Store a newly created item.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:items',
            'description' => 'nullable|string|max:1000',
            'unit_type' => 'required|string|max:50',
            'default_unit_price' => 'nullable|numeric|min:0',
            'default_discount_percentage' => 'nullable|numeric|min:0|max:100',
            'gst_percentage' => 'nullable|numeric|min:0|max:100'
        ]);

        $validated['created_by'] = Auth::id();
        $validated['updated_by'] = Auth::id();
        $validated['is_active'] = true;

        Item::create($validated);

        return redirect()->route('items.index')->with('success', 'Item created successfully.');
    }

    /**
     * Display the specified item.
     */
    public function show(Item $item)
    {
        return Inertia::render('Items/Show', [
            'item' => $item->load('creator', 'updater')
        ]);
    }

    /**
     * Show the form for editing the item.
     */
    public function edit(Item $item)
    {
        return Inertia::render('Items/Edit', [
            'item' => $item
        ]);
    }

    /**
     * Update the specified item.
     */
    public function update(Request $request, Item $item)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:items,name,' . $item->id,
            'description' => 'nullable|string|max:1000',
            'unit_type' => 'required|string|max:50',
            'default_unit_price' => 'nullable|numeric|min:0',
            'default_discount_percentage' => 'nullable|numeric|min:0|max:100',
            'gst_percentage' => 'nullable|numeric|min:0|max:100',
            'is_active' => 'boolean'
        ]);

        $validated['updated_by'] = Auth::id();

        $item->update($validated);

        return redirect()->route('items.index')->with('success', 'Item updated successfully.');
    }

    /**
     * Remove the specified item.
     */
    public function destroy(Item $item)
    {
        // Check if item has stocks or is used in purchase bills
        if ($item->stocks()->exists() || $item->purchaseBillItems()->exists()) {
            return redirect()->route('items.index')->with('error', 'Cannot delete item that has stocks or purchase records.');
        }

        $item->delete();

        return redirect()->route('items.index')->with('success', 'Item deleted successfully.');
    }

    /**
     * Get all active items (API endpoint for dropdowns)
     */
    public function getActive()
    {
        return response()->json(
            Item::active()->get(['id', 'item_code', 'name', 'unit_type', 'default_unit_price', 'default_discount_percentage', 'gst_percentage'])
        );
    }
}
