import { Controller, Get, Req, UseGuards,  } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { TypeUser } from './decorators/types.decorators';
import { UserType } from '@prisma/client';
import { UserTypesGuard } from './user-type.guard';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService, 
      ) {}
    
    
      @UseGuards(JwtAuthGuard, UserTypesGuard)
      @TypeUser(UserType.superAdmin)
      @Get()
      findAll() {
        return this.usersService.findAll();
      }
}
