import '@src/platform/monitoring/instrumentation';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './platform/http/configure-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  configureApp(app);
  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
