import { Request } from 'express';
import { PrismaClient } from '@prisma/client';
import { FactoryProvider, Injectable, OnModuleDestroy, Scope } from '@nestjs/common';
import { MyConfigService } from 'src/config/config.service';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class PrismaClientManager implements OnModuleDestroy {
  private clients: { [key: string]: PrismaClient } = {};

  constructor(private configService: MyConfigService) {}

  async getClient(tenantId: string): Promise<PrismaClient> {

    let client = this.clients[tenantId];
    if (!client) {
      //   const databaseUrl = process.env.DATABASE_URL.replace('public', tenantId);
      const databaseUrl = this.configService
        .getDbUrl()
        .replace('public', tenantId);

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
    durable: true, // Makes this provider durable
    useFactory: (ctxPayload: ContextPayload, manager: PrismaClientManager) => {
      /* 
        The tenantId in the context payload registered 
        in the AggregateByTenantContextIdStrategy 
      */
      return manager.getClient(ctxPayload.tenantId);
    },
    inject: [REQUEST, PrismaClientManager],
  };