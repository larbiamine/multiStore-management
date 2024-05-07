import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(MyConfigService);
  const port = config.getPort()
  await app.listen(port || 3000);
}
bootstrap();
