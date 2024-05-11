// config.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MyConfigService {
  constructor(private configService: ConfigService) {}

  getEncryptionKey(): string {
    return this.configService.get<string>('ENCRYPTION_KEY');
  }
  getJWTKey(): string {
    return this.configService.get<string>('JWT_SECRET');
  }
  getPort(): string {
    return this.configService.get<string>('PORT');
  }
  getDbUrl(): string {
    return this.configService.get<string>('DATABASE_URL');
  }
  getDbSchemaUrl(schema:string): string {
    return this.configService.get<string>('DATABASE_URL').replace('public', schema);
  }
  getRootHost(): string {
    return this.configService.get<string>('ROOT_HOSTNAME');
  }
  getDatabaseName(): string {
    return this.configService.get<string>('DATABASE_NAME');
  }
}
