import type { Session, User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { supabase } from "@/integrations/supabase/client";
import { clearVerifiedUser } from "./session";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  /** False until the stored session has been read once. */
  isReady: boolean;
  /** True after the user arrived through a password-recovery link. */
  isRecovery: boolean;
  /** Ends the session, clears cached data and goes to /login. Returns false if only the local session could be cleared. */
  signOut: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Single auth listener for the whole app; mounted once in __root. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const reconciled = useRef(new Set<string>());

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next);
      setIsReady(true);

      if (next && !reconciled.current.has(next.user.id)) {
        reconciled.current.add(next.user.id);
        // Creates a missing profile for this account only; never overwrites. Deferred so it
        // doesn't run inside the auth callback.
        setTimeout(() => {
          void supabase.rpc("ensure_my_profile").then(({ error }) => {
            if (error) reconciled.current.delete(next.user.id);
            else void queryClient.invalidateQueries({ queryKey: ["profile"] });
          });
        }, 0);
      }

      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
        if (window.location.pathname !== "/reset-password") {
          void navigate({ to: "/reset-password", replace: true });
        }
        return;
      }
      if (event === "SIGNED_OUT") {
        clearVerifiedUser();
        reconciled.current.clear();
        setIsRecovery(false);
        queryClient.clear();
        void router.invalidate(); // protected pages re-check and send the user to /login
        return;
      }
      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        void router.invalidate();
        void queryClient.invalidateQueries();
      }
    });
    return () => data.subscription.unsubscribe();
  }, [navigate, queryClient, router]);

  const signOut = useCallback(async () => {
    await queryClient.cancelQueries();
    let fullySignedOut = true;
    const { error } = await supabase.auth.signOut();
    if (error) {
      fullySignedOut = false;
      await supabase.auth.signOut({ scope: "local" });
    }
    clearVerifiedUser();
    queryClient.clear();
    await navigate({ to: "/login", replace: true });
    return fullySignedOut;
  }, [navigate, queryClient]);

  const value = useMemo<AuthContextValue>(
    () => ({ session, user: session?.user ?? null, isReady, isRecovery, signOut }),
    [session, isReady, isRecovery, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
