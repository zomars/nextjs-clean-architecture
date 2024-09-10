import { startSpan } from "@sentry/nextjs";
import { z } from "zod";

import { getInjection } from "@/di";
import { UnauthenticatedError } from "~/auth/entities/auth.error";
import { InputParseError } from "~/common/common.error";
import { Todo } from "../todo.model";
import { createTodoUseCase } from "../use-cases/create-todo.use-case";

function presenter(todo: Todo) {
  return startSpan({ name: "createTodo Presenter", op: "serialize" }, () => {
    return {
      id: todo.id,
      todo: todo.todo,
      userId: todo.userId,
      completed: todo.completed,
    };
  });
}

const inputSchema = z.object({ todo: z.string().min(1) });

export async function createTodoController(
  input: any,
  sessionId: string | undefined
): Promise<ReturnType<typeof presenter>> {
  return await startSpan(
    {
      name: "createTodo Controller",
    },
    async () => {
      if (!sessionId) {
        throw new UnauthenticatedError("Must be logged in to create a todo");
      }
      const authenticationService = getInjection("IAuthenticationService");
      const { user } = await authenticationService.validateSession(sessionId);

      const { data, error: inputParseError } = inputSchema.safeParse(input);

      if (inputParseError) {
        throw new InputParseError("Invalid data", { cause: inputParseError });
      }

      const todo = await createTodoUseCase(data, user.id);

      return presenter(todo);
    }
  );
}
