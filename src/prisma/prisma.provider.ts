import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Request } from 'express';
import { MyConfigService } from 'src/config/config.service';

@Injectable()
export class PrismaClientManager implements OnModuleDestroy {
  private clients: { [key: string]: PrismaClient } = {};
  private configService: MyConfigService
  getStoreId(request: Request):string {
    return request["storeId"];
  }

  getClient(request: Request): PrismaClient {
    const storeId = this.getStoreId(request);

    let client = this.clients[storeId];

    if (!client) {
      // const databaseUrl = process.env.DATABASE_URL!.replace('public', storeId);
      const databaseUrl = this.configService.getDbUrl().replace('public', storeId);

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
