import { withReportingSentry } from "./with-reporting.sentry";

/** Wrapper to disable reporting on certain conditions */
export const withReporting = <T extends any[], U>(
  func: (...args: T) => PromiseLike<U>,
  /** To avoid minified names */
  funcName: string
): ((...args: T) => Promise<U>) => {
  return withReportingSentry(func, funcName);
};
