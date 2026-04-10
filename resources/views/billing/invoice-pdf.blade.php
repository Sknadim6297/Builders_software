<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        body {
            font-family: "DejaVu Sans", Arial, sans-serif;
            font-size: 11px;
            color: #111827;
            margin: 12px;
        }
        .header-top {
            text-align: center;
            border-bottom: 1px solid #111827;
            padding-bottom: 8px;
            position: relative;
        }
        .title {
            font-size: 18px;
            font-weight: bold;
            letter-spacing: 0.8px;
            margin-bottom: 4px;
        }
        .duplicate {
            position: absolute;
            right: 0;
            top: 0;
            font-size: 10px;
            font-weight: bold;
            border: 1px solid #b91c1c;
            color: #b91c1c;
            padding: 2px 8px;
        }
        .line {
            margin-top: 4px;
            font-size: 10px;
        }
        .company {
            margin-top: 8px;
            line-height: 1.5;
            font-size: 10px;
        }
        .two-col {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .two-col td {
            vertical-align: top;
            padding: 0;
        }
        .buyer-col {
            width: 45%;
            padding-right: 10px;
        }
        .meta-col {
            width: 55%;
            padding-left: 10px;
        }
        .block-title {
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 4px;
            text-transform: uppercase;
        }
        .meta-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
        }
        .meta-table td {
            padding: 2px 0;
        }
        .meta-logo {
            margin-top: 8px;
            text-align: left;
        }
        .meta-logo img {
            max-height: 95px;
            max-width: 170px;
        }
        .account-type-logo {
            margin-top: 8px;
        }
        .account-type-logo img {
            max-height: 100px;
            max-width: 190px;
        }
        .items {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            table-layout: fixed;
        }
        .items th,
        .items td {
            border: 1px solid #6b7280;
            padding: 5px 4px;
            vertical-align: top;
            font-size: 9px;
            word-wrap: break-word;
            overflow-wrap: anywhere;
        }
        .items th {
            text-transform: uppercase;
            font-weight: bold;
            text-align: left;
        }
        .right {
            text-align: right;
        }
        .summary-wrap {
            width: 100%;
            margin-top: 8px;
            border-collapse: collapse;
        }
        .summary-wrap td {
            vertical-align: top;
        }
        .summary-wrap td:first-child {
            width: 35%;
            padding-right: 10px;
        }
        .summary-wrap td:last-child {
            width: 65%;
        }
        .summary {
            width: 92%;
            margin-left: auto;
            border-collapse: collapse;
            font-size: 10px;
        }
        .summary td {
            padding: 3px 0;
            border-bottom: 1px solid #d1d5db;
        }
        .summary td:first-child {
            white-space: nowrap;
            padding-right: 10px;
        }
        .summary .final td {
            font-weight: bold;
            border-top: 1px solid #111827;
            border-bottom: 1px solid #111827;
        }
        .amount-words {
            margin-top: 8px;
            font-size: 10px;
        }
        .terms {
            margin-top: 14px;
            border-top: 1px solid #111827;
            padding-top: 8px;
            font-size: 10px;
            line-height: 1.45;
        }
        .page-break {
            page-break-before: always;
            break-before: page;
        }
        .terms ul {
            margin: 4px 0 0 16px;
            padding: 0;
        }
        .notes {
            margin-top: 10px;
            font-size: 10px;
        }
        .sign {
            width: 100%;
            margin-top: 20px;
            border-collapse: collapse;
        }
        .sign td {
            width: 50%;
            text-align: center;
            padding-top: 34px;
            font-size: 10px;
            border-top: 1px solid #111827;
        }
        .footer {
            margin-top: 10px;
            text-align: center;
            font-size: 9px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="header-top">
        @if(($copy_type ?? 'customer') === 'duplicate')
            <div class="duplicate">DUPLICATE</div>
        @else
            <div class="duplicate" style="border-color:#111827;color:#111827;">ORIGINAL</div>
        @endif
        <div class="title">GST INVOICE</div>
        <div class="line"><strong>SUBJECT TO EXCLUSIVE JURISDICTION AT HOWRAH</strong></div>
        <div class="line">We hereby certify that the amount indicated in this tax invoice represents the price actually charged by us and that there is no additional consideration flowing directly or indirectly from such sales over and above what has been declared.</div>
        @php
            $companyPhones = array_values(array_filter([
                trim((string) ($company_phone_1 ?? '')),
                trim((string) ($company_phone_2 ?? '')),
                trim((string) ($company_phone_3 ?? '')),
            ], function ($phone) {
                return $phone !== '';
            }));
            $companyContactLine = count($companyPhones) > 0 ? implode(' / ', $companyPhones) : 'N/A';
            $companyEmailLine = trim((string) ($company_email ?? ''));
        @endphp
        <div class="company">
            <strong>{{ $company_name ?? 'SAYAN SITA BUILDERS' }}</strong><br>
            {{ $company_address ?? 'Chalitapara, Ajodhya, Shyampur, Howrah – 711312' }}<br>
            @if(!empty($company_address_2))
                {{ $company_address_2 }}<br>
            @endif
            GSTIN/UIN: {{ $company_gstin ?? '19DJZPM9953H1ZZ' }} | STATE NAME: WEST BENGAL, CODE: 19<br>
            CONTACT: {{ $companyContactLine }}@if($companyEmailLine !== '') | EMAIL: {{ $companyEmailLine }}@endif
        </div>
    </div>

    <table class="two-col">
        <tr>
            <td class="buyer-col">
                <div class="block-title">Buyer (Bill To)</div>
                <table class="meta-table">
                    <tr><td><strong>{{ $invoice->customer->name ?? 'N/A' }}</strong></td></tr>
                    <tr><td>Main Address: {{ $invoice->customer->address ?? 'N/A' }}</td></tr>
                    <tr><td>Delivery Address: {{ $invoice->customer->delivery_address ?? 'N/A' }}</td></tr>
                    <tr><td>Mobile: {{ $invoice->customer->mobile_number ?? 'N/A' }}</td></tr>
                    <tr><td>GSTIN/UIN: {{ $invoice->customer->gst_number ?? $invoice->customer->gstin ?? 'N/A' }}</td></tr>
                    <tr><td>Email: {{ $invoice->customer->email ?? 'N/A' }}</td></tr>
                </table>
            </td>
            <td class="meta-col">
                <div class="block-title">Invoice Meta</div>
                <table class="meta-table">
                    <tr><td><strong>Invoice Date:</strong> {{ optional($invoice->invoice_date)->format('d/m/Y') }}</td></tr>
                    <tr><td><strong>Invoice No:</strong> {{ $invoice->invoice_number }}</td></tr>
                    <tr><td><strong>Status:</strong> {{ strtoupper($invoice->payment_status ?? 'N/A') }}</td></tr>
                </table>
                @php
                    $buyerLogoPath = trim((string) ($buyer_logo ?? ''));
                    if (str_starts_with($buyerLogoPath, '/storage/')) {
                        $buyerLogoPath = substr($buyerLogoPath, 9);
                    } elseif (str_starts_with($buyerLogoPath, 'storage/')) {
                        $buyerLogoPath = substr($buyerLogoPath, 8);
                    }
                @endphp
                @if($buyerLogoPath !== '' && file_exists(public_path('storage/' . $buyerLogoPath)))
                    <div class="meta-logo">
                        <div style="font-size: 10px; font-weight: bold; margin-bottom: 4px;">Buyer Logo</div>
                        <img src="{{ public_path('storage/' . $buyerLogoPath) }}" alt="Buyer Logo" />
                    </div>
                @endif
            </td>
        </tr>
    </table>

    <table class="items">
        <thead>
            <tr>
                <th style="width: 5%;">SL No.</th>
                <th style="width: 30%;">Item Description</th>
                <th style="width: 11%;">Category</th>
                <th style="width: 8%;">Unit</th>
                <th style="width: 11%;">HSN Code</th>
                <th class="right" style="width: 8%;">Qty</th>
                <th class="right" style="width: 12%;">Rate/Unit</th>
                <th class="right" style="width: 8%;">Disc %</th>
                <th class="right" style="width: 11%;">Amount</th>
            </tr>
        </thead>
        <tbody>
            @forelse($lineItems as $index => $item)
                <tr>
                    <td>{{ $index + 1 }}</td>
                    <td>
                        <strong>{{ $item['name'] }}</strong>
                        @if(!empty($item['description']) && $item['description'] !== '-')
                            <div style="margin-top: 2px; color: #6b7280;">{{ $item['description'] }}</div>
                        @endif
                    </td>
                    <td>{{ $item['category'] ?? '-' }}</td>
                    <td>{{ $item['unit'] ?? '-' }}</td>
                    <td>{{ $item['hsn_code'] ?? '-' }}</td>
                    <td class="right">{{ number_format($item['quantity'], 2) }}</td>
                    <td class="right">₹ {{ number_format($item['unit_price'], 2) }}</td>
                    <td class="right">{{ number_format($item['discount_percentage'] ?? 0, 2) }}</td>
                    <td class="right"><strong>₹ {{ number_format($item['total'], 2) }}</strong></td>
                </tr>
            @empty
                <tr>
                    <td colspan="9" style="text-align: center;">No items found</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <table class="summary-wrap">
        <tr>
            <td>
                <div class="amount-words"><strong>Amount in Words:</strong> {{ $amount_in_words ?? '' }}</div>
            </td>
            <td>
                <table class="summary">
                    <tr><td>Gross Total</td><td class="right">₹ {{ number_format($gross_total ?? $invoice->subtotal ?? 0, 2) }}</td></tr>
                    <tr><td>Delivery Charges</td><td class="right">₹ {{ number_format($delivery_charges ?? 0, 2) }}</td></tr>
                    <tr><td>Discount ({{ number_format($invoice_discount_percent ?? 0, 2) }}%)</td><td class="right">- ₹ {{ number_format($invoice->discount ?? 0, 2) }}</td></tr>
                    <tr><td>CGST ({{ number_format(($invoice->cgst_percentage ?? (($invoice->gst_percentage ?? 0) / 2)), 2) }}%)</td><td class="right">₹ {{ number_format($cgst ?? 0, 2) }}</td></tr>
                    <tr><td>SGST ({{ number_format(($invoice->sgst_percentage ?? (($invoice->gst_percentage ?? 0) / 2)), 2) }}%)</td><td class="right">₹ {{ number_format($sgst ?? 0, 2) }}</td></tr>
                    <tr class="final"><td>Net Value</td><td class="right">₹ {{ number_format($net_value ?? $invoice->total ?? 0, 2) }}</td></tr>
                </table>
            </td>
        </tr>
    </table>

    @if(!empty($invoice->notes))
        <div class="notes"><strong>Notes:</strong> {{ $invoice->notes }}</div>
    @endif

    @if(!empty($invoice_certification_text))
        <div class="certification" style="margin-top: 12px; padding: 8px; border: 1px solid #ddd; background-color: #f9fafb; font-size: 10px; line-height: 1.6;">
            {{ nl2br($invoice_certification_text) }}
        </div>
    @endif

    @if(!empty($invoice->payments) && count($invoice->payments) > 0)
        <div style="margin-top: 12px;">
            <div class="block-title">Payment History</div>
            <table class="items" style="margin-top: 4px;">
                <thead>
                    <tr>
                        <th style="width: 20%;">Payment No.</th>
                        <th style="width: 20%;">Date</th>
                        <th style="width: 20%;">Method</th>
                        <th style="width: 20%;">Reference</th>
                        <th class="right" style="width: 20%;">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($invoice->payments as $payment)
                        <tr>
                            <td>{{ $payment->payment_number }}</td>
                            <td>{{ optional($payment->payment_date)->format('d/m/Y') }}</td>
                            <td>{{ strtoupper(str_replace('_', ' ', $payment->payment_method)) }}</td>
                            <td>{{ $payment->transaction_reference ?? '-' }}</td>
                            <td class="right">₹ {{ number_format($payment->amount, 2) }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endif

    <div class="terms page-break">
        <strong>Payment Terms & Conditions</strong>
        @php
            $rawTerms = trim((string) ($payment_tc ?? ''));
            $rawTerms = preg_replace('/\r\n|\r/', "\n", $rawTerms);

            if (strpos($rawTerms, "\n") === false) {
                $rawTerms = preg_replace('/\s+/', ' ', $rawTerms);
                $rawTerms = preg_replace('/\s*(After\s+\d+\s*(?:days?|months?)\s*[—-])/', "\n$1", $rawTerms);
                $rawTerms = preg_replace('/\s*(Interest\s*@)/', "\n$1", $rawTerms);
                $rawTerms = preg_replace('/\s*(Any\s+dispute)/i', "\n$1", $rawTerms);
            }

            $paymentTermsLines = array_values(array_filter(array_map('trim', explode("\n", $rawTerms)), function ($line) {
                return $line !== '';
            }));
        @endphp

        @if(count($paymentTermsLines) > 0)
            <ul>
                @foreach($paymentTermsLines as $termLine)
                    <li>{{ $termLine }}</li>
                @endforeach
            </ul>
        @else
            <div>N/A</div>
        @endif

        <table class="meta-table" style="margin-top: 8px;">
            <tr>
                <td style="width: 50%; vertical-align: top;">
                    <strong>Payment Mode:</strong> {{ $payment_mode ?? 'CREDIT' }}<br>
                    <strong>Godown:</strong> {{ $godown ?? 'CHALITAPARA' }}<br>
                    <strong>Transport:</strong> {{ $transport ?? 'VAN (SELF)' }}
                </td>
                <td style="width: 50%; vertical-align: top;">
                    <strong>Bank:</strong> {{ $bank ?? 'Development Bank of Singapore' }}<br>
                    <strong>Account No:</strong> {{ $account_no ?? '8828210000007429' }}<br>
                    <strong>IFSC:</strong> {{ $ifsc ?? 'DBSS0IN0828' }}<br>
                    <strong>Branch:</strong> {{ $branch ?? 'KOLKATA MAIN BRANCH' }}<br>
                    <strong>Account Type:</strong> {{ $account_type ?? 'Trade & Forex CURRENT ACCOUNT' }}
                    @php
                        $invoiceLogoPath = trim((string) ($invoice_logo ?? ''));
                        if (str_starts_with($invoiceLogoPath, '/storage/')) {
                            $invoiceLogoPath = substr($invoiceLogoPath, 9);
                        } elseif (str_starts_with($invoiceLogoPath, 'storage/')) {
                            $invoiceLogoPath = substr($invoiceLogoPath, 8);
                        }
                    @endphp
                    @if($invoiceLogoPath !== '' && file_exists(public_path('storage/' . $invoiceLogoPath)))
                        <div class="account-type-logo">
                            <img src="{{ public_path('storage/' . $invoiceLogoPath) }}" alt="Invoice Logo" />
                        </div>
                    @endif
                </td>
            </tr>
        </table>
    </div>

    <table class="sign">
        <tr>
            <td>CUSTOMER'S SEAL & SIGNATURE</td>
            <td>AUTHORISED SIGNATORY</td>
        </tr>
    </table>

    <div class="footer">
        Generated on {{ date('M j, Y \a\t g:i A') }} | Thank you for your business.
    </div>
</body>
</html>
