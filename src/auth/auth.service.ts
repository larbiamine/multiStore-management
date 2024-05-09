import { Injectable, NotFoundException } from '@nestjs/common';
import { MyConfigService } from 'src/config/config.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ReturnedUser } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import {AES, enc} from 'crypto-js';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { Prisma } from '@prisma/client';
import { MyJwtService } from 'src/jwt/jwt.service';
import { TokenResponse } from './auth.entity';
@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private configService: MyConfigService,
        private jwtService: MyJwtService
    ) {}

    async register(createUserDto: CreateUserDto, admin = false): Promise<ReturnedUser>{
        const { password, ...rest } = createUserDto;
        const EncryptionKey = this.configService.getEncryptionKey();
        if (!EncryptionKey) {
            throw new NotFoundException('Encryption key not found');
        }
        const encryptedPassword = AES.encrypt(password, EncryptionKey).toString();
        const user = await this.usersService.create({ ...rest, password: encryptedPassword }, admin);
        return user;
    }
    

    async validateUser(email: string, password: string): Promise<Prisma.UserCreateInput | null> {
        const user = await this.usersService.getUserByEmail(email);        
        if (!user) {
            return null;
        }
        const EncryptionKey = this.configService.getEncryptionKey();
        const decryptedPassword = AES.decrypt(user.password, EncryptionKey).toString(enc.Utf8);
        
        if (user && decryptedPassword === password) {
            return user;
        }

        return null;
    }

    async login(user: LoginUserDto): Promise<TokenResponse> {

        const validatedUser = await this.validateUser(user.email, user.password);

        if (!validatedUser) {
            throw new NotFoundException('Invalid credentials');
        }else{
            const {email, type, storeId} = validatedUser
            const payload = {
              email,
              type,
              storeId
            };
            return {
                token: await this.jwtService.generateToken(payload)
            };
        }

    }

}

