<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Menu extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'icon',
        'route_name',
        'href',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /**
     * Get users that have access to this menu
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_menu_permissions');
    }

    /**
     * Scope to get only active menus
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
