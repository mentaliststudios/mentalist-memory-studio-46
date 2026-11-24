import { z } from "zod";

import { DISPLAY_NAME_MAX_LENGTH } from "@/lib/auth/validation";

export const PALACE_NAME_MAX_LENGTH = 80;
export const PALACE_DESCRIPTION_MAX_LENGTH = 500;

/** True when the browser recognises the IANA time zone name. */
export function isValidTimeZone(value: string): boolean {
  if (!value) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

// Strip control characters so names render safely everywhere.
const cleanText = (v: string) => [...v].filter((ch) => ch.charCodeAt(0) >= 32 || ch === "\n").join("").trim();

export const profileSchema = z.object({
  displayName: z
    .string()
    .transform(cleanText)
    .pipe(
      z
        .string()
        .min(1, "Tell us what to call you.")
        .max(DISPLAY_NAME_MAX_LENGTH, `Keep it under ${DISPLAY_NAME_MAX_LENGTH} characters.`),
    ),
  timezone: z.string().trim().refine(isValidTimeZone, "Choose a valid time zone."),
});

export const palaceSchema = z.object({
  name: z
    .string()
    .transform(cleanText)
    .pipe(
      z
        .string()
        .min(1, "Give your palace a name.")
        .max(PALACE_NAME_MAX_LENGTH, `Keep it under ${PALACE_NAME_MAX_LENGTH} characters.`),
    ),
  description: z
    .string()
    .transform(cleanText)
    .pipe(
      z
        .string()
        .max(
          PALACE_DESCRIPTION_MAX_LENGTH,
          `Keep it under ${PALACE_DESCRIPTION_MAX_LENGTH} characters.`,
        ),
    ),
});

export type ProfileFormInput = z.input<typeof profileSchema>;
export type ProfileValues = z.output<typeof profileSchema>;
export type PalaceFormInput = z.input<typeof palaceSchema>;
export type PalaceValues = z.output<typeof palaceSchema>;
