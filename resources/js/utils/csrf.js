/**
 * CSRF Token Utilities
 * Handles CSRF token management for better session handling
 */

/**
 * Get the current CSRF token from the meta tag
 */
export function getCsrfToken() {
    const token = document.head.querySelector('meta[name="csrf-token"]');
    return token ? token.content : null;
}

/**
 * Refresh the CSRF token by making a request to get a fresh one
 */
export async function refreshCsrfToken() {
    try {
        const response = await fetch('/csrf-token', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.csrf_token) {
                // Update the meta tag
                const tokenMeta = document.head.querySelector('meta[name="csrf-token"]');
                if (tokenMeta) {
                    tokenMeta.content = data.csrf_token;
                }
                
                // Update axios default header
                if (window.axios) {
                    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = data.csrf_token;
                }
                
                return data.csrf_token;
            }
        }
        throw new Error('Failed to refresh CSRF token');
    } catch (error) {
        console.error('Error refreshing CSRF token:', error);
        return null;
    }
}

/**
 * Ensure we have a fresh CSRF token
 */
export function ensureFreshCsrfToken() {
    const token = getCsrfToken();
    if (token && window.axios) {
        window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
    }
    return token;
}

/**
 * Handle CSRF token errors with retry logic
 */
export async function handleCsrfError(originalRequest) {
    console.warn('CSRF token error detected, attempting to refresh...');
    
    const newToken = await refreshCsrfToken();
    if (newToken && originalRequest && !originalRequest._csrfRetried) {
        // Mark this request as retried to prevent infinite loops
        originalRequest._csrfRetried = true;
        
        // Update the request headers
        originalRequest.headers['X-CSRF-TOKEN'] = newToken;
        
        // Retry the original request
        return window.axios.request(originalRequest);
    }
    
    // If we can't refresh or this is a retry, reload the page
    console.warn('Could not recover from CSRF error, reloading page...');
    window.location.reload();
    return Promise.reject(new Error('CSRF token refresh failed'));
}
