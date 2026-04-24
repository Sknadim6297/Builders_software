<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

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
            $normalizedName = mb_strtolower(trim((string) $item->name));
            $groupedItems[$normalizedName][] = (int) $item->id;
        }

        foreach ($groupedItems as $itemIds) {
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
        }

        if (! $this->hasIndex('items', 'items_name_unique')) {
            Schema::table('items', function (Blueprint $table) {
                $table->unique('name');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if ($this->hasIndex('items', 'items_name_unique')) {
            Schema::table('items', function (Blueprint $table) {
                $table->dropUnique('items_name_unique');
            });
        }
    }

    private function hasIndex(string $table, string $indexName): bool
    {
        return ! empty(DB::select(
            'SHOW INDEX FROM `' . $table . '` WHERE Key_name = ?',
            [$indexName]
        ));
    }
};