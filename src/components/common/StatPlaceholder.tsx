import type { LucideIcon } from "lucide-react";

import { accentStyles, type Accent } from "@/lib/accents";
import { cn } from "@/lib/utils";

interface StatPlaceholderProps {
  icon: LucideIcon;
  label: string;
  /** Shown under the dash while there is no data yet. */
  hint: string;
  /** Real figure from saved data; `null`/omitted keeps the tile honestly empty. */
  value?: string | null;
  /** Shown under the value when there is one. */
  valueHint?: string;
  accent?: Accent;
  className?: string;
}

/** A metric tile that stays honestly empty until real practice data exists. */
export function StatPlaceholder({
  icon: Icon,
  label,
  hint,
  value = null,
  valueHint,
  accent = "brand",
  className,
}: StatPlaceholderProps) {
  const hasValue = value !== null;
  return (
    <div className={cn("panel flex flex-col gap-3 p-4", className)}>
      <div className="flex items-center gap-2.5">
        <span
          className={cn("grid size-9 place-items-center rounded-xl", accentStyles[accent].icon)}
        >
          <Icon className="size-[18px]" strokeWidth={2.2} aria-hidden="true" />
        </span>
        <span className="text-sm font-bold text-foreground">{label}</span>
      </div>
      <div>
        <p
          className={cn(
            "font-display text-3xl font-extrabold",
            hasValue ? "text-foreground" : "text-border-strong",
          )}
          aria-label={hasValue ? `${label}: ${value}` : `${label}: no data yet`}
        >
          {hasValue ? value : "—"}
        </p>
        <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
          {hasValue ? (valueHint ?? hint) : hint}
        </p>
      </div>
    </div>
  );
}
