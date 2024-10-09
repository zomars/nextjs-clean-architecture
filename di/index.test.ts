import { afterEach, beforeEach, expect, it } from "vitest";
import { MockAuthenticationService } from "~/auth/authentication.service.mock";
import { MockTodosRepository } from "~/todos/todos.repository.mock";
import { MockUsersRepository } from "~/users/users.repository.mock";
import { destroyContainer, getInjection, initializeContainer } from ".";

beforeEach(() => {
  initializeContainer();
});

afterEach(() => {
  destroyContainer();
});

it("should use Mock versions of repos and services", async () => {
  const authService = getInjection("IAuthenticationService");
  expect(authService).toBeInstanceOf(MockAuthenticationService);

  const usersRepository = getInjection("IUsersRepository");
  expect(usersRepository).toBeInstanceOf(MockUsersRepository);

  const todosRepository = getInjection("ITodosRepository");
  expect(todosRepository).toBeInstanceOf(MockTodosRepository);
});
