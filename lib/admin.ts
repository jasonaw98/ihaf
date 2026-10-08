import { notFound } from "next/navigation";
import { eventColumns, withAttendance } from "@/lib/events";
import { createClient } from "@/lib/supabase/server";

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
  const past = withCounts
    .filter((event) => new Date(event.starts_at).getTime() <= now)
    .reverse();

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
  return { event, attendees: attendees ?? [] };
}

export type AdminAttendee = Awaited<
  ReturnType<typeof getAdminEvent>
>["attendees"][number];
