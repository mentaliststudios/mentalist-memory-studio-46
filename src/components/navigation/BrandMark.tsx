import { Link } from "@tanstack/react-router";

import { cn } from "@/lib/utils";

/** Original Mentalist mark: an arched doorway (a palace room) with a spark of insight. */
export function BrandGlyph({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative grid size-10 shrink-0 place-items-center rounded-xl bg-brand shadow-soft",
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="size-6" fill="none">
        <path
          d="M6 20V11a6 6 0 0 1 12 0v9"
          className="stroke-primary-foreground"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M10 20v-5a2 2 0 0 1 4 0v5"
          className="stroke-primary-foreground"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute -top-1 -right-1 size-3 rounded-full border-2 border-card bg-sun" />
    </span>
  );
}

export function BrandMark({ compactOnTablet = false }: { compactOnTablet?: boolean }) {
  return (
    <Link
      to="/dashboard"
      className="flex items-center gap-2.5 rounded-xl focus-visible:outline-offset-4"
      aria-label="Mentalist — go to dashboard"
    >
      <BrandGlyph />
      <span
        className={cn(
          "font-display text-xl font-extrabold tracking-tight text-foreground",
          compactOnTablet && "md:hidden lg:inline",
        )}
      >
        Mentalist
      </span>
    </Link>
  );
}
