/** Default destination after signing in. */
export const DEFAULT_AFTER_LOGIN = "/dashboard";

const AUTH_ONLY_PATHS = ["/login", "/signup", "/forgot-password", "/reset-password"];

/**
 * Returns a safe, same-origin path to send the user to after sign-in.
 * Rejects absolute URLs, protocol-relative URLs, backslash tricks and auth pages (loop guard).
 */
export function safeRedirectPath(value: unknown): string {
  if (typeof value !== "string") return DEFAULT_AFTER_LOGIN;
  const path = value.trim();
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith("/\\")) {
    return DEFAULT_AFTER_LOGIN;
  }
  if (/[\u0000-\u001f\\]/.test(path)) return DEFAULT_AFTER_LOGIN;
  const pathname = path.split(/[?#]/)[0] ?? "";
  if (AUTH_ONLY_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return DEFAULT_AFTER_LOGIN;
  }
  return path;
}

export interface LoginSearch {
  redirect?: string;
}

export function parseLoginSearch(search: Record<string, unknown>): LoginSearch {
  return typeof search["redirect"] === "string" ? { redirect: search["redirect"] } : {};
}
