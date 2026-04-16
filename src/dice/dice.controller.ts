import { Controller, Get, Logger } from '@nestjs/common';
import { Counter, Meter } from '@src/platform/monitoring/metrics/meter';
import { MeterFactory } from '@src/platform/monitoring/metrics/meter.factory';

@Controller('api/v1/dice')
export class DiceController {
  private readonly logger = new Logger(DiceController.name);

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
    const value = Math.floor(Math.random() * (6 - 1 + 1) + 1);

    this.logger.log({ msg: 'roll dice', value });
    this.luckyRollCounter.increment(value, { 'dice.value': value });

    return value;
  }
}
