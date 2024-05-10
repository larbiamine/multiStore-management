import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { MyConfigModule } from 'src/config/config.module';

@Module({ imports:[MyConfigModule], providers: [PrismaService], exports: [PrismaService] })
export class PrismaModule {}
