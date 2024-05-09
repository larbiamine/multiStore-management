import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
const fs = require('fs');
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
  async createTable(tableName: string, schemaName:string): Promise<number | boolean> {
    try {
      const filePath = `./src/database/tableCreations/${tableName}.sql`;
      let sqlScript = fs.readFileSync(filePath, 'utf8');
      sqlScript = sqlScript.replace(`CREATE TABLE "${tableName}"`, `CREATE TABLE ${schemaName}."${tableName}"`);      // const res = await this.prisma.$executeRaw(sqlScript);
      const res = await this.prisma.$executeRawUnsafe(sqlScript);

      return res;
    } catch (error) {
      console.log('🆘 || error:', error);
      return false;
    }
  }
  async runRelations(fileName: string, storeId:string): Promise<number | boolean> {
    try {
      const filePath = `./src/database/tableCreations/${fileName}.sql`;
      let sqlScript = fs.readFileSync(filePath, 'utf8');
      sqlScript = sqlScript.replace(`"Product"`, `${storeId}."Product"`);      // const res = await this.prisma.$executeRaw(sqlScript);
      sqlScript = sqlScript.replace(`"Order"`, `${storeId}."Order"`);      // const res = await this.prisma.$executeRaw(sqlScript);
      const res = await this.prisma.$executeRawUnsafe(sqlScript);

      return res;
    } catch (error) {
      console.log('🆘 || error:', error);
      return false;
    }
  }
}
