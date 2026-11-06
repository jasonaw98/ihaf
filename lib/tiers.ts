import { type CategoryKey, gatherings } from "@/lib/content";
import { type Tier, tierPlans } from "@/lib/tier-plans";

export type TierProgress = {
  category: (typeof gatherings)[number];
  count: number;
  friends: number;
  level: number;
  tier: Tier;
  next: {
    tier: Tier;
    eventsRemaining: number;
    friendsRemaining: number;
  } | null;
  /** 0–1 progress from the current tier towards the next one. */
  progress: number;
};

export type FriendCounts = Partial<Record<CategoryKey, number>>;

export function isCategory(value: unknown): value is CategoryKey {
  return gatherings.some((item) => item.key === value);
}

export function categoryInfo(key: string | null | undefined) {
  return gatherings.find((item) => item.key === key) ?? null;
}

function share(value: number, from: number, to: number) {
  if (to <= from) return 1;
  return Math.min(Math.max((value - from) / (to - from), 0), 1);
}

export function tierFor(
  key: CategoryKey,
  count: number,
  friends = 0,
): TierProgress {
  const plan = tierPlans[key];
  let index = 0;
  plan.forEach((tier, i) => {
    if (count >= tier.events && friends >= tier.friends) index = i;
  });
  const tier = plan[index];
  const upcoming = plan[index + 1];
  const category = gatherings.find((item) => item.key === key) ?? gatherings[0];

  let progress = 1;
  if (upcoming) {
    const eventShare = share(count, tier.events, upcoming.events);
    progress =
      upcoming.friends > tier.friends
        ? (eventShare + share(friends, tier.friends, upcoming.friends)) / 2
        : eventShare;
  }

  return {
    category,
    count,
    friends,
    level: index + 1,
    tier,
    next: upcoming
      ? {
          tier: upcoming,
          eventsRemaining: Math.max(upcoming.events - count, 0),
          friendsRemaining: Math.max(upcoming.friends - friends, 0),
        }
      : null,
    progress,
  };
}

/** Tiers for every category, counting only attendance a host confirmed. */
export function tiersFromAttendance(
  rsvps: { category: string | null; attendedAt: string | null }[],
  friendCounts: FriendCounts = {},
) {
  const counts = new Map<CategoryKey, number>();
  for (const rsvp of rsvps) {
    if (!rsvp.attendedAt || !isCategory(rsvp.category)) continue;
    counts.set(rsvp.category, (counts.get(rsvp.category) ?? 0) + 1);
  }
  return gatherings.map((item) =>
    tierFor(item.key, counts.get(item.key) ?? 0, friendCounts[item.key] ?? 0),
  );
}

export function requirementText(tier: Tier, label: string) {
  if (tier.events === 0) return "Where everyone starts";
  const events = `${tier.events} IHAF ${label} ${tier.events === 1 ? "event" : "events"}`;
  return tier.friends > 0
    ? `${events} + ${tier.friends} new ${tier.friends === 1 ? "friend" : "friends"}`
    : events;
}

export function nextStepText(progress: TierProgress) {
  if (!progress.next) return "Final tier reached 💎";
  const parts: string[] = [];
  const { eventsRemaining, friendsRemaining, tier } = progress.next;
  if (eventsRemaining > 0) {
    parts.push(
      `${eventsRemaining} more ${eventsRemaining === 1 ? "event" : "events"}`,
    );
  }
  if (friendsRemaining > 0) {
    parts.push(
      `${friendsRemaining} new ${friendsRemaining === 1 ? "friend" : "friends"}`,
    );
  }
  return `${parts.join(" + ")} to ${tier.code} ${tier.title}`;
}
