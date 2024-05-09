import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserType } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    // async create(createUserDto: CreateUserDto) {
    async create(createUserDto: CreateUserDto, admin: boolean = false) {
        const { email } = createUserDto;
        const existByEmail = await this.checkifEmailExist(email);

        if (existByEmail) {
            throw new NotFoundException('Email already exist');
        }
        admin ? createUserDto.type = UserType.owner : createUserDto.type = UserType.guest;
        const user = await this.prisma.user.create({
            data: createUserDto,
        });
        const { password, ...returnUser } = user;
        return returnUser;
    }


    async checkifEmailExist(email: string): Promise<boolean> {
        const existingUser = await this.prisma.user.findMany({
          where: {
            email: { equals: email },
          },
        });
    
        return existingUser.length > 0;
      }

      async getUserByEmail(email: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
          where: {
            email: email,
          },
        });
        return user;
      }

      async findAll() {
        return this.prisma.user.findMany();
      }

}
