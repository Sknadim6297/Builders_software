<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VendorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Vendor::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('vend_id', 'like', "%{$search}%")
                  ->orWhere('mobile_number', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%")
                  ->orWhere('supply_of_goods', 'like', "%{$search}%");
            });
        }

        // Date range filtering
        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        $vendors = $query->orderBy('created_at', 'desc')->paginate(10);
        
        return Inertia::render('Vendors/Index', [
            'vendors' => $vendors,
            'filters' => $request->only(['search', 'from_date', 'to_date'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Vendors/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'mobile_number' => 'required|string|max:10',
            'address' => 'required|string',
            'pincode' => 'required|digits:6',
            'location' => 'required|string|max:255',
            'alternate_mobile' => 'nullable|string|max:10',
            'supply_of_goods' => 'required|string|max:255',
            'gst_number' => 'required|string|size:15',
            'is_active' => 'boolean'
        ]);

        Vendor::create([
            'name' => $request->name,
            'mobile_number' => $request->mobile_number,
            'address' => $request->address,
            'pincode' => $request->pincode,
            'location' => $request->location,
            'alternate_mobile' => $request->alternate_mobile,
            'supply_of_goods' => $request->supply_of_goods,
            'gst_number' => $request->gst_number,
            'is_active' => $request->is_active ?? true
        ]);

        return redirect()->route('vendors.index')
            ->with('success', 'Vendor created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Vendor $vendor)
    {
        return Inertia::render('Vendors/Show', [
            'vendor' => $vendor
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Vendor $vendor)
    {
        return Inertia::render('Vendors/Edit', [
            'vendor' => $vendor
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Vendor $vendor)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'mobile_number' => 'required|string|max:10',
            'address' => 'required|string',
            'pincode' => 'required|digits:6',
            'location' => 'required|string|max:255',
            'alternate_mobile' => 'nullable|string|max:10',
            'supply_of_goods' => 'required|string|max:255',
            'gst_number' => 'required|string|size:15',
            'is_active' => 'boolean'
        ]);

        $vendor->update([
            'name' => $request->name,
            'mobile_number' => $request->mobile_number,
            'address' => $request->address,
            'pincode' => $request->pincode,
            'location' => $request->location,
            'alternate_mobile' => $request->alternate_mobile,
            'supply_of_goods' => $request->supply_of_goods,
            'gst_number' => $request->gst_number,
            'is_active' => $request->is_active ?? true
        ]);

        return redirect()->route('vendors.index')
            ->with('success', 'Vendor updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vendor $vendor)
    {
        $vendor->delete();

        return redirect()->route('vendors.index')
            ->with('success', 'Vendor deleted successfully.');
    }
}
