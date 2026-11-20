import { Link } from "@tanstack/react-router";

import type { NavigationEntry } from "@/config/navigation";
import { cn } from "@/lib/utils";

interface NavigationItemProps {
  item: NavigationEntry;
  variant: "sidebar" | "bottom";
}

export function NavigationItem({ item, variant }: NavigationItemProps) {
  const Icon = item.icon;

  if (variant === "bottom") {
    return (
      <Link
        to={item.to}
        aria-label={item.title}
        className="group flex h-16 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-bold text-muted-foreground transition-colors data-[status=active]:text-accent-foreground"
      >
        <span className="grid h-8 w-12 place-items-center rounded-xl transition-colors group-data-[status=active]:bg-accent">
          <Icon className="size-5" strokeWidth={2.2} aria-hidden="true" />
        </span>
        <span className="max-w-full truncate px-0.5">{item.shortTitle}</span>
      </Link>
    );
  }

  return (
    <Link
      to={item.to}
      title={item.title}
      className={cn(
        "group flex h-12 items-center gap-3 rounded-xl px-3 text-[15px] font-bold text-muted-foreground transition-colors",
        "hover:bg-surface-2 hover:text-foreground",
        "data-[status=active]:bg-accent data-[status=active]:text-accent-foreground",
        "md:justify-center lg:justify-start",
      )}
    >
      <Icon className="size-5 shrink-0" strokeWidth={2.2} aria-hidden="true" />
      <span className="md:sr-only lg:not-sr-only">{item.title}</span>
    </Link>
  );
}
