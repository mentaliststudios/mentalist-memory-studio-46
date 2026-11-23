import { Link } from "@tanstack/react-router";
import { ArrowRight, type LucideIcon } from "lucide-react";

import type { NavigationPath } from "@/config/navigation";
import { accentStyles, type Accent } from "@/lib/accents";
import { cn } from "@/lib/utils";

interface QuickActionProps {
  to: NavigationPath;
  icon: LucideIcon;
  title: string;
  description: string;
  accent?: Accent;
}

export function QuickAction({
  to,
  icon: Icon,
  title,
  description,
  accent = "brand",
}: QuickActionProps) {
  return (
    <Link
      to={to}
      className="group panel flex items-center gap-4 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift sm:flex-col sm:items-start sm:p-5"
    >
      <span
        className={cn(
          "grid size-12 shrink-0 place-items-center rounded-2xl",
          accentStyles[accent].icon,
        )}
      >
        <Icon className="size-6" strokeWidth={2.1} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-display text-base font-extrabold text-foreground sm:text-lg">
          {title}
        </span>
        <span className="mt-0.5 block text-sm leading-snug text-muted-foreground">
          {description}
        </span>
      </span>
      <ArrowRight
        className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary sm:hidden"
        aria-hidden="true"
      />
      <span className="hidden items-center gap-1 text-sm font-bold text-primary sm:mt-auto sm:inline-flex">
        Let's go
        <ArrowRight
          className="size-4 transition-transform group-hover:translate-x-1"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}
