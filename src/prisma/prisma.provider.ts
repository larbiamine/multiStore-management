import { Inject, Injectable, NotFoundException, OnModuleDestroy, forwardRef } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { Request } from 'express';
import { MyConfigService } from 'src/config/config.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PrismaClientManager implements OnModuleDestroy {
  private clients: { [key: string]: PrismaClient } = {};

  constructor(
    private configService: MyConfigService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async getUserByStore(storeId: string): Promise<User> {
    return await this.usersService.findOneByStoreId(storeId);
  }

  async getClient(request: Request): Promise<PrismaClient> {
    const storeId = request['storeId'];

    let client = this.clients[storeId];

    if (!client) {
      const user = await this.getUserByStore(storeId);
      // check if store exists in the database
      if (!user) {
        throw new NotFoundException('Store not found');
      }

      // const databaseUrl = process.env.DATABASE_URL!.replace('public', storeId);
      const databaseUrl = this.configService
        .getDbUrl()
        .replace('public', storeId);

      client = new PrismaClient({
        datasources: {
          db: {
            url: databaseUrl,
          },
        },
      });

      // setup prisma middlewares if any

      this.clients[storeId] = client;
    }

    return client;
  }

  async onModuleDestroy() {
    await Promise.all(
      Object.values(this.clients).map((client) => client.$disconnect()),
    );
  }
}
