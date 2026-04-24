<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ItemController extends Controller
{
    /**
     * Display a listing of items.
     */
    public function index(Request $request)
    {
        $query = Item::with('category:id,name,discount_percentage')->orderBy('created_at', 'desc');

        // Search functionality
        if ($request->filled('search')) {
            $search = trim((string) $request->search);
            $searchTerms = $this->extractSearchTerms($search);

            $query->where(function($q) use ($search, $searchTerms) {
                $q->where('item_code', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%")
                  ->orWhere('hsn_code', 'like', "%{$search}%")
                  ->orWhere('unit_type', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('category', function ($categoryQuery) use ($search) {
                      $categoryQuery->where('name', 'like', "%{$search}%");
                  });
                if (! empty($searchTerms)) {
                    $q->orWhere(function ($termQuery) use ($searchTerms) {
                        foreach ($searchTerms as $term) {
                            $likeTerm = "%{$term}%";

                            $termQuery->where(function ($singleTermQuery) use ($likeTerm) {
                                $singleTermQuery->whereRaw('LOWER(name) like ?', [$likeTerm])
                                    ->orWhereRaw('LOWER(item_code) like ?', [$likeTerm])
                                    ->orWhereRaw('LOWER(hsn_code) like ?', [$likeTerm])
                                    ->orWhereRaw('LOWER(unit_type) like ?', [$likeTerm])
                                    ->orWhereRaw('LOWER(description) like ?', [$likeTerm])
                                    ->orWhereHas('category', function ($categoryQuery) use ($likeTerm) {
                                        $categoryQuery->whereRaw('LOWER(name) like ?', [$likeTerm]);
                                    });
                            });
                        }
                    });
                }
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('is_active', $request->status === 'active');
        }

        $items = $query->paginate(15)->withQueryString();

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
        return Inertia::render('Items/Create', [
            'categories' => Category::where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'discount_percentage']),
        ]);
    }

    /**
     * Store a newly created item.
     */
    public function store(Request $request)
    {
        $request->merge([
            'name' => $this->normalizeItemName($request->input('name')),
        ]);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) {
                    $normalizedName = $this->normalizeItemName($value);

                    $alreadyExists = Item::query()
                        ->get(['id', 'name'])
                        ->contains(function ($item) use ($normalizedName) {
                            return $this->normalizeItemName($item->name) === $normalizedName;
                        });

                    if ($alreadyExists) {
                        $fail('This item already exists. Please use a different item name.');
                    }
                },
                Rule::unique('items', 'name'),
            ],
            'category_id' => 'required|exists:categories,id',
            'hsn_code' => 'nullable|string|max:32',
            'description' => 'nullable|string|max:1000',
            'unit_type' => 'required|string|max:50',
            'default_unit_price' => 'nullable|numeric|min:0',
            'default_discount_percentage' => 'nullable|numeric|min:0|max:100',
            'gst_percentage' => 'nullable|numeric|min:0|max:100'
        ], [
            'name.unique' => 'This item already exists. Please use a different item name.',
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
            'item' => $item->load('creator', 'updater', 'category')
        ]);
    }

    /**
     * Show the form for editing the item.
     */
    public function edit(Item $item)
    {
        return Inertia::render('Items/Edit', [
            'item' => $item,
            'categories' => Category::where('is_active', true)
                ->orWhere('id', $item->category_id)
                ->orderBy('name')
                ->get(['id', 'name', 'discount_percentage']),
        ]);
    }

    /**
     * Update the specified item.
     */
    public function update(Request $request, Item $item)
    {
        $request->merge([
            'name' => $this->normalizeItemName($request->input('name')),
        ]);

        $validated = $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) use ($item) {
                    $normalizedName = $this->normalizeItemName($value);

                    $alreadyExists = Item::query()
                        ->where('id', '!=', $item->id)
                        ->get(['id', 'name'])
                        ->contains(function ($existingItem) use ($normalizedName) {
                            return $this->normalizeItemName($existingItem->name) === $normalizedName;
                        });

                    if ($alreadyExists) {
                        $fail('This item already exists. Please use a different item name.');
                    }
                },
                Rule::unique('items', 'name')->ignore($item->id),
            ],
            'category_id' => 'required|exists:categories,id',
            'hsn_code' => 'nullable|string|max:32',
            'description' => 'nullable|string|max:1000',
            'unit_type' => 'required|string|max:50',
            'default_unit_price' => 'nullable|numeric|min:0',
            'default_discount_percentage' => 'nullable|numeric|min:0|max:100',
            'gst_percentage' => 'nullable|numeric|min:0|max:100',
            'is_active' => 'boolean'
        ], [
            'name.unique' => 'This item already exists. Please use a different item name.',
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
            Item::active()
                ->with('category:id,name,discount_percentage')
                ->get(['id', 'item_code', 'name', 'category_id', 'hsn_code', 'unit_type', 'default_unit_price', 'default_discount_percentage', 'gst_percentage'])
        );
    }

    /**
     * Check if an item name already exists.
     */
    public function checkDuplicate(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'item_id' => 'nullable|integer|exists:items,id',
        ]);

        $itemName = $this->normalizeItemName($validated['name']);
        $ignoreItemId = $validated['item_id'] ?? null;

        $query = Item::query();

        if ($ignoreItemId) {
            $query->where('id', '!=', $ignoreItemId);
        }

        $existingItem = $query
            ->get(['id', 'item_code', 'name'])
            ->first(function ($item) use ($itemName) {
                return $this->normalizeItemName($item->name) === $itemName;
            });

        return response()->json([
            'exists' => (bool) $existingItem,
            'message' => $existingItem
                ? 'This item already exists. Please use a different item name.'
                : null,
            'item' => $existingItem,
        ]);
    }

    private function normalizeItemName($name): string
    {
        $normalized = str_replace("\xc2\xa0", ' ', (string) $name);
        $normalized = preg_replace('/\s+/u', ' ', $normalized) ?? $normalized;

        return trim($normalized);
    }

    private function extractSearchTerms(string $search): array
    {
        $normalized = mb_strtolower(str_replace("\xc2\xa0", ' ', $search));
        $normalized = preg_replace('/[^\pL\pN]+/u', ' ', $normalized) ?? $normalized;

        return collect(explode(' ', trim($normalized)))
            ->filter(fn ($term) => mb_strlen($term) >= 2)
            ->unique()
            ->values()
            ->all();
    }
}
