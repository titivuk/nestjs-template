import { registerAs } from '@nestjs/config';

export type MonitoringConfig = {
  exporterUrl: string;
};

export const monitoringConfig: MonitoringConfig = {
  exporterUrl: process.env.MONITORING_EXPORTER_URL!,
};

export const monitoringConfigNamespace = registerAs(
  'monitoring',
  () => monitoringConfig,
);
