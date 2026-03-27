<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Service;
use App\Models\Stock;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class BillingController extends Controller
{
	public function index(Request $request)
	{
		$query = Invoice::with('customer')
			->select('id', 'invoice_number', 'invoice_date', 'customer_id', 'total', 'amount_paid', 'due_amount', 'payment_status', 'created_at')
			->orderBy('created_at', 'desc');

		if ($request->filled('search')) {
			$search = $request->search;
			$query->where(function ($q) use ($search) {
				$q->where('invoice_number', 'like', "%{$search}%")
					->orWhereHas('customer', function ($customerQuery) use ($search) {
						$customerQuery->where('name', 'like', "%{$search}%")
							->orWhere('mobile_number', 'like', "%{$search}%")
							->orWhere('cust_id', 'like', "%{$search}%");
					});
			});
		}

		if ($request->filled('customer_id')) {
			$query->where('customer_id', $request->customer_id);
		}

		if ($request->filled('invoice_date_from')) {
			$query->whereDate('invoice_date', '>=', $request->invoice_date_from);
		}

		if ($request->filled('invoice_date_to')) {
			$query->whereDate('invoice_date', '<=', $request->invoice_date_to);
		}

		$invoices = $query->paginate(15)->withQueryString();
		$customers = Customer::select('id', 'name')->orderBy('name')->get();

		return Inertia::render('Billing/Index', [
			'invoices' => $invoices,
			'customers' => $customers,
			'filters' => $request->only(['search', 'customer_id', 'invoice_date_from', 'invoice_date_to'])
		]);
	}

	public function create(Request $request)
	{
		$customers = Customer::select('id', 'name', 'mobile_number')->orderBy('name')->get();
		$services = Service::select('id', 'name', 'final_price')->where('is_active', true)->orderBy('name')->get();
		$products = Stock::select('id', 'item_name', 'unit', 'selling_price', 'unit_cost', 'quantity_on_hand')
			->orderBy('item_name')
			->get();

		return Inertia::render('Billing/Create', [
			'customers' => $customers,
			'services' => $services,
			'products' => $products,
			'prefillCustomerId' => $request->get('customer_id')
		]);
	}

	public function store(Request $request)
	{
		$requestData = $request->all();
		if (isset($requestData['service_items']) && is_string($requestData['service_items'])) {
			$requestData['service_items'] = json_decode($requestData['service_items'], true) ?? [];
		}
		if (isset($requestData['product_items']) && is_string($requestData['product_items'])) {
			$requestData['product_items'] = json_decode($requestData['product_items'], true) ?? [];
		}
		$request->merge($requestData);

		$validated = $request->validate([
			'customer_id' => 'required|exists:customers,id',
			'invoice_date' => 'required|date',
			'cgst_percentage' => 'nullable|numeric|min:0|max:100',
			'sgst_percentage' => 'nullable|numeric|min:0|max:100',
			'gst_percentage' => 'nullable|numeric|min:0|max:100',
			'discount' => 'nullable|numeric|min:0',
			'advance_payment' => 'nullable|numeric|min:0',
			'payment_method' => 'nullable|string|in:cash,card,upi,bank_transfer,cheque,other',
			'buyer_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
			'notes' => 'nullable|string|max:1000',
			'service_items' => 'nullable|array',
			'service_items.*.service_id' => 'required_with:service_items|exists:services,id',
			'service_items.*.quantity' => 'required_with:service_items|numeric|min:0.01',
			'service_items.*.unit_price' => 'required_with:service_items|numeric|min:0',
			'product_items' => 'nullable|array',
			'product_items.*.stock_id' => 'required_with:product_items|exists:stocks,id',
			'product_items.*.quantity' => 'required_with:product_items|numeric|min:0.01',
			'product_items.*.unit_price' => 'required_with:product_items|numeric|min:0'
		]);

		$buyerLogoPath = null;
		if ($request->hasFile('buyer_logo')) {
			$buyerLogoPath = $request->file('buyer_logo')->store('invoice-logos', 'public');
		}

		$serviceItems = $validated['service_items'] ?? [];
		$productItems = $validated['product_items'] ?? [];

		if (empty($productItems)) {
			return back()->withErrors(['items' => 'Please add at least one product item.']);
		}

		$serviceIds = collect($serviceItems)->pluck('service_id')->unique()->filter()->values();
		$services = Service::with('consumables')->whereIn('id', $serviceIds)->get()->keyBy('id');

		$requiredByStock = [];
		foreach ($productItems as $item) {
			$stockId = (int) $item['stock_id'];
			$quantity = (float) $item['quantity'];
			if ($stockId && $quantity > 0) {
				$requiredByStock[$stockId] = ($requiredByStock[$stockId] ?? 0) + $quantity;
			}
		}

		foreach ($serviceItems as $item) {
			$serviceId = (int) $item['service_id'];
			$quantity = (float) $item['quantity'];
			$service = $services->get($serviceId);

			if (!$service || $quantity <= 0) {
				continue;
			}

			foreach ($service->consumables as $consumable) {
				$stockId = $consumable->id;
				$requiredQty = $quantity * (float) $consumable->pivot->quantity;
				$requiredByStock[$stockId] = ($requiredByStock[$stockId] ?? 0) + $requiredQty;
			}
		}

		$stocks = Stock::whereIn('id', array_keys($requiredByStock))->get()->keyBy('id');
		$insufficient = [];
		foreach ($requiredByStock as $stockId => $requiredQty) {
			$stock = $stocks->get($stockId);
			if (!$stock || $stock->quantity_on_hand < $requiredQty) {
				$insufficient[] = $stock ? $stock->item_name : "Stock #{$stockId}";
			}
		}

		if (!empty($insufficient)) {
			return back()->withErrors([
				'stock' => 'Insufficient stock for: ' . implode(', ', $insufficient)
			]);
		}

		DB::beginTransaction();

		try {
			$serviceRows = [];
			$productRows = [];
			$subtotal = 0;

			foreach ($serviceItems as $item) {
				$quantity = (float) $item['quantity'];
				$unitPrice = (float) $item['unit_price'];
				$total = $quantity * $unitPrice;
				$subtotal += $total;

				$serviceRows[] = [
					'service_id' => $item['service_id'],
					'quantity' => $quantity,
					'unit_price' => $unitPrice,
					'total' => $total
				];
			}

			foreach ($productItems as $item) {
				$quantity = (float) $item['quantity'];
				$unitPrice = (float) $item['unit_price'];
				$total = $quantity * $unitPrice;
				$subtotal += $total;

				$productRows[] = [
					'stock_id' => $item['stock_id'],
					'quantity' => $quantity,
					'unit_price' => $unitPrice,
					'total' => $total
				];
			}

			$cgstPercentage = (float) ($validated['cgst_percentage'] ?? 0);
			$sgstPercentage = (float) ($validated['sgst_percentage'] ?? 0);
			$gstPercentage = $cgstPercentage + $sgstPercentage;
			$gstAmount = ($subtotal * $gstPercentage) / 100;
			$discount = (float) ($validated['discount'] ?? 0);
			$totalAmount = $subtotal + $gstAmount - $discount;
			$advancePayment = min((float) ($validated['advance_payment'] ?? 0), $totalAmount);
			$dueAmount = $totalAmount - $advancePayment;
			
			$paymentStatus = 'unpaid';
			if ($advancePayment >= $totalAmount) {
				$paymentStatus = 'paid';
			} elseif ($advancePayment > 0) {
				$paymentStatus = 'partial';
			}

			$invoice = Invoice::create([
				'invoice_number' => 'TEMP-' . uniqid(),
				'invoice_date' => $validated['invoice_date'],
				'customer_id' => $validated['customer_id'],
				'subtotal' => $subtotal,
				'gst_percentage' => $gstPercentage,
				'cgst_percentage' => $cgstPercentage,
				'sgst_percentage' => $sgstPercentage,
				'discount' => $discount,
				'total' => $totalAmount,
				'amount_paid' => $advancePayment,
				'due_amount' => $dueAmount,
				'payment_status' => $paymentStatus,
				'buyer_logo' => $buyerLogoPath,
				'notes' => $validated['notes'] ?? null,
				'created_by' => Auth::id()
			]);

			$invoice->update(['invoice_number' => 'INV-' . str_pad($invoice->id, 6, '0', STR_PAD_LEFT)]);

			if (!empty($serviceRows)) {
				$invoice->serviceItems()->createMany($serviceRows);
			}

			if (!empty($productRows)) {
				$invoice->productItems()->createMany($productRows);
			}

			// Create advance payment record if any
			if ($advancePayment > 0) {
				$payment = Payment::create([
					'payment_number' => 'TEMP-' . uniqid(),
					'invoice_id' => $invoice->id,
					'payment_date' => $validated['invoice_date'],
					'amount' => $advancePayment,
					'payment_method' => $validated['payment_method'] ?? 'cash',
					'notes' => 'Advance payment',
					'created_by' => Auth::id()
				]);

				$payment->update(['payment_number' => 'PAY-' . str_pad($payment->id, 6, '0', STR_PAD_LEFT)]);
			}

			foreach ($productRows as $item) {
				$stock = $stocks->get((int) $item['stock_id']);
				if (!$stock) {
					continue;
				}

				$stock->updateQuantity(-1 * (float) $item['quantity']);
				StockMovement::create([
					'stock_id' => $stock->id,
					'movement_type' => 'out',
					'quantity' => $item['quantity'],
					'unit_cost' => $stock->unit_cost,
					'total_cost' => $stock->unit_cost * $item['quantity'],
					'reference_type' => 'invoice',
					'reference_id' => $invoice->id,
					'notes' => 'Invoice ' . $invoice->invoice_number . ' product sale',
					'created_by' => Auth::id()
				]);
			}

			foreach ($serviceRows as $item) {
				$service = $services->get((int) $item['service_id']);
				if (!$service) {
					continue;
				}

				foreach ($service->consumables as $consumable) {
					$stock = $stocks->get($consumable->id);
					if (!$stock) {
						continue;
					}

					$deductQty = (float) $item['quantity'] * (float) $consumable->pivot->quantity;
					$stock->updateQuantity(-1 * $deductQty);

					StockMovement::create([
						'stock_id' => $stock->id,
						'movement_type' => 'out',
						'quantity' => $deductQty,
						'unit_cost' => $stock->unit_cost,
						'total_cost' => $stock->unit_cost * $deductQty,
						'reference_type' => 'invoice',
						'reference_id' => $invoice->id,
						'notes' => 'Invoice ' . $invoice->invoice_number . ' service consumption: ' . $service->name,
						'created_by' => Auth::id()
					]);
				}
			}

			DB::commit();

			return redirect()->route('billing.show', $invoice->id)
				->with('success', 'Invoice created successfully.');
		} catch (\Exception $e) {
			DB::rollBack();
			Log::error('Failed to create invoice:', [
				'error' => $e->getMessage(),
				'trace' => $e->getTraceAsString()
			]);

			return back()->withErrors(['error' => 'Failed to create invoice: ' . $e->getMessage()]);
		}
	}

	public function show(Invoice $billing)
	{
		$billing->load(['customer', 'serviceItems.service', 'productItems.stock', 'creator', 'payments.creator']);

		return Inertia::render('Billing/Show', [
			'invoice' => $billing
		]);
	}

	public function edit(Invoice $billing)
	{
		$billing->load(['customer', 'serviceItems.service', 'productItems.stock']);
		$services = Service::select('id', 'name', 'final_price')->where('is_active', true)->orderBy('name')->get();
		$products = Stock::select('id', 'item_name', 'unit', 'selling_price', 'unit_cost', 'quantity_on_hand')
			->orderBy('item_name')
			->get();

		return Inertia::render('Billing/Edit', [
			'invoice' => $billing,
			'services' => $services,
			'products' => $products
		]);
	}

	public function update(Request $request, Invoice $billing)
	{
		$requestData = $request->all();
		if (isset($requestData['service_items']) && is_string($requestData['service_items'])) {
			$requestData['service_items'] = json_decode($requestData['service_items'], true) ?? [];
		}
		if (isset($requestData['product_items']) && is_string($requestData['product_items'])) {
			$requestData['product_items'] = json_decode($requestData['product_items'], true) ?? [];
		}
		$request->merge($requestData);

		$buyerLogoPath = $billing->buyer_logo;
		if ($request->hasFile('buyer_logo')) {
			$buyerLogoPath = $request->file('buyer_logo')->store('invoice-logos', 'public');
		}

		$validated = $request->validate([
			'invoice_date' => 'required|date',
			'cgst_percentage' => 'nullable|numeric|min:0|max:100',
			'sgst_percentage' => 'nullable|numeric|min:0|max:100',
			'gst_percentage' => 'nullable|numeric|min:0|max:100',
			'discount' => 'nullable|numeric|min:0',
			'buyer_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
			'notes' => 'nullable|string|max:1000',
			'service_items' => 'nullable|array',
			'service_items.*.service_id' => 'required_with:service_items|exists:services,id',
			'service_items.*.quantity' => 'required_with:service_items|numeric|min:0.01',
			'service_items.*.unit_price' => 'required_with:service_items|numeric|min:0',
			'product_items' => 'nullable|array',
			'product_items.*.stock_id' => 'required_with:product_items|exists:stocks,id',
			'product_items.*.quantity' => 'required_with:product_items|numeric|min:0.01',
			'product_items.*.unit_price' => 'required_with:product_items|numeric|min:0'
		]);

		$serviceItems = $validated['service_items'] ?? [];
		$productItems = $validated['product_items'] ?? [];

		if (empty($productItems)) {
			return back()->withErrors(['items' => 'Please add at least one product item.']);
		}

		$serviceIds = collect($serviceItems)->pluck('service_id')->unique()->filter()->values();
		$services = Service::with('consumables')->whereIn('id', $serviceIds)->get()->keyBy('id');

		$billing->load(['serviceItems.service.consumables', 'productItems.stock']);
		$oldRequiredByStock = [];
		foreach ($billing->productItems as $item) {
			$stockId = (int) $item->stock_id;
			$quantity = (float) $item->quantity;
			if ($stockId && $quantity > 0) {
				$oldRequiredByStock[$stockId] = ($oldRequiredByStock[$stockId] ?? 0) + $quantity;
			}
		}

		foreach ($billing->serviceItems as $item) {
			$service = $item->service;
			$quantity = (float) $item->quantity;
			if (!$service || $quantity <= 0) {
				continue;
			}

			foreach ($service->consumables as $consumable) {
				$stockId = $consumable->id;
				$requiredQty = $quantity * (float) $consumable->pivot->quantity;
				$oldRequiredByStock[$stockId] = ($oldRequiredByStock[$stockId] ?? 0) + $requiredQty;
			}
		}

		$newRequiredByStock = [];
		foreach ($productItems as $item) {
			$stockId = (int) $item['stock_id'];
			$quantity = (float) $item['quantity'];
			if ($stockId && $quantity > 0) {
				$newRequiredByStock[$stockId] = ($newRequiredByStock[$stockId] ?? 0) + $quantity;
			}
		}

		foreach ($serviceItems as $item) {
			$serviceId = (int) $item['service_id'];
			$quantity = (float) $item['quantity'];
			$service = $services->get($serviceId);

			if (!$service || $quantity <= 0) {
				continue;
			}

			foreach ($service->consumables as $consumable) {
				$stockId = $consumable->id;
				$requiredQty = $quantity * (float) $consumable->pivot->quantity;
				$newRequiredByStock[$stockId] = ($newRequiredByStock[$stockId] ?? 0) + $requiredQty;
			}
		}

		$stockIds = array_values(array_unique(array_merge(array_keys($oldRequiredByStock), array_keys($newRequiredByStock))));
		$stocks = Stock::whereIn('id', $stockIds)->get()->keyBy('id');
		$insufficient = [];
		foreach ($stockIds as $stockId) {
			$oldQty = $oldRequiredByStock[$stockId] ?? 0;
			$newQty = $newRequiredByStock[$stockId] ?? 0;
			$delta = $newQty - $oldQty;
			if ($delta > 0) {
				$stock = $stocks->get($stockId);
				if (!$stock || $stock->quantity_on_hand < $delta) {
					$insufficient[] = $stock ? $stock->item_name : "Stock #{$stockId}";
				}
			}
		}

		if (!empty($insufficient)) {
			return back()->withErrors([
				'stock' => 'Insufficient stock for: ' . implode(', ', $insufficient)
			]);
		}

		DB::beginTransaction();

		try {
			$serviceRows = [];
			$productRows = [];
			$subtotal = 0;

			foreach ($serviceItems as $item) {
				$quantity = (float) $item['quantity'];
				$unitPrice = (float) $item['unit_price'];
				$total = $quantity * $unitPrice;
				$subtotal += $total;

				$serviceRows[] = [
					'service_id' => $item['service_id'],
					'quantity' => $quantity,
					'unit_price' => $unitPrice,
					'total' => $total
				];
			}

			foreach ($productItems as $item) {
				$quantity = (float) $item['quantity'];
				$unitPrice = (float) $item['unit_price'];
				$total = $quantity * $unitPrice;
				$subtotal += $total;

				$productRows[] = [
					'stock_id' => $item['stock_id'],
					'quantity' => $quantity,
					'unit_price' => $unitPrice,
					'total' => $total
				];
			}

			$cgstPercentage = (float) ($validated['cgst_percentage'] ?? 0);
			$sgstPercentage = (float) ($validated['sgst_percentage'] ?? 0);
			$gstPercentage = $cgstPercentage + $sgstPercentage;
			$gstAmount = ($subtotal * $gstPercentage) / 100;
			$discount = (float) ($validated['discount'] ?? 0);
			$totalAmount = $subtotal + $gstAmount - $discount;

			$billing->update([
				'invoice_date' => $validated['invoice_date'],
				'subtotal' => $subtotal,
				'gst_percentage' => $gstPercentage,
				'cgst_percentage' => $cgstPercentage,
				'sgst_percentage' => $sgstPercentage,
				'discount' => $discount,
				'total' => $totalAmount,
				'buyer_logo' => $buyerLogoPath,
				'notes' => $validated['notes'] ?? null,
				'updated_by' => Auth::id()
			]);

			$billing->updatePaymentStatus();

			$billing->serviceItems()->delete();
			$billing->productItems()->delete();

			if (!empty($serviceRows)) {
				$billing->serviceItems()->createMany($serviceRows);
			}

			if (!empty($productRows)) {
				$billing->productItems()->createMany($productRows);
			}

			foreach ($stockIds as $stockId) {
				$oldQty = $oldRequiredByStock[$stockId] ?? 0;
				$newQty = $newRequiredByStock[$stockId] ?? 0;
				$delta = $newQty - $oldQty;

				if (abs($delta) < 0.00001) {
					continue;
				}

				$stock = $stocks->get($stockId);
				if (!$stock) {
					continue;
				}

				$movementType = $delta > 0 ? 'out' : 'in';
				$movementQty = abs($delta);
				$stock->updateQuantity(-1 * $delta);

				StockMovement::create([
					'stock_id' => $stock->id,
					'movement_type' => $movementType,
					'quantity' => $movementQty,
					'unit_cost' => $stock->unit_cost,
					'total_cost' => $stock->unit_cost * $movementQty,
					'reference_type' => 'invoice',
					'reference_id' => $billing->id,
					'notes' => 'Invoice ' . $billing->invoice_number . ' updated adjustment',
					'created_by' => Auth::id()
				]);
			}

			DB::commit();

			return redirect()->route('billing.show', $billing->id)
				->with('success', 'Invoice updated successfully.');
		} catch (\Exception $e) {
			DB::rollBack();
			Log::error('Failed to update invoice:', [
				'error' => $e->getMessage(),
				'trace' => $e->getTraceAsString()
			]);

			return back()->withErrors(['error' => 'Failed to update invoice: ' . $e->getMessage()]);
		}
	}

	public function download(Invoice $billing)
	{
		$billing->load(['customer', 'serviceItems.service', 'productItems.stock', 'creator', 'payments']);

		$invoiceDiscountPercent = 0;
		if ((float) ($billing->subtotal ?? 0) > 0 && (float) ($billing->discount ?? 0) > 0) {
			$invoiceDiscountPercent = round(((float) ($billing->discount ?? 0) / (float) ($billing->subtotal ?? 0)) * 100, 2);
		}

		$lineItems = array_merge(
			($billing->serviceItems ?? collect())->map(function ($item) {
				return [
					'type' => 'Service',
					'name' => $item->service->name ?? 'Service',
					'description' => $item->service->description ?? '-',
					'unit' => '-',
					'hsn_code' => $item->service->hsn_code ?? '-',
					'quantity' => $item->quantity,
					'unit_price' => $item->unit_price,
					'discount' => $item->discount ?? null,
					'total' => $item->total
				];
			})->toArray(),
			($billing->productItems ?? collect())->map(function ($item) {
				return [
					'type' => 'Product',
					'name' => $item->stock->item_name ?? 'Product',
					'description' => $item->stock->item_description ?? '-',
					'unit' => $item->stock->unit ?? '-',
					'hsn_code' => $item->stock->hsn_code ?? '-',
					'quantity' => $item->quantity,
					'unit_price' => $item->unit_price,
					'discount' => $item->discount ?? 0,
					'total' => $item->total
				];
			})->toArray()
		);

		$cgstPercentage = (float) ($billing->cgst_percentage ?? 0);
		$sgstPercentage = (float) ($billing->sgst_percentage ?? 0);
		$gstPercentage = $cgstPercentage + $sgstPercentage;
		$gstAmount = round((float) ($billing->subtotal ?? 0) * $gstPercentage / 100, 2);
		$cgst = round((float) ($billing->subtotal ?? 0) * $cgstPercentage / 100, 2);
		$sgst = round((float) ($billing->subtotal ?? 0) * $sgstPercentage / 100, 2);
		$deliveryCharges = $billing->delivery_charges ?? 0;
		$grossTotal = round(($billing->subtotal ?? 0) + $deliveryCharges, 2);
		$netValue = round(($billing->total ?? 0) + $deliveryCharges, 2);
		$amountInWords = $this->convertAmountToWords($netValue);

		$pdf = Pdf::loadView('billing.invoice-pdf', [
			'invoice' => $billing,
			'lineItems' => $lineItems,
			'gst_amount' => $gstAmount,
			'cgst' => $cgst,
			'sgst' => $sgst,
			'delivery_charges' => $deliveryCharges,
			'gross_total' => $grossTotal,
			'net_value' => $netValue,
			'amount_in_words' => $amountInWords,
			'invoice_discount_percent' => $invoiceDiscountPercent,
			'buyer_logo' => $billing->buyer_logo ?? null
		]);

		$filename = 'invoice-' . $billing->invoice_number . '.pdf';
		return $pdf->download($filename);
	}

	private function convertAmountToWords(float $amount): string
	{
		try {
			$formatter = new \NumberFormatter('en_IN', \NumberFormatter::SPELLOUT);
			$whole = (int) floor($amount);
			$fraction = (int) round(($amount - $whole) * 100);

			$words = ucfirst($formatter->format($whole)) . ' Rupees';
			if ($fraction > 0) {
				$words .= ' and ' . ucfirst($formatter->format($fraction)) . ' Paise';
			}
			$words .= ' only.';

			return $words;
		} catch (\Throwable $e) {
			return number_format($amount, 2) . ' Rupees only';
		}
	}

	/**
	 * Add a payment to an invoice
	 */
	public function addPayment(Request $request, Invoice $billing)
	{
		$validated = $request->validate([
			'amount' => 'required|numeric|min:0.01',
			'payment_date' => 'required|date',
			'payment_method' => 'required|string|in:cash,card,upi,bank_transfer,cheque,other',
			'transaction_reference' => 'nullable|string|max:255',
			'notes' => 'nullable|string|max:1000'
		]);

		if ($validated['amount'] > $billing->due_amount) {
			return back()->withErrors(['amount' => 'Payment amount cannot exceed due amount of ₹' . number_format($billing->due_amount, 2)]);
		}

		DB::beginTransaction();

		try {
			$lastPayment = Payment::latest('id')->first();
			$paymentNumber = 'PAY-' . str_pad(($lastPayment ? $lastPayment->id + 1 : 1), 6, '0', STR_PAD_LEFT);

			$payment = Payment::create([
				'payment_number' => $paymentNumber,
				'invoice_id' => $billing->id,
				'payment_date' => $validated['payment_date'],
				'amount' => $validated['amount'],
				'payment_method' => $validated['payment_method'],
				'transaction_reference' => $validated['transaction_reference'] ?? null,
				'notes' => $validated['notes'] ?? null,
				'created_by' => Auth::id()
			]);

			$billing->amount_paid += $validated['amount'];
			$billing->updatePaymentStatus();

			DB::commit();

			return back()->with('success', 'Payment of ₹' . number_format($validated['amount'], 2) . ' added successfully.');
		} catch (\Exception $e) {
			DB::rollBack();
			Log::error('Failed to add payment:', [
				'error' => $e->getMessage(),
				'trace' => $e->getTraceAsString()
			]);

			return back()->withErrors(['error' => 'Failed to add payment. Please try again.']);
		}
	}

	public function downloadPaymentReceipt(Payment $payment)
	{
		$payment->load(['invoice.customer', 'creator']);

		$pdf = Pdf::loadView('billing.payment-receipt-pdf', [
			'payment' => $payment,
			'invoice' => $payment->invoice
		]);

		$filename = 'receipt-' . $payment->payment_number . '.pdf';
		return $pdf->download($filename);
	}
}
