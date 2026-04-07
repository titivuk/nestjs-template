export interface Meter {
  createCounter<TAttributes extends MetricAttributes>(
    name: string,
    options: MetricOptions,
  ): Counter<TAttributes>;
  createGauge<TAttributes extends MetricAttributes>(
    name: string,
    options: MetricOptions,
  ): Gauge<TAttributes>;
  createHistorgram<TAttributes extends MetricAttributes>(
    name: string,
    options: HistogramMetricOptions,
  ): Histogram<TAttributes>;
}

export type MetricOptions = {
  description?: string;
};

export type HistogramMetricOptions = MetricOptions & {
  bucketBoundaries?: number[];
};

export interface Counter<
  TAttributes extends MetricAttributes = MetricAttributes,
> {
  /**
   * @param value must be positive
   */
  increment(value: number, attributes: TAttributes): void;
}

export interface Gauge<
  TAttributes extends MetricAttributes = MetricAttributes,
> {
  set(value: number, attributes: TAttributes): void;
}

export interface Histogram<
  TAttributes extends MetricAttributes = MetricAttributes,
> {
  add(value: number, attributes: TAttributes): void;
}

export type MetricAttributes = Record<string, any>;
