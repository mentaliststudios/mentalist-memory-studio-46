import type { User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";
import { isNetworkError } from "./errors";

// One server-side validation per access token: protected navigations reuse it instead of
// calling the auth server on every route change. Cleared on sign-out.
let verified: { token: string; user: User } | null = null;

export function clearVerifiedUser() {
  verified = null;
}

/**
 * Returns the signed-in user, validated with the auth server once per access token.
 * Invalid, expired or revoked sessions are cleared locally and resolve to null.
 * Offline: trusts the stored session (database row security still applies to every request).
 */
export async function getVerifiedUser(): Promise<User | null> {
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  if (!session) {
    verified = null;
    return null;
  }
  if (verified?.token === session.access_token) return verified.user;

  const { data: userData, error } = await supabase.auth.getUser();
  if (userData.user && !error) {
    verified = { token: session.access_token, user: userData.user };
    return userData.user;
  }
  if (error && isNetworkError(error)) return session.user;

  verified = null;
  await supabase.auth.signOut({ scope: "local" });
  return null;
}
