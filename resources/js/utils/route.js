import { Ziggy } from '@/ziggy';

export function route(name, params = {}, absolute = false) {
    // If route() is available globally (from @routes), use it
    if (typeof window !== 'undefined' && window.route && typeof window.route === 'function') {
        return window.route(name, params, absolute);
    }

    // Fallback to Ziggy if route is not globally available
    const ziggy = window.Ziggy || Ziggy;
    
    if (!ziggy.routes[name]) {
        console.warn(`Route '${name}' not found in Ziggy routes`);
        return '#';
    }

    const route = ziggy.routes[name];
    let uri = route.uri;

    // Replace parameters in the URI
    if (route.parameters && params) {
        route.parameters.forEach((param) => {
            const key = param;
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
    const url = absolute ? `${ziggy.url}/${uri}` : `/${uri}`;

    return query ? `${url}?${query}` : url;
}
