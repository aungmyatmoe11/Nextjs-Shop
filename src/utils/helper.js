export function hasPermission(userPermissions, requiredPermissions) {
    return requiredPermissions.some(permission => userPermissions.includes(permission));
  }