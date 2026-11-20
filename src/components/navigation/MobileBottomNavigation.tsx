import { primaryNavigation } from "@/config/navigation";
import { NavigationItem } from "./NavigationItem";

/** Bottom tab bar for phones (below md). */
export function MobileBottomNavigation() {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 pb-safe backdrop-blur-md md:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-6 px-1">
        {primaryNavigation.map((item) => (
          <li key={item.to} className="min-w-0">
            <NavigationItem item={item} variant="bottom" />
          </li>
        ))}
      </ul>
    </nav>
  );
}
