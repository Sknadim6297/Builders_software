<?php

namespace App\Providers;

use App\Listeners\LogAuthenticationActivity;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        
        // Share user permissions with all Inertia responses
        \Inertia\Inertia::share([
            'permissions' => function () {
                if (Auth::check()) {
                    return Auth::user()->permissions;
                }
                return [];
            },
        ]);

        // Register authentication activity logging
        Event::subscribe(LogAuthenticationActivity::class);
    }
}
