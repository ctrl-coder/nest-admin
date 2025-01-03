import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { SharedModule } from './shared/shared.module';
import { ServerConfigService } from './shared/services/config.service';
import { ValidationPipe } from '@nestjs/common';

import './global.polyfill';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule);

  const configService = app.select(SharedModule).get(ServerConfigService);
  const port = configService.appConfig.port;

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
}
bootstrap();
