/**
 * Structured Logger
 * Provides consistent, structured logging across the application.
 * NEVER log: health data, raw prompts, media URLs, secrets, PII
 */

export type LogLevel = "info" | "warn" | "error" | "debug";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  service: string;
  action: string;
  userId?: string;
  metadata?: Record<string, unknown>;
  error?: string;
}

export interface AIAuditEntry {
  timestamp: string;
  userId: string;
  action:
    | "exercise_created"
    | "routine_created"
    | "exercise_modified"
    | "routine_modified";
  source: "ai_assistant";
  model: string;
  provider: string;
  schemaVersion: string;
  toolCalls: string[];
  confirmedBy: "user";
}

const _SERVICE_NAME = "gym-progress";

/**
 * Core logging function
 * Outputs structured JSON to console
 */
export function log(entry: Omit<LogEntry, "timestamp">): void {
  const fullEntry: LogEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
  };

  const message = JSON.stringify(fullEntry);

  switch (entry.level) {
    case "error":
      console.error(message);
      break;
    case "warn":
      console.warn(message);
      break;
    case "debug":
      console.debug(message);
      break;
    default:
      console.log(message);
  }
}

/**
 * Convenience methods for each log level
 */
export function logInfo(
  service: string,
  action: string,
  metadata?: Record<string, unknown>
): void {
  log({ level: "info", service, action, metadata });
}

export function logWarn(
  service: string,
  action: string,
  metadata?: Record<string, unknown>
): void {
  log({ level: "warn", service, action, metadata });
}

export function logError(
  service: string,
  action: string,
  error: string | Error,
  metadata?: Record<string, unknown>
): void {
  log({
    level: "error",
    service,
    action,
    error: typeof error === "string" ? error : error.message,
    metadata,
  });
}

export function logDebug(
  service: string,
  action: string,
  metadata?: Record<string, unknown>
): void {
  log({ level: "debug", service, action, metadata });
}

/**
 * AI Audit logging
 * Logs every AI-generated write for compliance and debugging
 */
export function logAIAudit(entry: Omit<AIAuditEntry, "timestamp">): void {
  const fullEntry: AIAuditEntry = {
    ...entry,
    timestamp: new Date().toISOString(),
  };

  log({
    level: "info",
    service: "ai-assistant",
    action: entry.action,
    userId: entry.userId,
    metadata: {
      source: fullEntry.source,
      model: fullEntry.model,
      provider: fullEntry.provider,
      schemaVersion: fullEntry.schemaVersion,
      toolCalls: fullEntry.toolCalls,
      confirmedBy: fullEntry.confirmedBy,
    },
  });
}

/**
 * Auth logging
 */
export function logAuth(
  action: "login" | "logout" | "signup" | "session_restored" | "session_expired",
  userId?: string,
  metadata?: Record<string, unknown>
): void {
  log({ level: "info", service: "auth", action, userId, metadata });
}

/**
 * Workout logging
 */
export function logWorkout(
  action: "started" | "finished" | "set_logged" | "rest_started" | "rest_completed",
  userId: string,
  metadata?: Record<string, unknown>
): void {
  log({ level: "info", service: "workout", action, userId, metadata });
}

/**
 * Data access logging
 */
export function logDataAccess(
  action: "read" | "write" | "delete",
  resource: string,
  userId: string,
  metadata?: Record<string, unknown>
): void {
  log({
    level: "info",
    service: "data",
    action: `${action}:${resource}`,
    userId,
    metadata,
  });
}

/**
 * Performance logging
 */
export function logPerformance(
  action: string,
  duration: number,
  metadata?: Record<string, unknown>
): void {
  log({
    level: "debug",
    service: "performance",
    action,
    metadata: { duration, ...metadata },
  });
}

/**
 * Get logger for a specific service
 * Returns a scoped logger with service name pre-filled
 */
export function createServiceLogger(service: string) {
  return {
    info: (action: string, metadata?: Record<string, unknown>) =>
      logInfo(service, action, metadata),
    warn: (action: string, metadata?: Record<string, unknown>) =>
      logWarn(service, action, metadata),
    error: (action: string, error: string | Error, metadata?: Record<string, unknown>) =>
      logError(service, action, error, metadata),
    debug: (action: string, metadata?: Record<string, unknown>) =>
      logDebug(service, action, metadata),
  };
}
