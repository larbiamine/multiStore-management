import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TenantMiddleware } from 'src/middlewares/tenant.middleware';
import { MyConfigModule } from 'src/config/config.module';

@Module({
  imports: [MyConfigModule],
  providers: [ProductService],
  controllers: [ProductController]
})
export class ProductModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes(ProductController);
  }
}
