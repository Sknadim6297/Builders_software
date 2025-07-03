<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $permission  Permission key to check
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        $user = Auth::user();

        // Allow super admin to access everything
        if ($user && $user->isSuperAdmin()) {
            return $next($request);
        }

        // Check if user has the required permission
        if (!$user || !$user->hasPermission($permission)) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Access denied. You do not have permission to access this resource.'], 403);
            }

            return redirect()->route('dashboard')->with('error', 'Access denied. You do not have permission to access this resource.');
        }

        return $next($request);
    }
}
