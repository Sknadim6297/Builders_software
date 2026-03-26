const Ziggy = {"url":"http:\/\/localhost","port":null,"defaults":{},"routes":{"sanctum.csrf-cookie":{"uri":"sanctum\/csrf-cookie","methods":["GET","HEAD"]},"csrf.token":{"uri":"csrf-token","methods":["GET","HEAD"]},"dashboard":{"uri":"dashboard","methods":["GET","HEAD"]},"profile.edit":{"uri":"profile","methods":["GET","HEAD"]},"profile.update":{"uri":"profile","methods":["PATCH"]},"profile.destroy":{"uri":"profile","methods":["DELETE"]},"services.index":{"uri":"services","methods":["GET","HEAD"]},"services.create":{"uri":"services\/create","methods":["GET","HEAD"]},"services.store":{"uri":"services","methods":["POST"]},"services.show":{"uri":"services\/{service}","methods":["GET","HEAD"],"parameters":["service"],"bindings":{"service":"id"}},"services.edit":{"uri":"services\/{service}\/edit","methods":["GET","HEAD"],"parameters":["service"],"bindings":{"service":"id"}},"services.update":{"uri":"services\/{service}","methods":["PUT","PATCH"],"parameters":["service"],"bindings":{"service":"id"}},"services.destroy":{"uri":"services\/{service}","methods":["DELETE"],"parameters":["service"],"bindings":{"service":"id"}},"customers.index":{"uri":"customers","methods":["GET","HEAD"]},"customers.create":{"uri":"customers\/create","methods":["GET","HEAD"]},"customers.store":{"uri":"customers","methods":["POST"]},"customers.show":{"uri":"customers\/{customer}","methods":["GET","HEAD"],"parameters":["customer"],"bindings":{"customer":"id"}},"customers.edit":{"uri":"customers\/{customer}\/edit","methods":["GET","HEAD"],"parameters":["customer"],"bindings":{"customer":"id"}},"customers.update":{"uri":"customers\/{customer}","methods":["PUT","PATCH"],"parameters":["customer"],"bindings":{"customer":"id"}},"customers.destroy":{"uri":"customers\/{customer}","methods":["DELETE"],"parameters":["customer"],"bindings":{"customer":"id"}},"categories.index":{"uri":"categories","methods":["GET","HEAD"]},"categories.create":{"uri":"categories\/create","methods":["GET","HEAD"]},"categories.store":{"uri":"categories","methods":["POST"]},"categories.show":{"uri":"categories\/{category}","methods":["GET","HEAD"],"parameters":["category"],"bindings":{"category":"id"}},"categories.edit":{"uri":"categories\/{category}\/edit","methods":["GET","HEAD"],"parameters":["category"],"bindings":{"category":"id"}},"categories.update":{"uri":"categories\/{category}","methods":["PUT","PATCH"],"parameters":["category"],"bindings":{"category":"id"}},"categories.destroy":{"uri":"categories\/{category}","methods":["DELETE"],"parameters":["category"],"bindings":{"category":"id"}},"vendors.index":{"uri":"vendors","methods":["GET","HEAD"]},"vendors.create":{"uri":"vendors\/create","methods":["GET","HEAD"]},"vendors.store":{"uri":"vendors","methods":["POST"]},"vendors.show":{"uri":"vendors\/{vendor}","methods":["GET","HEAD"],"parameters":["vendor"],"bindings":{"vendor":"id"}},"vendors.edit":{"uri":"vendors\/{vendor}\/edit","methods":["GET","HEAD"],"parameters":["vendor"],"bindings":{"vendor":"id"}},"vendors.update":{"uri":"vendors\/{vendor}","methods":["PUT","PATCH"],"parameters":["vendor"],"bindings":{"vendor":"id"}},"vendors.destroy":{"uri":"vendors\/{vendor}","methods":["DELETE"],"parameters":["vendor"],"bindings":{"vendor":"id"}},"purchase-bills.index":{"uri":"purchase-bills","methods":["GET","HEAD"]},"purchase-bills.create":{"uri":"purchase-bills\/create","methods":["GET","HEAD"]},"purchase-bills.store":{"uri":"purchase-bills","methods":["POST"]},"purchase-bills.show":{"uri":"purchase-bills\/{purchase_bill}","methods":["GET","HEAD"],"parameters":["purchase_bill"]},"purchase-bills.edit":{"uri":"purchase-bills\/{purchase_bill}\/edit","methods":["GET","HEAD"],"parameters":["purchase_bill"]},"purchase-bills.update":{"uri":"purchase-bills\/{purchase_bill}","methods":["PUT","PATCH"],"parameters":["purchase_bill"]},"purchase-bills.destroy":{"uri":"purchase-bills\/{purchase_bill}","methods":["DELETE"],"parameters":["purchase_bill"]},"billing.download":{"uri":"billing\/{billing}\/download","methods":["GET","HEAD"],"parameters":["billing"],"bindings":{"billing":"id"}},"billing.payments.add":{"uri":"billing\/{billing}\/payments","methods":["POST"],"parameters":["billing"],"bindings":{"billing":"id"}},"payments.receipt":{"uri":"payments\/{payment}\/receipt","methods":["GET","HEAD"],"parameters":["payment"],"bindings":{"payment":"id"}},"billing.index":{"uri":"billing","methods":["GET","HEAD"]},"billing.create":{"uri":"billing\/create","methods":["GET","HEAD"]},"billing.store":{"uri":"billing","methods":["POST"]},"billing.show":{"uri":"billing\/{billing}","methods":["GET","HEAD"],"parameters":["billing"],"bindings":{"billing":"id"}},"billing.edit":{"uri":"billing\/{billing}\/edit","methods":["GET","HEAD"],"parameters":["billing"],"bindings":{"billing":"id"}},"billing.update":{"uri":"billing\/{billing}","methods":["PUT","PATCH"],"parameters":["billing"],"bindings":{"billing":"id"}},"stocks.index":{"uri":"stocks","methods":["GET","HEAD"]},"stocks.show":{"uri":"stocks\/{stock}","methods":["GET","HEAD"],"parameters":["stock"],"bindings":{"stock":"id"}},"admin-users.index":{"uri":"admin-users","methods":["GET","HEAD"]},"admin-users.create":{"uri":"admin-users\/create","methods":["GET","HEAD"]},"admin-users.store":{"uri":"admin-users","methods":["POST"]},"admin-users.show":{"uri":"admin-users\/{user}","methods":["GET","HEAD"],"parameters":["user"]},"admin-users.edit":{"uri":"admin-users\/{user}\/edit","methods":["GET","HEAD"],"parameters":["user"]},"admin-users.update":{"uri":"admin-users\/{user}","methods":["PUT","PATCH"],"parameters":["user"]},"admin-users.destroy":{"uri":"admin-users\/{user}","methods":["DELETE"],"parameters":["user"]},"activity-logs.index":{"uri":"activity-logs","methods":["GET","HEAD"]},"activity-logs.show":{"uri":"activity-logs\/{activityLog}","methods":["GET","HEAD"],"parameters":["activityLog"],"bindings":{"activityLog":"id"}},"activity-logs.export":{"uri":"activity-logs\/export","methods":["POST"]},"activity-logs.clear":{"uri":"activity-logs\/clear","methods":["DELETE"]},"activity-logs.request-delete-otp":{"uri":"activity-logs\/request-delete-otp","methods":["POST"]},"activity-logs.verify-delete-otp":{"uri":"activity-logs\/verify-delete-otp","methods":["POST"]},"activity-logs.destroy":{"uri":"activity-logs\/{activityLog}","methods":["DELETE"],"parameters":["activityLog"],"bindings":{"activityLog":"id"}},"login":{"uri":"login","methods":["GET","HEAD"]},"password.update":{"uri":"password","methods":["PUT"]},"logout":{"uri":"logout","methods":["POST"]},"storage.local":{"uri":"storage\/{path}","methods":["GET","HEAD"],"wheres":{"path":".*"},"parameters":["path"]}}};
if (typeof window !== 'undefined' && typeof window.Ziggy !== 'undefined') {
  Object.assign(Ziggy.routes, window.Ziggy.routes);
}

const route = function(name, params = {}, absolute = false) {
    // Support route().current('pattern') for sidebar navigation
    if (typeof name === 'undefined') {
        return {
            current: function(pattern) {
                if (typeof window === 'undefined') return false;
                const currentPath = window.location.pathname;
                if (pattern.includes('*')) {
                    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
                    return regex.test(currentPath);
                }
                return currentPath === pattern;
            }
        };
    }

    // Always resolve to URL for Inertia Link
    if (typeof Ziggy === 'undefined' || !Ziggy.routes) {
        console.warn('Ziggy routes not available');
        return `/${name}`; // Fallback
    }

    const routeData = Ziggy.routes[name];
    if (!routeData) {
        console.warn(`Route '${name}' not found`);
        return `/${name}`;
    }

    let uri = routeData.uri;
    let queryParamsObj = {};

    // Handle different parameter formats
    if (params && typeof params === 'object' && !Array.isArray(params)) {
        // Object format: { param: value }
        queryParamsObj = params;
    } else if (Array.isArray(params)) {
        // Array format: [value1, value2]
        queryParamsObj = {};
        if (routeData.parameters) {
            routeData.parameters.forEach((param, index) => {
                const key = typeof param === 'string' ? param : Object.keys(param)[0];
                if (params[index] !== undefined) {
                    queryParamsObj[key] = params[index];
                }
            });
        }
    } else if (params !== undefined && params !== null) {
        // Single parameter format: value
        queryParamsObj = {};
        if (routeData.parameters && routeData.parameters.length > 0) {
            const key = typeof routeData.parameters[0] === 'string' ? routeData.parameters[0] : Object.keys(routeData.parameters[0])[0];
            queryParamsObj[key] = params;
        }
    }

    // Replace path parameters
    if (routeData.parameters && queryParamsObj && Object.keys(queryParamsObj).length > 0) {
        routeData.parameters.forEach((param) => {
            const key = typeof param === 'string' ? param : Object.keys(param)[0];
            if (queryParamsObj[key] !== undefined) {
                uri = uri.replace(`{${key}}`, queryParamsObj[key]);
            }
        });
    }

    // Build query string from remaining params
    const queryParams = new URLSearchParams();
    if (queryParamsObj && Object.keys(queryParamsObj).length > 0) {
        Object.keys(queryParamsObj).forEach((key) => {
            if (!routeData.parameters || !routeData.parameters.some(p => (typeof p === 'string' ? p : Object.keys(p)[0]) === key)) {
                queryParams.append(key, queryParamsObj[key]);
            }
        });
    }

    const query = queryParams.toString();
    // Always use relative URLs to avoid CORS issues
    const url = `/${uri}`;

    return query ? `${url}?${query}` : url;
};

export { Ziggy };
export { route };
