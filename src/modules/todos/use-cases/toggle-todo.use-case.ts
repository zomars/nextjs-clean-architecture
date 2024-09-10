import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/di";
import { UnauthorizedError } from "~/auth/entities/auth.error";
import { NotFoundError } from "~/common/common.error";
import type { Todo } from "../todo.model";

export function toggleTodoUseCase(
  input: {
    todoId: number;
  },
  userId: string
): Promise<Todo> {
  return startSpan(
    { name: "toggleTodo Use Case", op: "function" },
    async () => {
      const todosRepository = getInjection("ITodosRepository");

      const todo = await todosRepository.getTodo(input.todoId);

      if (!todo) {
        throw new NotFoundError("Todo does not exist");
      }

      if (todo.userId !== userId) {
        throw new UnauthorizedError("Cannot toggle todo. Reason: unauthorized");
      }

      const updatedTodo = await todosRepository.updateTodo(todo.id, {
        completed: !todo.completed,
      });

      return updatedTodo;
    }
  );
}
