<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
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
        <h1>Purchase Bills Report</h1>
        <p>Generated on: {{ date('F j, Y \a\t g:i A') }}</p>
        @if($search)
            <p>Search Filter: "{{ $search }}"</p>
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
                    <td>{{ $bill->reference ?? '' }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" style="text-align: center; font-style: italic; color: #666;">
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
