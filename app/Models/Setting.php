<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Setting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'description'
    ];

    protected $table = 'settings';

    /**
     * Get setting by key
     */
    public static function getValue($key, $default = null)
    {
        $setting = self::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    /**
     * Set setting value
     */
    public static function setValue($key, $value, $description = null)
    {
        return self::updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'description' => $description]
        );
    }

    /**
     * Get all settings as key-value array
     */
    public static function getAll()
    {
        $settings = self::all();
        $result = [];
        foreach ($settings as $setting) {
            $result[$setting->key] = $setting->value;
        }
        return $result;
    }

    /**
     * Get company settings specifically
     */
    public static function getCompanySettings()
    {
        $companyLogo = self::getValue('company_logo', '/images/sayan-sita-logo.png');

        return [
            'company_name' => self::getValue('company_name', 'SAYAN SITA BUILDERS'),
            'company_address' => self::getValue('company_address', 'Chalitapara, Ajodhya, Shyampur, Howrah – 711312'),
            'company_phone_1' => self::getValue('company_phone_1', '6289249399'),
            'company_phone_2' => self::getValue('company_phone_2', '9609142692'),
            'company_phone_3' => self::getValue('company_phone_3', '9732771768'),
            'company_logo' => self::normalizeAssetUrl($companyLogo),
        ];
    }

    /**
     * Normalize saved logo path to a browser-safe URL.
     */
    public static function normalizeAssetUrl(?string $path): string
    {
        if (empty($path)) {
            return asset('images/sayan-sita-logo.png');
        }

        if (Str::startsWith($path, ['http://', 'https://'])) {
            return $path;
        }

        if (Str::startsWith($path, ['storage/', '/storage/'])) {
            return asset(ltrim($path, '/'));
        }

        if (Str::startsWith($path, '/')) {
            return asset(ltrim($path, '/'));
        }

        return asset($path);
    }
}
