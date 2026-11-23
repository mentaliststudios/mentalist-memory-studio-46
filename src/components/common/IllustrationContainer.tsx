import type { ReactNode } from "react";

import { accentStyles, type Accent } from "@/lib/accents";
import { cn } from "@/lib/utils";

interface IllustrationContainerProps {
  src?: string;
  alt?: string;
  accent?: Accent;
  className?: string;
  imageClassName?: string;
  children?: ReactNode;
}

/** Soft, dotted backdrop that frames illustrations and mini visuals consistently. */
export function IllustrationContainer({
  src,
  alt = "",
  accent = "brand",
  className,
  imageClassName,
  children,
}: IllustrationContainerProps) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-2xl", accentStyles[accent].soft, className)}
    >
      <div className="pointer-events-none absolute inset-0 bg-dots opacity-70" />
      {src && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className={cn("relative h-full w-full object-contain", imageClassName)}
        />
      )}
      {children && <div className="relative h-full">{children}</div>}
    </div>
  );
}
