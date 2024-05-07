import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RequestContextModule } from 'nestjs-request-context';
import { MyConfigModule } from './config/config.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { TenantController } from './tenant/tenant.controller';
import { TenantModule } from './tenant/tenant.module';

@Module({
  imports: [PrismaModule, RequestContextModule, MyConfigModule, ProductModule, OrderModule, TenantModule],
  controllers: [AppController, TenantController],
  providers: [AppService],
})
export class AppModule {}
