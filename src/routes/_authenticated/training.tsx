import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Lock, Target, Trophy, Gauge, MousePointerClick } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { IllustrationContainer } from "@/components/common/IllustrationContainer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  difficultyLevels,
  trainingCategories,
  type TrainingCategory,
  type TrainingCategoryId,
} from "@/config/training";
import { accentStyles } from "@/lib/accents";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/training")({
  head: () => ({
    meta: [
      { title: "Memory Training — Mentalist" },
      {
        name: "description",
        content:
          "Train visual, sequence, word and association memory with friendly, focused exercises.",
      },
      { property: "og:title", content: "Memory Training — Mentalist" },
      {
        property: "og:description",
        content: "A playful training hub for visual, sequence, word and association memory.",
      },
    ],
  }),
  component: TrainingPage,
});

const howItWorks = [
  { icon: MousePointerClick, label: "Pick a skill" },
  { icon: Gauge, label: "Choose a level" },
  { icon: Trophy, label: "Beat your own best" },
];

/* Decorative mini visuals — each category gets its own identity. */
function VisualMemoryArt() {
  const lit = new Set([1, 6, 8, 13]);
  const tones = ["bg-primary", "bg-mint", "bg-sun", "bg-primary-glow"];
  let tone = 0;
  return (
    <div className="grid h-full place-items-center p-5">
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 16 }, (_, i) => (
          <span
            key={i}
            className={cn(
              "size-7 rounded-lg sm:size-8",
              lit.has(i) ? tones[tone++ % tones.length] : "bg-card/80",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function SequenceArt() {
  const digits = ["3", "8", "1"];
  return (
    <div className="flex h-full items-center justify-center gap-1.5 p-5 sm:gap-2">
      {digits.map((d, i) => (
        <span key={i} className="flex items-center gap-1.5 sm:gap-2">
          <span className="grid size-10 place-items-center rounded-xl bg-card font-display text-lg font-extrabold text-mint-foreground shadow-soft sm:size-11">
            {d}
          </span>
          <ArrowRight className="size-4 text-mint-foreground/60" />
        </span>
      ))}
      <span className="grid size-10 place-items-center rounded-xl border-2 border-dashed border-mint-foreground/40 font-display text-lg font-extrabold text-mint-foreground sm:size-11">
        ?
      </span>
    </div>
  );
}

function WordsArt() {
  const words = [
    { w: "lantern", c: "-rotate-3" },
    { w: "violin", c: "rotate-2" },
    { w: "maple", c: "rotate-1" },
    { w: "comet", c: "-rotate-2" },
    { w: "harbor", c: "rotate-3" },
  ];
  return (
    <div className="flex h-full flex-wrap content-center items-center justify-center gap-2 p-5">
      {words.map(({ w, c }) => (
        <span
          key={w}
          className={cn(
            "rounded-lg bg-card px-3 py-1.5 text-sm font-bold text-sun-foreground shadow-soft",
            c,
          )}
        >
          {w}
        </span>
      ))}
    </div>
  );
}

function AssociationArt() {
  return (
    <div className="flex h-full items-center justify-center gap-2 p-5">
      <span className="rounded-xl bg-card px-3 py-2 text-sm font-bold text-blush-foreground shadow-soft">
        Kangaroo
      </span>
      <span className="h-0.5 w-6 rounded-full bg-blush-foreground/40 sm:w-10" />
      <span className="grid size-9 place-items-center rounded-full bg-blush-foreground text-primary-foreground">
        <span className="text-xs font-extrabold">+</span>
      </span>
      <span className="h-0.5 w-6 rounded-full bg-blush-foreground/40 sm:w-10" />
      <span className="rounded-xl bg-card px-3 py-2 text-sm font-bold text-blush-foreground shadow-soft">
        Pocket watch
      </span>
    </div>
  );
}

const art: Record<TrainingCategoryId, () => React.JSX.Element> = {
  visual: VisualMemoryArt,
  sequence: SequenceArt,
  words: WordsArt,
  association: AssociationArt,
};

function announceTraining(name: string) {
  toast(`${name} is being prepared`, {
    description: "Real exercises arrive in an upcoming phase — no scores are recorded yet.",
  });
}

function TrainingCard({ category }: { category: TrainingCategory }) {
  const Art = art[category.id];
  const styles = accentStyles[category.accent];
  return (
    <article className="group panel flex flex-col overflow-hidden p-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift">
      <IllustrationContainer accent={category.accent} className="h-40 sm:h-44">
        <Art />
      </IllustrationContainer>
      <div className="flex flex-1 flex-col p-3 pt-4 md:p-4">
        <div className="flex items-center gap-3">
          <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", styles.icon)}>
            <category.icon className="size-5" aria-hidden="true" />
          </span>
          <h2 className="text-xl font-extrabold text-foreground">{category.name}</h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{category.description}</p>
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Skills trained">
          {category.skills.map((s) => (
            <li key={s}>
              <Badge variant="outline">{s}</Badge>
            </li>
          ))}
        </ul>

        <div className="mt-5 rounded-xl bg-background p-3">
          <p className="text-[11px] font-extrabold tracking-[0.14em] text-muted-foreground uppercase">
            Levels
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {difficultyLevels.map((level) => (
              <li
                key={level}
                className="flex items-center gap-1 rounded-lg border border-border bg-card px-2 py-1 text-xs font-bold text-muted-foreground"
              >
                <Lock className="size-3 shrink-0" aria-hidden="true" />
                <span>{level}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <span className="text-xs font-semibold text-muted-foreground">Exercises coming soon</span>
          <Button variant="soft" onClick={() => announceTraining(category.name)}>
            Preview <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      </div>
    </article>
  );
}

function TrainingPage() {
  return (
    <div className="space-y-10 md:space-y-12">
      <PageHeader
        eyebrow="Training hub"
        title="Memory Training"
        icon={Target}
        accent="mint"
        description="Short, focused workouts for different memory skills. Pick one and make it a habit."
      />

      <ol className="flex flex-wrap items-center gap-2 sm:gap-3" aria-label="How training works">
        {howItWorks.map((step, i) => (
          <li key={step.label} className="flex items-center gap-2 sm:gap-3">
            <span className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-bold text-foreground">
              <step.icon className="size-4 text-primary" aria-hidden="true" />
              {step.label}
            </span>
            {i < howItWorks.length - 1 && (
              <ArrowRight
                className="hidden size-4 text-muted-foreground sm:block"
                aria-hidden="true"
              />
            )}
          </li>
        ))}
      </ol>

      <div className="grid gap-5 md:grid-cols-2">
        {trainingCategories.map((c) => (
          <TrainingCard key={c.id} category={c} />
        ))}
      </div>
    </div>
  );
}
