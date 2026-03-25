import { Module } from '@nestjs/common';
import { AppConfigModule } from './platform/config/app-config.module';
import { HttpModule } from './platform/http/http.module';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [AppConfigModule, HttpModule, TodoModule],
})
export class AppModule {}
