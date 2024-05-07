import { PrismaClient } from '@prisma/client';
import {
  FactoryProvider,
  Injectable,
  OnModuleDestroy,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class PrismaClientManager implements OnModuleDestroy {
  private clients: { [key: string]: PrismaClient } = {};

  async getClient(tenantId: string): Promise<PrismaClient> {
    let client = this.clients[tenantId];
    if (!client) {
      const databaseUrl = process.env.DATABASE_URL.replace('public', tenantId);

      client = new PrismaClient({
        datasources: {
          db: {
            url: databaseUrl,
          },
        },
      });
      this.clients[tenantId] = client;
    }
    return client;
  }

  async onModuleDestroy() {
    await Promise.all(
      Object.values(this.clients).map((client) => client.$disconnect()),
    );
  }
}

export interface ContextPayload {
  tenantId: string;
}

export const prismaClientProvider: FactoryProvider<PrismaClient> = {
  provide: PrismaClient,
  scope: Scope.REQUEST,
  useFactory: (ctxPayload: ContextPayload, manager: PrismaClientManager) => {
    return manager.getClient(ctxPayload.tenantId);
  },
  inject: [REQUEST, PrismaClientManager],
};
