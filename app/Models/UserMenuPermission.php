<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserMenuPermission extends Model
{
    protected $fillable = [
        'user_id',
        'menu_id',
    ];

    /**
     * Get the user this permission belongs to
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the menu this permission is for
     */
    public function menu(): BelongsTo
    {
        return $this->belongsTo(Menu::class);
    }
}
