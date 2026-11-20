import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Castle,
  Clock,
  Flame,
  Lightbulb,
  Play,
  RotateCcw,
  Sprout,
  Target,
} from "lucide-react";

import heroPalace from "@/assets/hero-palace.webp";
import { EmptyState } from "@/components/common/EmptyState";
import { ProgressIndicator } from "@/components/common/ProgressIndicator";
import { QuickAction } from "@/components/common/QuickAction";
import { SectionHeader } from "@/components/common/SectionHeader";
import { StatPlaceholder } from "@/components/common/StatPlaceholder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { NavigationPath } from "@/config/navigation";
import { accentStyles, type Accent } from "@/lib/accents";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Mentalist" },
      {
        name: "description",
        content:
          "Your Mentalist home: start a Memory Palace, train your memory and explore techniques.",
      },
      { property: "og:title", content: "Dashboard — Mentalist" },
      {
        property: "og:description",
        content:
          "Make your memory extraordinary with daily practice, Memory Palaces and smart techniques.",
      },
    ],
  }),
  component: DashboardPage,
});

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const firstSteps: {
  title: string;
  description: string;
  to: NavigationPath;
  accent: Accent;
}[] = [
  {
    title: "Understand the Method of Loci",
    description: "A two-minute idea that changes how you remember.",
    to: "/techniques",
    accent: "violet",
  },
  {
    title: "Sketch your first Memory Palace",
    description: "Pick a room you know by heart.",
    to: "/memory-palace",
    accent: "mint",
  },
  {
    title: "Warm up with Visual Memory",
    description: "A gentle first training session.",
    to: "/training",
    accent: "sun",
  },
];

function DashboardPage() {
  return (
    <div className="space-y-10 md:space-y-12">
      {/* Welcome */}
      <section
        aria-labelledby="welcome-title"
        className="relative animate-rise overflow-hidden rounded-3xl border border-lavender bg-hero"
      >
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-50" />
        <div className="relative grid items-center gap-2 md:grid-cols-[1.15fr_1fr]">
          <div className="order-2 p-6 pt-0 md:order-1 md:p-10 md:pr-0">
            <Badge variant="outline" className="bg-card/70">
              <Sprout aria-hidden="true" /> Welcome back
            </Badge>
            <h1
              id="welcome-title"
              className="mt-4 text-3xl leading-[1.05] font-extrabold text-foreground sm:text-4xl lg:text-5xl"
            >
              Ready to make your memory <span className="text-primary">stronger?</span>
            </h1>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              Make your memory extraordinary — one vivid image, one familiar room, one small session
              at a time.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/memory-palace">
                  <Castle aria-hidden="true" /> Build a palace
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/training">Start training</Link>
              </Button>
            </div>
          </div>
          <div className="order-1 flex justify-center px-6 pt-6 md:order-2 md:p-6">
            <img
              src={heroPalace}
              alt="Illustration of a floating memory palace surrounded by keys and stars"
              className="h-48 w-auto animate-float object-contain sm:h-56 md:h-72 lg:h-80"
              width={539}
              height={552}
            />
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section aria-labelledby="quick-actions">
        <SectionHeader id="quick-actions" title="Jump right in" />
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          <QuickAction
            to="/memory-palace"
            icon={Castle}
            title="Create a Memory Palace"
            description="Turn a familiar place into storage for anything."
            accent="violet"
          />
          <QuickAction
            to="/training"
            icon={Target}
            title="Start Memory Training"
            description="Short, focused exercises for your recall."
            accent="mint"
          />
          <QuickAction
            to="/techniques"
            icon={Lightbulb}
            title="Explore Techniques"
            description="Learn the methods memory champions use."
            accent="sun"
          />
        </div>
      </section>

      {/* Daily practice + overview */}
      <div className="grid gap-5 lg:grid-cols-5">
        <section aria-labelledby="daily-practice" className="panel p-5 md:p-6 lg:col-span-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold tracking-[0.14em] text-sun-foreground uppercase">
                Daily practice
              </p>
              <h2
                id="daily-practice"
                className="mt-1 text-xl font-extrabold text-foreground md:text-2xl"
              >
                A little every day goes a long way
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                Five focused minutes a day beats an hour once a week. Each day you practice will
                light up below.
              </p>
            </div>
            <ProgressIndicator
              variant="ring"
              value={null}
              label="Today's practice"
              className="hidden sm:grid"
            />
          </div>

          <ol className="mt-6 grid grid-cols-7 gap-1.5 sm:gap-3" aria-label="This week's practice">
            {weekDays.map((day) => (
              <li key={day} className="flex flex-col items-center gap-2">
                <span
                  className="grid aspect-square w-full max-w-12 place-items-center rounded-xl border-2 border-dashed border-border bg-background"
                  aria-label={`${day}: no practice recorded`}
                >
                  <Flame className="size-4 text-border-strong" aria-hidden="true" />
                </span>
                <span className="text-[11px] font-bold text-muted-foreground">{day}</span>
              </li>
            ))}
          </ol>

          <p className="mt-5 flex items-center gap-2 rounded-xl bg-surface-2 px-3 py-2.5 text-[13px] text-muted-foreground">
            <Sprout className="size-4 shrink-0 text-primary" aria-hidden="true" />
            Daily goals and streaks will start counting once you save your practice.
          </p>
        </section>

        <section aria-labelledby="practice-overview" className="lg:col-span-2">
          <h2 id="practice-overview" className="sr-only">
            Practice overview
          </h2>
          <div className="grid h-full grid-cols-2 gap-3 sm:gap-4">
            <StatPlaceholder
              icon={Play}
              label="Sessions"
              hint="Shows after your first session"
              accent="violet"
            />
            <StatPlaceholder
              icon={RotateCcw}
              label="Reviews"
              hint="Items due for review appear here"
              accent="mint"
            />
            <StatPlaceholder
              icon={Clock}
              label="Training time"
              hint="Tracked while you train"
              accent="sun"
            />
            <StatPlaceholder
              icon={Flame}
              label="Streak"
              hint="Begins with day one"
              accent="blush"
            />
          </div>
        </section>
      </div>

      {/* Start here + recent activity */}
      <div className="grid gap-5 lg:grid-cols-5">
        <section aria-labelledby="start-here" className="panel p-5 md:p-6 lg:col-span-3">
          <SectionHeader
            id="start-here"
            title="Your first steps"
            description="New to memory training? Follow this path."
          />
          <ol className="relative space-y-3">
            <span
              className="absolute top-6 bottom-6 left-[1.4rem] w-0.5 rounded-full bg-border"
              aria-hidden="true"
            />
            {firstSteps.map((step, index) => (
              <li key={step.title} className="relative">
                <Link
                  to={step.to}
                  className="group flex items-center gap-4 rounded-2xl p-1.5 pr-3 transition-colors hover:bg-surface-2"
                >
                  <span
                    className={cn(
                      "relative grid size-11 shrink-0 place-items-center rounded-full border-4 border-card font-display text-base font-extrabold",
                      accentStyles[step.accent].icon,
                    )}
                  >
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2 font-bold text-foreground">
                      {step.title}
                      {index === 0 && <Badge variant="soft">Start here</Badge>}
                    </span>
                    <span className="block text-sm text-muted-foreground">{step.description}</span>
                  </span>
                  <ArrowRight
                    className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="recent-activity" className="lg:col-span-2">
          <SectionHeader id="recent-activity" title="Recent activity" />
          <EmptyState
            icon={Sprout}
            accent="mint"
            title="No memories created yet."
            description="Start your first practice session and your journey will appear here."
            action={
              <Button asChild variant="soft">
                <Link to="/training">Start practicing</Link>
              </Button>
            }
          />
        </section>
      </div>
    </div>
  );
}
