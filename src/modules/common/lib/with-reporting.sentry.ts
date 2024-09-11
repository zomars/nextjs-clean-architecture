import { withServerActionInstrumentation } from "@sentry/nextjs";

export const withReportingSentry =
  <T extends any[], U>(
    func: (...args: T) => PromiseLike<U>
  ): ((...args: T) => Promise<U>) =>
  async (...args) =>
    await withServerActionInstrumentation(
      func.name,
      { recordResponse: true },
      async () => await func(...args)
    );
