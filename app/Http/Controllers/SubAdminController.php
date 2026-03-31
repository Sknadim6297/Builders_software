<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Menu;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SubAdminController extends Controller
{
    /**
     * Display a listing of sub-admins.
     */
    public function index(Request $request)
    {
        // Only super admin can access
        if (!Auth::user()->is_super_admin) {
            abort(403, 'Unauthorized action.');
        }

        $query = User::where('is_super_admin', false)->with('role');

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $subAdmins = $query->paginate(15);
        
        // Add menus count to each sub-admin
        $subAdmins->each(function ($subAdmin) {
            $subAdmin->menus_count = $subAdmin->menus()->count();
        });

        return Inertia::render('SubAdmins/Index', [
            'subAdmins' => $subAdmins,
            'filters' => $request->only(['search'])
        ]);
    }

    /**
     * Show the form for creating a new sub-admin.
     */
    public function create()
    {
        // Only super admin can access
        if (!Auth::user()->is_super_admin) {
            abort(403, 'Unauthorized action.');
        }

        $menus = Menu::where('is_active', true)->orderBy('sort_order')->get();
        $roles = Role::where('name', '!=', 'super_admin')->get();

        return Inertia::render('SubAdmins/Create', [
            'menus' => $menus,
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created sub-admin.
     */
    public function store(Request $request)
    {
        // Only super admin can access
        if (!Auth::user()->is_super_admin) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
            'role_id' => 'required|exists:roles,id',
            'selected_menus' => 'required|array|min:1',
            'selected_menus.*' => 'exists:menus,id',
        ]);

        // Create the sub-admin user
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $validated['role_id'],
            'is_super_admin' => false,
        ]);

        // Assign menu permissions
        $user->menus()->attach($validated['selected_menus']);

        return redirect()->route('sub-admins.index')->with('success', 'Sub-Admin created successfully.');
    }

    /**
     * Display the specified sub-admin.
     */
    public function show(User $user)
    {
        // Only super admin can access
        if (!Auth::user()->is_super_admin) {
            abort(403, 'Unauthorized action.');
        }

        // Cannot view super admin
        if ($user->is_super_admin) {
            abort(403, 'Cannot view super admin.');
        }

        return Inertia::render('SubAdmins/Show', [
            'subAdmin' => $user->load('role', 'menus:id,name,description,icon'),
        ]);
    }

    /**
     * Show the form for editing a sub-admin.
     */
    public function edit(User $user)
    {
        // Only super admin can access
        if (!Auth::user()->is_super_admin) {
            abort(403, 'Unauthorized action.');
        }

        // Cannot edit super admin
        if ($user->is_super_admin) {
            abort(403, 'Cannot edit super admin.');
        }

        $menus = Menu::where('is_active', true)->orderBy('sort_order')->get();
        $roles = Role::where('name', '!=', 'super_admin')->get();

        // Load sub-admin with menus and attach them with alias for React component
        $subAdminData = $user->load('role', 'menus:id,name,description,icon');
        $subAdminData->sub_admin_menus = $subAdminData->menus;

        return Inertia::render('SubAdmins/Edit', [
            'subAdmin' => $subAdminData,
            'menus' => $menus,
            'roles' => $roles,
        ]);
    }

    /**
     * Update the specified sub-admin.
     */
    public function update(Request $request, User $user)
    {
        // Only super admin can access
        if (!Auth::user()->is_super_admin) {
            abort(403, 'Unauthorized action.');
        }

        // Cannot edit super admin
        if ($user->is_super_admin) {
            abort(403, 'Cannot edit super admin.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role_id' => 'required|exists:roles,id',
            'selected_menus' => 'required|array|min:1',
            'selected_menus.*' => 'exists:menus,id',
            'password' => 'nullable|min:8|confirmed',
        ]);

        // Update user details
        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->role_id = $validated['role_id'];

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        // Update menu permissions
        $user->menus()->sync($validated['selected_menus']);

        return redirect()->route('sub-admins.index')->with('success', 'Sub-Admin updated successfully.');
    }

    /**
     * Remove the specified sub-admin.
     */
    public function destroy(User $user)
    {
        // Only super admin can access
        if (!Auth::user()->is_super_admin) {
            abort(403, 'Unauthorized action.');
        }

        // Cannot delete super admin
        if ($user->is_super_admin) {
            abort(403, 'Cannot delete super admin.');
        }

        // Remove menu permissions
        $user->menus()->detach();

        // Delete the user
        $user->delete();

        return redirect()->route('sub-admins.index')->with('success', 'Sub-Admin deleted successfully.');
    }
}
