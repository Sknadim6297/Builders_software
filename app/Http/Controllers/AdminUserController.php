<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use App\Services\ActivityLogger;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        // Only super admin can access this
        if (!Auth::user()->isSuperAdmin()) {
            return redirect()->route('dashboard')
                ->with('error', 'Access denied. Only super administrators can manage users.');
        }

        $query = User::with(['role', 'permissions'])
            ->where('id', '!=', Auth::id()); // Exclude current user

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Role filter
        if ($request->filled('role')) {
            $query->where('role_id', $request->role);
        }

        $users = $query->orderBy('created_at', 'desc')
                      ->paginate(10)
                      ->withQueryString();

        $roles = Role::all();

        return Inertia::render('AdminUsers/Index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => $request->only(['search', 'role'])
        ]);
    }

    public function create()
    {
        if (!Auth::user()->isSuperAdmin()) {
            return redirect()->route('dashboard')
                ->with('error', 'Access denied. Only super administrators can manage users.');
        }

        $roles = Role::all();
        $permissions = Permission::where('is_active', true)
                                ->orderBy('sort_order')
                                ->get();

        return Inertia::render('AdminUsers/Create', [
            'roles' => $roles,
            'permissions' => $permissions
        ]);
    }

    public function store(Request $request)
    {
        if (!Auth::user()->isSuperAdmin()) {
            return redirect()->route('dashboard')
                ->with('error', 'Access denied. Only super administrators can manage users.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'role_id' => 'required|exists:roles,id',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $request->role_id,
            'is_super_admin' => false, // Only current super admin can create, not another super admin
        ]);

        // Attach permissions if provided
        if ($request->has('permissions')) {
            $user->permissions()->attach($request->permissions);
        }

        // Log admin activity
        ActivityLogger::logAdminAction('user_created', "Created admin user: {$user->name} ({$user->email})", $user);

        return redirect()->route('admin-users.index')
            ->with('success', 'Admin user created successfully.');
    }

    public function show($id)
    {
        if (!Auth::user()->isSuperAdmin()) {
            return redirect()->route('dashboard')
                ->with('error', 'Access denied. Only super administrators can manage users.');
        }

        $user = User::with(['role', 'permissions'])->findOrFail($id);

        // Log admin activity
        ActivityLogger::logAdminAction('user_viewed', "Viewed admin user: {$user->name} ({$user->email})", $user);

        return Inertia::render('AdminUsers/Show', [
            'user' => $user
        ]);
    }

    public function edit($id)
    {
        if (!Auth::user()->isSuperAdmin()) {
            return redirect()->route('dashboard')
                ->with('error', 'Access denied. Only super administrators can manage users.');
        }

        $user = User::with('permissions')->findOrFail($id);

        // Prevent editing super admin account
        if ($user->isSuperAdmin()) {
            return redirect()->route('admin-users.index')
                ->with('error', 'Cannot edit super administrator account.');
        }

        $roles = Role::all();
        $permissions = Permission::where('is_active', true)
                                ->orderBy('sort_order')
                                ->get();

        return Inertia::render('AdminUsers/Edit', [
            'user' => $user,
            'roles' => $roles,
            'permissions' => $permissions
        ]);
    }

    public function update(Request $request, $id)
    {
        if (!Auth::user()->isSuperAdmin()) {
            return redirect()->route('dashboard')
                ->with('error', 'Access denied. Only super administrators can manage users.');
        }

        $user = User::findOrFail($id);

        // Prevent editing super admin account
        if ($user->isSuperAdmin()) {
            return redirect()->route('admin-users.index')
                ->with('error', 'Cannot edit super administrator account.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|confirmed|min:8',
            'role_id' => 'required|exists:roles,id',
            'permissions' => 'nullable|array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $updateData = [
            'name' => $request->name,
            'email' => $request->email,
            'role_id' => $request->role_id,
        ];

        if ($request->filled('password')) {
            $updateData['password'] = Hash::make($request->password);
        }

        $user->update($updateData);

        // Sync permissions
        $permissions = $request->has('permissions') ? $request->permissions : [];
        $user->permissions()->sync($permissions);

        // Log admin activity
        ActivityLogger::logAdminAction('user_updated', "Updated admin user: {$user->name} ({$user->email})", $user);

        return redirect()->route('admin-users.index')
            ->with('success', 'Admin user updated successfully.');
    }

    public function destroy($id)
    {
        if (!Auth::user()->isSuperAdmin()) {
            return redirect()->route('dashboard')
                ->with('error', 'Access denied. Only super administrators can manage users.');
        }

        $user = User::findOrFail($id);

        // Prevent deleting super admin account
        if ($user->isSuperAdmin()) {
            return redirect()->route('admin-users.index')
                ->with('error', 'Cannot delete super administrator account.');
        }

        // Prevent deleting self
        if ($user->id === Auth::id()) {
            return redirect()->route('admin-users.index')
                ->with('error', 'Cannot delete your own account.');
        }

        // Log admin activity before deletion
        ActivityLogger::logAdminAction('user_deleted', "Deleted admin user: {$user->name} ({$user->email})", $user);

        $user->delete();

        return redirect()->route('admin-users.index')
            ->with('success', 'Admin user deleted successfully.');
    }
}
