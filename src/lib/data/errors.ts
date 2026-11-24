/** Maps database / network errors to friendly copy. Never shows raw backend messages. */

export const DATA_MESSAGES = {
  network: "We couldn't reach Mentalist. Check your connection and try again.",
  session: "Your session has ended. Please sign in again.",
  permission: "You don't have access to that.",
  notFound: "We couldn't find that item. It may have been deleted.",
  duplicate: "That already exists.",
  invalid: "Some details aren't valid. Check them and try again.",
  linked: "This is still linked to other items, so it can't be removed yet.",
  generic: "Something went wrong. Please try again.",
} as const;

interface DataLikeError {
  name?: string;
  code?: string;
  status?: number;
  message?: string;
}

function asDataError(error: unknown): DataLikeError | null {
  return error && typeof error === "object" ? (error as DataLikeError) : null;
}

/** Thrown by the data layer when a row the user targeted no longer exists for them. */
export class NotFoundError extends Error {
  override name = "NotFoundError";
  code = "PGRST116";
}

export function isDataNetworkError(error: unknown): boolean {
  const e = asDataError(error);
  if (!e) return false;
  if (e.name === "AuthRetryableFetchError" || e.status === 0) return true;
  return /failed to fetch|networkerror|network request failed|load failed/i.test(e.message ?? "");
}

/** Expired, invalid or missing access token — the user must re-authenticate. */
export function isSessionError(error: unknown): boolean {
  const e = asDataError(error);
  if (!e) return false;
  if (e.code === "PGRST301" || e.code === "PGRST302" || e.code === "PGRST303") return true;
  if (e.status === 401) return true;
  return /jwt expired|invalid jwt|jwt.*(malformed|invalid)/i.test(e.message ?? "");
}

const NO_RETRY_CODES = new Set([
  "42501", // insufficient privilege (row security / grants)
  "23505", // unique violation
  "23503", // foreign key violation
  "23514", // check violation
  "22001", // value too long
  "22023", // invalid parameter (e.g. time zone)
  "PGRST116", // no rows
]);

/** Retry only failures that might succeed on a second try (network blips, 5xx). */
export function shouldRetry(failureCount: number, error: unknown): boolean {
  if (failureCount >= 2) return false;
  if (isSessionError(error)) return false;
  const e = asDataError(error);
  if (e?.code && NO_RETRY_CODES.has(e.code)) return false;
  return true;
}

export function friendlyDataError(
  error: unknown,
  overrides: Partial<Record<keyof typeof DATA_MESSAGES, string>> = {},
): string {
  const m = { ...DATA_MESSAGES, ...overrides };
  if (isDataNetworkError(error)) return m.network;
  if (isSessionError(error)) return m.session;
  const e = asDataError(error);
  switch (e?.code) {
    case "42501":
      return m.permission;
    case "PGRST116":
      return m.notFound;
    case "23505":
      return m.duplicate;
    case "23503":
      return m.linked;
    case "23514":
    case "23502":
    case "22001":
    case "22023":
    case "22P02":
      return m.invalid;
  }
  return m.generic;
}
