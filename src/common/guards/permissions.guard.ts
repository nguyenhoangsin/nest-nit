// permissions.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permission } from '../enums/permissions.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Retrieve the list of required permissions from metadata
    const requiredPermissions: Permission[] = this.reflector.get<Permission[]>(
      'permissions',
      context.getHandler(),
    );
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true; // No permissions required, allow access
    }

    // Retrieve user information from the request
    const request = context.switchToHttp().getRequest();
    // `request.user` is auto set in src/common/guards/jwt.strategy.ts, when the passport call method validate and return value
    const user = request.user;

    if (!user?.permissions) {
      throw new ForbiddenException('Access denied: No permissions found');
    }

    // Check if the user has at least one permission from the required list
    const hasPermission = requiredPermissions.some((requiredPermission: string): boolean =>
      user.permissions.includes(requiredPermission),
    );
    if (!hasPermission) {
      throw new ForbiddenException('Access denied: Insufficient permissions');
    }

    return true; // Valid permission found
  }
}
