<!DOCTYPE html>
<html>
<head>
    <meta charse        th {
            background-color: #a47db5;
            color: white;
            font-weight: bold;
        }tf-8">
    <title>Stock Management Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            font-size: 12px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #a47db5;
            padding-bottom: 20px;
        }
        .logo {
            margin-bottom: 15px;
        }
        .logo img {
            max-height: 80px;
            max-width: 250px;
        }
        .header h1 {
            color: #a47db5;
            margin: 10px 0 5px 0;
            font-size: 24px;
            font-weight: bold;
        }
        .header .subtitle {
            color: #666;
            margin: 0;
            font-size: 14px;
        }
        .header p {
            color: #666;
            margin: 5px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f5f5f5;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
        }
        .low-stock {
            background-color: #fee2e2 !important;
            color: #991b1b;
        }
        .status-badge {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: bold;
        }
        .status-in-stock {
            background-color: #d1fae5;
            color: #065f46;
        }
        .status-low-stock {
            background-color: #fee2e2;
            color: #991b1b;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">
            <img src="{{ public_path('images/logo.png') }}" alt="The Skin Studio">
        </div>
        <h1>The Skin Studio</h1>
        <p class="subtitle">Stock Management Report</p>
        <p>Generated on: {{ date('F j, Y \a\t g:i A') }}</p>
        @if($search)
            <p>Search Filter: "{{ $search }}"</p>
        @endif
        @if($lowStock)
            <p>Filter: Low Stock Items Only</p>
        @endif
    </div>

    <table>
        <thead>
            <tr>
                <th>Item Name</th>
                <th>Description</th>
                <th>Unit</th>
                <th class="text-right">Quantity</th>
                <th class="text-right">Unit Cost</th>
                <th class="text-right">Total Value</th>
                <th class="text-center">Status</th>
                <th class="text-center">Last Updated</th>
            </tr>
        </thead>
        <tbody>
            @forelse($stocks as $stock)
                <tr class="{{ $stock->quantity_on_hand <= $stock->reorder_level ? 'low-stock' : '' }}">
                    <td>{{ $stock->item_name }}</td>
                    <td>{{ $stock->item_description ?? 'N/A' }}</td>
                    <td>{{ strtoupper($stock->unit) }}</td>
                    <td class="text-right">{{ number_format($stock->quantity_on_hand, 2) }}</td>
                    <td class="text-right">₹{{ number_format($stock->unit_cost ?? 0, 2) }}</td>
                    <td class="text-right">₹{{ number_format($stock->total_value ?? 0, 2) }}</td>
                    <td class="text-center">
                        <span class="status-badge {{ $stock->quantity_on_hand <= $stock->reorder_level ? 'status-low-stock' : 'status-in-stock' }}">
                            {{ $stock->quantity_on_hand <= $stock->reorder_level ? 'Low Stock' : 'In Stock' }}
                        </span>
                    </td>
                    <td class="text-center">{{ $stock->updated_at->format('M j, Y') }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="8" style="text-align: center; font-style: italic; color: #666;">
                        No stock items found
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>Total Records: {{ count($stocks) }}</p>
        @php
            $totalValue = $stocks->sum('total_value');
            $lowStockCount = $stocks->filter(function($stock) {
                return $stock->quantity_on_hand <= $stock->reorder_level;
            })->count();
        @endphp
        <p>Total Inventory Value: ₹{{ number_format($totalValue, 2) }}</p>
        <p>Low Stock Items: {{ $lowStockCount }}</p>
    </div>
</body>
</html>
