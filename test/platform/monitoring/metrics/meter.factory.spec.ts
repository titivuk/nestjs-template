import { MeterFactory } from '@src/platform/monitoring/metrics/meter.factory';

describe('MeterFactory', () => {
  it('should return new meter', () => {
    const factory = new MeterFactory();

    const meter = factory.getMeter('test');

    expect(meter).toBeDefined();
  });

  it('should return existing meter', () => {
    const factory = new MeterFactory();
    const originalMeter = factory.getMeter('test');

    const meter = factory.getMeter('test');

    expect(meter).toBe(originalMeter);
  });

  it('should return new versioned meter', () => {
    const factory = new MeterFactory();
    const originalMeter = factory.getMeter('test');

    const meter = factory.getMeter('test', 'v2');

    expect(meter).not.toBe(originalMeter);
  });

  it('should return existing versioned meter', () => {
    const factory = new MeterFactory();
    const originalMeter = factory.getMeter('test', 'v2');

    const meter = factory.getMeter('test', 'v2');

    expect(meter).toBe(originalMeter);
  });
});
