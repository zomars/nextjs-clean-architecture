import { startSpan } from "@sentry/nextjs";
import { inject, injectable } from "inversify";
import { generateIdFromEntropySize, Lucia } from "lucia";

import { SESSION_COOKIE } from "@/config";
import { DI_SYMBOLS } from "@/di/types";
import { luciaAdapter } from "@/drizzle";
import { User } from "~/users/user.model";
import { type IUsersRepository } from "~/users/users.repository.interface";
import { IAuthenticationService } from "./authentication.service.interface";
import { UnauthenticatedError } from "./entities/auth.error";
import { Cookie } from "./entities/cookie.model";
import { Session, sessionSchema } from "./entities/session.model";

@injectable()
export class AuthenticationService implements IAuthenticationService {
  private _lucia: Lucia;

  constructor(
    @inject(DI_SYMBOLS.IUsersRepository)
    private _usersRepository: IUsersRepository
  ) {
    this._lucia = new Lucia(luciaAdapter, {
      sessionCookie: {
        name: SESSION_COOKIE,
        expires: false,
        attributes: {
          secure: process.env.NODE_ENV === "production",
        },
      },
      getUserAttributes: (attributes) => {
        return {
          username: attributes.username,
        };
      },
    });
  }

  async validateSession(
    sessionId: string
  ): Promise<{ user: User; session: Session }> {
    return await startSpan(
      { name: "AuthenticationService > validateSession" },
      async () => {
        const result = await startSpan(
          { name: "lucia.validateSession", op: "function" },
          () => this._lucia.validateSession(sessionId)
        );

        if (!result.user || !result.session) {
          throw new UnauthenticatedError("Unauthenticated");
        }

        const user = await this._usersRepository.getUser(result.user.id);

        if (!user) {
          throw new UnauthenticatedError("User doesn't exist");
        }

        return { user, session: result.session };
      }
    );
  }

  async createSession(
    user: User
  ): Promise<{ session: Session; cookie: Cookie }> {
    return await startSpan(
      { name: "AuthenticationService > createSession" },
      async () => {
        const luciaSession = await startSpan(
          { name: "lucia.createSession", op: "function" },
          () => this._lucia.createSession(user.id, {})
        );

        const session = sessionSchema.parse(luciaSession);
        const cookie = startSpan(
          { name: "lucia.createSessionCookie", op: "function" },
          () => this._lucia.createSessionCookie(session.id)
        );

        return { session, cookie };
      }
    );
  }

  async invalidateSession(sessionId: string): Promise<{ blankCookie: Cookie }> {
    await startSpan({ name: "lucia.invalidateSession", op: "function" }, () =>
      this._lucia.invalidateSession(sessionId)
    );

    const blankCookie = startSpan(
      { name: "lucia.createBlankSessionCookie", op: "function" },
      () => this._lucia.createBlankSessionCookie()
    );

    return { blankCookie };
  }

  generateUserId(): string {
    return startSpan(
      { name: "AuthenticationService > generateUserId", op: "function" },
      () => generateIdFromEntropySize(10)
    );
  }
}

interface DatabaseUserAttributes {
  username: string;
}

declare module "lucia" {
  interface Register {
    Lucia: Lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}
