<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Daily Reports</title>
    <style>
        @page {
            margin: 18px 20px;
        }

        body {
            font-family: "DejaVu Sans", Arial, sans-serif;
            font-size: 10.5px;
            color: #111827;
            line-height: 1.45;
        }

        .header {
            border: 1px solid #d1d5db;
            border-radius: 10px;
            padding: 16px 18px;
            margin-bottom: 14px;
            background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #b91c1c 100%);
            color: #fff;
        }

        .header-row {
            width: 100%;
            border-collapse: collapse;
        }

        .header-row td {
            vertical-align: top;
        }

        .logo-wrap {
            width: 240px;
        }

        .logo-wrap img {
            display: block;
            max-width: 240px;
            max-height: 88px;
            object-fit: contain;
            background: transparent;
        }

        .brand-title {
            font-size: 20px;
            font-weight: 700;
            letter-spacing: 0.4px;
            margin-bottom: 4px;
        }

        .brand-subtitle {
            color: #dbeafe;
            font-size: 10px;
        }

        .meta-box {
            text-align: right;
            font-size: 10px;
        }

        .meta-pill {
            display: inline-block;
            padding: 4px 9px;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.16);
            margin-bottom: 6px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.4px;
        }

        .meta-line {
            margin-top: 2px;
            color: #eff6ff;
        }

        .section {
            margin-top: 14px;
        }

        .section-title {
            font-size: 12px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.35px;
        }

        .section-card {
            border: 1px solid #d1d5db;
            border-radius: 10px;
            overflow: hidden;
            background: #fff;
        }

        .metric-grid {
            width: 100%;
            border-collapse: separate;
            border-spacing: 8px 0;
            table-layout: fixed;
        }

        .metric {
            border-radius: 10px;
            padding: 12px 14px;
            color: #fff;
        }

        .metric.purchase {
            background: linear-gradient(135deg, #4f46e5, #6366f1);
        }

        .metric.sales {
            background: linear-gradient(135deg, #059669, #10b981);
        }

        .metric.due {
            background: linear-gradient(135deg, #b91c1c, #ef4444);
        }

        .metric.payments {
            background: linear-gradient(135deg, #2563eb, #3b82f6);
        }

        .metric-label {
            font-size: 10px;
            opacity: 0.92;
            text-transform: uppercase;
            letter-spacing: 0.35px;
        }

        .metric-value {
            font-size: 20px;
            font-weight: 700;
            margin-top: 4px;
        }

        .metric-note {
            font-size: 9px;
            margin-top: 3px;
            opacity: 0.92;
        }

        .detail-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }

        .detail-table th,
        .detail-table td {
            border-top: 1px solid #e5e7eb;
            padding: 6px 7px;
            vertical-align: top;
            word-wrap: break-word;
            overflow-wrap: anywhere;
        }

        .detail-table th {
            background: #f8fafc;
            color: #374151;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.25px;
            text-align: left;
        }

        .detail-table td {
            font-size: 9.5px;
        }

        .right {
            text-align: right;
        }

        .red {
            color: #b91c1c;
            font-weight: 700;
        }

        .muted {
            color: #6b7280;
        }

        .empty-row td {
            text-align: center;
            color: #6b7280;
            padding: 12px 8px;
        }

        .two-col {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        }

        .two-col td {
            width: 50%;
            vertical-align: top;
            padding: 0 0 0 0;
        }

        .spacer {
            height: 8px;
        }

        .footer {
            margin-top: 12px;
            text-align: center;
            color: #6b7280;
            font-size: 9px;
        }

        .section-badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 999px;
            background: #eff6ff;
            color: #1d4ed8;
            font-size: 9px;
            font-weight: 700;
            margin-left: 8px;
            vertical-align: middle;
        }

        .report-note {
            margin-top: 6px;
            color: #dbeafe;
            font-size: 9px;
        }
    </style>
</head>
<body>
@php
    $reportType = data_get($filters, 'report_type', 'all');
    $reportTypeLabels = [
        'all' => 'All Reports',
        'purchase' => 'Purchase Report',
        'sales' => 'Sales Report',
        'due' => 'Due Report',
        'payments' => 'Payment Report',
    ];
    $reportTypeLabel = $reportTypeLabels[$reportType] ?? 'All Reports';
    $periodFrom = data_get($report, 'period.from', 'All Time');
    $periodTo = data_get($report, 'period.to', 'All Time');
    $periodLabel = $periodFrom === 'All Time' && $periodTo === 'All Time'
        ? 'All Time'
        : $periodFrom . ' to ' . $periodTo;
    $showPurchase = in_array($reportType, ['all', 'purchase'], true);
    $showSales = in_array($reportType, ['all', 'sales'], true);
    $showDue = in_array($reportType, ['all', 'due'], true);
    $showPayments = in_array($reportType, ['all', 'payments'], true);
@endphp

    <div class="header">
        <table class="header-row">
            <tr>
                <td>
                    <div class="logo-wrap">
                        <img src="{{ $companyLogoForPdf }}" alt="Company Logo">
                    </div>
                </td>
                <td class="meta-box">
                    <div class="meta-pill">{{ $reportTypeLabel }}</div><br>
                    <div class="brand-title" style="margin-top: 8px;">Daily Reports</div>
                    <div class="brand-subtitle">Purchase, Sales, Due and payment method tracking</div>
                    <div class="meta-line"><strong>Period:</strong> {{ $periodLabel }}</div>
                    <div class="meta-line"><strong>Generated:</strong> {{ now()->format('Y-m-d h:i A') }}</div>
                    <div class="report-note">Same filters as the report view are applied to this PDF export.</div>
                </td>
            </tr>
        </table>
    </div>

    <table class="metric-grid">
        <tr>
            <td class="metric purchase">
                <div class="metric-label">Total Purchase</div>
                <div class="metric-value">₹ {{ number_format((float) data_get($report, 'purchase.total_amount', 0), 2) }}</div>
                <div class="metric-note">Bills: {{ data_get($report, 'purchase.count', 0) }}</div>
            </td>
            <td class="metric sales">
                <div class="metric-label">Total Sales</div>
                <div class="metric-value">₹ {{ number_format((float) data_get($report, 'sales.total_amount', 0), 2) }}</div>
                <div class="metric-note">Invoices: {{ data_get($report, 'sales.count', 0) }}</div>
            </td>
            <td class="metric due">
                <div class="metric-label">Outstanding Due</div>
                <div class="metric-value">₹ {{ number_format((float) data_get($report, 'due.total_outstanding', 0), 2) }}</div>
                <div class="metric-note">Due Invoices: {{ data_get($report, 'due.count', 0) }}</div>
            </td>
            <td class="metric payments">
                <div class="metric-label">Total Payments</div>
                <div class="metric-value">₹ {{ number_format((float) data_get($report, 'payments.total_amount', 0), 2) }}</div>
                <div class="metric-note">Payments: {{ data_get($report, 'payments.count', 0) }}</div>
            </td>
        </tr>
    </table>

    @if($showPurchase)
        <div class="section">
            <div class="section-title">Purchase Report <span class="section-badge">{{ data_get($report, 'purchase.count', 0) }} records</span></div>
            <div class="section-card">
                <table class="detail-table">
                    <thead>
                        <tr>
                            <th style="width: 18%;">PO No.</th>
                            <th style="width: 15%;">Date</th>
                            <th>Supplier</th>
                            <th style="width: 16%;" class="right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse(data_get($report, 'purchase.details', []) as $row)
                            <tr>
                                <td>{{ $row['po_number'] }}</td>
                                <td>{{ $row['po_date'] }}</td>
                                <td>{{ $row['supplier_name'] }}</td>
                                <td class="right">₹ {{ number_format((float) $row['amount'], 2) }}</td>
                            </tr>
                        @empty
                            <tr class="empty-row"><td colspan="4">No purchase records</td></tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    @endif

    @if($showSales)
        <div class="section">
            <div class="section-title">Sales Report <span class="section-badge">{{ data_get($report, 'sales.count', 0) }} records</span></div>
            <div class="section-card">
                <table class="detail-table">
                    <thead>
                        <tr>
                            <th style="width: 18%;">Invoice No.</th>
                            <th style="width: 15%;">Date</th>
                            <th>Customer</th>
                            <th style="width: 16%;" class="right">Amount</th>
                            <th style="width: 16%;" class="right red">Due</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse(data_get($report, 'sales.details', []) as $row)
                            <tr>
                                <td>{{ $row['invoice_number'] }}</td>
                                <td>{{ $row['invoice_date'] }}</td>
                                <td>{{ $row['customer_name'] }}</td>
                                <td class="right">₹ {{ number_format((float) $row['amount'], 2) }}</td>
                                <td class="right red">₹ {{ number_format((float) $row['due_amount'], 2) }}</td>
                            </tr>
                        @empty
                            <tr class="empty-row"><td colspan="5">No sales records</td></tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    @endif

    @if($showDue)
        <div class="section">
            <div class="section-title">Due Report <span class="section-badge">{{ data_get($report, 'due.count', 0) }} records</span></div>
            <div class="section-card">
                <table class="detail-table">
                    <thead>
                        <tr>
                            <th style="width: 16%;">Invoice No.</th>
                            <th style="width: 14%;">Date</th>
                            <th>Customer</th>
                            <th style="width: 14%;" class="right">Total</th>
                            <th style="width: 14%;" class="right">Paid</th>
                            <th style="width: 14%;" class="right red">Due</th>
                            <th style="width: 14%;" class="right">Days</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse(data_get($report, 'due.details', []) as $row)
                            <tr>
                                <td>{{ $row['invoice_number'] }}</td>
                                <td>{{ $row['invoice_date'] }}</td>
                                <td>{{ $row['customer_name'] }}</td>
                                <td class="right">₹ {{ number_format((float) $row['total_amount'], 2) }}</td>
                                <td class="right">₹ {{ number_format((float) $row['amount_paid'], 2) }}</td>
                                <td class="right red">₹ {{ number_format((float) $row['due_amount'], 2) }}</td>
                                <td class="right">{{ (int) round((float) $row['days_overdue']) }}</td>
                            </tr>
                        @empty
                            <tr class="empty-row"><td colspan="7">No due records</td></tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    @endif

    @if($showPayments)
        <div class="section">
            <div class="section-title">Payment Method Report <span class="section-badge">{{ data_get($report, 'payments.count', 0) }} records</span></div>
            <div class="section-card">
                <table class="detail-table">
                    <thead>
                        <tr>
                            <th>Method</th>
                            <th style="width: 16%;" class="right">Payments</th>
                            <th style="width: 22%;" class="right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse(data_get($report, 'payments.method_breakdown', []) as $row)
                            <tr>
                                <td>{{ $row['payment_method_label'] ?? $row['payment_method'] ?? '-' }}</td>
                                <td class="right">{{ $row['count'] }}</td>
                                <td class="right">₹ {{ number_format((float) $row['total_amount'], 2) }}</td>
                            </tr>
                        @empty
                            <tr class="empty-row"><td colspan="3">No payment records</td></tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    @endif

    <div class="section">
        <div class="section-title">Payment Details</div>
        <div class="section-card">
            <table class="detail-table">
                <thead>
                    <tr>
                        <th style="width: 14%;">Payment No.</th>
                        <th style="width: 13%;">Date</th>
                        <th style="width: 15%;">Invoice</th>
                        <th>Customer</th>
                        <th style="width: 16%;">Method</th>
                        <th style="width: 14%;" class="right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse(data_get($report, 'payments.details', []) as $row)
                        <tr>
                            <td>{{ $row['payment_number'] }}</td>
                            <td>{{ $row['payment_date'] }}</td>
                            <td>{{ $row['invoice_number'] }}</td>
                            <td>{{ $row['customer_name'] }}</td>
                            <td>{{ $row['payment_method_label'] ?? $row['payment_method'] ?? '-' }}</td>
                            <td class="right">₹ {{ number_format((float) $row['amount'], 2) }}</td>
                        </tr>
                    @empty
                        <tr class="empty-row"><td colspan="6">No payment records</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Supplier-wise Purchase Breakdown</div>
        <div class="section-card">
            <table class="detail-table">
                <thead>
                    <tr>
                        <th>Supplier</th>
                        <th style="width: 18%;" class="right">Bills</th>
                        <th style="width: 22%;" class="right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    @forelse(data_get($report, 'purchase.supplier_breakdown', []) as $row)
                        <tr>
                            <td>{{ $row['supplier_name'] }}</td>
                            <td class="right">{{ $row['count'] }}</td>
                            <td class="right">₹ {{ number_format((float) $row['total_amount'], 2) }}</td>
                        </tr>
                    @empty
                        <tr class="empty-row"><td colspan="3">No supplier breakdown data</td></tr>
                    @endforelse
                </tbody>
            </table>
        </div>
    </div>

    <div class="footer">
        Generated from the same filtered daily report dataset.
    </div>
</body>
</html>
