import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  PaginatedResponseDto,
  PaginationDto,
} from '../platform/http/pagination/paginated-result.dto';
import { PaginationQuery } from '../platform/http/pagination/pagination-query.decorator';
import { getPaginatedSchema } from '../platform/http/swagger/get-paginated-schema';
import { CustomDto } from './custom.dto';
import { GetTodoItemsItem } from './get-todo-items-item.dto';
import { TodoActionDdto } from './todo-action.dto';
import { TodoService } from './todo.service';

@ApiTags('todo')
@ApiExtraModels(GetTodoItemsItem)
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @ApiOkResponse({ schema: getPaginatedSchema(GetTodoItemsItem) })
  @ApiQuery({ type: PaginationDto, required: false })
  getTodoItems(
    @PaginationQuery()
    pagination?: PaginationDto,
  ): PaginatedResponseDto<GetTodoItemsItem> {
    console.log(pagination);
    console.log(pagination instanceof PaginationDto);
    return {
      page: 1,
      perPage: 20,
      total: 3,
      totalPages: 1,
      data: [],
    };
  }

  @Post()
  async executeAction(@Body() action: TodoActionDdto) {
    return this.todoService.executeAction(action);
  }

  @Post('custom')
  @HttpCode(200)
  custom(@Body() body: CustomDto): void {}
}
