import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';

const sdk = new NodeSDK({
  // TODO: good place for application level config
  serviceName: 'nestjs-template',
  // TOOD: urls should be dynamic
  traceExporter: new OTLPTraceExporter({
    url: 'http://localhost:4317',
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: 'http://localhost:4317',
    }),
    exportIntervalMillis: 10_000,
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

// TODO:
// gracefull shutdown
// sdk.shutdown().finally(() => exist)
// most likely await sdk.shutdown();
