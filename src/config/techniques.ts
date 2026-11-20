import {
  Castle,
  Brain,
  Hash,
  Image,
  LayoutGrid,
  ListOrdered,
  Quote,
  Type,
  type LucideIcon,
} from "lucide-react";

import type { Accent } from "@/lib/accents";

export type TechniqueGroup = "foundations" | "words" | "numbers";

export interface Technique {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  accent: Accent;
  group: TechniqueGroup;
  level: "Beginner" | "Intermediate";
  /** A short, real-world illustration of the technique. */
  example?: { cue: string; meaning: string };
}

export const techniques: Technique[] = [
  {
    id: "memory-palace",
    name: "Memory Palace",
    description:
      "Place vivid images along a route through a place you know well, then walk it again in your mind to recall everything in order.",
    icon: Castle,
    accent: "violet",
    group: "foundations",
    level: "Beginner",
  },
  {
    id: "visual-association",
    name: "Visual Association",
    description:
      "Link abstract ideas to bold, unusual mental pictures your brain simply can't ignore.",
    icon: Image,
    accent: "mint",
    group: "foundations",
    level: "Beginner",
  },
  {
    id: "active-recall",
    name: "Active Recall",
    description:
      "Pull information out of memory instead of rereading it. The effort is what makes it stick.",
    icon: Brain,
    accent: "sun",
    group: "foundations",
    level: "Beginner",
  },
  {
    id: "mnemonics",
    name: "Mnemonics",
    description: "Turn hard-to-remember facts into rhymes, phrases or little stories.",
    icon: Quote,
    accent: "blush",
    group: "words",
    level: "Beginner",
    example: {
      cue: "Every Good Boy Does Fine",
      meaning: "Notes on the treble staff lines: E G B D F",
    },
  },
  {
    id: "acronyms",
    name: "Acronyms",
    description: "Compress a list into one memorable word built from the first letters.",
    icon: Type,
    accent: "violet",
    group: "words",
    level: "Beginner",
    example: { cue: "ROY G BIV", meaning: "Red, Orange, Yellow, Green, Blue, Indigo, Violet" },
  },
  {
    id: "first-letter",
    name: "First-Letter Method",
    description:
      "Build a sentence where each word starts with the letter of the item you need to recall.",
    icon: ListOrdered,
    accent: "mint",
    group: "words",
    level: "Beginner",
    example: {
      cue: "My Very Educated Mother Just Served Us Nachos",
      meaning: "The eight planets, in order from the Sun",
    },
  },
  {
    id: "chunking",
    name: "Chunking",
    description:
      "Group long strings into a few meaningful pieces so your working memory can hold them.",
    icon: LayoutGrid,
    accent: "sun",
    group: "numbers",
    level: "Beginner",
    example: { cue: "415 · 555 · 0199", meaning: "Ten digits become three easy chunks" },
  },
  {
    id: "number-systems",
    name: "Number Memorization Systems",
    description:
      "Convert digits into sounds, words and images — like the Major System — so numbers become stories.",
    icon: Hash,
    accent: "blush",
    group: "numbers",
    level: "Intermediate",
    example: { cue: "3 = M · 2 = N", meaning: "32 becomes “MooN” — an image you can picture" },
  },
];
