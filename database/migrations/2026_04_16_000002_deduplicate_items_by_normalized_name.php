<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $items = DB::table('items')
            ->orderBy('id')
            ->get(['id', 'name']);

        $groupedItems = [];

        foreach ($items as $item) {
            $normalizedName = $this->normalizeName($item->name);
            $groupedItems[$normalizedName][] = (int) $item->id;
        }

        foreach ($groupedItems as $normalizedName => $itemIds) {
            if (count($itemIds) < 2) {
                continue;
            }

            $keeperId = array_shift($itemIds);

            DB::table('stocks')
                ->whereIn('item_id', $itemIds)
                ->update(['item_id' => $keeperId]);

            DB::table('purchase_bill_items')
                ->whereIn('item_id', $itemIds)
                ->update(['item_id' => $keeperId]);

            DB::table('items')
                ->whereIn('id', $itemIds)
                ->delete();

            DB::table('items')
                ->where('id', $keeperId)
                ->update(['name' => $normalizedName]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No safe rollback for deduplicated data.
    }

    private function normalizeName($name): string
    {
        $normalized = str_replace("\xc2\xa0", ' ', (string) $name);
        $normalized = preg_replace('/\s+/u', ' ', $normalized) ?? $normalized;

        return trim($normalized);
    }
};
