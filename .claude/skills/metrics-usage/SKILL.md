---
name: metrics-usage
description: Custom metrics instrumentation pattern using OpenTelemetry meters. Use when adding metrics, counters, histograms, or gauges to a module. Use when user says "add metrics", "track metric", "instrument", "counter", "histogram", or "observable gauge".
---

# Metrics Usage

## When to use this skill

- Adding custom metrics (counters, histograms, gauges) to any module
- Creating a new metrics service for a module

## Architecture decision

The monitoring module (`src/platform/monitoring/`) provides `MeterFactory` which returns OpenTelemetry `Meter` instances directly. There is **no custom abstraction** over OpenTelemetry meter/instrument APIs.

Each feature module that needs metrics creates its own `*-metrics.service.ts` wrapper. This keeps OpenTelemetry usage localized per module — if we later decide to abstract, only these wrapper classes need to change.

## How to add metrics to a module

### Step 1: Create a metrics service in the feature module

Create `<module-name>-metrics.service.ts` in the module's directory.

```typescript
import { Injectable } from '@nestjs/common';
import { type Meter } from '@opentelemetry/api';
import { MeterFactory } from '@src/platform/monitoring/meter.factory';

@Injectable()
export class <ModuleName>MetricsService {
  private readonly meter: Meter;

  // Declare instruments as private readonly fields
  private readonly myCounter;

  constructor(meterFactory: MeterFactory) {
    // Meter name should match the module/domain name/use case name
    this.meter = meterFactory.getMeter('<module-name>');

    // Create instruments in constructor
    this.myCounter = this.meter.createCounter('<module-name>.<metric-name>.counter');
  }

  // Expose domain-meaningful methods, not raw instruments
  captureMyEvent(value: number, attributes?: Record<string, string | number>) {
    this.myCounter.add(value, attributes);
  }
}
```

### Step 2: Register in the feature module

Import `MonitoringModule` and provide the metrics service:

```typescript
import { Module } from '@nestjs/common';
import { MonitoringModule } from '@src/platform/monitoring/monitoring.module';
import { <ModuleName>MetricsService } from './<module-name>-metrics.service';

@Module({
  imports: [MonitoringModule],
  providers: [<ModuleName>MetricsService],
})
export class <ModuleName>Module {}
```

### Step 3: Inject and use in controllers/services

```typescript
constructor(private readonly metrics: <ModuleName>MetricsService) {}

someMethod() {
  this.metrics.captureMyEvent(1, { 'some.attribute': 'value' });
}
```

## Naming conventions

- Meter name: module/domain name (e.g., `dice`, `todo`, `auth`)
- Metric name: `<domain>.<what>.<instrument-type>` (e.g., `dice.lucky-rolls.counter`)
- Attribute keys: dot-separated, lowercase (e.g., `dice.value`, `http.method`)

## OpenTelemetry instrument types

Use the appropriate instrument from the `Meter` instance:

| Method                                | Use case                                                             |
| ------------------------------------- | -------------------------------------------------------------------- |
| `createCounter(name)`                 | Monotonically increasing value (requests, errors, events)            |
| `createUpDownCounter(name)`           | Value that can increase or decrease (queue size, active connections) |
| `createHistogram(name)`               | Distribution of values (latency, response size)                      |
| `createObservableGauge(name)`         | Current snapshot value via callback (CPU usage, memory)              |
| `createObservableCounter(name)`       | Monotonic value read via callback                                    |
| `createObservableUpDownCounter(name)` | Up/down value read via callback                                      |

## Key rules

- **One metrics service per feature module** — do not share across modules
- **Domain methods, not raw instruments** — the metrics service exposes business-meaningful methods (e.g., `captureRoll`, `trackLatency`), not generic `add`/`record`
- **Import only `type Meter`** — use `import { type Meter }` to avoid pulling in implementation at the type level
- **All instrument creation in constructor** — instruments are created once, reused across calls
