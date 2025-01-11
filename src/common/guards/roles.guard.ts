// roles.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Retrieve the list of required roles from metadata
    const requiredRoles: Role[] = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // No roles required, allow access
    }

    // Retrieve user information from the request
    const request = context.switchToHttp().getRequest();
    // `request.user` is auto set in src/common/guards/jwt.strategy.ts, when the passport call method validate and return value
    const user = request.user;

    if (!user?.roles) {
      throw new ForbiddenException('Access denied: No role found');
    }

    // Check if the user has at least one of the required roles
    const hasRole: boolean = requiredRoles.some((requiredRole: string): boolean =>
      user.roles.includes(requiredRole),
    );
    if (!hasRole) {
      throw new ForbiddenException('Access denied: Insufficient permissions');
    }

    return true; // Valid role found
  }
}
