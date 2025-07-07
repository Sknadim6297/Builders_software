<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\PurchaseBill;
use App\Models\Vendor;
use App\Models\Customer;
use App\Models\Stock;
use App\Models\StockMovement;
use App\Exports\PurchaseBillsExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;

class PurchaseBillController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = PurchaseBill::with(['vendor'])->orderBy('created_at', 'desc');

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('po_number', 'like', "%{$search}%")
                  ->orWhere('reference', 'like', "%{$search}%")
                  ->orWhereHas('vendor', function($vendorQuery) use ($search) {
                      $vendorQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Handle export requests
        if ($request->has('export')) {
            $exportType = $request->get('export');
            $search = $request->get('search');

            if ($exportType === 'excel') {
                return Excel::download(new PurchaseBillsExport($search), 'purchase-bills-' . date('Y-m-d') . '.xlsx');
            }

            if ($exportType === 'pdf') {
                $purchaseBills = $query->get();
                $pdf = Pdf::loadView('purchase-bills.pdf', compact('purchaseBills', 'search'));
                return $pdf->download('purchase-bills-' . date('Y-m-d') . '.pdf');
            }
        }

        $purchaseBills = $query->paginate(15)->withQueryString();

        return Inertia::render('PurchaseBills/Index', [
            'purchaseBills' => $purchaseBills,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $vendors = Vendor::select('id', 'name', 'address')->orderBy('name')->get();
        $customers = Customer::select('id', 'name', 'address')->orderBy('name')->get();

        return Inertia::render('PurchaseBills/Create', [
            'vendors' => $vendors,
            'customers' => $customers
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Handle items field - convert array to JSON string if needed for FormData submissions
        $requestData = $request->all();
        if (isset($requestData['items']) && is_array($requestData['items'])) {
            $requestData['items'] = json_encode($requestData['items']);
            $request->merge($requestData);
        }
        
        $validated = $request->validate([
            'po_date' => 'required|date',
            'vendor_id' => 'required|exists:vendors,id',
            'vendor_address' => 'required|string|max:500',
            'deliver_address' => 'required|string|max:500',
            'expected_delivery' => 'nullable|date',
            'items' => 'required', // Accept both string and array
            'subtotal' => 'required|numeric|min:0',
            'tax' => 'nullable|numeric|min:0|max:100',
            'discount' => 'nullable|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'terms' => 'nullable|string|max:1000',
            'notes' => 'nullable|string|max:1000',
            'reference' => 'nullable|string|max:255',
            'attachments.*' => 'nullable|file|max:10240'
        ]);

        // Ensure items is converted to proper format
        if (is_array($validated['items'])) {
            $items = $validated['items'];
        } else {
            $items = json_decode($validated['items'], true);
        }

        DB::beginTransaction();
        
        try {
            // Generate PO number
            $lastPO = PurchaseBill::latest('id')->first();
            $poNumber = 'PO-' . str_pad(($lastPO ? $lastPO->id + 1 : 1), 6, '0', STR_PAD_LEFT);
            
            // Create purchase bill
            $purchaseBill = PurchaseBill::create([
                'po_number' => $poNumber,
                'po_date' => $validated['po_date'],
                'vendor_id' => $validated['vendor_id'],
                'vendor_address' => $validated['vendor_address'],
                'deliver_address' => $validated['deliver_address'],
                'expected_delivery' => $validated['expected_delivery'],
                'items' => $items,
                'subtotal' => $validated['subtotal'],
                'tax' => $validated['tax'] ?? 0,
                'discount' => $validated['discount'] ?? 0,
                'total' => $validated['total'],
                'terms' => $validated['terms'],
                'notes' => $validated['notes'],
                'reference' => $validated['reference'],
                'status' => 'draft',
                'created_by' => Auth::id()
            ]);

            // Handle file attachments
            if ($request->hasFile('attachments')) {
                $attachments = [];
                foreach ($request->file('attachments') as $index => $file) {
                    if ($file && $file->isValid()) {
                        $filename = time() . '_' . $index . '_' . $file->getClientOriginalName();
                        $path = $file->storeAs('purchase-bills', $filename, 'public');
                        $attachments[] = [
                            'name' => $file->getClientOriginalName(),
                            'path' => $path,
                            'size' => $file->getSize(),
                            'type' => $file->getClientMimeType()
                        ];
                    }
                }
                $purchaseBill->update(['attachments' => $attachments]);
            }

            // Update stock for each item
            $this->updateStockFromPurchaseBill($purchaseBill, $items);

            DB::commit();

            return redirect()->route('purchase-bills.index')
                ->with('success', 'Purchase bill created successfully.');

        } catch (\Exception $e) {
            DB::rollback();
            
            // Log the error for debugging
            Log::error('Failed to create purchase bill:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()->withErrors(['error' => 'Failed to create purchase bill. Please try again.']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $purchaseBill = PurchaseBill::with(['vendor', 'creator'])->findOrFail($id);

        return Inertia::render('PurchaseBills/Show', [
            'purchaseBill' => $purchaseBill
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $purchaseBill = PurchaseBill::with(['vendor'])->findOrFail($id);
        $vendors = Vendor::select('id', 'name', 'address')->orderBy('name')->get();
        $customers = Customer::select('id', 'name', 'address')->orderBy('name')->get();

        return Inertia::render('PurchaseBills/Edit', [
            'purchaseBill' => $purchaseBill,
            'vendors' => $vendors,
            'customers' => $customers
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $purchaseBill = PurchaseBill::findOrFail($id);

        $validated = $request->validate([
            'po_date' => 'required|date',
            'vendor_id' => 'required|exists:vendors,id',
            'vendor_address' => 'required|string|max:500',
            'deliver_address' => 'required|string|max:500',
            'expected_delivery' => 'nullable|date',
            'items' => 'required', // Accept both string and array
            'subtotal' => 'required|numeric|min:0',
            'tax' => 'nullable|numeric|min:0|max:100',
            'discount' => 'nullable|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'terms' => 'nullable|string|max:1000',
            'notes' => 'nullable|string|max:1000',
            'reference' => 'nullable|string|max:255',
            'attachments.*' => 'nullable|file|max:10240',
            'status' => 'nullable|in:draft,sent,received,completed,cancelled'
        ]);

        DB::beginTransaction();
        
        try {
            // Ensure items is converted to proper format
            if (is_array($validated['items'])) {
                $items = $validated['items'];
            } else {
                $items = json_decode($validated['items'], true);
            }
            
            // Update purchase bill
            $purchaseBill->update([
                'po_date' => $validated['po_date'],
                'vendor_id' => $validated['vendor_id'],
                'vendor_address' => $validated['vendor_address'],
                'deliver_address' => $validated['deliver_address'],
                'expected_delivery' => $validated['expected_delivery'],
                'items' => $items,
                'subtotal' => $validated['subtotal'],
                'tax' => $validated['tax'] ?? 0,
                'discount' => $validated['discount'] ?? 0,
                'total' => $validated['total'],
                'terms' => $validated['terms'],
                'notes' => $validated['notes'],
                'reference' => $validated['reference'],
                'status' => $validated['status'] ?? $purchaseBill->status,
                'updated_by' => Auth::id()
            ]);

            // Handle new file attachments
            if ($request->hasFile('attachments')) {
                $existingAttachments = $purchaseBill->attachments ?? [];
                $newAttachments = [];
                
                foreach ($request->file('attachments') as $index => $file) {
                    if ($file && $file->isValid()) {
                        $filename = time() . '_' . $index . '_' . $file->getClientOriginalName();
                        $path = $file->storeAs('purchase-bills', $filename, 'public');
                        $newAttachments[] = [
                            'name' => $file->getClientOriginalName(),
                            'path' => $path,
                            'size' => $file->getSize(),
                            'type' => $file->getClientMimeType()
                        ];
                    }
                }
                
                $allAttachments = array_merge($existingAttachments, $newAttachments);
                $purchaseBill->update(['attachments' => $allAttachments]);
            }

            DB::commit();

            return redirect()->route('purchase-bills.index')
                ->with('success', 'Purchase bill updated successfully.');

        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Failed to update purchase bill: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $purchaseBill = PurchaseBill::findOrFail($id);
            
            // Delete associated files
            if ($purchaseBill->attachments) {
                foreach ($purchaseBill->attachments as $attachment) {
                    if (isset($attachment['path'])) {
                        Storage::disk('public')->delete($attachment['path']);
                    }
                }
            }
            
            $purchaseBill->delete();

            return redirect()->route('purchase-bills.index')
                ->with('success', 'Purchase bill deleted successfully.');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete purchase bill: ' . $e->getMessage()]);
        }
    }

    /**
     * Update stock based on purchase bill items
     */
    private function updateStockFromPurchaseBill(PurchaseBill $purchaseBill, array $items)
    {
        foreach ($items as $item) {
            $itemName = $item['product'] ?? ''; // Changed from 'name' to 'product'
            $quantity = (float)($item['quantity'] ?? 0);
            $unitCost = (float)($item['unit_price'] ?? 0); // Changed from 'unit_cost' to 'unit_price'
            $unit = $item['measurement'] ?? 'pcs'; // Changed from 'unit' to 'measurement'
            
            if (empty($itemName) || $quantity <= 0) {
                continue;
            }

            // Find or create stock item
            $stock = Stock::firstOrCreate(
                ['item_name' => $itemName],
                [
                    'item_description' => $item['description'] ?? '',
                    'unit' => $unit,
                    'quantity_on_hand' => 0,
                    'unit_cost' => $unitCost,
                    'total_value' => 0,
                    'reorder_level' => 0,
                    'supplier_info' => 'From Purchase Bill: ' . $purchaseBill->po_number,
                    'last_updated_by' => Auth::id()
                ]
            );

            // Update stock quantity
            $stock->updateQuantity($quantity, $unitCost);

            // Create stock movement record
            StockMovement::create([
                'stock_id' => $stock->id,
                'movement_type' => 'in',
                'quantity' => $quantity,
                'unit_cost' => $unitCost,
                'total_cost' => $quantity * $unitCost,
                'reference_type' => 'purchase_bill',
                'reference_id' => $purchaseBill->id,
                'notes' => 'From Purchase Bill: ' . $purchaseBill->po_number,
                'created_by' => Auth::id()
            ]);
        }
    }
}
