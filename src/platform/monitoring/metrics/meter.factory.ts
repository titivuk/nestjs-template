import { Injectable } from '@nestjs/common';
import { Meter } from './meter';
import { OtelMeter } from './otel.meter';

@Injectable()
export class MeterFactory {
  private readonly meters: Map<string, Meter> = new Map();

  getMeter(name: string, version?: string): Meter {
    const key = this.getKey(name, version);

    // reuse meter for the same name and version
    let meter = this.meters.get(key);
    if (meter) {
      return meter;
    }

    meter = new OtelMeter(name, version);
    this.meters.set(key, meter);

    return meter;
  }

  private getKey(name: string, version?: string): string {
    if (typeof version !== 'string') {
      return name;
    }

    return `n:${name}_v:${version}`;
  }
}
