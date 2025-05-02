import type { LogLevel, LogMethod } from "@rayriffy/analytics";

export const dummyLogger: Record<LogLevel, LogMethod> = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
  http: () => {},
  verbose: () => {},
  silly: () => {},
}
