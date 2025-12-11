import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorators';

// User interface with the role property
interface RequestUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

// Extended request interface
interface AuthenticatedRequest {
  user: RequestUser;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles are required, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    // Check if user exists
    if (!user) {
      throw new ForbiddenException('You are not authenticated');
    }

    // Check if user has a role property
    if (!user.role) {
      throw new ForbiddenException('User role not defined');
    }

    // Check if user's role matches any of the required roles
    const hasRequiredRole = requiredRoles.some((role) => user.role === role);

    if (!hasRequiredRole) {
      throw new ForbiddenException('You do not have the required permissions');
    }

    return true;
  }
}
