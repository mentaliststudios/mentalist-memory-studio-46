/** Maps auth provider errors to friendly copy. Never exposes raw/internal messages. */

export const AUTH_MESSAGES = {
  invalidCredentials: "That email and password don't match. Check them and try again.",
  emailNotConfirmed: "Please confirm your email first — open the link we sent to your inbox.",
  weakPassword: "That password is too easy to guess. Try a longer, less common one.",
  samePassword: "Your new password must be different from your current one.",
  invalidEmail: "That email address can't be used. Check it for typos.",
  rateLimited: "Too many attempts. Please wait a minute and try again.",
  network: "We couldn't reach Mentalist. Check your connection and try again.",
  signupDisabled: "New sign-ups are closed right now.",
  generic: "Something went wrong. Please try again.",
} as const;

interface AuthLikeError {
  name?: string;
  code?: string;
  status?: number;
  message?: string;
}

export function isNetworkError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const e = error as AuthLikeError;
  if (e.name === "AuthRetryableFetchError") return true;
  if (e.name === "TypeError" && /fetch|network/i.test(e.message ?? "")) return true;
  return e.status === 0;
}

/** True when the provider reports the email is already registered (signup must stay enumeration-safe). */
export function isAlreadyRegistered(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const code = (error as AuthLikeError).code;
  return code === "user_already_exists" || code === "email_exists";
}

export function friendlyAuthError(error: unknown): string {
  if (isNetworkError(error)) return AUTH_MESSAGES.network;
  if (!error || typeof error !== "object") return AUTH_MESSAGES.generic;
  const e = error as AuthLikeError;
  switch (e.code) {
    case "invalid_credentials":
    case "user_not_found":
      return AUTH_MESSAGES.invalidCredentials;
    case "email_not_confirmed":
      return AUTH_MESSAGES.emailNotConfirmed;
    case "weak_password":
      return AUTH_MESSAGES.weakPassword;
    case "same_password":
      return AUTH_MESSAGES.samePassword;
    case "email_address_invalid":
      return AUTH_MESSAGES.invalidEmail;
    case "over_request_rate_limit":
    case "over_email_send_rate_limit":
      return AUTH_MESSAGES.rateLimited;
    case "signup_disabled":
    case "email_provider_disabled":
      return AUTH_MESSAGES.signupDisabled;
  }
  if (e.status === 429) return AUTH_MESSAGES.rateLimited;
  if (/email address is not allowed|email address .* is invalid/i.test(e.message ?? "")) {
    return AUTH_MESSAGES.invalidEmail;
  }
  if (e.status === 400 && /invalid login credentials/i.test(e.message ?? "")) {
    return AUTH_MESSAGES.invalidCredentials;
  }
  return AUTH_MESSAGES.generic;
}
