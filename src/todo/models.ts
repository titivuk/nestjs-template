import { z } from 'zod';

export type TodoAction = {
  todoListId?: string;
  prompt: string;
};

export const todoItemSchema = z.object({
  title: z.string().nonempty().describe('The title of the item'),
  done: z
    .boolean()
    .describe('The state of the item: true if done, false otherwise'),
});

export type TodoItem = z.infer<typeof todoItemSchema>;

export const todoListSchema = z.object({
  id: z.string(),
  items: z.array(todoItemSchema),
});

export type TodoList = z.infer<typeof todoListSchema>;
