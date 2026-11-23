import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { accentStyles, type Accent } from "@/lib/accents";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: ReactNode;
  action?: ReactNode;
  accent?: Accent;
  compact?: boolean;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  accent = "brand",
  compact = false,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-card text-center",
        compact ? "px-5 py-8" : "px-6 py-12",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-60 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]" />
      <div className="relative">
        <span
          className={cn(
            "mx-auto grid place-items-center rounded-2xl",
            compact ? "size-12" : "size-16",
            accentStyles[accent].icon,
          )}
        >
          <Icon className={compact ? "size-6" : "size-8"} strokeWidth={2} aria-hidden="true" />
        </span>
        <h3
          className={cn("mt-4 font-extrabold text-foreground", compact ? "text-base" : "text-lg")}
        >
          {title}
        </h3>
        <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
        {action && <div className="mt-5 flex justify-center">{action}</div>}
      </div>
    </div>
  );
}
