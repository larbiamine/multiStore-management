import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RequestContextModule } from 'nestjs-request-context';
import { MyConfigModule } from './config/config.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    RequestContextModule,
    MyConfigModule,
    ProductModule,
    OrderModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
