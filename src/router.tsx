import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";

import { clearVerifiedUser } from "@/lib/auth/session";
import { isSessionError, shouldRetry } from "@/lib/data/errors";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  let recheckSession = () => {};

  // An expired or revoked session makes the sign-in gate re-check with the auth server,
  // which signs out locally and redirects to /login only if the session is really invalid.
  const onError = (error: unknown) => {
    if (!isSessionError(error)) return;
    clearVerifiedUser();
    recheckSession();
  };

  // One client per request: a module-level QueryClient leaks cached data between SSR requests.
  const queryClient = new QueryClient({
    queryCache: new QueryCache({ onError }),
    mutationCache: new MutationCache({ onError }),
    defaultOptions: {
      queries: { staleTime: 30_000, retry: shouldRetry },
      mutations: { retry: false },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // Lets Query own freshness; set caching defaults on the QueryClient, not the router.
    defaultPreloadStaleTime: 0,
  });

  recheckSession = () => void router.invalidate();

  return router;
};
