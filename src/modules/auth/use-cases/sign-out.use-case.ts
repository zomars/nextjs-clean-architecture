import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/di";
import { Cookie } from "../entities/cookie.model";

export function signOutUseCase(
  sessionId: string
): Promise<{ blankCookie: Cookie }> {
  return startSpan({ name: "signOut Use Case", op: "function" }, async () => {
    const authenticationService = getInjection("IAuthenticationService");

    return await authenticationService.invalidateSession(sessionId);
  });
}
