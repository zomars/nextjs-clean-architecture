import { withReportingSentry } from "./with-reporting.sentry";

/** Wrapper to disable reporting on certain conditions */
export const withReporting = (
  ...args: Parameters<typeof withReportingSentry>
) => {
  return withReportingSentry(...args);
};
