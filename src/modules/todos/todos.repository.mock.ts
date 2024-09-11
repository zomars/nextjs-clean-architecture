import { injectable } from "inversify";

import { Todo, TodoInsert } from "./todo.model";
import { ITodosRepository } from "./todos.repository.interface";

@injectable()
export class MockTodosRepository implements ITodosRepository {
  private _todos: Todo[];

  constructor() {
    this._todos = [];
  }

  async createTodo(todo: TodoInsert): Promise<Todo> {
    const id = this._todos.length;
    const created = { ...todo, id };
    this._todos.push(created);
    return created;
  }

  async getTodo(id: number): Promise<Todo | undefined> {
    const todo = this._todos.find((t) => t.id === id);
    return todo;
  }

  async getTodosForUser(userId: string): Promise<Todo[]> {
    const usersTodos = this._todos.filter((t) => t.userId === userId);
    return usersTodos;
  }

  async updateTodo(id: number, input: Partial<TodoInsert>): Promise<Todo> {
    const existingIndex = this._todos.findIndex((t) => t.id === id);
    const updated = {
      ...this._todos[existingIndex],
      ...input,
    };
    this._todos[existingIndex] = updated;
    return updated;
  }
}
