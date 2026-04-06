import { Module } from '@nestjs/common';
import { MeterFactory } from './meter.factory';

@Module({
  providers: [MeterFactory],
  exports: [MeterFactory],
})
export class MonitoringModule {}
