import { Module } from '@nestjs/common';
import { MeterFactory } from './metrics/meter.factory';

@Module({
  providers: [MeterFactory],
  exports: [MeterFactory],
})
export class MonitoringModule {}
