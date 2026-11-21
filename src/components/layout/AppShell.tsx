import type { ReactNode } from "react";

import { ApplicationSidebar } from "@/components/navigation/ApplicationSidebar";
import { BrandMark } from "@/components/navigation/BrandMark";
import { AccountMenu } from "@/components/navigation/AccountMenu";
import { MobileBottomNavigation } from "@/components/navigation/MobileBottomNavigation";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>

      <ApplicationSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center border-b border-border bg-background/90 px-4 backdrop-blur-md md:hidden">
          <BrandMark />
          <div className="ml-auto">
            <AccountMenu variant="header" />
          </div>
        </header>

        <main id="main-content" tabIndex={-1} className="flex-1 pb-safe-nav outline-none md:pb-12">
          <div className="mx-auto w-full max-w-6xl px-4 pt-6 sm:px-6 md:pt-10 lg:px-10">
            {children}
          </div>
        </main>
      </div>

      <MobileBottomNavigation />
    </div>
  );
}
