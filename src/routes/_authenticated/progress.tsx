import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Award,
  CalendarDays,
  Castle,
  CircleCheck,
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
import { PageError, PageLoading } from "@/components/common/PageStatus";
import { ProgressIndicator } from "@/components/common/ProgressIndicator";
import { SectionHeader } from "@/components/common/SectionHeader";
import { StatPlaceholder } from "@/components/common/StatPlaceholder";
import { Button } from "@/components/ui/button";
import { trainingCategories } from "@/config/training";
import { accentStyles, type Accent } from "@/lib/accents";
import { useSessionUser } from "@/lib/auth/use-session-user";
import { activityQuery } from "@/lib/data/activity";
import { myProfileQuery } from "@/lib/data/profile";
import {
  calendarKeys,
  formatDuration,
  formatShortDate,
  intensity,
  pluralize,
} from "@/lib/data/stats";
import { summarizePractice } from "@/lib/data/summary";
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
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(myProfileQuery(context.user.id)),
      context.queryClient.ensureQueryData(activityQuery(context.user.id)),
    ]),
  pendingComponent: PageLoading,
  errorComponent: PageError,
  component: ProgressPage,
});

const WEEKS = 12;
const legendShades = ["bg-surface-2", "bg-rose", "bg-primary-glow", "bg-primary"];

type MilestoneId = "first-session" | "first-palace" | "streak-3" | "technique-explorer";

const milestones: { id: MilestoneId; title: string; icon: typeof Star; accent: Accent }[] = [
  { id: "first-session", title: "First session", icon: Star, accent: "brand" },
  { id: "first-palace", title: "First palace", icon: Castle, accent: "mint" },
  { id: "streak-3", title: "3-day streak", icon: Flame, accent: "sun" },
  // No saved data tracks technique lessons yet, so this one stays locked for now.
  { id: "technique-explorer", title: "Technique explorer", icon: Medal, accent: "blush" },
];

const ratingLabels: Record<string, string> = {
  again: "Forgot",
  hard: "Hard",
  good: "Good",
  easy: "Easy",
};

function ProgressPage() {
  const user = useSessionUser();
  const { data: profile } = useSuspenseQuery(myProfileQuery(user.id));
  const { data: activity } = useSuspenseQuery(activityQuery(user.id));
  const timeZone = profile?.timezone ?? "UTC";
  const summary = useMemo(() => summarizePractice(activity, timeZone), [activity, timeZone]);
  const calendar = calendarKeys(summary.today, WEEKS);
  const hasSessions = summary.sessionCount > 0;
  const activeDays = calendar.filter((k) => summary.practiceDays.has(k)).length;
  const unlocked: Record<MilestoneId, boolean> = {
    "first-session": hasSessions,
    "first-palace": activity.palaceCount > 0,
    "streak-3": summary.longestStreak >= 3,
    "technique-explorer": false,
  };
  const earnedCount = Object.values(unlocked).filter(Boolean).length;

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
            value={hasSessions ? pluralize(summary.currentStreak, "day") : null}
            valueHint={`Best: ${pluralize(summary.longestStreak, "day")}`}
            accent="sun"
          />
          <StatPlaceholder
            icon={Play}
            label="Training sessions"
            hint="Counted when you finish a session"
            value={hasSessions ? String(summary.sessionCount) : null}
            valueHint="Completed"
            accent="brand"
          />
          <StatPlaceholder
            icon={Clock}
            label="Training time"
            hint="Measured while you train"
            value={summary.totalSeconds > 0 ? formatDuration(summary.totalSeconds) : null}
            valueHint="Across completed sessions"
            accent="mint"
          />
          <StatPlaceholder
            icon={RotateCcw}
            label="Reviews"
            hint="Logged as you recall items"
            value={activity.reviewEventCount ? String(activity.reviewEventCount) : null}
            valueHint="Recall attempts logged"
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
            aria-label={`Practice calendar for the last ${WEEKS} weeks: ${
              activeDays
                ? `practiced on ${pluralize(activeDays, "day")}`
                : "no practice recorded yet"
            }`}
          >
            <div
              className="grid max-w-[26rem] grid-flow-col grid-rows-7 gap-1 sm:gap-1.5"
              style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` }}
            >
              {calendar.map((key) => {
                const level = intensity(summary.practiceDays.get(key) ?? 0);
                const future = key > summary.today;
                return (
                  <span
                    key={key}
                    title={future ? undefined : key}
                    className={cn(
                      "aspect-square rounded-sm",
                      future ? "bg-transparent" : legendShades[level],
                    )}
                  />
                );
              })}
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4" aria-hidden="true" />
              {activeDays
                ? `${pluralize(activeDays, "practice day")} in the last ${WEEKS} weeks`
                : "No practice recorded yet"}
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
              <ProgressIndicator
                key={c.id}
                value={summary.accuracy.get(c.id) ?? null}
                label={c.name}
              />
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section aria-labelledby="history">
          <SectionHeader id="history" title="Practice history" />
          {hasSessions ? (
            <ul className="panel divide-y divide-border p-2">
              {activity.sessions.slice(0, 8).map((s) => {
                const name =
                  trainingCategories.find((c) => c.id === s.activity_key)?.name ??
                  "Training session";
                return (
                  <li key={s.id} className="flex items-center gap-3 p-3">
                    <span
                      className={cn(
                        "grid size-9 shrink-0 place-items-center rounded-xl",
                        accentStyles.mint.icon,
                      )}
                    >
                      <CircleCheck className="size-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-foreground">
                        {name}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {formatDuration(s.duration_seconds)}
                        {s.total_items && s.correct_items !== null
                          ? ` · ${s.correct_items}/${s.total_items} correct`
                          : ""}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatShortDate(s.completed_at, timeZone)}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
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
          )}
        </section>
        <section aria-labelledby="reviews">
          <SectionHeader id="reviews" title="Review activity" />
          {activity.scheduledItemCount || activity.reviewEventCount ? (
            <div className="panel space-y-3 p-5">
              <p className="text-sm font-bold text-foreground">
                {pluralize(activity.reviewsDue, "item")} due now ·{" "}
                {pluralize(activity.reviewEventCount, "review")} logged
              </p>
              {activity.recentReviews.length ? (
                <ul className="divide-y divide-border">
                  {activity.recentReviews.map((r) => (
                    <li key={r.id} className="flex items-center justify-between py-2 text-sm">
                      <span className="font-semibold text-foreground">
                        {ratingLabels[r.rating] ?? r.rating}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatShortDate(r.reviewed_at, timeZone)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : (
            <EmptyState
              icon={RotateCcw}
              accent="mint"
              title="Nothing to review yet"
              description="Once you memorize something, Mentalist will help you revisit it at the right moments."
            />
          )}
        </section>
      </div>

      {/* Milestones preview */}
      <section aria-labelledby="milestones" className="rounded-3xl bg-surface-2 p-5 md:p-6">
        <SectionHeader
          id="milestones"
          title="Milestones to unlock"
          description={
            earnedCount
              ? `${earnedCount} of ${milestones.length} earned from your saved activity.`
              : "A preview of what's ahead — nothing has been earned yet."
          }
          action={<Award className="size-6 text-primary" aria-hidden="true" />}
        />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {milestones.map((m) => {
            const earned = unlocked[m.id];
            return (
              <li
                key={m.title}
                className="flex flex-col items-center rounded-2xl bg-card p-4 text-center"
              >
                <span className="relative">
                  <span
                    className={cn(
                      "grid size-14 place-items-center rounded-2xl",
                      !earned && "opacity-45 grayscale-[0.4]",
                      accentStyles[m.accent].icon,
                    )}
                  >
                    <m.icon className="size-7" aria-hidden="true" />
                  </span>
                  {earned ? null : (
                    <span className="absolute -right-1.5 -bottom-1.5 grid size-6 place-items-center rounded-full border-2 border-card bg-foreground text-background">
                      <Lock className="size-3" aria-hidden="true" />
                    </span>
                  )}
                </span>
                <span className="mt-3 text-sm font-bold text-foreground">{m.title}</span>
                <span
                  className={cn(
                    "text-xs",
                    earned ? "font-bold text-primary" : "text-muted-foreground",
                  )}
                >
                  {earned ? "Earned" : "Locked"}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
