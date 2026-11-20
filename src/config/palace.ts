import bedroom from "@/assets/room-bedroom.webp";
import hallway from "@/assets/room-hallway.webp";
import kitchen from "@/assets/room-kitchen.webp";
import living from "@/assets/room-living.webp";
import office from "@/assets/room-office.webp";
import type { Accent } from "@/lib/accents";

export interface PalaceEnvironment {
  id: string;
  name: string;
  greatFor: string;
  image: string;
  accent: Accent;
}

export const palaceEnvironments: PalaceEnvironment[] = [
  {
    id: "bedroom",
    name: "Bedroom",
    greatFor: "Your very first palace — you know every corner.",
    image: bedroom,
    accent: "violet",
  },
  {
    id: "living-room",
    name: "Living Room",
    greatFor: "Lists, speeches and presentation points.",
    image: living,
    accent: "sun",
  },
  {
    id: "kitchen",
    name: "Kitchen",
    greatFor: "Shopping lists, recipes and step-by-step processes.",
    image: kitchen,
    accent: "mint",
  },
  {
    id: "office",
    name: "Office",
    greatFor: "Work facts, exam topics and vocabulary.",
    image: office,
    accent: "blush",
  },
  {
    id: "hallway",
    name: "Hallway",
    greatFor: "Long sequences — each door becomes a new room.",
    image: hallway,
    accent: "violet",
  },
];

export const futurePalaceTemplates = [
  "Your school",
  "Daily commute",
  "Favorite park",
  "A city you love",
];
