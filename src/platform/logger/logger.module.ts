import { Module } from '@nestjs/common';
import { AppLogger } from './app.logger';
import { PINO_LOGGER_KEY, pinoLogger } from './pino';
import { RequestContextModule } from '../request-context/request-context.module';

@Module({
  imports: [RequestContextModule],
  providers: [
    AppLogger,
    {
      provide: PINO_LOGGER_KEY,
      useValue: pinoLogger,
    },
  ],
  exports: [AppLogger],
})
export class LoggerModule {}
