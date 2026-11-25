import type { ActivitySnapshot } from "./activity";
import { accuracyByActivity, currentStreak, dayKey, longestStreak, type DayKey } from "./stats";

export interface PracticeSummary {
  today: DayKey;
  /** Completed sessions per calendar day (user's time zone). */
  practiceDays: Map<DayKey, number>;
  currentStreak: number;
  longestStreak: number;
  totalSeconds: number;
  sessionCount: number;
  accuracy: Map<string, number>;
}

/** Derives every practice figure from saved sessions. Nothing here is estimated or invented. */
export function summarizePractice(
  snapshot: Pick<ActivitySnapshot, "sessions" | "sessionCount">,
  timeZone: string,
  now: Date = new Date(),
): PracticeSummary {
  const practiceDays = new Map<DayKey, number>();
  let totalSeconds = 0;
  for (const s of snapshot.sessions) {
    const key = dayKey(s.completed_at, timeZone);
    practiceDays.set(key, (practiceDays.get(key) ?? 0) + 1);
    totalSeconds += s.duration_seconds;
  }
  const days = new Set(practiceDays.keys());
  const today = dayKey(now, timeZone);
  return {
    today,
    practiceDays,
    currentStreak: currentStreak(days, today),
    longestStreak: longestStreak(days),
    totalSeconds,
    sessionCount: snapshot.sessionCount,
    accuracy: accuracyByActivity(snapshot.sessions),
  };
}
