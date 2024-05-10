import {  NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MyConfigService } from './config/config.service';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    skipMissingProperties: false // Ensure validation of all properties
  }));
  const config = app.get(MyConfigService);
  const port = config.getPort()
  await app.listen(port || 3000);
}
bootstrap();
