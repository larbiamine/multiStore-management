import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { Request } from 'express';
  import { MyJwtService } from 'src/jwt/jwt.service';
  
  interface AuthRequest extends Request {
    auth?: any; // Modify 'any' to the type of 'auth' if you have a specific type
  }

  @Injectable()
  // use this guard to protect routes that require a valid JWT token using the @UseGuards decorator
  export class JwtAuthGuard implements CanActivate {
    constructor(
      private myJwtService: MyJwtService,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<AuthRequest>();
      const token = this.getToken(request);

      try {
        const auth = await this.myJwtService.verifyToken(token);

        request['auth'] = auth;
        return true;
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }
    }
    getToken(request: Request): string {
      const authorization = request.header('Authorization');
      return authorization?.split(' ')[1];
    }
  }
  