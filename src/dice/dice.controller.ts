import { Controller, Get } from '@nestjs/common';
import { DiceMetricsService } from './dice-metrics.service';

@Controller('api/v1/dice')
export class DiceController {
  constructor(private readonly diceMetricsService: DiceMetricsService) {}

  @Get()
  roll() {
    const edge = Math.floor(Math.random() * (6 - 1 + 1) + 1);
    this.diceMetricsService.captureRoll(edge);

    return edge;
  }
}
