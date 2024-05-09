import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from './enums/user-type.enum';
import { USER_TYPES_KEY } from './decorators/types.decorators';

@Injectable()
export class UserTypesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredUserTypes = this.reflector.getAllAndOverride<UserType[]>(
      USER_TYPES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredUserTypes) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    const auth = request.auth; 

    if (!auth) {
      return false;
    } else {
      return auth.type === requiredUserTypes[0];
    }
  }
}
