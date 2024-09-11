"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SESSION_COOKIE } from "@/config";
import { signInController } from "~/auth/controllers/sign-in.controller";
import { signOutController } from "~/auth/controllers/sign-out.controller";
import { signUpController } from "~/auth/controllers/sign-up.controller";
import {
  AuthenticationError,
  UnauthenticatedError,
} from "~/auth/entities/auth.error";
import { Cookie } from "~/auth/entities/cookie.model";
import { InputParseError } from "~/common/common.error";
import { captureException } from "~/common/lib/capture-exception";
import { withReporting } from "~/common/lib/with-reporting";

export const signUp = withReporting(_signUp, "signUp");
async function _signUp(formData: FormData) {
  const username = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirm_password")?.toString();

  let sessionCookie: Cookie;
  try {
    const { cookie } = await signUpController({
      username,
      password,
      confirm_password: confirmPassword,
    });
    sessionCookie = cookie;
  } catch (err) {
    if (err instanceof InputParseError) {
      return {
        error:
          "Invalid data. Make sure the Password and Confirm Password match.",
      };
    }
    captureException(err);
    return {
      error:
        "An error happened. The developers have been notified. Please try again later. Message: " +
        (err as Error).message,
    };
  }

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  redirect("/");
}

export const signIn = withReporting(_signIn, "signIn");
async function _signIn(formData: FormData) {
  const username = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();

  let sessionCookie: Cookie;
  try {
    sessionCookie = await signInController({ username, password });
  } catch (err) {
    if (err instanceof InputParseError || err instanceof AuthenticationError) {
      return {
        error: "Incorrect username or password",
      };
    }
    captureException(err);
    return {
      error:
        "An error happened. The developers have been notified. Please try again later.",
    };
  }

  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  redirect("/");
}

export const signOut = withReporting(_signOut, "signOut");
async function _signOut() {
  const cookiesStore = cookies();
  const sessionId = cookiesStore.get(SESSION_COOKIE)?.value;

  let blankCookie: Cookie;
  try {
    blankCookie = await signOutController(sessionId);
  } catch (err) {
    if (err instanceof UnauthenticatedError || err instanceof InputParseError) {
      redirect("/sign-in");
    }
    captureException(err);
    throw err;
  }

  cookies().set(blankCookie.name, blankCookie.value, blankCookie.attributes);

  redirect("/sign-in");
}
