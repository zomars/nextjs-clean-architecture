import "reflect-metadata";
import { afterEach, beforeEach, expect, it } from "vitest";

import { destroyContainer, initializeContainer } from "@/di";
import { UnauthenticatedError } from "~/auth/entities/auth.error";
import { signInUseCase } from "~/auth/use-cases/sign-in.use-case";
import { createTodoUseCase } from "../use-cases/create-todo.use-case";
import { getTodosForUserController } from "./get-todos-for-user.controller";

beforeEach(() => {
  initializeContainer();
});

afterEach(() => {
  destroyContainer();
});

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it("returns users todos", async () => {
  const { session } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  await expect(getTodosForUserController(session.id)).resolves.toMatchObject(
    []
  );

  await createTodoUseCase({ todo: "todo-one" }, session.userId);
  await createTodoUseCase({ todo: "todo-two" }, session.userId);
  await createTodoUseCase({ todo: "todo-three" }, session.userId);

  await expect(getTodosForUserController(session.id)).resolves.toMatchObject([
    {
      todo: "todo-one",
      completed: false,
      userId: "1",
    },
    {
      todo: "todo-two",
      completed: false,
      userId: "1",
    },
    {
      todo: "todo-three",
      completed: false,
      userId: "1",
    },
  ]);
});

it("throws when unauthenticated", () => {
  expect(getTodosForUserController("")).rejects.toBeInstanceOf(
    UnauthenticatedError
  );
  expect(getTodosForUserController(undefined)).rejects.toBeInstanceOf(
    UnauthenticatedError
  );
});
