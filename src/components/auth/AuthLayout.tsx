import type { LucideIcon } from "lucide-react";
import { Castle, Lightbulb, Target } from "lucide-react";
import type { ReactNode } from "react";

import heroPalace from "@/assets/hero-palace.webp";
import { BrandGlyph } from "@/components/navigation/BrandMark";
import { cn } from "@/lib/utils";

const highlights: { icon: LucideIcon; text: string; tone: string }[] = [
  {
    icon: Castle,
    text: "Build Memory Palaces room by room",
    tone: "bg-accent text-accent-foreground",
  },
  {
    icon: Lightbulb,
    text: "Learn techniques used by memory athletes",
    tone: "bg-sun text-sun-foreground",
  },
  {
    icon: Target,
    text: "Train recall with short, playful sessions",
    tone: "bg-mint text-mint-foreground",
  },
];

function Wordmark() {
  return (
    <div className="flex items-center gap-2.5">
      <BrandGlyph />
      <span className="font-display text-xl font-extrabold tracking-tight text-foreground">
        Mentalist
      </span>
    </div>
  );
}

interface AuthLayoutProps {
  icon: LucideIcon;
  title: string;
  description: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

/** Shared frame for sign-in, sign-up and password pages (no app navigation). */
export function AuthLayout({ icon: Icon, title, description, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-dvh w-full bg-background lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <aside className="relative hidden overflow-hidden border-r border-border bg-hero lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          className="pointer-events-none absolute inset-0 bg-dots opacity-60"
          aria-hidden="true"
        />
        <div className="relative">
          <Wordmark />
        </div>
        <div className="relative">
          <img
            src={heroPalace}
            alt=""
            width={520}
            height={390}
            className="mx-auto mb-8 w-full max-w-md animate-float drop-shadow-sm"
          />
          <h2 className="max-w-md text-4xl font-extrabold leading-tight text-foreground">
            Make your memory <span className="text-primary">extraordinary.</span>
          </h2>
          <ul className="mt-6 space-y-3">
            {highlights.map(({ icon: HIcon, text, tone }) => (
              <li
                key={text}
                className="flex items-center gap-3 text-[15px] font-semibold text-foreground"
              >
                <span className={cn("grid size-8 place-items-center rounded-lg", tone)}>
                  <HIcon className="size-4" aria-hidden="true" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-muted-foreground">
          Your memories stay private to your account.
        </p>
      </aside>

      <main id="main-content" className="flex min-h-dvh flex-col px-4 py-6 sm:px-8 lg:py-10">
        <div className="lg:hidden">
          <Wordmark />
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">
          <div className="panel animate-rise p-6 sm:p-8">
            <span className="grid size-12 place-items-center rounded-2xl bg-accent text-accent-foreground">
              <Icon className="size-6" strokeWidth={2.2} aria-hidden="true" />
            </span>
            <h1 className="mt-5 text-[1.75rem] font-extrabold leading-tight text-foreground">
              {title}
            </h1>
            <div className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              {description}
            </div>
            <div className="mt-7">{children}</div>
          </div>
          {footer ? (
            <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
