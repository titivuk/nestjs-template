import { Module } from '@nestjs/common';
import { AppLogger } from './app.logger';
import { PINO_LOGGER_KEY, pinoLogger } from './pino';

@Module({
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
