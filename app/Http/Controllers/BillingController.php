<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Invoice;
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
		$query = Invoice::with('customer')->orderBy('created_at', 'desc');

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
			'discount' => 'nullable|numeric|min:0',
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

		if (empty($serviceItems) && empty($productItems)) {
			return back()->withErrors(['items' => 'Please add at least one service or product item.']);
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
			$lastInvoice = Invoice::latest('id')->first();
			$invoiceNumber = 'INV-' . str_pad(($lastInvoice ? $lastInvoice->id + 1 : 1), 6, '0', STR_PAD_LEFT);

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

			$discount = (float) ($validated['discount'] ?? 0);
			$totalAmount = $subtotal - $discount;

			$invoice = Invoice::create([
				'invoice_number' => $invoiceNumber,
				'invoice_date' => $validated['invoice_date'],
				'customer_id' => $validated['customer_id'],
				'subtotal' => $subtotal,
				'discount' => $discount,
				'total' => $totalAmount,
				'notes' => $validated['notes'] ?? null,
				'created_by' => Auth::id()
			]);

			if (!empty($serviceRows)) {
				$invoice->serviceItems()->createMany($serviceRows);
			}

			if (!empty($productRows)) {
				$invoice->productItems()->createMany($productRows);
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
					'notes' => 'Invoice ' . $invoiceNumber . ' product sale',
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
						'notes' => 'Invoice ' . $invoiceNumber . ' service consumption: ' . $service->name,
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

			return back()->withErrors(['error' => 'Failed to create invoice. Please try again.']);
		}
	}

	public function show(Invoice $billing)
	{
		$billing->load(['customer', 'serviceItems.service', 'productItems.stock', 'creator']);

		return Inertia::render('Billing/Show', [
			'invoice' => $billing
		]);
	}

	public function download(Invoice $billing)
	{
		$billing->load(['customer', 'serviceItems.service', 'productItems.stock', 'creator']);

		$lineItems = array_merge(
			($billing->serviceItems ?? collect())->map(function ($item) {
				return [
					'type' => 'Service',
					'name' => $item->service->name ?? 'Service',
					'description' => $item->service->description ?? '-',
					'measurement' => '-',
					'quantity' => $item->quantity,
					'unit_price' => $item->unit_price,
					'total' => $item->total
				];
			})->toArray(),
			($billing->productItems ?? collect())->map(function ($item) {
				return [
					'type' => 'Product',
					'name' => $item->stock->item_name ?? 'Product',
					'description' => $item->stock->item_description ?? '-',
					'measurement' => $item->stock->unit ?? '-',
					'quantity' => $item->quantity,
					'unit_price' => $item->unit_price,
					'total' => $item->total
				];
			})->toArray()
		);

		$pdf = Pdf::loadView('billing.invoice-pdf', [
			'invoice' => $billing,
			'lineItems' => $lineItems
		]);

		$filename = 'invoice-' . $billing->invoice_number . '.pdf';
		return $pdf->download($filename);
	}
}
