import { withServerActionInstrumentation } from "@sentry/nextjs";

export const withReportingSentry =
  <T extends any[], U>(
    func: (...args: T) => PromiseLike<U>,
    funcName: string = func.name
  ): ((...args: T) => Promise<U>) =>
  async (...args) =>
    await withServerActionInstrumentation(
      funcName,
      { recordResponse: true },
      async () => await func(...args)
    );
