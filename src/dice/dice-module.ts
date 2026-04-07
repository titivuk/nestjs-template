import { Module } from '@nestjs/common';
import { MonitoringModule } from '@src/platform/monitoring/monitoring.module';
import { DiceController } from './dice.controller';

@Module({
  imports: [MonitoringModule],
  controllers: [DiceController],
})
export class DiceModule {}
