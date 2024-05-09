import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
  private prisma: PrismaClient;
  constructor() {
    super();
    this.prisma = new PrismaClient();
  }

  async createSchema(schemaName: string): Promise<number | boolean> {
    try {
      const result = await this.prisma
        .$executeRaw`CREATE SCHEMA ${Prisma.raw(schemaName)};`;
      return result;
    } catch (error) {
      console.log('🆘 || error:', error);
      return false;
    }
  }
  async createTable(tableName: string): Promise<number | boolean> {
    try {
      const result = await this.prisma
        .$executeRaw`CREATE TABLE ${Prisma.raw(tableName)};`;
      return result;
    } catch (error) {
      console.log('🆘 || error:', error);
      return false;
    }
  }
}
