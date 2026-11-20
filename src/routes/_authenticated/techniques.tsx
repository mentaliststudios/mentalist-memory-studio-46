import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Lightbulb, PlayCircle } from "lucide-react";
import { toast } from "sonner";

import { FeatureCard } from "@/components/common/FeatureCard";
import { IllustrationContainer } from "@/components/common/IllustrationContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { SectionHeader } from "@/components/common/SectionHeader";
import heroPalace from "@/assets/hero-palace.webp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { techniques, type Technique, type TechniqueGroup } from "@/config/techniques";
import { accentStyles } from "@/lib/accents";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/techniques")({
  head: () => ({
    meta: [
      { title: "Memory Techniques — Mentalist" },
      {
        name: "description",
        content:
          "Learn Memory Palace, visual association, mnemonics, acronyms, chunking, number systems and active recall.",
      },
      { property: "og:title", content: "Memory Techniques — Mentalist" },
      {
        property: "og:description",
        content: "A friendly library of proven memorization techniques.",
      },
    ],
  }),
  component: TechniquesPage,
});

function byGroup(group: TechniqueGroup) {
  return techniques.filter((t) => t.group === group);
}

function announceTutorial(name: string) {
  toast(`${name} tutorial coming soon`, {
    description: "Step-by-step lessons are being prepared for a future phase.",
  });
}

function TutorialButton({
  technique,
  variant = "soft",
}: {
  technique: Technique;
  variant?: "soft" | "default";
}) {
  return (
    <Button variant={variant} size="sm" onClick={() => announceTutorial(technique.name)}>
      <PlayCircle aria-hidden="true" /> Tutorial · soon
    </Button>
  );
}

function TechniquesPage() {
  const foundations = byGroup("foundations");
  const [featured, ...otherFoundations] = foundations;

  return (
    <div className="space-y-10 md:space-y-12">
      <PageHeader
        eyebrow="Library"
        title="Memory Techniques"
        icon={Lightbulb}
        accent="sun"
        description="Proven methods, explained simply. Start with the foundations, then pick up tricks for words and numbers."
      />

      {/* Foundations */}
      <section aria-labelledby="foundations">
        <SectionHeader
          id="foundations"
          title="Foundations"
          description="The core ideas everything else builds on."
        />
        <div className="grid gap-4 lg:grid-cols-5">
          {featured && (
            <article className="panel relative overflow-hidden lg:col-span-3 lg:row-span-2">
              <div className="grid h-full sm:grid-cols-[1.1fr_1fr] lg:grid-cols-1 xl:grid-cols-[1.1fr_1fr]">
                <div className="flex flex-col p-6 md:p-7">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="default">Most powerful</Badge>
                    <Badge variant="outline">{featured.level}</Badge>
                  </div>
                  <h3 className="mt-4 text-2xl font-extrabold text-foreground md:text-3xl">
                    {featured.name}
                  </h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {featured.description}
                  </p>
                  <div className="mt-auto pt-6">
                    <TutorialButton technique={featured} variant="default" />
                  </div>
                </div>
                <IllustrationContainer
                  src={heroPalace}
                  alt=""
                  className="m-2 mt-0 min-h-48 sm:mt-2 sm:ml-0 lg:mt-0 lg:ml-2 xl:mt-2 xl:ml-0"
                  imageClassName="p-4"
                />
              </div>
            </article>
          )}
          {otherFoundations.map((t) => (
            <FeatureCard
              key={t.id}
              icon={t.icon}
              title={t.name}
              description={t.description}
              accent={t.accent}
              badge={t.level}
              className="lg:col-span-2"
              footer={<TutorialButton technique={t} />}
            />
          ))}
        </div>
      </section>

      {/* Word tricks */}
      <section aria-labelledby="word-tricks">
        <SectionHeader
          id="word-tricks"
          title="Tricks for words and lists"
          description="Turn letters into sentences, words and little rhymes."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {byGroup("words").map((t) => (
            <article key={t.id} className="panel flex flex-col overflow-hidden">
              <div className={cn("relative px-5 pt-5 pb-6", accentStyles[t.accent].soft)}>
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "grid size-10 place-items-center rounded-xl",
                      accentStyles[t.accent].icon,
                    )}
                  >
                    <t.icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="text-[11px] font-extrabold tracking-[0.14em] text-muted-foreground uppercase">
                    Example
                  </span>
                </div>
                {t.example && (
                  <>
                    <p className="mt-4 font-display text-xl leading-tight font-extrabold text-foreground">
                      “{t.example.cue}”
                    </p>
                    <p className="mt-1.5 text-[13px] text-muted-foreground">{t.example.meaning}</p>
                  </>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-lg font-extrabold text-foreground">{t.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {t.description}
                </p>
                <div className="mt-auto pt-5">
                  <TutorialButton technique={t} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Numbers */}
      <section aria-labelledby="numbers">
        <SectionHeader
          id="numbers"
          title="Numbers and structure"
          description="Make long strings of digits feel short and meaningful."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {byGroup("numbers").map((t) => (
            <article
              key={t.id}
              className="panel flex flex-col gap-5 p-5 sm:flex-row sm:items-center md:p-6"
            >
              <div
                className={cn(
                  "flex shrink-0 flex-col items-center justify-center rounded-2xl px-5 py-6 text-center sm:w-44",
                  accentStyles[t.accent].soft,
                )}
              >
                <t.icon className={cn("size-6", accentStyles[t.accent].text)} aria-hidden="true" />
                {t.example && (
                  <p className="mt-2 font-display text-lg leading-tight font-extrabold text-foreground">
                    {t.example.cue}
                  </p>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-extrabold text-foreground">{t.name}</h3>
                  <Badge variant={accentStyles[t.accent].badge}>{t.level}</Badge>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {t.description}
                </p>
                {t.example && (
                  <p className="mt-2 text-[13px] font-semibold text-foreground">
                    {t.example.meaning}
                  </p>
                )}
                <div className="mt-4">
                  <TutorialButton technique={t} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="flex flex-col items-start gap-3 rounded-3xl bg-surface-2 p-5 sm:flex-row sm:items-center md:p-6">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-card text-primary">
          <BookOpen className="size-5" aria-hidden="true" />
        </span>
        <p className="text-sm leading-relaxed text-muted-foreground">
          <span className="font-bold text-foreground">Tip:</span> techniques combine beautifully.
          Use chunking to split a number, the Major System to turn each chunk into an image, and a
          Memory Palace to store them in order.
        </p>
      </aside>
    </div>
  );
}
