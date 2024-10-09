import { afterEach, beforeEach, expect, it } from "vitest";

import { destroyContainer, initializeContainer } from "@/di";
import {
  UnauthenticatedError,
  UnauthorizedError,
} from "~/auth/entities/auth.error";
import { signInUseCase } from "~/auth/use-cases/sign-in.use-case";
import { signOutUseCase } from "~/auth/use-cases/sign-out.use-case";
import { InputParseError } from "~/common/common.error";
import { createTodoUseCase } from "../use-cases/create-todo.use-case";
import { toggleTodoController } from "./toggle-todo.controller";

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

  expect(todo.completed).toBe(false);

  await expect(
    toggleTodoController({ todoId: todo.id }, session.id)
  ).resolves.toMatchObject({
    todo: "Write unit tests",
    completed: true,
    userId: "1",
  });

  await expect(
    toggleTodoController({ todoId: todo.id }, session.id)
  ).resolves.toMatchObject({
    todo: "Write unit tests",
    completed: false,
    userId: "1",
  });
});

it("throws for invalid input", async () => {
  const { session } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  // @ts-ignore
  expect(toggleTodoController(undefined, session.id)).rejects.toBeInstanceOf(
    InputParseError
  );
  expect(toggleTodoController({}, session.id)).rejects.toBeInstanceOf(
    InputParseError
  );
});

it("throws when unauthenticated", async () => {
  const { session } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  const todo = await createTodoUseCase(
    { todo: "Write unit tests" },
    session.userId
  );

  await signOutUseCase(session.id);

  // with valid session id, but expired session
  expect(
    toggleTodoController({ todoId: todo.id }, session.id)
  ).rejects.toBeInstanceOf(UnauthenticatedError);

  // with undefined session id
  expect(
    toggleTodoController({ todoId: todo.id }, undefined)
  ).rejects.toBeInstanceOf(UnauthenticatedError);
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
    toggleTodoController({ todoId: todo.id }, sessionTwo.id)
  ).rejects.toBeInstanceOf(UnauthorizedError);
});
