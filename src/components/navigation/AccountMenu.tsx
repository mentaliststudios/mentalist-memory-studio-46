import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronsUpDown, LogOut, UserRound } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth/AuthProvider";
import { myProfileQuery } from "@/lib/data/profile";
import { cn } from "@/lib/utils";

interface AccountMenuProps {
  variant: "sidebar" | "header";
}

/** Signed-in account summary with the sign-out action. */
export function AccountMenu({ variant }: AccountMenuProps) {
  const { user, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const profile = useQuery({ ...myProfileQuery(user?.id ?? ""), enabled: Boolean(user) });

  if (!user) return null;
  const email = user.email ?? "";
  const name = profile.data?.display_name ?? null;
  const initial = (name ?? email).trim().charAt(0).toUpperCase() || "M";

  async function handleSignOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      const complete = await signOut();
      if (!complete) toast.message("Signed out on this device.");
    } catch {
      toast.error("We couldn't sign you out. Please try again.");
    } finally {
      setSigningOut(false);
    }
  }

  const avatar = (
    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent font-display text-sm font-extrabold text-accent-foreground">
      {initial}
    </span>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Account menu"
        className={cn(
          "flex items-center gap-3 rounded-xl text-left transition-colors hover:bg-surface-2",
          variant === "sidebar" ? "w-full p-2 md:justify-center lg:justify-start" : "p-1",
        )}
      >
        {avatar}
        {variant === "sidebar" ? (
          <>
            <span className="hidden min-w-0 flex-1 lg:block">
              <span className="block truncate text-sm font-bold text-foreground">
                {name ?? "Your account"}
              </span>
              <span className="block truncate text-xs text-muted-foreground">{email}</span>
            </span>
            <ChevronsUpDown
              className="hidden size-4 text-muted-foreground lg:block"
              aria-hidden="true"
            />
          </>
        ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={variant === "sidebar" ? "start" : "end"}
        side={variant === "sidebar" ? "top" : "bottom"}
        className="w-60 rounded-xl"
      >
        <DropdownMenuLabel className="font-normal">
          <span className="block truncate text-sm font-bold text-foreground">
            {name ?? "Your account"}
          </span>
          <span className="block truncate text-xs text-muted-foreground">{email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="cursor-pointer gap-2 font-semibold">
          <Link to="/profile">
            <UserRound className="size-4" aria-hidden="true" />
            Profile & settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={signingOut}
          onSelect={(event) => {
            event.preventDefault();
            void handleSignOut();
          }}
          className="cursor-pointer gap-2 font-semibold"
        >
          <LogOut className="size-4" aria-hidden="true" />
          {signingOut ? "Signing out…" : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
