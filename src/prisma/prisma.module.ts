import { Module, forwardRef } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { MyConfigModule } from 'src/config/config.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [MyConfigModule, forwardRef(() => UsersModule)],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
