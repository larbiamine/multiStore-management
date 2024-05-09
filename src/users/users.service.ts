import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserType } from '@prisma/client';
import { MyConfigService } from 'src/config/config.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService,
      private configService: MyConfigService,
      ) {}

    // async create(createUserDto: CreateUserDto) {
    async create(createUserDto: CreateUserDto, admin: boolean = false) {
        const { email, storeId } = createUserDto;
        const existByEmail = await this.checkifEmailExist(email);
        const existByStoreId = await this.checkifStoreIdExist(storeId);
        
        if (existByStoreId) {
            throw new NotFoundException('StoreId already exist');
        }
        if (existByEmail) {
            throw new NotFoundException('Email already exist');
        }
        if (!admin && !storeId) {
            throw new NotFoundException('StoreId is required');
        }
        admin ? createUserDto.type = UserType.superAdmin : createUserDto.type = UserType.store;
        const user = await this.prisma.user.create({
            data: createUserDto,
        });
        // create schema for store
        const schema = await this.createSchema(storeId);

        if (schema != 0) {
          await this.prisma.user.delete({
            where: {
              email: email,
            },
          });
          throw new NotFoundException('Error creating store schema');
        }
       

        //delete user if schema creation fails

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
    async checkifStoreIdExist(storeId: string): Promise<boolean> {
        const existingUser = await this.prisma.user.findMany({
          where: {
            storeId: { equals: storeId },
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

      async createSchema(storeId:string): Promise<number|boolean> {
        const schemaName = `store_${storeId}`;
        return await this.prisma.createSchema(schemaName);
      }

      async findAll() {
        return this.prisma.user.findMany();
      }

}
