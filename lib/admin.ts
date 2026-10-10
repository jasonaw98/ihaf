import { notFound } from "next/navigation";
import { eventColumns, withAttendance } from "@/lib/events";
import { createClient } from "@/lib/supabase/server";
import { isCategory, tiersFromAttendance } from "@/lib/tiers";

/** Resolves for admins; everyone else gets a 404 so the area stays hidden. */
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) notFound();
  return { supabase, user };
}

export async function getAdminOverview() {
  const { supabase } = await requireAdmin();
  const [{ data: events, error }, { count: memberCount }] = await Promise.all([
    supabase
      .from("events")
      .select(eventColumns)
      .order("starts_at", { ascending: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ]);
  if (error) throw error;

  const withCounts = await withAttendance(events, undefined);
  const now = Date.now();
  const upcoming = withCounts.filter(
    (event) => new Date(event.starts_at).getTime() > now,
  );
  const pastEvents = withCounts
    .filter((event) => new Date(event.starts_at).getTime() <= now)
    .reverse();

  const { data: confirmed } = pastEvents.length
    ? await supabase
        .from("event_attendees")
        .select("event_id")
        .in(
          "event_id",
          pastEvents.map((event) => event.id),
        )
        .not("attended_at", "is", null)
    : { data: [] };
  const confirmedByEvent = new Map<string, number>();
  for (const row of confirmed ?? []) {
    confirmedByEvent.set(
      row.event_id,
      (confirmedByEvent.get(row.event_id) ?? 0) + 1,
    );
  }
  const past = pastEvents.map((event) => ({
    ...event,
    confirmedCount: confirmedByEvent.get(event.id) ?? 0,
  }));

  return {
    upcoming,
    past,
    memberCount: memberCount ?? 0,
    upcomingSeats: upcoming.reduce(
      (sum, event) => sum + event.attendeeCount,
      0,
    ),
  };
}

export async function getAdminEvent(id: string) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { supabase } = await requireAdmin();
  const [{ data: event, error }, { data: attendees, error: attendeeError }] =
    await Promise.all([
      supabase.from("events").select(eventColumns).eq("id", id).maybeSingle(),
      supabase.rpc("admin_event_attendees", { target_event: id }),
    ]);
  if (error) throw error;
  if (attendeeError) throw attendeeError;
  if (!event) notFound();

  const people = attendees ?? [];
  const tiers: Record<string, string> = {};
  if (isCategory(event.category) && people.length > 0) {
    const { data: history } = await supabase
      .from("event_attendees")
      .select("user_id, attended_at, events (category)")
      .in(
        "user_id",
        people.map((person) => person.user_id),
      )
      .not("attended_at", "is", null);
    const byUser = new Map<
      string,
      { category: string | null; attendedAt: string | null }[]
    >();
    for (const row of history ?? []) {
      if (!row.events) continue;
      byUser.set(row.user_id, [
        ...(byUser.get(row.user_id) ?? []),
        { category: row.events.category, attendedAt: row.attended_at },
      ]);
    }
    for (const person of people) {
      const tier = tiersFromAttendance(byUser.get(person.user_id) ?? []).find(
        (item) => item.category.key === event.category,
      );
      if (tier) tiers[person.user_id] = `Tier ${tier.level} · ${tier.name}`;
    }
  }

  return { event, attendees: people, tiers };
}

export type AdminAttendee = Awaited<
  ReturnType<typeof getAdminEvent>
>["attendees"][number];
