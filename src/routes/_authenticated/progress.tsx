import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  CalendarDays,
  Castle,
  Clock,
  Flame,
  History,
  Lock,
  Medal,
  Play,
  RotateCcw,
  Star,
  TrendingUp,
} from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { ProgressIndicator } from "@/components/common/ProgressIndicator";
import { SectionHeader } from "@/components/common/SectionHeader";
import { StatPlaceholder } from "@/components/common/StatPlaceholder";
import { Button } from "@/components/ui/button";
import { trainingCategories } from "@/config/training";
import { accentStyles, type Accent } from "@/lib/accents";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/progress")({
  head: () => ({
    meta: [
      { title: "Progress — Mentalist" },
      {
        name: "description",
        content:
          "Track practice history, training time, accuracy and streaks as you train your memory.",
      },
      { property: "og:title", content: "Progress — Mentalist" },
      {
        property: "og:description",
        content: "See your memory practice grow over time with Mentalist.",
      },
    ],
  }),
  component: ProgressPage,
});

const WEEKS = 12;
const legendShades = ["bg-surface-2", "bg-rose", "bg-primary-glow", "bg-primary"];

const milestones: { title: string; icon: typeof Star; accent: Accent }[] = [
  { title: "First session", icon: Star, accent: "brand" },
  { title: "First palace", icon: Castle, accent: "mint" },
  { title: "3-day streak", icon: Flame, accent: "sun" },
  { title: "Technique explorer", icon: Medal, accent: "blush" },
];

function ProgressPage() {
  return (
    <div className="space-y-10 md:space-y-12">
      <PageHeader
        eyebrow="Your journey"
        title="Progress"
        icon={TrendingUp}
        accent="blush"
        description="Real statistics appear here as you practice — nothing is filled in for you."
      />

      <section aria-labelledby="at-a-glance">
        <h2 id="at-a-glance" className="sr-only">
          At a glance
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatPlaceholder
            icon={Flame}
            label="Streak"
            hint="Starts with your first day of practice"
            accent="sun"
          />
          <StatPlaceholder
            icon={Play}
            label="Training sessions"
            hint="Counted when you finish a session"
            accent="brand"
          />
          <StatPlaceholder
            icon={Clock}
            label="Training time"
            hint="Measured while you train"
            accent="mint"
          />
          <StatPlaceholder
            icon={RotateCcw}
            label="Reviews"
            hint="Logged as you recall items"
            accent="blush"
          />
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-5">
        {/* Frequency */}
        <section aria-labelledby="frequency" className="panel p-5 md:p-6 lg:col-span-3">
          <SectionHeader
            id="frequency"
            title="Practice frequency"
            description={`The last ${WEEKS} weeks. Days color in as you practice.`}
          />
          <div
            className="overflow-hidden"
            role="img"
            aria-label={`Practice calendar for the last ${WEEKS} weeks: no practice recorded yet`}
          >
            <div
              className="grid max-w-[26rem] grid-flow-col grid-rows-7 gap-1 sm:gap-1.5"
              style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: WEEKS * 7 }, (_, i) => (
                <span key={i} className="aspect-square rounded-sm bg-surface-2" />
              ))}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4" aria-hidden="true" /> No practice recorded yet
            </span>
            <span className="flex items-center gap-1.5" aria-hidden="true">
              Less
              {legendShades.map((s) => (
                <span key={s} className={cn("size-3 rounded-sm", s)} />
              ))}
              More
            </span>
          </div>
        </section>

        {/* Accuracy */}
        <section aria-labelledby="accuracy" className="panel p-5 md:p-6 lg:col-span-2">
          <SectionHeader
            id="accuracy"
            title="Accuracy by exercise"
            description="Your recall rate for each skill."
          />
          <div className="space-y-5">
            {trainingCategories.map((c) => (
              <ProgressIndicator key={c.id} value={null} label={c.name} />
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section aria-labelledby="history">
          <SectionHeader id="history" title="Practice history" />
          <EmptyState
            icon={History}
            title="Your story starts here"
            description="Every session you complete will be listed here, with what you practiced and how it went."
            action={
              <Button asChild variant="soft">
                <Link to="/training">Go to training</Link>
              </Button>
            }
          />
        </section>
        <section aria-labelledby="reviews">
          <SectionHeader id="reviews" title="Review activity" />
          <EmptyState
            icon={RotateCcw}
            accent="mint"
            title="Nothing to review yet"
            description="Once you memorize something, Mentalist will help you revisit it at the right moments."
          />
        </section>
      </div>

      {/* Milestones preview */}
      <section aria-labelledby="milestones" className="rounded-3xl bg-surface-2 p-5 md:p-6">
        <SectionHeader
          id="milestones"
          title="Milestones to unlock"
          description="A preview of what's ahead — nothing has been earned yet."
          action={<Award className="size-6 text-primary" aria-hidden="true" />}
        />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {milestones.map((m) => (
            <li
              key={m.title}
              className="flex flex-col items-center rounded-2xl bg-card p-4 text-center"
            >
              <span className="relative">
                <span
                  className={cn(
                    "grid size-14 place-items-center rounded-2xl opacity-45 grayscale-[0.4]",
                    accentStyles[m.accent].icon,
                  )}
                >
                  <m.icon className="size-7" aria-hidden="true" />
                </span>
                <span className="absolute -right-1.5 -bottom-1.5 grid size-6 place-items-center rounded-full border-2 border-card bg-foreground text-background">
                  <Lock className="size-3" aria-hidden="true" />
                </span>
              </span>
              <span className="mt-3 text-sm font-bold text-foreground">{m.title}</span>
              <span className="text-xs text-muted-foreground">Locked</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
