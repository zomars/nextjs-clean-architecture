import { User } from "~/users/user.model";
import { Cookie } from "./entities/cookie.model";
import { Session } from "./entities/session.model";

export interface IAuthenticationService {
  generateUserId(): string;
  validateSession(
    sessionId: Session["id"]
  ): Promise<{ user: User; session: Session }>;
  createSession(user: User): Promise<{ session: Session; cookie: Cookie }>;
  invalidateSession(sessionId: Session["id"]): Promise<{ blankCookie: Cookie }>;
}
