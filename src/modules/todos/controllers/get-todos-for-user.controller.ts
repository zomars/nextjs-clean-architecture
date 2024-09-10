import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/di";
import { UnauthenticatedError } from "~/auth/entities/auth.error";
import { Todo } from "../todo.model";
import { getTodosForUserUseCase } from "../use-cases/get-todos-for-user.use-case";

function presenter(todos: Todo[]) {
  return startSpan({ name: "getTodosForUser Presenter", op: "serialize" }, () =>
    todos.map((t) => ({
      id: t.id,
      todo: t.todo,
      userId: t.userId,
      completed: t.completed,
    }))
  );
}

export async function getTodosForUserController(
  sessionId: string | undefined
): Promise<ReturnType<typeof presenter>> {
  return await startSpan({ name: "getTodosForUser Controller" }, async () => {
    if (!sessionId) {
      throw new UnauthenticatedError("Must be logged in to create a todo");
    }

    const authenticationService = getInjection("IAuthenticationService");
    const { session } = await authenticationService.validateSession(sessionId);

    const todos = await getTodosForUserUseCase(session.userId);

    return presenter(todos);
  });
}
