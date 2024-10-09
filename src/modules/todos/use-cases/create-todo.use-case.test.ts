import { afterEach, beforeEach, expect, it } from "vitest";

import { destroyContainer, initializeContainer } from "@/di";
import { signInUseCase } from "~/auth/use-cases/sign-in.use-case";
import { createTodoUseCase } from "./create-todo.use-case";

beforeEach(() => {
  initializeContainer();
});

afterEach(() => {
  destroyContainer();
});

// A great guide on test names
// https://www.epicweb.dev/talks/how-to-write-better-test-names
it("creates todo", async () => {
  const { session } = await signInUseCase({
    username: "one",
    password: "password-one",
  });

  expect(
    createTodoUseCase({ todo: "Write unit tests" }, session.userId)
  ).resolves.toMatchObject({
    todo: "Write unit tests",
    userId: "1",
    completed: false,
  });
});
