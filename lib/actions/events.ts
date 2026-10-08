"use server";

import { revalidatePath } from "next/cache";
import { normalizePhone, PHONE_ERROR } from "@/lib/phone";
import { createClient } from "@/lib/supabase/server";

export type RsvpState = { error?: string };

const UUID_PATTERN = /^[0-9a-f-]{36}$/i;

export async function toggleRsvp(
  _previous: RsvpState,
  formData: FormData,
): Promise<RsvpState> {
  const eventId = String(formData.get("event_id") ?? "");
  const intent = formData.get("intent");
  if (!UUID_PATTERN.test(eventId))
    return { error: "That event couldn’t be found." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to save your seat." };

  if (intent === "leave") {
    const { error } = await supabase
      .from("event_attendees")
      .delete()
      .eq("event_id", eventId)
      .eq("user_id", user.id);
    if (error)
      return { error: "We couldn’t cancel that. Try again in a moment." };
  } else {
    const phoneInput = formData.get("phone");
    if (phoneInput !== null) {
      const phone = normalizePhone(String(phoneInput));
      if (!phone) return { error: PHONE_ERROR };
      const { error } = await supabase
        .from("profiles")
        .update({ phone })
        .eq("id", user.id);
      if (error) return { error: "We couldn’t save your phone number." };
    }

    const { error } = await supabase
      .from("event_attendees")
      .insert({ event_id: eventId, user_id: user.id });
    if (error && error.code !== "23505") {
      return {
        error:
          error.code === "42501"
            ? "This event is full or has already started, or your profile is missing a phone number."
            : "We couldn’t save your seat. Try again in a moment.",
      };
    }
  }

  revalidatePath("/events", "layout");
  revalidatePath("/profile");
  return {};
}
