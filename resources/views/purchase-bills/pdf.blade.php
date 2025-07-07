<!DOCTYPE html>
<html>
<head>
    <meta charse        th {
            background-color: #a47db5;
            color: white;
            font-weight: bold;
        }tf-8">
    <title>Purchase Bills Report</title>
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
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 10px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">
            <img src="{{ public_path('images/logo.png') }}" alt="The Skin Studio">
        </div>
        <h1>The Skin Studio</h1>
        <p class="subtitle">Purchase Bills Report</p>
        <p>Generated on: {{ date('F j, Y \a\t g:i A') }}</p>
        @if(!empty($filters))
            <div style="margin-top: 10px; font-size: 11px; color: #666;">
                <strong>Applied Filters:</strong>
                @if(!empty($filters['search']))
                    Search: "{{ $filters['search'] }}" |
                @endif
                @if(!empty($filters['vendor_id']))
                    Vendor ID: {{ $filters['vendor_id'] }} |
                @endif
                @if(!empty($filters['status']))
                    Status: {{ ucfirst($filters['status']) }} |
                @endif
                @if(!empty($filters['po_date_from']) || !empty($filters['po_date_to']))
                    PO Date: {{ $filters['po_date_from'] ?? 'Start' }} to {{ $filters['po_date_to'] ?? 'End' }} |
                @endif
                @if(!empty($filters['expected_delivery_from']) || !empty($filters['expected_delivery_to']))
                    Expected Delivery: {{ $filters['expected_delivery_from'] ?? 'Start' }} to {{ $filters['expected_delivery_to'] ?? 'End' }} |
                @endif
                @if(!empty($filters['min_amount']) || !empty($filters['max_amount']))
                    Amount: ${{ $filters['min_amount'] ?? '0' }} to ${{ $filters['max_amount'] ?? '∞' }}
                @endif
            </div>
        @endif
    </div>

    <table>
        <thead>
            <tr>
                <th>PO Number</th>
                <th>Vendor</th>
                <th>PO Date</th>
                <th>Expected Delivery</th>
                <th class="text-right">Total Amount</th>
                <th>Status</th>
                <th>Reference</th>
            </tr>
        </thead>
        <tbody>
            @forelse($purchaseBills as $bill)
                <tr>
                    <td>{{ $bill->po_number }}</td>
                    <td>{{ $bill->vendor->name ?? 'N/A' }}</td>
                    <td>{{ $bill->po_date ? date('M j, Y', strtotime($bill->po_date)) : '' }}</td>
                    <td>{{ $bill->expected_delivery ? date('M j, Y', strtotime($bill->expected_delivery)) : '' }}</td>
                    <td class="text-right">${{ number_format($bill->total ?? 0, 2) }}</td>
                    <td>{{ ucfirst($bill->status ?? 'draft') }}</td>
                    <td>{{ $bill->reference ?? '' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="7" style="text-align: center; font-style: italic; color: #666;">
                        No purchase bills found
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>Total Records: {{ count($purchaseBills) }}</p>
    </div>
</body>
</html>
