import { Lightbulb } from "lucide-react";

import { primaryNavigation } from "@/config/navigation";
import { AccountMenu } from "./AccountMenu";
import { BrandMark } from "./BrandMark";
import { NavigationItem } from "./NavigationItem";

/** Desktop sidebar (lg+) that collapses to an icon rail on tablets (md). Hidden on phones. */
export function ApplicationSidebar() {
  return (
    <aside className="sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-3 py-6 md:flex md:w-[5.5rem] lg:w-64 lg:px-4">
      <div className="flex justify-center px-1 lg:justify-start lg:px-2">
        <BrandMark compactOnTablet />
      </div>

      <nav aria-label="Main navigation" className="mt-8 flex-1">
        <ul className="space-y-1.5">
          {primaryNavigation.map((item) => (
            <li key={item.to}>
              <NavigationItem item={item} variant="sidebar" />
            </li>
          ))}
        </ul>
      </nav>

      <div className="hidden rounded-2xl bg-surface-2 p-4 lg:block">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <span className="grid size-7 place-items-center rounded-lg bg-sun text-sun-foreground">
            <Lightbulb className="size-4" aria-hidden="true" />
          </span>
          Memory tip
        </div>
        <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
          The stranger the image, the stronger the memory. Exaggerate, animate, make it funny.
        </p>
      </div>

      <div className="mt-4 border-t border-sidebar-border pt-4">
        <AccountMenu variant="sidebar" />
      </div>
    </aside>
  );
}
