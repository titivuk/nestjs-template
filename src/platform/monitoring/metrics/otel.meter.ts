import * as otelApi from '@opentelemetry/api';
import {
  Counter,
  Gauge,
  Histogram,
  HistogramMetricOptions,
  Meter,
  MetricAttributes,
  MetricOptions,
} from './meter';

export class OtelMeter implements Meter {
  private readonly meter: otelApi.Meter;

  constructor(name: string, version?: string) {
    this.meter = otelApi.metrics.getMeter(name, version);
  }

  createCounter(name: string, options?: MetricOptions): Counter {
    const otelOptions: otelApi.MetricOptions = {};
    if (options?.description) otelOptions.description = options.description;

    return new OtelCounter(this.meter.createCounter(name, otelOptions));
  }

  createGauge(name: string, options: MetricOptions): Gauge {
    const otelOptions: otelApi.MetricOptions = {};
    if (options?.description) otelOptions.description = options.description;

    return new OtelGauge(this.meter.createGauge(name, otelOptions));
  }

  createHistorgram(name: string, options: HistogramMetricOptions): Histogram {
    const otelOptions: otelApi.MetricOptions = {};
    if (options?.description) otelOptions.description = options.description;
    if (options?.bucketBoundaries)
      otelOptions.advice = {
        explicitBucketBoundaries: options.bucketBoundaries,
      };

    return new OtelHistogram(this.meter.createGauge(name, otelOptions));
  }
}

class OtelCounter implements Counter {
  constructor(private readonly counter: otelApi.Counter) {}

  increment(value: number, attributes: MetricAttributes) {
    this.counter.add(value, attributes);
  }
}

class OtelGauge implements Gauge {
  constructor(private readonly gauge: otelApi.Gauge) {}

  set(value: number, attributes: MetricAttributes) {
    this.gauge.record(value, attributes);
  }
}

class OtelHistogram implements Histogram {
  constructor(private readonly histogram: otelApi.Histogram) {}

  add(value: number, attributes: MetricAttributes) {
    this.histogram.record(value, attributes);
  }
}
