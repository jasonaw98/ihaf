import type { Tables } from "@/lib/supabase/database.types";
import { createClient } from "@/lib/supabase/server";

export type EventRow = Tables<"events">;

export type EventSummary = EventRow & {
  attendeeCount: number;
  isGoing: boolean;
};

export const eventColumns =
  "id, title, description, cover_image_url, location, starts_at, ends_at, capacity, created_at, updated_at";

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function withAttendance(
  events: EventRow[],
  userId: string | undefined,
): Promise<EventSummary[]> {
  if (events.length === 0) return [];
  const supabase = await createClient();
  const ids = events.map((event) => event.id);

  const [counts, mine] = await Promise.all([
    supabase.rpc("event_attendee_counts", { event_ids: ids }),
    userId
      ? supabase
          .from("event_attendees")
          .select("event_id")
          .eq("user_id", userId)
          .in("event_id", ids)
      : Promise.resolve({ data: [] as { event_id: string }[] }),
  ]);

  const countById = new Map(
    (counts.data ?? []).map((row) => [
      row.event_id,
      Number(row.attendee_count),
    ]),
  );
  const going = new Set((mine.data ?? []).map((row) => row.event_id));

  return events.map((event) => ({
    ...event,
    attendeeCount: countById.get(event.id) ?? 0,
    isGoing: going.has(event.id),
  }));
}

export async function getUpcomingEvents(
  userId: string | undefined,
  limit = 12,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(eventColumns)
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return withAttendance(data, userId);
}

export async function getEventsBetween(
  start: string,
  end: string,
  userId: string | undefined,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(eventColumns)
    .gte("starts_at", start)
    .lt("starts_at", end)
    .order("starts_at", { ascending: true });
  if (error) throw error;
  return withAttendance(data, userId);
}

export async function getEvent(id: string, userId: string | undefined) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(eventColumns)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const [event] = await withAttendance([data], userId);
  return event;
}

export async function getMyEvents(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event_attendees")
    .select(`events (${eventColumns})`)
    .eq("user_id", userId);
  if (error) throw error;
  const events = (data ?? [])
    .map((row) => row.events)
    .filter((event): event is EventRow => event !== null)
    .sort((a, b) => a.starts_at.localeCompare(b.starts_at));
  return withAttendance(events, userId);
}

export async function hasPhone(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("phone")
    .eq("id", userId)
    .maybeSingle();
  return Boolean(data?.phone);
}

export function spotsLeft(
  event: Pick<EventSummary, "capacity" | "attendeeCount">,
) {
  return event.capacity === null
    ? null
    : Math.max(event.capacity - event.attendeeCount, 0);
}

export function hasStarted(event: Pick<EventRow, "starts_at">) {
  return new Date(event.starts_at).getTime() <= Date.now();
}
