import { CircleAlert, CircleCheck } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function FormAlert({ tone, children }: { tone: "error" | "success"; children: ReactNode }) {
  const Icon = tone === "error" ? CircleAlert : CircleCheck;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex gap-3 rounded-xl border p-3.5 text-sm font-medium leading-relaxed animate-pop",
        tone === "error"
          ? "border-destructive/30 bg-destructive/8 text-destructive"
          : "border-mint-foreground/20 bg-mint/50 text-mint-foreground",
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}
