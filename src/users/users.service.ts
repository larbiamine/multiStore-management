import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserType } from '@prisma/client';
import { MyConfigService } from 'src/config/config.service';
import { ReturnedUser } from './user.entity';

@Injectable()
export class UsersService {
    constructor(
      @Inject(forwardRef(() => PrismaService))
      private prisma: PrismaService,
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
        const schemaName = `store_${storeId}`
        const schema = await this.createSchema(schemaName);

        const productTable = await this.createTable("Product",schemaName);
        const orderTable = await this.createTable("Order",schemaName);

        const relations = 0;
        // const relations = await this.prisma.runRelations("relations", schemaName);

        if (schema != 0 || productTable != 0 || orderTable != 0 || relations != 0) {
          //delete user if schema creation fails
          await this.prisma.user.delete({
            where: {
              email: email,
            },
          });
          throw new NotFoundException('Error creating store schema');
        }
  

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
      async findOneByStoreId(storeId: string): Promise<User | null> {
        const user = await this.prisma.user.findFirst({
          where: {
            storeId: storeId,
          },
        });
        return user;
      }

      async createSchema(schemaName:string): Promise<number|boolean> {
        
        return await this.prisma.createSchema(schemaName);
      }
      async createTable(tableName:string, schemaName:string): Promise<number|boolean> {
        
        // return await this.prisma.createTable(tableName, schemaName);
        return await this.prisma.createNewTable(tableName, schemaName);
      }

      async findAll(): Promise<ReturnedUser[]>{
        const users = await this.prisma.user.findMany();
        const filteredUsers = users.map((user) => {
          const { password, ...rest } = user;
          return rest;
        })
        return filteredUsers;
      }

}
