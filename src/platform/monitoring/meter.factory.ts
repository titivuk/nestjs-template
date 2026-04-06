import { Injectable } from '@nestjs/common';
import { type Meter, metrics } from '@opentelemetry/api';

@Injectable()
export class MeterFactory {
  getMeter(name: string): Meter {
    return metrics.getMeter(name);
  }
}
