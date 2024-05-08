import { FactoryProvider, Global, Module, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { Request } from 'express';
import { PrismaClientManager } from 'src/prisma/prisma.provider';

const prismaClientProvider: FactoryProvider<PrismaClient> = {
  provide: PrismaClient,
  scope: Scope.REQUEST,
  inject: [REQUEST, PrismaClientManager],
  useFactory: (request: Request, manager: PrismaClientManager) =>
    manager.getClient(request),
};
@Global()
@Module({
  providers: [PrismaClientManager, prismaClientProvider],
  exports: [PrismaClient],
})
export class DatabaseModule {}
