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
        $companyPhone1 = Setting::getValue('company_phone_1', '6289249399');
        $companyPhone2 = Setting::getValue('company_phone_2', '9609142692');
        $companyPhone3 = Setting::getValue('company_phone_3', '9732771768');
        $companyLogo = Setting::getValue('company_logo', '/images/sayan-sita-logo.png');

        return Inertia::render('Settings/Website', [
            'company_name' => $companyName,
            'company_address' => $companyAddress,
            'company_phone_1' => $companyPhone1,
            'company_phone_2' => $companyPhone2,
            'company_phone_3' => $companyPhone3,
            'company_logo' => $companyLogo,
            'company_logo_url' => Setting::normalizeAssetUrl($companyLogo),
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
            'company_phone_1' => 'nullable|string|max:20',
            'company_phone_2' => 'nullable|string|max:20',
            'company_phone_3' => 'nullable|string|max:20',
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
        if (array_key_exists('company_phone_1', $validatedWebsite)) {
            Setting::setValue('company_phone_1', $validatedWebsite['company_phone_1']);
        }
        if (array_key_exists('company_phone_2', $validatedWebsite)) {
            Setting::setValue('company_phone_2', $validatedWebsite['company_phone_2']);
        }
        if (array_key_exists('company_phone_3', $validatedWebsite)) {
            Setting::setValue('company_phone_3', $validatedWebsite['company_phone_3']);
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
