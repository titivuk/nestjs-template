import { Module } from '@nestjs/common';
import { DiceModule } from './dice/dice-module';
import { AppConfigModule } from './platform/config/app-config.module';
import { HttpModule } from './platform/http/http.module';
import { TodoModule } from './todo/todo.module';

@Module({
  imports: [AppConfigModule, HttpModule, TodoModule, DiceModule],
})
export class AppModule {}
