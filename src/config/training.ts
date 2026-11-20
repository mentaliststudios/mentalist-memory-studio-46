import { Eye, Link2, ListOrdered, WholeWord, type LucideIcon } from "lucide-react";

import type { Accent } from "@/lib/accents";

export type TrainingCategoryId = "visual" | "sequence" | "words" | "association";

export interface TrainingCategory {
  id: TrainingCategoryId;
  name: string;
  description: string;
  skills: string[];
  icon: LucideIcon;
  accent: Accent;
}

export const trainingCategories: TrainingCategory[] = [
  {
    id: "visual",
    name: "Visual Memory",
    description: "Remember positions, colors and shapes after a quick glance.",
    skills: ["Spatial recall", "Attention to detail"],
    icon: Eye,
    accent: "violet",
  },
  {
    id: "sequence",
    name: "Sequence Memory",
    description: "Hold an order in mind — digits, steps and patterns — and play it back.",
    skills: ["Ordering", "Working memory"],
    icon: ListOrdered,
    accent: "mint",
  },
  {
    id: "words",
    name: "Word Memory",
    description: "Study a list of words, then recall as many as you can, forward and backward.",
    skills: ["Verbal recall", "Imagery"],
    icon: WholeWord,
    accent: "sun",
  },
  {
    id: "association",
    name: "Association Challenge",
    description:
      "Pair unrelated ideas with a vivid link, then rebuild the connections from memory.",
    skills: ["Linking", "Creativity"],
    icon: Link2,
    accent: "blush",
  },
];

export const difficultyLevels = ["Beginner", "Intermediate", "Advanced"] as const;
