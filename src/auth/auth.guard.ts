import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserType } from '@prisma/client';
import { Request } from 'express';
import { MyJwtService } from 'src/jwt/jwt.service';

interface AuthRequest extends Request {
  auth?: any; // Modify 'any' to the type of 'auth' if you have a specific type
}

@Injectable()
// use this guard to protect routes that require a valid JWT token using the @UseGuards decorator
export class JwtAuthGuard implements CanActivate {
  constructor(private myJwtService: MyJwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const token = this.getToken(request);

    try {
      const auth = await this.myJwtService.verifyToken(token);

      const storeId = this.getStoreId(request);
      if (storeId != auth.storeId && auth.type == UserType.store) {
        throw new ForbiddenException('Cross store access not allowed');
      }
      request['auth'] = auth;

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw new ForbiddenException('Cross store access not allowed');
      } else {
        throw new UnauthorizedException('Invalid token');
      }
    }
  }
  getToken(request: Request): string {
    const authorization = request.header('Authorization');
    return authorization?.split(' ')[1];
  }
  getStoreId(req: any): string {
    const host = req.headers.host;
    const hostParts = host.split('.');
    return 'store_' + hostParts[0];
  }
}
