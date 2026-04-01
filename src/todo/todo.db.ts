import { timestamps } from '@platform/db/column.helpers';
import { boolean, pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const todoListSchema = pgTable('todo_list', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  ...timestamps,
});

export const todoItemSchema = pgTable('todo_item', {
  id: uuid().primaryKey().defaultRandom(),
  todoListId: uuid()
    .notNull()
    .references(() => todoListSchema.id),
  name: text().notNull(),
  done: boolean().notNull().default(false),
  ...timestamps,
});

export const testSchema = pgTable('test', {
  id: uuid().primaryKey().defaultRandom(),
});
