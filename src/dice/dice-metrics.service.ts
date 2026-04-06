import { Injectable } from '@nestjs/common';
import { type Meter } from '@opentelemetry/api';
import { MeterFactory } from '@src/platform/monitoring/meter.factory';

@Injectable()
export class DiceMetricsService {
  private readonly meter: Meter;

  private readonly luckyRollCounter;

  constructor(meterFactory: MeterFactory) {
    this.meter = meterFactory.getMeter('dice');
    this.luckyRollCounter = this.meter.createCounter(
      'dice.lucky-rolls.counter',
    );
  }

  captureRoll(roll: number) {
    this.luckyRollCounter.add(1, { 'dice.value': roll });
  }
}
