import '@src/platform/monitoring/instrumentation';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './platform/http/configure-app';
import { AppLogger } from './platform/logger/app.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(AppLogger));

  configureApp(app);
  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
