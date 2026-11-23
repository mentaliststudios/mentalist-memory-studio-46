/**
 * Accent palette used to give sections a distinct but consistent identity.
 * Class strings are literal so Tailwind can see them.
 */
export type Accent = "brand" | "mint" | "sun" | "blush";

export const accentStyles: Record<
  Accent,
  {
    icon: string;
    soft: string;
    text: string;
    border: string;
    dot: string;
    badge: "soft" | "mint" | "sun" | "blush";
  }
> = {
  brand: {
    icon: "bg-accent text-accent-foreground",
    soft: "bg-surface-2",
    text: "text-accent-foreground",
    border: "border-rose",
    dot: "bg-primary",
    badge: "soft",
  },
  mint: {
    icon: "bg-mint text-mint-foreground",
    soft: "bg-mint/35",
    text: "text-mint-foreground",
    border: "border-mint",
    dot: "bg-mint-foreground",
    badge: "mint",
  },
  sun: {
    icon: "bg-sun text-sun-foreground",
    soft: "bg-sun/40",
    text: "text-sun-foreground",
    border: "border-sun",
    dot: "bg-sun-foreground",
    badge: "sun",
  },
  blush: {
    icon: "bg-blush text-blush-foreground",
    soft: "bg-blush/40",
    text: "text-blush-foreground",
    border: "border-blush",
    dot: "bg-blush-foreground",
    badge: "blush",
  },
};
