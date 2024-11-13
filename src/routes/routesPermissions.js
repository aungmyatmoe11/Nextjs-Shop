export const routePermissions = {
    '/dashboard' : [],
    '/products': ['products.view'],
    '/products/create': ['products.create'],
    '/products/edit': ['products.update'],
    '/products/[id]': ['products.view'], // Dynamic route pattern example
    // Add more route-to-permission mappings as needed
    "/users" : ["users.view"],
    "/users/create" : ["users.create"],
  };