import { Controller, Get } from '@nestjs/common';
import { Counter, Meter } from '@src/platform/monitoring/metrics/meter';
import { MeterFactory } from '@src/platform/monitoring/metrics/meter.factory';

@Controller('api/v1/dice')
export class DiceController {
  private readonly meter: Meter;
  private readonly luckyRollCounter: Counter<{ 'dice.value': number }>;

  constructor(meterFactory: MeterFactory) {
    this.meter = meterFactory.getMeter('dice');
    this.luckyRollCounter = this.meter.createCounter(
      'dice.lucky-rolls.counter',
      {
        description: 'Dice lucky rolls counter',
      },
    );
  }

  @Get()
  roll() {
    const edge = Math.floor(Math.random() * (6 - 1 + 1) + 1);
    this.luckyRollCounter.increment(edge, { 'dice.value': edge });

    return edge;
  }
}
