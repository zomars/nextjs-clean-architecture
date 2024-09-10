import { startSpan } from "@sentry/nextjs";

import { getInjection } from "@/di";
import { InputParseError } from "~/common/common.error";
import { Cookie } from "../entities/cookie.model";
import { signOutUseCase } from "../use-cases/sign-out.use-case";

export async function signOutController(
  sessionId: string | undefined
): Promise<Cookie> {
  return await startSpan({ name: "signOut Controller" }, async () => {
    if (!sessionId) {
      throw new InputParseError("Must provide a session ID");
    }
    const authenticationService = getInjection("IAuthenticationService");
    const { session } = await authenticationService.validateSession(sessionId);

    const { blankCookie } = await signOutUseCase(session.id);
    return blankCookie;
  });
}
