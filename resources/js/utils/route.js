const Ziggy = {"url":"http:\/\/localhost","port":null,"defaults":{},"routes":{"sanctum.csrf-cookie":{"uri":"sanctum\/csrf-cookie","methods":["GET","HEAD"]},"csrf.token":{"uri":"csrf-token","methods":["GET","HEAD"]},"dashboard":{"uri":"dashboard","methods":["GET","HEAD"]},"profile.edit":{"uri":"profile","methods":["GET","HEAD"]},"profile.update":{"uri":"profile","methods":["PATCH"]},"profile.destroy":{"uri":"profile","methods":["DELETE"]},"customers.index":{"uri":"customers","methods":["GET","HEAD"]},"customers.create":{"uri":"customers\/create","methods":["GET","HEAD"]},"customers.store":{"uri":"customers","methods":["POST"]},"customers.show":{"uri":"customers\/{customer}","methods":["GET","HEAD"],"parameters":["customer"],"bindings":{"customer":"id"}},"customers.edit":{"uri":"customers\/{customer}\/edit","methods":["GET","HEAD"],"parameters":["customer"],"bindings":{"customer":"id"}},"customers.update":{"uri":"customers\/{customer}","methods":["PUT","PATCH"],"parameters":["customer"],"bindings":{"customer":"id"}},"customers.destroy":{"uri":"customers\/{customer}","methods":["DELETE"],"parameters":["customer"],"bindings":{"customer":"id"}},"categories.index":{"uri":"categories","methods":["GET","HEAD"]},"categories.create":{"uri":"categories\/create","methods":["GET","HEAD"]},"categories.store":{"uri":"categories","methods":["POST"]},"categories.show":{"uri":"categories\/{category}","methods":["GET","HEAD"],"parameters":["category"],"bindings":{"category":"id"}},"categories.edit":{"uri":"categories\/{category}\/edit","methods":["GET","HEAD"],"parameters":["category"],"bindings":{"category":"id"}},"categories.update":{"uri":"categories\/{category}","methods":["PUT","PATCH"],"parameters":["category"],"bindings":{"category":"id"}},"categories.destroy":{"uri":"categories\/{category}","methods":["DELETE"],"parameters":["category"],"bindings":{"category":"id"}},"categories.toggle-status":{"uri":"categories\/{category}\/toggle-status","methods":["PATCH"],"parameters":["category"],"bindings":{"category":"id"}},"vendors.index":{"uri":"vendors","methods":["GET","HEAD"]},"vendors.create":{"uri":"vendors\/create","methods":["GET","HEAD"]},"vendors.store":{"uri":"vendors","methods":["POST"]},"vendors.show":{"uri":"vendors\/{vendor}","methods":["GET","HEAD"],"parameters":["vendor"],"bindings":{"vendor":"id"}},"vendors.edit":{"uri":"vendors\/{vendor}\/edit","methods":["GET","HEAD"],"parameters":["vendor"],"bindings":{"vendor":"id"}},"vendors.update":{"uri":"vendors\/{vendor}","methods":["PUT","PATCH"],"parameters":["vendor"],"bindings":{"vendor":"id"}},"vendors.destroy":{"uri":"vendors\/{vendor}","methods":["DELETE"],"parameters":["vendor"],"bindings":{"vendor":"id"}},"items.index":{"uri":"items","methods":["GET","HEAD"]},"items.create":{"uri":"items\/create","methods":["GET","HEAD"]},"items.store":{"uri":"items","methods":["POST"]},"items.show":{"uri":"items\/{item}","methods":["GET","HEAD"],"parameters":["item"],"bindings":{"item":"id"}},"items.edit":{"uri":"items\/{item}\/edit","methods":["GET","HEAD"],"parameters":["item"],"bindings":{"item":"id"}},"items.update":{"uri":"items\/{item}","methods":["PUT","PATCH"],"parameters":["item"],"bindings":{"item":"id"}},"items.destroy":{"uri":"items\/{item}","methods":["DELETE"],"parameters":["item"],"bindings":{"item":"id"}},"items.active":{"uri":"items-api\/active","methods":["GET","HEAD"]},"purchase-bills.index":{"uri":"purchase-bills","methods":["GET","HEAD"]},"purchase-bills.create":{"uri":"purchase-bills\/create","methods":["GET","HEAD"]},"purchase-bills.store":{"uri":"purchase-bills","methods":["POST"]},"purchase-bills.show":{"uri":"purchase-bills\/{purchase_bill}","methods":["GET","HEAD"],"parameters":["purchase_bill"]},"purchase-bills.edit":{"uri":"purchase-bills\/{purchase_bill}\/edit","methods":["GET","HEAD"],"parameters":["purchase_bill"]},"purchase-bills.update":{"uri":"purchase-bills\/{purchase_bill}","methods":["PUT","PATCH"],"parameters":["purchase_bill"]},"purchase-bills.destroy":{"uri":"purchase-bills\/{purchase_bill}","methods":["DELETE"],"parameters":["purchase_bill"]},"billing.download":{"uri":"billing\/{billing}\/download","methods":["GET","HEAD"],"parameters":["billing"],"bindings":{"billing":"id"}},"billing.payments.add":{"uri":"billing\/{billing}\/payments","methods":["POST"],"parameters":["billing"],"bindings":{"billing":"id"}},"payments.receipt":{"uri":"payments\/{payment}\/receipt","methods":["GET","HEAD"],"parameters":["payment"],"bindings":{"payment":"id"}},"billing.index":{"uri":"billing","methods":["GET","HEAD"]},"billing.create":{"uri":"billing\/create","methods":["GET","HEAD"]},"billing.store":{"uri":"billing","methods":["POST"]},"billing.show":{"uri":"billing\/{billing}","methods":["GET","HEAD"],"parameters":["billing"],"bindings":{"billing":"id"}},"billing.edit":{"uri":"billing\/{billing}\/edit","methods":["GET","HEAD"],"parameters":["billing"],"bindings":{"billing":"id"}},"billing.update":{"uri":"billing\/{billing}","methods":["PUT","PATCH"],"parameters":["billing"],"bindings":{"billing":"id"}},"gst.index":{"uri":"gst","methods":["GET","HEAD"]},"daily-reports.index":{"uri":"daily-reports","methods":["GET","HEAD"]},"daily-reports.export":{"uri":"daily-reports\/export","methods":["GET","HEAD"]},"stocks.index":{"uri":"stocks","methods":["GET","HEAD"]},"stocks.show":{"uri":"stocks\/{stock}","methods":["GET","HEAD"],"parameters":["stock"],"bindings":{"stock":"id"}},"admin-users.index":{"uri":"admin-users","methods":["GET","HEAD"]},"admin-users.create":{"uri":"admin-users\/create","methods":["GET","HEAD"]},"admin-users.store":{"uri":"admin-users","methods":["POST"]},"admin-users.show":{"uri":"admin-users\/{user}","methods":["GET","HEAD"],"parameters":["user"]},"admin-users.edit":{"uri":"admin-users\/{user}\/edit","methods":["GET","HEAD"],"parameters":["user"]},"admin-users.update":{"uri":"admin-users\/{user}","methods":["PUT","PATCH"],"parameters":["user"]},"admin-users.destroy":{"uri":"admin-users\/{user}","methods":["DELETE"],"parameters":["user"]},"sub-admins.index":{"uri":"sub-admins","methods":["GET","HEAD"]},"sub-admins.create":{"uri":"sub-admins\/create","methods":["GET","HEAD"]},"sub-admins.store":{"uri":"sub-admins","methods":["POST"]},"sub-admins.show":{"uri":"sub-admins\/{user}","methods":["GET","HEAD"],"parameters":["user"],"bindings":{"user":"id"}},"sub-admins.edit":{"uri":"sub-admins\/{user}\/edit","methods":["GET","HEAD"],"parameters":["user"],"bindings":{"user":"id"}},"sub-admins.update":{"uri":"sub-admins\/{user}","methods":["PUT","PATCH"],"parameters":["user"],"bindings":{"user":"id"}},"sub-admins.destroy":{"uri":"sub-admins\/{user}","methods":["DELETE"],"parameters":["user"],"bindings":{"user":"id"}},"activity-logs.index":{"uri":"activity-logs","methods":["GET","HEAD"]},"activity-logs.show":{"uri":"activity-logs\/{activityLog}","methods":["GET","HEAD"],"parameters":["activityLog"],"bindings":{"activityLog":"id"}},"activity-logs.export":{"uri":"activity-logs\/export","methods":["POST"]},"activity-logs.clear":{"uri":"activity-logs\/clear","methods":["DELETE"]},"activity-logs.request-delete-otp":{"uri":"activity-logs\/request-delete-otp","methods":["POST"]},"activity-logs.verify-delete-otp":{"uri":"activity-logs\/verify-delete-otp","methods":["POST"]},"activity-logs.destroy":{"uri":"activity-logs\/{activityLog}","methods":["DELETE"],"parameters":["activityLog"],"bindings":{"activityLog":"id"}},"settings.edit":{"uri":"settings","methods":["GET","HEAD"]},"settings.update":{"uri":"settings","methods":["PATCH"]},"settings.website.edit":{"uri":"settings\/website","methods":["GET","HEAD"]},"settings.website.update":{"uri":"settings\/website","methods":["PATCH"]},"settings.invoice.edit":{"uri":"settings\/invoice","methods":["GET","HEAD"]},"settings.invoice.update":{"uri":"settings\/invoice","methods":["PATCH"]},"login":{"uri":"login","methods":["GET","HEAD"]},"password.update":{"uri":"password","methods":["PUT"]},"logout":{"uri":"logout","methods":["POST"]},"storage.local":{"uri":"storage\/{path}","methods":["GET","HEAD"],"wheres":{"path":".*"},"parameters":["path"]}}};
if (typeof window !== 'undefined' && typeof window.Ziggy !== 'undefined') {
  Object.assign(Ziggy.routes, window.Ziggy.routes);
}

const buildPathRegex = (uri) => {
  const escaped = uri.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const withParams = escaped.replace(/\\\{[^}]+\\\}/g, '[^/]+');
  return new RegExp(`^/${withParams}$`);
};

const resolveCurrentRouteName = () => {
  if (typeof window === 'undefined' || !window.location) {
    return null;
  }

  const currentPath = window.location.pathname;
  const routeEntries = Object.entries(Ziggy.routes || {});

  for (const [name, config] of routeEntries) {
    const uri = config?.uri || '';
    const normalizedUri = uri.startsWith('/') ? uri.slice(1) : uri;
    const regex = buildPathRegex(normalizedUri);

    if (regex.test(currentPath)) {
      return name;
    }
  }

  return null;
};

const route = function (name, params = {}, absolute = false) {
  if (typeof name === 'undefined') {
    return {
      current: function (pattern) {
        if (!pattern) return false;
        const currentRouteName = resolveCurrentRouteName();
        if (!currentRouteName) return false;

        if (pattern.includes('*')) {
          const regexPattern = pattern
            .replace(/\./g, '\\.')
            .replace(/\*/g, '.*');
          return new RegExp(`^${regexPattern}$`).test(currentRouteName);
        }

        return currentRouteName === pattern;
      },
    };
  }

  if (!Ziggy.routes || !Ziggy.routes[name]) {
    console.warn(`Route '${name}' not found.`);
    return '/' + name;
  }

  const routeData = Ziggy.routes[name];
  let uri = routeData.uri;

  let normalizedParams = params;
  if (routeData.parameters && Array.isArray(routeData.parameters) && routeData.parameters.length > 0) {
    if (normalizedParams === null || typeof normalizedParams === 'undefined') {
      normalizedParams = {};
    } else if (typeof normalizedParams !== 'object' || Array.isArray(normalizedParams)) {
      normalizedParams = {
        [routeData.parameters[0]]: normalizedParams,
      };
    }
  }

  if (routeData.parameters && Array.isArray(routeData.parameters)) {
    routeData.parameters.forEach((param) => {
      const boundKey = routeData.bindings ? routeData.bindings[param] : param;
      const value = normalizedParams[param] ?? normalizedParams[boundKey] ?? '';
      uri = uri.replace(`{${param}}`, value);
    });
  }

  const path = uri.startsWith('/') ? uri : '/' + uri;

  if (!absolute) {
    return path;
  }

  const protocol = Ziggy.https ? 'https' : 'http';
  const host = Ziggy.host || (typeof window !== 'undefined' ? window.location.host : 'localhost');
  return `${protocol}://${host}${path}`;
};

export { Ziggy, route };
