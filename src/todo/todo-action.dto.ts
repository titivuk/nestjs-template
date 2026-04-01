import { IsOptional, IsString, MinLength } from 'class-validator';
import { TodoAction } from './models';

export class TodoActionDdto implements TodoAction {
  @IsOptional()
  @IsString()
  @MinLength(1)
  todoList?: string;
  @IsString()
  @MinLength(1)
  prompt!: string;
}
