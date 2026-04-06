import { Module } from '@nestjs/common';
import { MonitoringModule } from '@src/platform/monitoring/monitoring.module';
import { DiceMetricsService } from './dice-metrics.service';
import { DiceController } from './dice.controller';

@Module({
  imports: [MonitoringModule],
  controllers: [DiceController],
  providers: [DiceMetricsService],
})
export class DiceModule {}
