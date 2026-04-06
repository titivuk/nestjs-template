import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { containerDetector } from '@opentelemetry/resource-detector-container';
import {
  defaultResource,
  envDetector,
  processDetector,
  resourceFromAttributes,
} from '@opentelemetry/resources';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const resource = defaultResource().merge(
  resourceFromAttributes({
    // TODO: good place for application level config
    [ATTR_SERVICE_NAME]: 'nestjs-template',
    [ATTR_SERVICE_VERSION]: '1.0.0',
  }),
);

const sdk = new NodeSDK({
  resource,
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
  resourceDetectors: [envDetector, processDetector, containerDetector],
});

sdk.start();

// TODO:
// gracefull shutdown
// sdk.shutdown().finally(() => exist)
// most likely await sdk.shutdown();
