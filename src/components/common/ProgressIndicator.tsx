import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  /** 0–100. `null` means no data has been recorded yet. */
  value: number | null;
  label: string;
  variant?: "bar" | "ring";
  emptyLabel?: string;
  className?: string;
}

export function ProgressIndicator({
  value,
  label,
  variant = "bar",
  emptyLabel = "No data yet",
  className,
}: ProgressIndicatorProps) {
  const hasValue = value !== null;
  const clamped = hasValue ? Math.min(100, Math.max(0, value)) : 0;
  const valueText = hasValue ? `${Math.round(clamped)}%` : emptyLabel;

  if (variant === "ring") {
    const r = 26;
    const c = 2 * Math.PI * r;
    return (
      <div
        role="img"
        aria-label={`${label}: ${valueText}`}
        className={cn("relative grid size-20 place-items-center", className)}
      >
        <svg viewBox="0 0 64 64" className="absolute inset-0 -rotate-90">
          <circle
            cx="32"
            cy="32"
            r={r}
            fill="none"
            strokeWidth="7"
            className="stroke-surface-2"
            strokeDasharray={hasValue ? undefined : "3 5"}
          />
          {hasValue && (
            <circle
              cx="32"
              cy="32"
              r={r}
              fill="none"
              strokeWidth="7"
              strokeLinecap="round"
              className="stroke-primary transition-[stroke-dashoffset] duration-700"
              strokeDasharray={c}
              strokeDashoffset={c - (clamped / 100) * c}
            />
          )}
        </svg>
        <span className="font-display text-lg font-extrabold text-foreground">
          {hasValue ? `${Math.round(clamped)}%` : "—"}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
        <span className="font-bold text-foreground">{label}</span>
        <span className="text-muted-foreground">{valueText}</span>
      </div>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={hasValue ? Math.round(clamped) : undefined}
        aria-valuetext={valueText}
        className={cn(
          "h-3 w-full overflow-hidden rounded-full",
          hasValue ? "bg-surface-2" : "border-2 border-dashed border-border bg-transparent",
        )}
      >
        {hasValue && (
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-700"
            style={{ width: `${clamped}%` }}
          />
        )}
      </div>
    </div>
  );
}
