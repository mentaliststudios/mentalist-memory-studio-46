import { BrandGlyph } from "@/components/navigation/BrandMark";

/** Shown while the stored session is checked, so protected pages never flash for signed-out visitors. */
export function AuthPending() {
  return (
    <div
      className="grid min-h-dvh place-items-center bg-background"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4">
        <BrandGlyph className="size-14 animate-pulse" />
        <p className="text-sm font-semibold text-muted-foreground">Opening your memory space…</p>
      </div>
    </div>
  );
}
