"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { fromLocalInput } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";

export type EventField =
  | "title"
  | "description"
  | "location"
  | "starts_at"
  | "ends_at"
  | "capacity"
  | "cover_image_url";

export type EventFormState = {
  status: "idle" | "saved" | "error";
  message?: string;
  fieldErrors?: Partial<Record<EventField, string>>;
};

const UUID_PATTERN = /^[0-9a-f-]{36}$/i;

async function adminClient() {
  const supabase = await createClient();
  const { data: isAdmin } = await supabase.rpc("is_admin");
  return isAdmin ? supabase : null;
}

function text(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value === "" ? null : value;
}

function revalidateEvents(id?: string) {
  revalidatePath("/admin", "layout");
  revalidatePath("/events", "layout");
  revalidatePath("/profile");
  if (id) revalidatePath(`/events/${id}`);
}

export async function saveEvent(
  _previous: EventFormState,
  formData: FormData,
): Promise<EventFormState> {
  const supabase = await adminClient();
  if (!supabase)
    return { status: "error", message: "Only admins can manage events." };

  const id = text(formData, "id");
  if (id && !UUID_PATTERN.test(id))
    return { status: "error", message: "Unknown event." };

  const title = text(formData, "title");
  const description = text(formData, "description");
  const location = text(formData, "location");
  const coverImageUrl = text(formData, "cover_image_url");
  const startsRaw = text(formData, "starts_at");
  const endsRaw = text(formData, "ends_at");
  const capacityRaw = text(formData, "capacity");

  const fieldErrors: EventFormState["fieldErrors"] = {};
  if (!title) fieldErrors.title = "Give the event a name.";
  else if (title.length > 120)
    fieldErrors.title = "Keep it under 120 characters.";
  if (description && description.length > 4000) {
    fieldErrors.description = "Keep it under 4,000 characters.";
  }
  if (location && location.length > 120)
    fieldErrors.location = "Keep it under 120 characters.";

  const startsAt = startsRaw ? fromLocalInput(startsRaw) : null;
  if (!startsAt) fieldErrors.starts_at = "Pick a start date and time.";
  const endsAt = endsRaw ? fromLocalInput(endsRaw) : null;
  if (endsRaw && !endsAt) fieldErrors.ends_at = "Pick a valid end time.";
  else if (startsAt && endsAt && endsAt <= startsAt) {
    fieldErrors.ends_at = "End time must be after the start.";
  }

  let capacity: number | null = null;
  if (capacityRaw) {
    capacity = Number(capacityRaw);
    if (!Number.isInteger(capacity) || capacity < 1 || capacity > 10000) {
      fieldErrors.capacity =
        "Use a whole number above 0, or leave empty for no limit.";
    }
  }

  if (coverImageUrl) {
    try {
      const url = new URL(coverImageUrl);
      if (url.protocol !== "https:")
        fieldErrors.cover_image_url = "Use an https:// link.";
    } catch {
      fieldErrors.cover_image_url = "That doesn’t look like a link.";
    }
  }

  if (Object.keys(fieldErrors).length > 0 || !title || !startsAt) {
    return {
      status: "error",
      message: "A few things need a look.",
      fieldErrors,
    };
  }

  const values = {
    title,
    description,
    location,
    starts_at: startsAt,
    ends_at: endsAt,
    capacity,
    cover_image_url: coverImageUrl,
  };

  if (id) {
    const { error } = await supabase.from("events").update(values).eq("id", id);
    if (error)
      return {
        status: "error",
        message: "Couldn’t save the event. Try again.",
      };
    revalidateEvents(id);
    return { status: "saved", message: "Event saved." };
  }

  const { data, error } = await supabase
    .from("events")
    .insert(values)
    .select("id")
    .single();
  if (error)
    return {
      status: "error",
      message: "Couldn’t create the event. Try again.",
    };
  revalidateEvents(data.id);
  redirect(`/admin/events/${data.id}?created=1`);
}

export async function deleteEvent(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const supabase = await adminClient();
  if (!supabase || !UUID_PATTERN.test(id)) return;
  await supabase.from("events").delete().eq("id", id);
  revalidateEvents(id);
  redirect("/admin");
}

export async function setAttendance(
  attendeeId: string,
  eventId: string,
  attended: boolean,
) {
  const supabase = await adminClient();
  if (!supabase || !UUID_PATTERN.test(attendeeId))
    return { error: "Not allowed." };
  const { error } = await supabase
    .from("event_attendees")
    .update({ attended_at: attended ? new Date().toISOString() : null })
    .eq("id", attendeeId);
  if (error) return { error: "Couldn’t update attendance." };
  revalidatePath(`/admin/events/${eventId}`);
  return {};
}

export async function removeAttendee(attendeeId: string, eventId: string) {
  const supabase = await adminClient();
  if (!supabase || !UUID_PATTERN.test(attendeeId))
    return { error: "Not allowed." };
  const { error } = await supabase
    .from("event_attendees")
    .delete()
    .eq("id", attendeeId);
  if (error) return { error: "Couldn’t remove that RSVP." };
  revalidateEvents(eventId);
  return {};
}
