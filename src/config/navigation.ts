import {
  Castle,
  House,
  Lightbulb,
  Sparkles,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export type NavigationPath =
  "/dashboard" | "/memory-palace" | "/techniques" | "/training" | "/assistant" | "/progress";

export interface NavigationEntry {
  title: string;
  /** Short label for the mobile bottom navigation. */
  shortTitle: string;
  to: NavigationPath;
  icon: LucideIcon;
}

export const primaryNavigation: NavigationEntry[] = [
  { title: "Dashboard", shortTitle: "Home", to: "/dashboard", icon: House },
  { title: "Memory Palace", shortTitle: "Palace", to: "/memory-palace", icon: Castle },
  { title: "Techniques", shortTitle: "Methods", to: "/techniques", icon: Lightbulb },
  { title: "Training", shortTitle: "Train", to: "/training", icon: Target },
  { title: "AI Assistant", shortTitle: "Assistant", to: "/assistant", icon: Sparkles },
  { title: "Progress", shortTitle: "Progress", to: "/progress", icon: TrendingUp },
];
