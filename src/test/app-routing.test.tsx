import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { primaryNavigation } from "@/config/navigation";
import { routeTree } from "@/routeTree.gen";

function makeRouter(initial = "/") {
  return createRouter({
    routeTree,
    context: { queryClient: new QueryClient() },
    history: createMemoryHistory({ initialEntries: [initial] }),
  });
}

// Match routes without rendering: jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const matches = makeRouter().matchRoutes("/");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("opens the Dashboard from the root URL", async () => {
    const router = makeRouter("/");
    await router.load();
    expect(router.state.location.pathname).toBe("/dashboard");
  });

  it.each(["/dashboard", "/memory-palace", "/techniques", "/training", "/assistant", "/progress"])(
    "has a page for %s",
    (path) => {
      const matches = makeRouter().matchRoutes(path);
      expect(matches.at(-1)?.routeId).toBe(path);
    },
  );

  it("navigation lists exactly the six primary sections", () => {
    expect(primaryNavigation.map((i) => i.to)).toEqual([
      "/dashboard",
      "/memory-palace",
      "/techniques",
      "/training",
      "/assistant",
      "/progress",
    ]);
  });
});
