<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingsController extends Controller
{
    /**
     * Show website settings form
     */
    public function editWebsite()
    {
        // Only super admins can access settings
        if (!Auth::user()->is_super_admin) {
            abort(403, 'Unauthorized access');
        }

        // Company settings
        $companyName = Setting::getValue('company_name', 'SAYAN SITA BUILDERS');
        $companyAddress = Setting::getValue('company_address', 'Chalitapara, Ajodhya, Shyampur, Howrah – 711312');
        $companyAddress2 = Setting::getValue('company_address_2', '');
        $companyAddresses = Setting::getCompanyAddresses();
        $companyPhone1 = Setting::getValue('company_phone_1', '6289249399');
        $companyPhone2 = Setting::getValue('company_phone_2', '9609142692');
        $companyPhone3 = Setting::getValue('company_phone_3', '9732771768');
        $companyEmail = Setting::getValue('company_email', '');
        $companyGstin = Setting::getValue('company_gstin', '19DJZPM9953H1ZZ');
        $companyLogo = Setting::getValue('company_logo', '/images/sayan-sita-logo.png');
        $invoiceCertificationText = Setting::getValue('invoice_certification_text', '');

        return Inertia::render('Settings/Website', [
            'company_name' => $companyName,
            'company_address' => $companyAddress,
            'company_address_2' => $companyAddress2,
            'company_addresses' => implode("\n", $companyAddresses),
            'company_phone_1' => $companyPhone1,
            'company_phone_2' => $companyPhone2,
            'company_phone_3' => $companyPhone3,
            'company_email' => $companyEmail,
            'company_gstin' => $companyGstin,
            'company_logo' => $companyLogo,
            'company_logo_url' => Setting::normalizeAssetUrl($companyLogo),
            'invoice_certification_text' => $invoiceCertificationText,
        ]);
    }

    /**
     * Show invoice settings form
     */
    public function editInvoice()
    {
        // Only super admins can access settings
        if (!Auth::user()->is_super_admin) {
            abort(403, 'Unauthorized access');
        }

        $paymentTc = Setting::getValue('payment_terms_conditions', '');
        $bankDetails = Setting::getValue('bank_details', '');
        $paymentMode = Setting::getValue('payment_mode', 'CREDIT');
        $godown = Setting::getValue('godown', 'CHALITAPARA');
        $transport = Setting::getValue('transport', 'VAN (SELF)');
        $bank = Setting::getValue('bank', 'Development Bank of Singapore');
        $accountNo = Setting::getValue('account_no', '8828210000007429');
        $ifsc = Setting::getValue('ifsc', 'DBSS0IN0828');
        $branch = Setting::getValue('branch', 'KOLKATA MAIN BRANCH');
        $accountType = Setting::getValue('account_type', 'Trade & Forex CURRENT ACCOUNT');
        $invoiceLogo = Setting::getValue('invoice_logo', '');

        return Inertia::render('Settings/Invoice', [
            'payment_tc' => $paymentTc,
            'bank_details' => $bankDetails,
            'payment_mode' => $paymentMode,
            'godown' => $godown,
            'transport' => $transport,
            'bank' => $bank,
            'account_no' => $accountNo,
            'ifsc' => $ifsc,
            'branch' => $branch,
            'account_type' => $accountType,
            'invoice_logo' => $invoiceLogo,
            'invoice_logo_url' => $invoiceLogo ? asset('storage/' . $invoiceLogo) : null
        ]);
    }

    /**
     * Backward-compatible old settings route
     */
    public function edit()
    {
        return $this->editInvoice();
    }

    /**
     * Update website settings only
     */
    public function updateWebsite(Request $request)
    {
        if (!Auth::user()->is_super_admin) {
            abort(403, 'Unauthorized access');
        }

        $validatedWebsite = $request->validate([
            'company_name' => 'nullable|string|max:255',
            'company_address' => 'nullable|string|max:500',
            'company_address_2' => 'nullable|string|max:500',
            'company_addresses' => 'nullable|string|max:5000',
            'company_phone_1' => 'nullable|string|max:20',
            'company_phone_2' => 'nullable|string|max:20',
            'company_phone_3' => 'nullable|string|max:20',
            'company_email' => 'nullable|email|max:255',
            'company_gstin' => 'nullable|string|max:30',
            'invoice_certification_text' => 'nullable|string|max:2000',
            'company_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
        ]);

        $companyLogoPath = Setting::getValue('company_logo', '');
        if ($request->hasFile('company_logo')) {
            $uploadedLogo = $request->file('company_logo')->store('company-logos', 'public');

            if (!empty($companyLogoPath) && (strpos($companyLogoPath, 'storage/') !== false || strpos($companyLogoPath, '/storage/') !== false)) {
                Storage::disk('public')->delete(str_replace(['/storage/', 'storage/'], '', $companyLogoPath));
            }

            $companyLogoPath = '/storage/' . $uploadedLogo;
        }

        if (array_key_exists('company_name', $validatedWebsite)) {
            Setting::setValue('company_name', $validatedWebsite['company_name']);
        }
        if (array_key_exists('company_address', $validatedWebsite)) {
            Setting::setValue('company_address', $validatedWebsite['company_address']);
        }
        if (array_key_exists('company_address_2', $validatedWebsite)) {
            Setting::setValue('company_address_2', $validatedWebsite['company_address_2']);
        }
        if (array_key_exists('company_addresses', $validatedWebsite)) {
            $addressLines = preg_split('/\r\n|\r|\n/', (string) ($validatedWebsite['company_addresses'] ?? '')) ?: [];
            $normalizedAddresses = array_values(array_filter(array_map(function ($line) {
                return trim((string) $line);
            }, $addressLines), function ($line) {
                return $line !== '';
            }));

            if (empty($normalizedAddresses)) {
                $legacyAddress1 = trim((string) ($validatedWebsite['company_address'] ?? ''));
                $legacyAddress2 = trim((string) ($validatedWebsite['company_address_2'] ?? ''));
                if ($legacyAddress1 !== '') {
                    $normalizedAddresses[] = $legacyAddress1;
                }
                if ($legacyAddress2 !== '') {
                    $normalizedAddresses[] = $legacyAddress2;
                }
            }

            Setting::setValue('company_addresses', json_encode($normalizedAddresses));

            // Keep legacy keys in sync for old screens and reports.
            Setting::setValue('company_address', $normalizedAddresses[0] ?? '');
            Setting::setValue('company_address_2', $normalizedAddresses[1] ?? '');
        }
        if (array_key_exists('company_phone_1', $validatedWebsite)) {
            Setting::setValue('company_phone_1', $validatedWebsite['company_phone_1']);
        }
        if (array_key_exists('company_phone_2', $validatedWebsite)) {
            Setting::setValue('company_phone_2', $validatedWebsite['company_phone_2']);
        }
        if (array_key_exists('company_phone_3', $validatedWebsite)) {
            Setting::setValue('company_phone_3', $validatedWebsite['company_phone_3']);
        }
        if (array_key_exists('company_email', $validatedWebsite)) {
            Setting::setValue('company_email', $validatedWebsite['company_email']);
        }
        if (array_key_exists('company_gstin', $validatedWebsite)) {
            Setting::setValue('company_gstin', strtoupper(trim($validatedWebsite['company_gstin'] ?? '')));
        }
        if (array_key_exists('invoice_certification_text', $validatedWebsite)) {
            Setting::setValue('invoice_certification_text', $validatedWebsite['invoice_certification_text']);
        }
        if (!empty($companyLogoPath)) {
            Setting::setValue('company_logo', $companyLogoPath);
        }

        return redirect()->back()->with('success', 'Website settings updated successfully');
    }

    /**
     * Update invoice settings only
     */
    public function updateInvoice(Request $request)
    {
        if (!Auth::user()->is_super_admin) {
            abort(403, 'Unauthorized access');
        }

        $validatedInvoice = $request->validate([
            'payment_tc' => 'nullable|string',
            'payment_mode' => 'required|string|max:100',
            'godown' => 'required|string|max:255',
            'transport' => 'required|string|max:255',
            'bank' => 'required|string|max:255',
            'account_no' => 'required|string|max:50',
            'ifsc' => 'required|string|max:50',
            'branch' => 'required|string|max:255',
            'account_type' => 'required|string|max:255',
            'invoice_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5120',
        ]);

        $invoiceLogoPath = Setting::getValue('invoice_logo', '');
        if ($request->hasFile('invoice_logo')) {
            $uploadedLogo = $request->file('invoice_logo')->store('invoice-logos', 'public');

            if (!empty($invoiceLogoPath)) {
                Storage::disk('public')->delete($invoiceLogoPath);
            }

            $invoiceLogoPath = $uploadedLogo;
        }

        Setting::setValue('payment_terms_conditions', $validatedInvoice['payment_tc'] ?? '');
        Setting::setValue('payment_mode', $validatedInvoice['payment_mode']);
        Setting::setValue('godown', $validatedInvoice['godown']);
        Setting::setValue('transport', $validatedInvoice['transport']);
        Setting::setValue('bank', $validatedInvoice['bank']);
        Setting::setValue('account_no', $validatedInvoice['account_no']);
        Setting::setValue('ifsc', $validatedInvoice['ifsc']);
        Setting::setValue('branch', $validatedInvoice['branch']);
        Setting::setValue('account_type', $validatedInvoice['account_type']);

        if (!empty($invoiceLogoPath)) {
            Setting::setValue('invoice_logo', $invoiceLogoPath);
        }

        return redirect()->back()->with('success', 'Invoice settings updated successfully');
    }

    /**
     * Update settings
     */
    public function update(Request $request)
    {
        return $this->updateInvoice($request);
    }

    /**
     * Get company settings (public API - no auth required)
     */
    public function getCompanySettings()
    {
        return response()->json(Setting::getCompanySettings());
    }
}
