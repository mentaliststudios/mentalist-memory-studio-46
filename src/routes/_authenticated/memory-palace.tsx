import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Castle, Footprints, Info, MapPin, Plus, Sparkles } from "lucide-react";
import { useState } from "react";

import { EmptyState } from "@/components/common/EmptyState";
import { IllustrationContainer } from "@/components/common/IllustrationContainer";
import { PageHeader } from "@/components/common/PageHeader";
import { PageError, PageLoading } from "@/components/common/PageStatus";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { PalaceCard } from "@/components/palace/PalaceCard";
import { PalaceFormDialog, type PalaceDialogState } from "@/components/palace/PalaceFormDialog";
import { Button } from "@/components/ui/button";
import { futurePalaceTemplates, palaceEnvironments } from "@/config/palace";
import { useSessionUser } from "@/lib/auth/use-session-user";
import { palacesQuery } from "@/lib/data/palaces";
import { myProfileQuery } from "@/lib/data/profile";
import { accentStyles, type Accent } from "@/lib/accents";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/memory-palace")({
  head: () => ({
    meta: [
      { title: "Memory Palace — Mentalist" },
      {
        name: "description",
        content:
          "Use the Method of Loci: turn familiar places into Memory Palaces that store anything you learn.",
      },
      { property: "og:title", content: "Memory Palace — Mentalist" },
      {
        property: "og:description",
        content: "Turn your bedroom, kitchen or hallway into a Memory Palace with Mentalist.",
      },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(palacesQuery(context.user.id)),
      context.queryClient.ensureQueryData(myProfileQuery(context.user.id)),
    ]),
  pendingComponent: PageLoading,
  errorComponent: PageError,
  component: MemoryPalacePage,
});

const steps: { title: string; description: string; icon: typeof MapPin; accent: Accent }[] = [
  {
    title: "Choose a place",
    description: "Somewhere you can picture with your eyes closed — your home is perfect.",
    icon: MapPin,
    accent: "brand",
  },
  {
    title: "Walk a route",
    description: "Pick stops in a fixed order: the door, the lamp, the bed, the window…",
    icon: Footprints,
    accent: "mint",
  },
  {
    title: "Place vivid images",
    description: "Leave a strange, funny image at each stop. Walk back to recall.",
    icon: Sparkles,
    accent: "sun",
  },
];

function MemoryPalacePage() {
  const user = useSessionUser();
  const { data: palaces } = useSuspenseQuery(palacesQuery(user.id));
  const { data: profile } = useSuspenseQuery(myProfileQuery(user.id));
  const timeZone = profile?.timezone ?? "UTC";
  const [dialog, setDialog] = useState<PalaceDialogState | null>(null);
  const openCreate = () => setDialog({ mode: "create" });

  return (
    <div className="space-y-10 md:space-y-12">
      <PageHeader
        eyebrow="Method of Loci"
        title="Memory Palace"
        icon={Castle}
        description="Your mind remembers places remarkably well. Turn familiar spaces into storage for anything you want to keep."
        actions={
          <Button size="lg" onClick={openCreate}>
            <Plus aria-hidden="true" /> Create palace
          </Button>
        }
      />

      {/* How it works */}
      <section aria-labelledby="how-it-works" className="panel overflow-hidden">
        <div className="grid lg:grid-cols-[1fr_1.6fr]">
          <div className="bg-hero relative p-6 md:p-8">
            <div className="pointer-events-none absolute inset-0 bg-dots opacity-50" />
            <div className="relative">
              <h2 id="how-it-works" className="text-xl font-extrabold text-foreground md:text-2xl">
                How it works
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                The Method of Loci has been used since ancient Greece, when orators memorized entire
                speeches by walking through imaginary buildings. Today memory champions still rely
                on it.
              </p>
            </div>
          </div>
          <ol className="grid gap-px bg-border sm:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="flex flex-col gap-3 bg-card p-5 md:p-6">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "grid size-10 place-items-center rounded-xl",
                      accentStyles[step.accent].icon,
                    )}
                  >
                    <step.icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="font-display text-sm font-extrabold text-muted-foreground">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="font-extrabold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Your palaces */}
      <section aria-labelledby="your-palaces">
        <SectionHeader
          id="your-palaces"
          title="Your palaces"
          description={palaces.length ? `${palaces.length} saved to your account` : undefined}
        />
        {palaces.length ? (
          <>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {palaces.map((palace) => (
                <li key={palace.id}>
                  <PalaceCard
                    palace={palace}
                    userId={user.id}
                    timeZone={timeZone}
                    onEdit={(p) => setDialog({ mode: "edit", palace: p })}
                  />
                </li>
              ))}
            </ul>
            <p className="mt-4 flex items-center gap-2 rounded-xl bg-surface-2 px-3 py-2.5 text-[13px] text-muted-foreground">
              <Info className="size-4 shrink-0 text-primary" aria-hidden="true" />
              Adding rooms and stops to a palace is coming next.
            </p>
          </>
        ) : (
          <EmptyState
            icon={Castle}
            title="No palaces yet"
            description="Pick a place you know by heart, plan a route, and your first palace will live here."
            action={
              <Button onClick={openCreate}>
                <Plus aria-hidden="true" /> Create your first palace
              </Button>
            }
          />
        )}
      </section>

      {/* Environments */}
      <section aria-labelledby="environments">
        <SectionHeader
          id="environments"
          title="Start from a familiar place"
          description="Preview rooms that make great first palaces."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {palaceEnvironments.map((env, index) => (
            <li key={env.id} className={cn(index < 2 ? "lg:col-span-3" : "lg:col-span-2")}>
              <article className="group panel flex h-full flex-col overflow-hidden p-2 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift">
                <IllustrationContainer
                  src={env.image}
                  alt={`Illustrated ${env.name.toLowerCase()}`}
                  accent={env.accent}
                  className={cn("aspect-[4/3]", index < 2 && "lg:aspect-[16/10]")}
                  imageClassName="p-3 transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <div className="flex flex-1 flex-col p-3 pt-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-extrabold text-foreground">{env.name}</h3>
                    <Badge variant="outline">Ready-made rooms · soon</Badge>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {env.greatFor}
                  </p>
                  <Button
                    variant="soft"
                    size="sm"
                    className="mt-3 self-start"
                    onClick={() =>
                      setDialog({ mode: "create", name: env.name, templateKey: env.id })
                    }
                  >
                    <Plus aria-hidden="true" /> Use this place
                  </Button>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>

      {/* Future templates */}
      <section aria-labelledby="more-templates" className="rounded-3xl bg-surface-2 p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 id="more-templates" className="text-lg font-extrabold text-foreground">
              More templates on the way
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Any place you know well can become a palace.
            </p>
          </div>
          <ul className="flex flex-wrap gap-2">
            {futurePalaceTemplates.map((name) => (
              <li
                key={name}
                className="rounded-xl border-2 border-dashed border-border-strong bg-card px-3 py-1.5 text-sm font-semibold text-muted-foreground"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <PalaceFormDialog userId={user.id} state={dialog} onClose={() => setDialog(null)} />
    </div>
  );
}
