import { Module, OnApplicationShutdown } from '@nestjs/common';
import { sdk } from './instrumentation';
import { MeterFactory } from './metrics/meter.factory';

@Module({
  providers: [MeterFactory],
  exports: [MeterFactory],
})
export class MonitoringModule implements OnApplicationShutdown {
  async onApplicationShutdown() {
    await sdk.shutdown();
  }
}
