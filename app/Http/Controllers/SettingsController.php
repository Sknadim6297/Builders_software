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
     * Show settings form
     */
    public function edit()
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

        return Inertia::render('Settings/Index', [
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
     * Update settings
     */
    public function update(Request $request)
    {
        // Only super admins can update settings
        if (!Auth::user()->is_super_admin) {
            abort(403, 'Unauthorized access');
        }

        $validated = $request->validate([
            'payment_tc' => 'nullable|string',
            'payment_mode' => 'required|string|max:100',
            'godown' => 'required|string|max:255',
            'transport' => 'required|string|max:255',
            'bank' => 'required|string|max:255',
            'account_no' => 'required|string|max:50',
            'ifsc' => 'required|string|max:50',
            'branch' => 'required|string|max:255',
            'account_type' => 'required|string|max:255',
            'invoice_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:5120'
        ]);

        $invoiceLogoPath = Setting::getValue('invoice_logo', '');
        if ($request->hasFile('invoice_logo')) {
            $uploadedLogo = $request->file('invoice_logo')->store('invoice-logos', 'public');

            if (!empty($invoiceLogoPath)) {
                Storage::disk('public')->delete($invoiceLogoPath);
            }

            $invoiceLogoPath = $uploadedLogo;
        }

        Setting::setValue('payment_terms_conditions', $validated['payment_tc'] ?? '');
        Setting::setValue('payment_mode', $validated['payment_mode']);
        Setting::setValue('godown', $validated['godown']);
        Setting::setValue('transport', $validated['transport']);
        Setting::setValue('bank', $validated['bank']);
        Setting::setValue('account_no', $validated['account_no']);
        Setting::setValue('ifsc', $validated['ifsc']);
        Setting::setValue('branch', $validated['branch']);
        Setting::setValue('account_type', $validated['account_type']);

        if (!empty($invoiceLogoPath)) {
            Setting::setValue('invoice_logo', $invoiceLogoPath);
        }

        return redirect()->back()->with('success', 'Settings updated successfully');
    }
}
