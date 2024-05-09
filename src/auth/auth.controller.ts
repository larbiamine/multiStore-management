import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { UserTypesGuard } from 'src/users/user-type.guard';
import { JwtAuthGuard } from './auth.guard';
import { TypeUser } from 'src/users/decorators/types.decorators';
import { ReturnedUser } from 'src/users/user.entity';
import { TokenResponse } from './auth.entity';
import { UserType } from '@prisma/client';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto):Promise<ReturnedUser> {
      return this.authService.register(createUserDto);
    }

    @UseGuards(JwtAuthGuard, UserTypesGuard)
    @TypeUser(UserType.superAdmin)
    @Post('registeradmin')
    async registerAdmin(@Body() createUserDto: CreateUserDto): Promise<ReturnedUser> {
      return this.authService.register(createUserDto, true);
    }

    @Post('login')
    async login(@Request() req):Promise<TokenResponse> {
  
      const user = req.body;

      return this.authService.login(user);
    }

}
