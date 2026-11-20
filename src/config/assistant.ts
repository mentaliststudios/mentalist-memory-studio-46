import { Castle, Orbit, Quote, Sparkles, type LucideIcon } from "lucide-react";

import type { Accent } from "@/lib/accents";

export interface AssistantPrompt {
  text: string;
  icon: LucideIcon;
  accent: Accent;
}

export const suggestedPrompts: AssistantPrompt[] = [
  { text: "Help me memorize the planets.", icon: Orbit, accent: "violet" },
  { text: "Create a mnemonic for this information.", icon: Quote, accent: "blush" },
  { text: "Turn this text into memorable associations.", icon: Sparkles, accent: "mint" },
  { text: "Help me build a Memory Palace.", icon: Castle, accent: "sun" },
];
