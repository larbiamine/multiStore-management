import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/auth.entity';

@Injectable()
export class MyJwtService {

    constructor(private jwtService: JwtService) {}

    async generateToken(payload: JwtPayload): Promise<string> {
        return this.jwtService.sign(payload);
    }

    async verifyToken(token: string): Promise<any> {
        return this.jwtService.verify(token);
    }
}
