import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersController } from './users.controller';
import { MyConfigModule } from 'src/config/config.module';
import { MyJwtModule } from 'src/jwt/jwt.module';
import { TenantMiddleware } from 'src/middlewares/tenant.middleware';

@Module({
  imports: [MyConfigModule, forwardRef(() => PrismaModule), MyJwtModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
