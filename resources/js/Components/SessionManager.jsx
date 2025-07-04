import { useEffect, useRef } from 'react';
import { ensureFreshCsrfToken } from '../utils/csrf';

/**
 * SessionManager Component
 * Handles session management and CSRF token refresh
 * This component receives CSRF token as a prop instead of using usePage()
 */
export default function SessionManager({ csrfToken }) {
    const lastTokenRef = useRef(csrfToken);
    const heartbeatIntervalRef = useRef(null);

    useEffect(() => {
        // Update CSRF token when it changes
        if (csrfToken && csrfToken !== lastTokenRef.current) {
            lastTokenRef.current = csrfToken;
            
            // Update the meta tag
            const tokenMeta = document.head.querySelector('meta[name="csrf-token"]');
            if (tokenMeta) {
                tokenMeta.content = csrfToken;
            }
            
            // Update axios headers
            if (window.axios) {
                window.axios.defaults.headers.common['X-CSRF-TOKEN'] = csrfToken;
            }
        }
    }, [csrfToken]);

    useEffect(() => {
        // Set up session heartbeat to keep session alive
        const startHeartbeat = () => {
            // Send a lightweight request every 5 minutes to keep session alive
            heartbeatIntervalRef.current = setInterval(async () => {
                try {
                    await fetch('/csrf-token', {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-CSRF-TOKEN': ensureFreshCsrfToken()
                        }
                    });
                } catch (error) {
                    console.warn('Session heartbeat failed:', error);
                }
            }, 5 * 60 * 1000); // 5 minutes
        };

        // Start heartbeat only if we have a CSRF token (indicating authenticated session)
        if (csrfToken) {
            startHeartbeat();
        }

        // Cleanup on unmount
        return () => {
            if (heartbeatIntervalRef.current) {
                clearInterval(heartbeatIntervalRef.current);
            }
        };
    }, [csrfToken]);

    useEffect(() => {
        // Listen for page visibility changes to refresh token when user returns
        const handleVisibilityChange = () => {
            if (!document.hidden && csrfToken) {
                // Page became visible, ensure we have a fresh token
                ensureFreshCsrfToken();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [csrfToken]);

    // This component doesn't render anything
    return null;
}
