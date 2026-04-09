<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use App\Models\PurchaseBill;
use App\Models\Vendor;
use App\Models\Customer;
use App\Models\Stock;
use App\Models\StockMovement;
use App\Models\Item;
use App\Models\PurchaseBillItem;
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

        // Vendor filter
        if ($request->filled('vendor_id')) {
            $query->where('vendor_id', $request->vendor_id);
        }

        // Status filter (assuming you have a status field)
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // PO Date range filter
        if ($request->filled('po_date_from')) {
            $query->where('po_date', '>=', $request->po_date_from);
        }
        if ($request->filled('po_date_to')) {
            $query->where('po_date', '<=', $request->po_date_to);
        }

        // Expected delivery date range filter
        if ($request->filled('expected_delivery_from')) {
            $query->where('expected_delivery', '>=', $request->expected_delivery_from);
        }
        if ($request->filled('expected_delivery_to')) {
            $query->where('expected_delivery', '<=', $request->expected_delivery_to);
        }

        // Amount range filter
        if ($request->filled('min_amount')) {
            $query->where('total', '>=', $request->min_amount);
        }
        if ($request->filled('max_amount')) {
            $query->where('total', '<=', $request->max_amount);
        }

        // Handle export requests
        if ($request->has('export')) {
            $exportType = $request->get('export');
            $filters = $request->only([
                'search', 'vendor_id', 'status', 'po_date_from', 'po_date_to',
                'expected_delivery_from', 'expected_delivery_to', 'min_amount', 'max_amount'
            ]);

            if ($exportType === 'excel') {
                return Excel::download(new PurchaseBillsExport($filters), 'purchase-bills-' . date('Y-m-d') . '.xlsx');
            }

            if ($exportType === 'pdf') {
                $purchaseBills = $query->get();
                $pdf = Pdf::loadView('purchase-bills.pdf', compact('purchaseBills', 'filters'));
                return $pdf->download('purchase-bills-' . date('Y-m-d') . '.pdf');
            }
        }

        $purchaseBills = $query->paginate(15)->withQueryString();
        $vendors = Vendor::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('PurchaseBills/Index', [
            'purchaseBills' => $purchaseBills,
            'vendors' => $vendors,
            'filters' => $request->only([
                'search', 'vendor_id', 'status', 'po_date_from', 'po_date_to',
                'expected_delivery_from', 'expected_delivery_to', 'min_amount', 'max_amount'
            ])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $vendors = Vendor::select('id', 'name', 'address')->orderBy('name')->get();
        $customers = Customer::select('id', 'name', 'address')->orderBy('name')->get();
        $items = Item::active()
            ->with('category:id,name')
            ->get(['id', 'item_code', 'name', 'category_id', 'hsn_code', 'unit_type', 'default_unit_price', 'default_discount_percentage', 'gst_percentage']);

        return Inertia::render('PurchaseBills/CreateNew', [
            'vendors' => $vendors,
            'customers' => $customers,
            'items' => $items
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
            'inv_cha_no' => 'nullable|string|max:100',
            'vendor_id' => 'required|exists:vendors,id',
            'vendor_address' => 'required|string|max:500',
            'deliver_address' => 'required|string|max:500',
            'expected_delivery' => 'nullable|date',
            'items' => 'required',
            'subtotal' => 'required|numeric|min:0',
            'delivery_charges' => 'nullable|numeric|min:0',
            'gst_type' => 'required|in:intra,inter',
            'cgst_percentage' => 'nullable|numeric|min:0|max:100',
            'sgst_percentage' => 'nullable|numeric|min:0|max:100',
            'igst_percentage' => 'nullable|numeric|min:0|max:100',
            'cgst_amount' => 'nullable|numeric|min:0',
            'sgst_amount' => 'nullable|numeric|min:0',
            'igst_amount' => 'nullable|numeric|min:0',
            'tcs_percentage' => 'nullable|numeric|min:0|max:100',
            'tcs_amount' => 'nullable|numeric|min:0',
            'round_off' => 'nullable|numeric',
            'gross_amount' => 'nullable|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'net_amount' => 'nullable|numeric|min:0',
            'terms' => 'nullable|string|max:1000',
            'notes' => 'nullable|string|max:1000',
            'reference' => 'nullable|string|max:255',
            'attachments.*' => 'nullable|file|max:10240'
        ]);

        $gstData = $this->validatePurchaseBillGst($validated);

        // Ensure items is converted to proper format
        if (is_array($validated['items'])) {
            $items = $validated['items'];
        } else {
            $items = json_decode($validated['items'], true);
        }

        $this->validatePurchaseBillItemsHsn($items);
        $this->syncItemMasterHsnCodes($items);

        // Recalculate item-level values for security and consistency
        $grossAmount = 0;
        foreach ($items as &$item) {
            $quantity = (float) ($item['quantity'] ?? 0);
            $rate = (float) ($item['unit_price'] ?? 0);
            $itemDiscountPercent = (float) ($item['discount_percentage'] ?? 0);
            $item['discount_percentage'] = $itemDiscountPercent;

            $netRate = $rate - ($rate * $itemDiscountPercent / 100);
            $netRate = round($netRate, 2);
            $itemAmount = round($netRate * $quantity, 2);

            $item['net_rate'] = $netRate;
            $item['amount'] = $itemAmount;
            $grossAmount += $itemAmount;
        }
        unset($item);

        $deliveryCharges = (float) ($validated['delivery_charges'] ?? 0);
        $gstType = $gstData['gst_type'];
        $cgstPercentage = $gstData['cgst_percentage'];
        $sgstPercentage = $gstData['sgst_percentage'];
        $igstPercentage = $gstData['igst_percentage'];
        $tcsPercentage = (float) ($validated['tcs_percentage'] ?? 0);
        $roundOff = (float) ($validated['round_off'] ?? 0);
        $discountAmount = (float) ($validated['discount'] ?? 0);

        $baseInvoiceAmount = $grossAmount + $deliveryCharges;
        $cgstAmount = 0;
        $sgstAmount = 0;
        $igstAmount = 0;

        if ($gstType === 'intra') {
            $cgstAmount = round($baseInvoiceAmount * ($cgstPercentage / 100), 2);
            $sgstAmount = round($baseInvoiceAmount * ($sgstPercentage / 100), 2);
        } else {
            $igstAmount = round($baseInvoiceAmount * ($igstPercentage / 100), 2);
        }

        $gstTotal = $cgstAmount + $sgstAmount + $igstAmount;
        $tcsAmount = round(($baseInvoiceAmount + $gstTotal) * ($tcsPercentage / 100), 2);

        $netAmount = $baseInvoiceAmount + $gstTotal + $tcsAmount + $roundOff - $discountAmount;
        $netAmount = round(max(0, $netAmount), 2);

        $taxField = $gstTotal;
        $computedTotal = $netAmount;

        DB::beginTransaction();
        
        try {
            // Generate PO number
            $lastPO = PurchaseBill::latest('id')->first();
            $poNumber = 'PO-' . str_pad(($lastPO ? $lastPO->id + 1 : 1), 6, '0', STR_PAD_LEFT);
            
            // Create purchase bill
            $purchaseBill = PurchaseBill::create([
                'po_number' => $poNumber,
                'inv_cha_no' => $validated['inv_cha_no'] ?? null,
                'po_date' => $validated['po_date'],
                'vendor_id' => $validated['vendor_id'],
                'vendor_address' => $validated['vendor_address'],
                'deliver_address' => $validated['deliver_address'],
                'expected_delivery' => $validated['expected_delivery'],
                'items' => $items,
                'subtotal' => $grossAmount,
                'delivery_charges' => $deliveryCharges,
                'gst_type' => $gstType,
                'cgst_percentage' => $cgstPercentage,
                'sgst_percentage' => $sgstPercentage,
                'igst_percentage' => $igstPercentage,
                'cgst_amount' => $cgstAmount,
                'sgst_amount' => $sgstAmount,
                'igst_amount' => $igstAmount,
                'tax' => $taxField,
                'tcs_percentage' => $tcsPercentage,
                'tcs_amount' => $tcsAmount,
                'round_off' => $roundOff,
                'gross_amount' => $baseInvoiceAmount,
                'discount' => $discountAmount,
                'total' => $computedTotal,
                'net_amount' => $netAmount,
                'terms' => $validated['terms'],
                'notes' => $validated['notes'],
                'reference' => $validated['reference'],
                'status' => 'draft',
                'created_by' => Auth::id()
            ]);

            // Create PurchaseBillItem records for each item
            foreach ($items as $item) {
                if (!empty($item['item_id'])) {
                    PurchaseBillItem::create([
                        'purchase_bill_id' => $purchaseBill->id,
                        'item_id' => $item['item_id'],
                        'hsn_code' => $item['hsn_code'] ?? null,
                        'quantity' => $item['quantity'] ?? 0,
                        'unit_price' => $item['unit_price'] ?? 0,
                        'discount_percentage' => $item['discount_percentage'] ?? 0,
                        'total' => $item['amount'] ?? 0,
                        'gst_percentage' => $item['gst_percentage'] ?? 0
                    ]);
                }
            }

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
        $items = Item::active()
            ->with('category:id,name')
            ->get(['id', 'item_code', 'name', 'category_id', 'hsn_code', 'unit_type', 'default_unit_price', 'default_discount_percentage', 'gst_percentage']);

        return Inertia::render('PurchaseBills/Edit', [
            'purchaseBill' => $purchaseBill,
            'vendors' => $vendors,
            'items' => $items
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
            'inv_cha_no' => 'nullable|string|max:100',
            'vendor_id' => 'required|exists:vendors,id',
            'vendor_address' => 'required|string|max:500',
            'deliver_address' => 'required|string|max:500',
            'expected_delivery' => 'nullable|date',
            'items' => 'required', // Accept both string and array
            'subtotal' => 'required|numeric|min:0',
            'delivery_charges' => 'nullable|numeric|min:0',
            'gst_type' => 'required|in:intra,inter',
            'cgst_percentage' => 'nullable|numeric|min:0|max:100',
            'sgst_percentage' => 'nullable|numeric|min:0|max:100',
            'igst_percentage' => 'nullable|numeric|min:0|max:100',
            'cgst_amount' => 'nullable|numeric|min:0',
            'sgst_amount' => 'nullable|numeric|min:0',
            'igst_amount' => 'nullable|numeric|min:0',
            'tcs_percentage' => 'nullable|numeric|min:0|max:100',
            'tcs_amount' => 'nullable|numeric|min:0',
            'round_off' => 'nullable|numeric',
            'gross_amount' => 'nullable|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'net_amount' => 'nullable|numeric|min:0',
            'terms' => 'nullable|string|max:1000',
            'notes' => 'nullable|string|max:1000',
            'reference' => 'nullable|string|max:255',
            'attachments.*' => 'nullable|file|max:10240',
            'status' => 'nullable|in:draft,sent,received,completed,cancelled'
        ]);

        $gstData = $this->validatePurchaseBillGst($validated);

        // Ensure items is converted to proper format
        if (is_array($validated['items'])) {
            $items = $validated['items'];
        } else {
            $items = json_decode($validated['items'], true);
        }

        $this->validatePurchaseBillItemsHsn($items);
        $this->syncItemMasterHsnCodes($items);

        // Recalculate item-level values for security and consistency
        $grossAmount = 0;
        foreach ($items as &$item) {
            $quantity = (float) ($item['quantity'] ?? 0);
            $rate = (float) ($item['unit_price'] ?? 0);
            $itemDiscountPercent = (float) ($item['discount_percentage'] ?? 0);
            $item['discount_percentage'] = $itemDiscountPercent;

            $netRate = $rate - ($rate * $itemDiscountPercent / 100);
            $netRate = round($netRate, 2);
            $itemAmount = round($netRate * $quantity, 2);

            $item['net_rate'] = $netRate;
            $item['amount'] = $itemAmount;
            $grossAmount += $itemAmount;
        }
        unset($item);

        $deliveryCharges = (float) ($validated['delivery_charges'] ?? 0);
        $gstType = $gstData['gst_type'];
        $cgstPercentage = $gstData['cgst_percentage'];
        $sgstPercentage = $gstData['sgst_percentage'];
        $igstPercentage = $gstData['igst_percentage'];
        $tcsPercentage = (float) ($validated['tcs_percentage'] ?? 0);
        $roundOff = (float) ($validated['round_off'] ?? 0);
        $discountAmount = (float) ($validated['discount'] ?? 0);

        $baseInvoiceAmount = $grossAmount + $deliveryCharges;
        $cgstAmount = 0;
        $sgstAmount = 0;
        $igstAmount = 0;

        if ($gstType === 'intra') {
            $cgstAmount = round($baseInvoiceAmount * ($cgstPercentage / 100), 2);
            $sgstAmount = round($baseInvoiceAmount * ($sgstPercentage / 100), 2);
        } else {
            $igstAmount = round($baseInvoiceAmount * ($igstPercentage / 100), 2);
        }

        $gstTotal = $cgstAmount + $sgstAmount + $igstAmount;
        $tcsAmount = round(($baseInvoiceAmount + $gstTotal) * ($tcsPercentage / 100), 2);

        $netAmount = round(max(0, $baseInvoiceAmount + $gstTotal + $tcsAmount + $roundOff - $discountAmount), 2);
        $taxField = $gstTotal;

        DB::beginTransaction();

        try {
            // Update purchase bill
            $purchaseBill->update([
                'po_date' => $validated['po_date'],
                'inv_cha_no' => $validated['inv_cha_no'] ?? null,
                'vendor_id' => $validated['vendor_id'],
                'vendor_address' => $validated['vendor_address'],
                'deliver_address' => $validated['deliver_address'],
                'expected_delivery' => $validated['expected_delivery'],
                'items' => $items,
                'subtotal' => $grossAmount,
                'delivery_charges' => $deliveryCharges,
                'gst_type' => $gstType,
                'cgst_percentage' => $cgstPercentage,
                'sgst_percentage' => $sgstPercentage,
                'igst_percentage' => $igstPercentage,
                'cgst_amount' => $cgstAmount,
                'sgst_amount' => $sgstAmount,
                'igst_amount' => $igstAmount,
                'tax' => $taxField,
                'tcs_percentage' => $tcsPercentage,
                'tcs_amount' => $tcsAmount,
                'round_off' => $roundOff,
                'gross_amount' => $baseInvoiceAmount,
                'discount' => $discountAmount,
                'total' => $netAmount,
                'net_amount' => $netAmount,
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
     * Validate purchase bill GST structure.
     */
    private function validatePurchaseBillGst(array $data): array
    {
        $cgstPercentage = (float) ($data['cgst_percentage'] ?? 0);
        $sgstPercentage = (float) ($data['sgst_percentage'] ?? 0);
        $igstPercentage = (float) ($data['igst_percentage'] ?? 0);

        $hasCgst = $cgstPercentage > 0;
        $hasSgst = $sgstPercentage > 0;
        $hasIgst = $igstPercentage > 0;

        if (!$hasCgst && !$hasSgst && !$hasIgst) {
            throw ValidationException::withMessages([
                'gst_rule' => 'Please enter either IGST or CGST & SGST.',
            ]);
        }

        if (($hasCgst xor $hasSgst)) {
            throw ValidationException::withMessages([
                'gst_rule' => 'Both CGST and SGST are required.',
            ]);
        }

        if ($hasIgst && ($hasCgst || $hasSgst)) {
            throw ValidationException::withMessages([
                'gst_rule' => 'You cannot enter IGST with CGST & SGST.',
            ]);
        }

        return [
            'gst_type' => $hasIgst ? 'inter' : 'intra',
            'cgst_percentage' => $hasCgst ? $cgstPercentage : 0,
            'sgst_percentage' => $hasSgst ? $sgstPercentage : 0,
            'igst_percentage' => $hasIgst ? $igstPercentage : 0,
        ];
    }

    /**
     * Ensure every purchase bill item has an HSN code.
     */
    private function validatePurchaseBillItemsHsn(array $items): void
    {
        foreach ($items as $item) {
            if (empty($item['item_id'])) {
                continue;
            }

            $hsnCode = trim((string) ($item['hsn_code'] ?? ''));
            if ($hsnCode === '') {
                throw ValidationException::withMessages([
                    'items' => 'HSN Code is required for this product.',
                ]);
            }
        }
    }

    /**
     * Keep item master HSN in sync with latest purchase bill entries.
     */
    private function syncItemMasterHsnCodes(array $items): void
    {
        foreach ($items as $item) {
            $itemId = (int) ($item['item_id'] ?? 0);
            if ($itemId <= 0) {
                continue;
            }

            $hsnCode = trim((string) ($item['hsn_code'] ?? ''));
            if ($hsnCode === '') {
                continue;
            }

            Item::where('id', $itemId)->update(['hsn_code' => $hsnCode]);
        }
    }

    /**
     * Update stock based on purchase bill items
     */
    private function updateStockFromPurchaseBill(PurchaseBill $purchaseBill, array $items)
    {
        foreach ($items as $item) {
            $itemId = $item['item_id'] ?? null;
            $quantity = (float) ($item['quantity'] ?? 0);
            $unitCost = (float) ($item['unit_price'] ?? 0);
            
            if (empty($itemId) || $quantity <= 0) {
                continue;
            }

            // Get the Item Master record
            $itemMaster = Item::find($itemId);
            if (!$itemMaster) {
                continue;
            }

            // Find or create stock item linked to Item Master
            $stock = Stock::firstOrCreate(
                ['item_id' => $itemMaster->id],
                [
                    'item_name' => $itemMaster->name,
                    'item_description' => $itemMaster->description ?? '',
                    'unit' => $itemMaster->unit_type,
                    'quantity_on_hand' => 0,
                    'unit_cost' => $unitCost,
                    'selling_price' => $unitCost,
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
