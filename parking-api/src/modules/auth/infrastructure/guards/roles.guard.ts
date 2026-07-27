import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../../users/domain/enums/role.enum';
import { ROLES_KEY } from '../../presentation/decorators/roles.decorator';
import { AuthenticatedUser } from '../strategies/jwt.strategy';

@Injectable()
export class RolesGuard {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser;

    if (!requiredRoles.includes(user.role as Role)) {
      throw new ForbiddenException('No tienes permisos para esta acción');
    }

    return true;
  }
}
