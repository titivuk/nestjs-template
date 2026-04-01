import { Module } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';
import { DbModule } from 'src/platform/db/db.module';
import { GetTodoItemsItem } from './get-todo-items-item.dto';
import { TodoController } from './todo.controller';
import { TodoRepository } from './todo.repository';
import { TodoService } from './todo.service';

@ApiExtraModels(GetTodoItemsItem)
@Module({
  imports: [DbModule],
  controllers: [TodoController],
  providers: [TodoService, TodoRepository],
})
export class TodoModule {}
