/** Pure helpers that turn saved practice rows into dashboard / progress figures. */

export type DayKey = string; // YYYY-MM-DD in the user's time zone

const formatters = new Map<string, Intl.DateTimeFormat>();

function dayFormatter(timeZone: string): Intl.DateTimeFormat {
  let f = formatters.get(timeZone);
  if (!f) {
    try {
      f = new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    } catch {
      f = new Intl.DateTimeFormat("en-CA", {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }
    formatters.set(timeZone, f);
  }
  return f;
}

/** Calendar day of an instant in the given IANA time zone (falls back to UTC if invalid). */
export function dayKey(date: Date | string, timeZone: string): DayKey {
  const d = typeof date === "string" ? new Date(date) : date;
  const parts = dayFormatter(timeZone).formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function addDays(key: DayKey, days: number): DayKey {
  const d = new Date(`${key}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** 0 = Monday … 6 = Sunday. */
export function weekdayIndex(key: DayKey): number {
  return (new Date(`${key}T00:00:00Z`).getUTCDay() + 6) % 7;
}

/** Consecutive practice days ending today, or ending yesterday if today has no practice yet. */
export function currentStreak(days: ReadonlySet<DayKey>, today: DayKey): number {
  let cursor = days.has(today) ? today : addDays(today, -1);
  let streak = 0;
  while (days.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

export function longestStreak(days: ReadonlySet<DayKey>): number {
  let best = 0;
  for (const day of days) {
    if (days.has(addDays(day, -1))) continue; // not the start of a run
    let length = 1;
    while (days.has(addDays(day, length))) length += 1;
    best = Math.max(best, length);
  }
  return best;
}

/** Monday-to-Sunday keys for the week containing `today`. */
export function weekKeys(today: DayKey): DayKey[] {
  const monday = addDays(today, -weekdayIndex(today));
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

/** `weeks` full Monday-first weeks ending with the current week, oldest first, day by day. */
export function calendarKeys(today: DayKey, weeks: number): DayKey[] {
  const start = addDays(today, -weekdayIndex(today) - (weeks - 1) * 7);
  return Array.from({ length: weeks * 7 }, (_, i) => addDays(start, i));
}

/** Calendar shade: 0 none, 1 one session, 2 two sessions, 3 three or more. */
export function intensity(count: number): 0 | 1 | 2 | 3 {
  if (count <= 0) return 0;
  if (count >= 3) return 3;
  return count as 1 | 2;
}

export function formatDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) return "0 min";
  if (totalSeconds < 60) return "<1 min";
  const minutes = Math.floor(totalSeconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} h ${rest} min` : `${hours} h`;
}

export interface AccuracyInput {
  activity_key: string;
  total_items: number | null;
  correct_items: number | null;
}

/** Recall rate (0–100) per activity, only for activities with at least one scored item. */
export function accuracyByActivity(sessions: readonly AccuracyInput[]): Map<string, number> {
  const totals = new Map<string, { correct: number; total: number }>();
  for (const s of sessions) {
    if (!s.total_items || s.total_items <= 0 || s.correct_items === null) continue;
    const t = totals.get(s.activity_key) ?? { correct: 0, total: 0 };
    t.correct += s.correct_items;
    t.total += s.total_items;
    totals.set(s.activity_key, t);
  }
  const result = new Map<string, number>();
  for (const [key, t] of totals) result.set(key, (t.correct / t.total) * 100);
  return result;
}

export function pluralize(count: number, one: string, many = `${one}s`): string {
  return `${count} ${count === 1 ? one : many}`;
}

/** "Nov 23" (or "Nov 23, 2025" outside the current year) in the user's time zone. */
export function formatShortDate(iso: string, timeZone: string, now = new Date()): string {
  const d = new Date(iso);
  const sameYear = dayKey(d, timeZone).slice(0, 4) === dayKey(now, timeZone).slice(0, 4);
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  };
  try {
    return new Intl.DateTimeFormat("en-US", { ...options, timeZone }).format(d);
  } catch {
    return new Intl.DateTimeFormat("en-US", { ...options, timeZone: "UTC" }).format(d);
  }
}
