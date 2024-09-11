import { hash } from "@node-rs/argon2";
import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/di";
import { User } from "~/users/user.model";
import { AuthenticationError } from "../entities/auth.error";
import { Cookie } from "../entities/cookie.model";
import { Session } from "../entities/session.model";

export function signUpUseCase(input: {
  username: string;
  password: string;
}): Promise<{
  session: Session;
  cookie: Cookie;
  user: Pick<User, "id" | "username">;
}> {
  return startSpan({ name: "signUp Use Case", op: "function" }, async () => {
    const usersRepository = getInjection("IUsersRepository");
    const user = await usersRepository.getUserByUsername(input.username);
    if (user) {
      throw new AuthenticationError("Username taken");
    }

    const passwordHash = await startSpan(
      { name: "hash password", op: "function" },
      () =>
        hash(input.password, {
          memoryCost: 19456,
          timeCost: 2,
          outputLen: 32,
          parallelism: 1,
        })
    );

    const authenticationService = getInjection("IAuthenticationService");
    const userId = authenticationService.generateUserId();

    const newUser = await usersRepository.createUser({
      id: userId,
      username: input.username,
      password_hash: passwordHash,
    });

    const { cookie, session } = await authenticationService.createSession(
      newUser
    );

    return {
      cookie,
      session,
      user: {
        id: newUser.id,
        username: newUser.username,
      },
    };
  });
}
