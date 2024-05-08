import { ContextIdFactory, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyConfigService } from './config/config.service';
import { AggregateByTenantContextIdStrategy } from './providers/client-aggregation.strategy';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(MyConfigService);
  const port = config.getPort()
  ContextIdFactory.apply(new AggregateByTenantContextIdStrategy());
  await app.listen(port || 3000);
}
bootstrap();
