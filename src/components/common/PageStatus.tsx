import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useRouter, type ErrorComponentProps } from "@tanstack/react-router";
import { CloudOff } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { friendlyDataError } from "@/lib/data/errors";

/** Shown while a page's saved data loads. */
export function PageLoading() {
  return (
    <div className="space-y-8" role="status" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <div className="space-y-3">
        <Skeleton className="h-4 w-28 rounded-lg" />
        <Skeleton className="h-9 w-64 max-w-full rounded-xl" />
        <Skeleton className="h-4 w-96 max-w-full rounded-lg" />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-3xl" />
    </div>
  );
}

/** Shown when a page's saved data couldn't be loaded; retry re-runs the page's loader. */
export function PageError({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  const queryReset = useQueryErrorResetBoundary();
  return (
    <EmptyState
      icon={CloudOff}
      accent="blush"
      title="We couldn't load this page"
      description={friendlyDataError(error)}
      action={
        <Button
          onClick={() => {
            queryReset.reset();
            reset();
            void router.invalidate();
          }}
        >
          Try again
        </Button>
      }
    />
  );
}
