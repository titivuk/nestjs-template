import { Module } from '@nestjs/common';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TodoRepository } from './todo.repository';
import { ApiExtraModels } from '@nestjs/swagger';
import { GetTodoItemsItem } from './get-todo-items-item.dto';

@ApiExtraModels(GetTodoItemsItem)
@Module({
  controllers: [TodoController],
  providers: [TodoService, TodoRepository],
})
export class TodoModule {}
