<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'is_super_admin',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_super_admin' => 'boolean',
        ];
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'user_permissions');
    }

    /**
     * Get menus this user has access to
     */
    public function menus()
    {
        return $this->belongsToMany(Menu::class, 'user_menu_permissions');
    }

    /**
     * Get allowed menus for this user (including all for super admin)
     */
    public function getAllowedMenus()
    {
        if ($this->is_super_admin) {
            return Menu::active()->orderBy('sort_order')->get();
        }
        return $this->menus()->where('is_active', true)->orderBy('sort_order')->get();
    }

    /**
     * Check if user has access to a menu
     */
    public function hasMenuAccess($menuName)
    {
        if ($this->is_super_admin) {
            return true;
        }
        return $this->menus()->where('name', $menuName)->exists();
    }

    public function hasPermission($permission)
    {
        if ($this->is_super_admin) {
            return true;
        }

        if (is_string($permission)) {
            return $this->permissions()->where('name', $permission)->exists();
        }

        return $this->permissions()->where('id', $permission)->exists();
    }

    public function isSuperAdmin()
    {
        return $this->is_super_admin;
    }
}
