import { captureExceptionSentry } from "./capture-exception.sentry";

/** Wrapper to disable reporting on certain conditions */
export const captureException = (
  ...args: Parameters<typeof captureExceptionSentry>
) => {
  return captureExceptionSentry(...args);
};
