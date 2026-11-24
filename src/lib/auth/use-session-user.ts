import { getRouteApi } from "@tanstack/react-router";

const authenticatedRoute = getRouteApi("/_authenticated");

/** The verified signed-in user. Only usable inside pages under the sign-in gate. */
export function useSessionUser() {
  return authenticatedRoute.useRouteContext({ select: (ctx) => ctx.user });
}
