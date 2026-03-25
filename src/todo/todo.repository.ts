import { Injectable } from '@nestjs/common';
import { mkdir, readFile, unlink, writeFile } from 'fs/promises';
import { join } from 'path';
import { TodoList } from './models';

@Injectable()
export class TodoRepository {
  static readonly STORE_DIR = join(process.cwd(), 'store', 'todos');

  async create(list: TodoList): Promise<TodoList> {
    await mkdir(TodoRepository.STORE_DIR, { recursive: true });
    await writeFile(this.filePath(list.id), JSON.stringify(list));
    return list;
  }

  async update(list: TodoList): Promise<TodoList> {
    await writeFile(this.filePath(list.id), JSON.stringify(list));
    return list;
  }

  async findById(id: string): Promise<TodoList | null> {
    try {
      const data = await readFile(this.filePath(id), 'utf-8');
      return JSON.parse(data) as TodoList;
    } catch {
      return null;
    }
  }

  async delete(id: string): Promise<void> {
    await unlink(this.filePath(id));
  }

  private filePath(id: string): string {
    return join(TodoRepository.STORE_DIR, `${id}.json`);
  }
}
