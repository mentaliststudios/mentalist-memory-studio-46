import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { queryKeys } from "./keys";

/** Upper bound of completed sessions loaded for charts and totals (the API returns at most 1000 rows). */
export const SESSION_HISTORY_LIMIT = 1000;

export interface CompletedSession {
  id: string;
  activity_key: string;
  session_type: string;
  completed_at: string;
  duration_seconds: number;
  total_items: number | null;
  correct_items: number | null;
}

export interface ActivitySnapshot {
  /** Completed sessions, newest first (up to SESSION_HISTORY_LIMIT). */
  sessions: CompletedSession[];
  sessionCount: number;
  scheduledItemCount: number;
  reviewsDue: number;
  reviewEventCount: number;
  recentReviews: { id: string; rating: string; reviewed_at: string }[];
  palaceCount: number;
  recentPalaces: { id: string; name: string; created_at: string }[];
}

function must<T>(result: { data: T; error: unknown }): T {
  if (result.error) throw result.error;
  return result.data;
}

function count(result: { count: number | null; error: unknown }): number {
  if (result.error) throw result.error;
  return result.count ?? 0;
}

/** Everything the dashboard and progress pages show, read from the user's own rows only. */
export const activityQuery = (userId: string) =>
  queryOptions({
    queryKey: queryKeys.activity(userId),
    queryFn: async (): Promise<ActivitySnapshot> => {
      const now = new Date().toISOString();
      const [
        sessions,
        sessionCount,
        scheduled,
        due,
        events,
        recentReviews,
        palaces,
        recentPalaces,
      ] = await Promise.all([
        supabase
          .from("practice_sessions")
          .select(
            "id, activity_key, session_type, completed_at, duration_seconds, total_items, correct_items",
          )
          .eq("user_id", userId)
          .eq("status", "completed")
          .not("completed_at", "is", null)
          .order("completed_at", { ascending: false })
          .limit(SESSION_HISTORY_LIMIT),
        supabase
          .from("practice_sessions")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId)
          .eq("status", "completed"),
        supabase
          .from("review_schedule")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId),
        supabase
          .from("review_schedule")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId)
          .lte("due_at", now),
        supabase
          .from("review_events")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId),
        supabase
          .from("review_events")
          .select("id, rating, reviewed_at")
          .eq("user_id", userId)
          .order("reviewed_at", { ascending: false })
          .limit(5),
        supabase
          .from("memory_palaces")
          .select("id", { count: "exact", head: true })
          .eq("user_id", userId)
          .is("archived_at", null),
        supabase
          .from("memory_palaces")
          .select("id, name, created_at")
          .eq("user_id", userId)
          .is("archived_at", null)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      return {
        sessions: must(sessions) as CompletedSession[],
        sessionCount: count(sessionCount),
        scheduledItemCount: count(scheduled),
        reviewsDue: count(due),
        reviewEventCount: count(events),
        recentReviews: must(recentReviews),
        palaceCount: count(palaces),
        recentPalaces: must(recentPalaces),
      };
    },
  });
