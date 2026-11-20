import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { AuthPending } from "@/components/auth/AuthPending";
import { AppShell } from "@/components/layout/AppShell";
import { getVerifiedUser } from "@/lib/auth/session";

// Sign-in gate for every app section. ssr:false because the session lives in browser storage.
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const user = await getVerifiedUser();
    if (!user) {
      throw redirect({ to: "/login", search: { redirect: location.href }, replace: true });
    }
    return { user };
  },
  pendingComponent: AuthPending,
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
