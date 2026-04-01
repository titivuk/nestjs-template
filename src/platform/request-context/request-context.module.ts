import { Module } from '@nestjs/common';
import { AlsModule } from '../als/als.module';
import { RequestContextService } from './request-context.service';

@Module({
  imports: [AlsModule],
  providers: [RequestContextService],
  exports: [RequestContextService],
})
export class RequestContextModule {}
