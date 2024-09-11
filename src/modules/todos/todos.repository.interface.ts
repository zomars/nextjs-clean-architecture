import type { Todo, TodoInsert } from "./todo.model";

export interface ITodosRepository {
  createTodo(todo: TodoInsert): Promise<Todo>;
  getTodo(id: number): Promise<Todo | undefined>;
  getTodosForUser(userId: string): Promise<Todo[]>;
  updateTodo(id: number, input: Partial<TodoInsert>): Promise<Todo>;
}
