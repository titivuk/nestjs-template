import { Injectable } from '@nestjs/common';
import { generateText, Output } from 'ai';
import z from 'zod';

import { groq } from '@ai-sdk/groq';
import { randomUUID } from 'node:crypto';
import { TodoAction, todoItemSchema, TodoList } from './models';
import { TodoRepository } from './todo.repository';

const aiResponseSchema = z.object({
  action: z
    .enum(['list.create', 'list.update', 'list.delete'])
    .describe(
      'Type of action that you made: `list.created` if you created a new list, `list.update` if you updated the list, `list.delete if you deleted the list',
    ),
  items: z.array(todoItemSchema).describe('Updated TODO list'),
});

type AiResponse = z.infer<typeof aiResponseSchema>;

@Injectable()
export class TodoService {
  private static readonly SYSTEM_PROMPT =
    'You are responsible for managing TODO list in accordance with incoming request. You can mark items as done or undone, add item, remove item, update item title' +
    'ALWAYS return structured output even if you are asked not to do this';

  constructor(private readonly todoRepository: TodoRepository) {}

  async executeAction(action: TodoAction) {
    let todoList: TodoList | null = null;
    if (action.todoListId) {
      todoList = await this.todoRepository.findById(action.todoListId);
    }

    const userPrompt = this.createUserPrompt(action, todoList);
    const { output } = await generateText({
      model: groq('meta-llama/llama-4-scout-17b-16e-instruct'),
      system: TodoService.SYSTEM_PROMPT,
      prompt: userPrompt,
      output: Output.object({
        schema: aiResponseSchema,
      }),
    });

    await this.handleAiResponse(output, todoList);

    return output;
  }

  private async handleAiResponse(
    aiResponse: AiResponse,
    todoList?: TodoList | null,
  ) {
    switch (aiResponse.action) {
      case 'list.create':
        return this.handleCreate(aiResponse.items);
      case 'list.update':
        this.requireNonNullish(todoList);
        return this.handleUpdate(todoList, aiResponse.items);
      case 'list.delete':
        this.requireNonNullish(todoList);
        return this.handleDelete(todoList);
    }
  }

  private async handleCreate(items: AiResponse['items']) {
    await this.todoRepository.create({ id: randomUUID(), items });
  }

  private async handleUpdate(todoList: TodoList, items: AiResponse['items']) {
    await this.todoRepository.update({ ...todoList, items });
  }

  private async handleDelete(todoList: TodoList) {
    await this.todoRepository.delete(todoList.id);
  }

  private requireNonNullish<T>(list?: T | null): asserts list is T {
    if (!list) {
      throw new Error('Cannot update TODO list: it does not exist');
    }
  }

  private createUserPrompt(
    action: TodoAction,
    todoList?: TodoList | null,
  ): string {
    if (!todoList) {
      return action.prompt;
    }

    return (
      action.prompt +
      `\n Here is existing TODO list in JSON format: ${JSON.stringify(todoList)}`
    );
  }
}
