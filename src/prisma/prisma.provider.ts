import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Request } from 'express';

@Injectable()
export class PrismaClientManager implements OnModuleDestroy {
  private clients: { [key: string]: PrismaClient } = {};

  getStoreId(request: Request):string {
    return request["storeId"];
  }

  getClient(request: Request): PrismaClient {
    const storeId = this.getStoreId(request);

    let client = this.clients[storeId];

    if (!client) {
      const databaseUrl = process.env.DATABASE_URL!.replace('public', storeId);

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
