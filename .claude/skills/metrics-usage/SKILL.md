---
name: metrics-usage
description: Custom metrics instrumentation pattern using the Meter abstraction over OpenTelemetry. Use when adding metrics, counters, histograms, or gauges to a module. Use when user says "add metrics", "track metric", "instrument", "counter", "histogram", or "gauge".
---

# Metrics Usage

## When to use this skill

- Adding custom metrics (counters, histograms, gauges) to any controller or service

## Architecture

The monitoring module (`src/platform/monitoring/`) provides a custom `Meter` abstraction that wraps OpenTelemetry. Feature modules never import from `@opentelemetry/api` directly — they use the custom interfaces from `@src/platform/monitoring/metrics/meter`.

`MeterFactory` creates and caches `Meter` instances. Instruments are created directly in the class that uses them (no separate metrics service).

## How to add metrics

### Step 1: Import MonitoringModule in the feature module

```typescript
import { Module } from '@nestjs/common';
import { MonitoringModule } from '@src/platform/monitoring/monitoring.module';

@Module({
  imports: [MonitoringModule],
})
export class <ModuleName>Module {}
```

### Step 2: Create instruments

```typescript
import { Counter, Meter } from '@src/platform/monitoring/metrics/meter';
import { MeterFactory } from '@src/platform/monitoring/metrics/meter.factory';

@Controller('api/v1/<resource>')
export class <Resource>Controller {
  private readonly meter: Meter;
  private readonly myCounter: Counter<{ 'some.attribute': string }>;

  constructor(meterFactory: MeterFactory) {
    this.meter = meterFactory.getMeter('<module-name>');
    this.myCounter = this.meter.createCounter('module.metric-name.counter', {
      description: 'Description of counter',
    });
  }

  someMethod() {
    this.myCounter.increment(1, { 'some.attribute': 'value' });
  }
}
```

## Available instruments

Import types from `@src/platform/monitoring/metrics/meter`.

| Factory method                       | Interface      | Record method                        | Use case                                            |
| ------------------------------------ | -------------- | ------------------------------------ | --------------------------------------------------- |
| `meter.createCounter(name, opts)`    | `Counter<T>`   | `counter.increment(value, attrs)`    | Monotonically increasing (requests, errors, events) |
| `meter.createGauge(name, opts)`      | `Gauge<T>`     | `gauge.set(value, attrs)`            | Current snapshot (queue size, active connections)    |
| `meter.createHistorgram(name, opts)` | `Histogram<T>` | `histogram.add(value, attrs)`        | Distribution of values (latency, response size)     |

Histogram accepts additional `bucketBoundaries` option:

```typescript
this.meter.createHistorgram('module.latency.histogram', {
  description: 'Request latency',
  bucketBoundaries: [5, 10, 25, 50, 100, 250, 500, 1000],
});
```

## Typed attributes

Use the generic parameter on instrument types to define the attribute shape:

```typescript
private readonly rollCounter: Counter<{ 'dice.value': number }>;
```

This enforces that callers pass the correct attributes at call sites.

## Naming conventions

- **Meter name**: module/domain name (e.g., `dice`, `todo`, `auth`)
- **Metric name**: `<domain>.<what>.<instrument-type>` (e.g., `dice.lucky-rolls.counter`)
- **Attribute keys**: dot-separated, lowercase (e.g., `dice.value`, `http.method`)

## Key rules

- **Never import from `@opentelemetry/api`** — use `@src/platform/monitoring/metrics/meter` for types and `@src/platform/monitoring/metrics/meter.factory` for `MeterFactory`
- **Create instruments in constructor** — instruments are created once, reused across calls
- **Use typed attributes** — define attribute shape via the generic parameter on `Counter<T>`, `Gauge<T>`, `Histogram<T>`
