import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AlsModule } from '@platform/als/als.module';
import { HttpExceptionFilter } from './http.exception-filter';
import { AlsMiddleware } from './middlewares/als.middleware';
import { RequestContextMiddleware } from './middlewares/request-context.middleware';

@Module({
  imports: [AlsModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class HttpModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AlsMiddleware, RequestContextMiddleware).forRoutes('*');
  }
}
