import { afterEach, beforeEach, expect, it } from "vitest";

import { destroyContainer, initializeContainer } from "@/di";
import { UnauthorizedError } from "~/auth/entities/auth.error";
import { signInUseCase } from "~/auth/use-cases/sign-in.use-case";
import { signOutUseCase } from "~/auth/use-cases/sign-out.use-case";
import { NotFoundError } from "~/common/common.error";
import { createTodoUseCase } from "./create-todo.use-case";
import { toggleTodoUseCase } from "./toggle-todo.use-case";

beforeEach(() => {
  initializeContainer();
});

afterEach(() => {
  destroyContainer();
});

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it("toggles todo", async () => {
  const { session } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  const todo = await createTodoUseCase(
    { todo: "Write unit tests" },
    session.userId
  );

  expect(
    toggleTodoUseCase({ todoId: todo.id }, session.userId)
  ).resolves.toMatchObject({
    todo: "Write unit tests",
    userId: "1",
    completed: true,
  });
});

it("throws when unauthorized", async () => {
  const { session: sessionOne } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  const todo = await createTodoUseCase(
    { todo: "Write unit tests" },
    sessionOne.userId
  );

  await signOutUseCase(sessionOne.id);

  const { session: sessionTwo } = await signInUseCase({
    username: "two",
    password: "password-two",
  });

  expect(
    toggleTodoUseCase({ todoId: todo.id }, sessionTwo.userId)
  ).rejects.toBeInstanceOf(UnauthorizedError);
});

it("throws for invalid input", async () => {
  const { session } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  expect(
    toggleTodoUseCase({ todoId: 1234567890 }, session.userId)
  ).rejects.toBeInstanceOf(NotFoundError);
});
