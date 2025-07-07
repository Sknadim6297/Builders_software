<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Stock Movement History - {{ $stock->item_name }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            font-size: 12px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #333;
            margin: 0;
            font-size: 20px;
        }
        .header p {
            color: #666;
            margin: 5px 0;
        }
        .stock-info {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border: 1px solid #dee2e6;
        }
        .stock-info h2 {
            margin: 0 0 10px 0;
            color: #333;
            font-size: 16px;
        }
        .stock-details {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
        }
        .stock-detail {
            margin: 5px 0;
        }
        .stock-detail strong {
            color: #495057;
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
        .movement-in {
            background-color: #d1fae5 !important;
            color: #065f46;
        }
        .movement-out {
            background-color: #fee2e2 !important;
            color: #991b1b;
        }
        .movement-adjustment {
            background-color: #fef3c7 !important;
            color: #92400e;
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
        <h1>Stock Movement History</h1>
        <p>{{ $stock->item_name }}</p>
        <p>Generated on: {{ date('F j, Y \a\t g:i A') }}</p>
    </div>

    <div class="stock-info">
        <h2>Current Stock Information</h2>
        <div class="stock-details">
            <div class="stock-detail">
                <strong>Item Name:</strong> {{ $stock->item_name }}
            </div>
            <div class="stock-detail">
                <strong>Description:</strong> {{ $stock->item_description ?? 'N/A' }}
            </div>
            <div class="stock-detail">
                <strong>Unit:</strong> {{ strtoupper($stock->unit) }}
            </div>
            <div class="stock-detail">
                <strong>Current Quantity:</strong> {{ number_format($stock->quantity_on_hand, 2) }}
            </div>
            <div class="stock-detail">
                <strong>Unit Cost:</strong> ₹{{ number_format($stock->unit_cost ?? 0, 2) }}
            </div>
            <div class="stock-detail">
                <strong>Total Value:</strong> ₹{{ number_format($stock->total_value ?? 0, 2) }}
            </div>
            <div class="stock-detail">
                <strong>Reorder Level:</strong> {{ number_format($stock->reorder_level, 2) }}
            </div>
            <div class="stock-detail">
                <strong>Status:</strong> 
                <span class="status-badge {{ $stock->quantity_on_hand <= $stock->reorder_level ? 'status-low-stock' : 'status-in-stock' }}">
                    {{ $stock->quantity_on_hand <= $stock->reorder_level ? 'Low Stock' : 'In Stock' }}
                </span>
            </div>
        </div>
    </div>

    <h3>Movement History</h3>
    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Type</th>
                <th class="text-right">Quantity</th>
                <th class="text-right">Unit Cost</th>
                <th>Source</th>
                <th>Reference</th>
                <th>Notes</th>
                <th>Updated By</th>
            </tr>
        </thead>
        <tbody>
            @forelse($stock->stockMovements as $movement)
                <tr class="{{ 
                    $movement->movement_type === 'in' ? 'movement-in' : 
                    ($movement->movement_type === 'out' ? 'movement-out' : 'movement-adjustment') 
                }}">
                    <td>{{ $movement->created_at->format('M j, Y H:i') }}</td>
                    <td>{{ ucfirst($movement->movement_type) }}</td>
                    <td class="text-right">{{ number_format($movement->quantity, 2) }}</td>
                    <td class="text-right">₹{{ number_format($movement->unit_cost ?? 0, 2) }}</td>
                    <td>{{ $movement->source ?? 'N/A' }}</td>
                    <td>{{ $movement->reference ?? 'N/A' }}</td>
                    <td>{{ $movement->notes ?? 'N/A' }}</td>
                    <td>{{ $movement->createdBy->name ?? 'System' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="8" style="text-align: center; font-style: italic; color: #666;">
                        No movement history found
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>Total Movements: {{ count($stock->stockMovements) }}</p>
        @php
            $totalIn = $stock->stockMovements->where('movement_type', 'in')->sum('quantity');
            $totalOut = $stock->stockMovements->where('movement_type', 'out')->sum('quantity');
        @endphp
        <p>Total Received: {{ number_format($totalIn, 2) }} | Total Dispatched: {{ number_format($totalOut, 2) }}</p>
    </div>
</body>
</html>
