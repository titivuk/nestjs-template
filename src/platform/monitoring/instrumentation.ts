import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-grpc';
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
import { ATTR_DEPLOYMENT_ENVIRONMENT_NAME } from '@opentelemetry/semantic-conventions/incubating';
import { appConfig } from '../config/app.config';
import { monitoringConfig } from './monitoring.config';

const resource = defaultResource().merge(
  resourceFromAttributes({
    [ATTR_SERVICE_NAME]: appConfig.name,
    [ATTR_DEPLOYMENT_ENVIRONMENT_NAME]: appConfig.env,
    [ATTR_SERVICE_VERSION]: '1.0.0',
  }),
);

const sdk = new NodeSDK({
  resource,
  // OTEL_LOGS_EXPORER=none set to disable tracing
  // traceExporter: new OTLPTraceExporter({
  //   url: monitoringConfig.exporterUrl,
  // }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: monitoringConfig.exporterUrl,
    }),
    exportIntervalMillis: 10_000,
    exportTimeoutMillis: 5_000,
  }),
  instrumentations: [getNodeAutoInstrumentations()],
  resourceDetectors: [envDetector, processDetector, containerDetector],
});

sdk.start();

// TODO:
// gracefull shutdown
// sdk.shutdown().finally(() => exist)
// most likely await sdk.shutdown();
