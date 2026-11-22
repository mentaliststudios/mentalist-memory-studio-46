import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, rootRouteId } from "@tanstack/react-router";
import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = vi.hoisted(() => ({
  session: null as null | { access_token: string; user: { id: string } },
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: async () => ({ data: { session: auth.session }, error: null }),
      getUser: async () => ({ data: { user: auth.session?.user ?? null }, error: null }),
      signOut: async () => ({ error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    },
  },
}));

import { primaryNavigation } from "@/config/navigation";
import { clearVerifiedUser } from "@/lib/auth/session";
import { routeTree } from "@/routeTree.gen";

function makeRouter(initial = "/") {
  return createRouter({
    routeTree,
    context: { queryClient: new QueryClient() },
    history: createMemoryHistory({ initialEntries: [initial] }),
  });
}

const protectedPaths = [
  "/dashboard",
  "/memory-palace",
  "/techniques",
  "/training",
  "/assistant",
  "/progress",
];

// Match routes without rendering: jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  beforeEach(() => {
    auth.session = null;
    clearVerifiedUser();
  });

  it("matches a page for / instead of falling back to not found", () => {
    const matches = makeRouter().matchRoutes("/");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it.each(protectedPaths)("has a page for %s behind the sign-in gate", (path) => {
    const matches = makeRouter().matchRoutes(path);
    expect(matches.at(-1)?.routeId).toBe(`/_authenticated${path}`);
  });

  it.each(["/login", "/signup", "/forgot-password", "/reset-password"])(
    "has a public page for %s",
    (path) => {
      const matches = makeRouter().matchRoutes(path);
      expect(matches.at(-1)?.routeId).toBe(path);
    },
  );

  it.each(protectedPaths)(
    "sends signed-out visitors from %s to /login and remembers the page",
    async (path) => {
      const router = makeRouter(path);
      await router.load();
      expect(router.state.location.pathname).toBe("/login");
      expect(router.state.location.search).toEqual({ redirect: path });
    },
  );

  it("sends signed-out visitors from / to /login with /dashboard as the destination", async () => {
    const router = makeRouter("/");
    await router.load();
    expect(router.state.location.pathname).toBe("/login");
    expect(router.state.location.search).toEqual({ redirect: "/dashboard" });
  });

  it("opens the Dashboard from the root URL when signed in", async () => {
    auth.session = { access_token: "t1", user: { id: "u1" } };
    const router = makeRouter("/");
    await router.load();
    expect(router.state.location.pathname).toBe("/dashboard");
  });

  it("sends signed-in visitors away from /login to their intended page", async () => {
    auth.session = { access_token: "t1", user: { id: "u1" } };
    const router = makeRouter("/login?redirect=%2Fprogress");
    await router.load();
    expect(router.state.location.pathname).toBe("/progress");
  });

  it("sends signed-in visitors away from /signup to the Dashboard", async () => {
    auth.session = { access_token: "t1", user: { id: "u1" } };
    const router = makeRouter("/signup");
    await router.load();
    expect(router.state.location.pathname).toBe("/dashboard");
  });

  it("navigation lists exactly the six primary sections", () => {
    expect(primaryNavigation.map((i) => i.to)).toEqual(protectedPaths);
  });
});
