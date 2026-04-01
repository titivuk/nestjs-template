import { Module } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';
import { Als } from './als';

@Module({
  providers: [
    {
      provide: Als,
      useValue: new Als(new AsyncLocalStorage()),
    },
  ],
  exports: [Als],
})
export class AlsModule {}
