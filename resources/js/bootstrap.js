import axios from 'axios';
import { handleCsrfError, ensureFreshCsrfToken } from './utils/csrf.js';

window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Set up CSRF token for axios requests
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token not found: https://laravel.com/docs/csrf#csrf-x-csrf-token');
}

// Add response interceptor to handle session expiration
window.axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 419) {
            // Session expired or CSRF token mismatch
            try {
                return await handleCsrfError(error.config);
            } catch (csrfError) {
                console.error('CSRF error handling failed:', csrfError);
                // Fallback to page reload
                window.location.reload();
                return Promise.reject(csrfError);
            }
        }
        
        return Promise.reject(error);
    }
);

// Add request interceptor to ensure fresh CSRF token
window.axios.interceptors.request.use(
    (config) => {
        // Always ensure we have fresh CSRF token for each request
        ensureFreshCsrfToken();
        return config;
    },
    (error) => Promise.reject(error)
);

// Setup global route() function if not already available
if (typeof window.route === 'undefined') {
    window.route = function(name, params = {}, absolute = false) {
        // Fallback route implementation using Ziggy
        const Ziggy = window.Ziggy || { url: '', routes: {} };
        
        if (!Ziggy.routes[name]) {
            console.warn(`Route '${name}' not found in Ziggy routes`);
            return '#';
        }

        const route = Ziggy.routes[name];
        let uri = route.uri;

        // Replace parameters in the URI
        if (route.parameters && params) {
            route.parameters.forEach((param) => {
                const key = typeof param === 'string' ? param : Object.keys(param)[0];
                if (params[key] !== undefined) {
                    uri = uri.replace(`{${key}}`, params[key]);
                }
            });
        }

        // Add query parameters
        const queryParams = new URLSearchParams();
        Object.keys(params).forEach((key) => {
            if (!route.parameters || !route.parameters.includes(key)) {
                queryParams.append(key, params[key]);
            }
        });

        const query = queryParams.toString();
        const url = absolute ? `${Ziggy.url}/${uri}` : `/${uri}`;

        return query ? `${url}?${query}` : url;
    };
}
