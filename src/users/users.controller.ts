import { Controller, Get, Req, UseGuards,  } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService, 
      ) {}
    
    
      @UseGuards(JwtAuthGuard)
      @Get()
      findAll(@Req() request: Request) {
        console.log(request.headers);

        return this.usersService.findAll();
      }
}
