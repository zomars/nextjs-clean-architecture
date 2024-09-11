import { captureException } from "@sentry/nextjs";

/** Wrapper to disable reporting on certain conditions */
export const captureExceptionSentry = (
  ...args: Parameters<typeof captureException>
) => {
  return captureException(...args);
};
