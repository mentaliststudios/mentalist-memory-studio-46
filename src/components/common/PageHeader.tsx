import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { accentStyles, type Accent } from "@/lib/accents";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  icon?: LucideIcon;
  accent?: Accent;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  accent = "violet",
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "flex animate-rise flex-col gap-5 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="flex min-w-0 items-start gap-4">
        {Icon && (
          <span
            className={cn(
              "hidden size-14 shrink-0 place-items-center rounded-2xl sm:grid",
              accentStyles[accent].icon,
            )}
          >
            <Icon className="size-7" strokeWidth={2.1} aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0">
          {eyebrow && (
            <p
              className={cn(
                "text-xs font-extrabold tracking-[0.14em] uppercase",
                accentStyles[accent].text,
              )}
            >
              {eyebrow}
            </p>
          )}
          <h1 className="mt-1 text-3xl font-extrabold text-foreground md:text-4xl">{title}</h1>
          {description && (
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
    </header>
  );
}
