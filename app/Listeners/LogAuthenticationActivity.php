<?php

namespace App\Listeners;

use App\Services\ActivityLogger;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Verified;

class LogAuthenticationActivity
{
    /**
     * Handle user login events.
     */
    public function handleLogin(Login $event): void
    {
        ActivityLogger::logAuth('login', $event->user);
    }

    /**
     * Handle user logout events.
     */
    public function handleLogout(Logout $event): void
    {
        ActivityLogger::logAuth('logout', $event->user);
    }

    /**
     * Handle user registration events.
     */
    public function handleRegistered(Registered $event): void
    {
        ActivityLogger::logAuth('register', $event->user);
    }

    /**
     * Handle password reset events.
     */
    public function handlePasswordReset(PasswordReset $event): void
    {
        ActivityLogger::logAuth('password_reset', $event->user);
    }

    /**
     * Handle email verification events.
     */
    public function handleEmailVerified(Verified $event): void
    {
        ActivityLogger::logAuth('email_verified', $event->user);
    }

    /**
     * Register the listeners for the subscriber.
     */
    public function subscribe($events): void
    {
        $events->listen(Login::class, [LogAuthenticationActivity::class, 'handleLogin']);
        $events->listen(Logout::class, [LogAuthenticationActivity::class, 'handleLogout']);
        $events->listen(Registered::class, [LogAuthenticationActivity::class, 'handleRegistered']);
        $events->listen(PasswordReset::class, [LogAuthenticationActivity::class, 'handlePasswordReset']);
        $events->listen(Verified::class, [LogAuthenticationActivity::class, 'handleEmailVerified']);
    }
}
