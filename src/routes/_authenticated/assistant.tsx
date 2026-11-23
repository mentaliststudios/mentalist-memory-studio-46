import { createFileRoute } from "@tanstack/react-router";
import { Info, SendHorizontal, Sparkles } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/common/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { suggestedPrompts } from "@/config/assistant";
import { accentStyles } from "@/lib/accents";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/assistant")({
  head: () => ({
    meta: [
      { title: "AI Memory Assistant — Mentalist" },
      {
        name: "description",
        content: "Turn information into memorable associations, mnemonics and Memory Palaces.",
      },
      { property: "og:title", content: "AI Memory Assistant — Mentalist" },
      {
        property: "og:description",
        content: "A specialized assistant that turns information into memorable associations.",
      },
    ],
  }),
  component: AssistantPage,
});

const MAX_LENGTH = 2000;

function AssistantPage() {
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  function applyPrompt(text: string) {
    setMessage(text);
    inputRef.current?.focus();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim()) return;
    toast("The assistant isn't answering yet", {
      description:
        "Your message wasn't sent anywhere. Answer generation arrives in a future phase.",
    });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 md:space-y-8">
      <PageHeader
        eyebrow="Assistant"
        title="AI Memory Assistant"
        icon={Sparkles}
        description="Turn information into memorable associations."
        actions={<Badge variant="sun">In preparation</Badge>}
      />

      <div
        role="note"
        className="flex items-start gap-3 rounded-2xl border border-sun bg-sun/30 p-4 text-sm leading-relaxed text-foreground"
      >
        <Info className="mt-0.5 size-5 shrink-0 text-sun-foreground" aria-hidden="true" />
        <p>
          <span className="font-bold">The assistant is being prepared.</span> You can explore the
          interface now — it won't generate answers until it launches in a later phase.
        </p>
      </div>

      <section aria-labelledby="assistant-start" className="panel overflow-hidden">
        <div className="relative px-5 pt-10 pb-6 text-center md:px-8">
          <div className="pointer-events-none absolute inset-0 bg-dots opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
          <div className="relative">
            <span className="mx-auto grid size-16 animate-pop place-items-center rounded-2xl bg-primary text-primary-foreground shadow-press">
              <Sparkles className="size-8" aria-hidden="true" />
            </span>
            <h2 id="assistant-start" className="mt-5 text-2xl font-extrabold text-foreground">
              What would you like to remember?
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Pick a suggestion or describe what you're learning — a list, a definition, a speech, a
              formula.
            </p>
          </div>
        </div>

        <ul className="grid gap-2.5 px-5 pb-6 sm:grid-cols-2 md:px-8">
          {suggestedPrompts.map((p) => (
            <li key={p.text}>
              <button
                type="button"
                onClick={() => applyPrompt(p.text)}
                className="group flex w-full items-center gap-3 rounded-xl border border-border bg-background p-3 text-left text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-rose hover:bg-card hover:shadow-card"
              >
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-lg",
                    accentStyles[p.accent].icon,
                  )}
                >
                  <p.icon className="size-[18px]" aria-hidden="true" />
                </span>
                {p.text}
              </button>
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit} className="border-t border-border bg-background p-3 md:p-4">
          <label htmlFor="assistant-input" className="sr-only">
            Message the memory assistant
          </label>
          <div className="flex items-end gap-2 rounded-2xl border-2 border-border bg-card p-2 transition-colors focus-within:border-primary">
            <textarea
              id="assistant-input"
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={MAX_LENGTH}
              rows={2}
              placeholder="Paste text or describe what you want to memorize…"
              className="max-h-48 min-h-12 flex-1 resize-none bg-transparent px-2 py-1.5 text-base text-foreground outline-none placeholder:text-muted-foreground focus-visible:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                }
              }}
            />
            <Button type="submit" size="icon" aria-label="Send message" disabled={!message.trim()}>
              <SendHorizontal aria-hidden="true" />
            </Button>
          </div>
          <p className="mt-2 px-1 text-xs text-muted-foreground">
            Preview only — messages aren't sent or stored.
          </p>
        </form>
      </section>
    </div>
  );
}
