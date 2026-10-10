import { type CategoryKey, gatherings, tierPlans } from "@/lib/content";

export type TierProgress = {
  category: (typeof gatherings)[number];
  count: number;
  level: number;
  name: string;
  next: { level: number; name: string; remaining: number } | null;
  /** 0–1 progress from the current tier towards the next one. */
  progress: number;
};

export function isCategory(value: unknown): value is CategoryKey {
  return gatherings.some((item) => item.key === value);
}

export function categoryInfo(key: string | null | undefined) {
  return gatherings.find((item) => item.key === key) ?? null;
}

export function tierFor(key: CategoryKey, count: number): TierProgress {
  const plan = tierPlans[key];
  let index = 0;
  plan.forEach((tier, i) => {
    if (count >= tier.from) index = i;
  });
  const current = plan[index];
  const upcoming = plan[index + 1];
  const category = gatherings.find((item) => item.key === key) ?? gatherings[0];

  return {
    category,
    count,
    level: index + 1,
    name: current.name,
    next: upcoming
      ? {
          level: index + 2,
          name: upcoming.name,
          remaining: upcoming.from - count,
        }
      : null,
    progress: upcoming
      ? (count - current.from) / (upcoming.from - current.from)
      : 1,
  };
}

/** Tiers for every category, counting only attendance a host confirmed. */
export function tiersFromAttendance(
  rsvps: { category: string | null; attendedAt: string | null }[],
) {
  const counts = new Map<CategoryKey, number>();
  for (const rsvp of rsvps) {
    if (!rsvp.attendedAt || !isCategory(rsvp.category)) continue;
    counts.set(rsvp.category, (counts.get(rsvp.category) ?? 0) + 1);
  }
  return gatherings.map((item) => tierFor(item.key, counts.get(item.key) ?? 0));
}
