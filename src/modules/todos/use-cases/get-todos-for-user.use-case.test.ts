import "reflect-metadata";
import { afterEach, beforeEach, expect, it } from "vitest";

import { destroyContainer, initializeContainer } from "@/di";
import { signInUseCase } from "~/auth/use-cases/sign-in.use-case";
import { createTodoUseCase } from "./create-todo.use-case";
import { getTodosForUserUseCase } from "./get-todos-for-user.use-case";

beforeEach(() => {
  initializeContainer();
});

afterEach(() => {
  destroyContainer();
});

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it("returns todos", async () => {
  const { session } = await signInUseCase({
    username: "one",
    password: "password-one",
  });
  expect(getTodosForUserUseCase(session.userId)).resolves.toHaveLength(0);

  await createTodoUseCase({ todo: "todo-one" }, session.userId);
  await createTodoUseCase({ todo: "todo-two" }, session.userId);
  await createTodoUseCase({ todo: "todo-three" }, session.userId);

  expect(getTodosForUserUseCase(session.userId)).resolves.toMatchObject([
    {
      todo: "todo-one",
      userId: "1",
      completed: false,
    },
    {
      todo: "todo-two",
      userId: "1",
      completed: false,
    },
    {
      todo: "todo-three",
      userId: "1",
      completed: false,
    },
  ]);
});
