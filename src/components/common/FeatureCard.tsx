import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { accentStyles, type Accent } from "@/lib/accents";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: ReactNode;
  accent?: Accent;
  badge?: string;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
  headingLevel?: "h2" | "h3";
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  accent = "brand",
  badge,
  children,
  footer,
  className,
  headingLevel = "h3",
}: FeatureCardProps) {
  const Heading = headingLevel;
  return (
    <article className={cn("panel flex flex-col p-5 md:p-6", className)}>
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "grid size-12 shrink-0 place-items-center rounded-2xl",
            accentStyles[accent].icon,
          )}
        >
          <Icon className="size-6" strokeWidth={2.1} aria-hidden="true" />
        </span>
        {badge && <Badge variant={accentStyles[accent].badge}>{badge}</Badge>}
      </div>
      <Heading className="mt-4 text-lg font-extrabold text-foreground">{title}</Heading>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
      {children && <div className="mt-4">{children}</div>}
      {footer && <div className="mt-auto pt-5">{footer}</div>}
    </article>
  );
}
