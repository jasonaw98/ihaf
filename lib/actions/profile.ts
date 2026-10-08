"use server";

import { revalidatePath } from "next/cache";
import { dayKey } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";

export type ProfileField =
  | "full_name"
  | "username"
  | "location"
  | "date_of_birth"
  | "bio";

export type ProfileState = {
  status: "idle" | "saved" | "error";
  message?: string;
  fieldErrors?: Partial<Record<ProfileField, string>>;
};

function optional(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text === "" ? null : text;
}

export async function updateProfile(
  _previous: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return { status: "error", message: "Your session ended. Sign in again." };

  const fullName = optional(formData.get("full_name"));
  const username = optional(formData.get("username"))?.toLowerCase() ?? null;
  const location = optional(formData.get("location"));
  const dateOfBirth = optional(formData.get("date_of_birth"));
  const bio = optional(formData.get("bio"));

  const fieldErrors: ProfileState["fieldErrors"] = {};
  if (!fullName) fieldErrors.full_name = "Add the name people should call you.";
  else if (fullName.length > 80)
    fieldErrors.full_name = "Keep it under 80 characters.";
  if (username && !/^[a-z0-9_]{3,24}$/.test(username)) {
    fieldErrors.username = "3–24 characters: letters, numbers, or underscores.";
  }
  if (location && location.length > 80)
    fieldErrors.location = "Keep it under 80 characters.";
  if (bio && bio.length > 280)
    fieldErrors.bio = "Keep your bio under 280 characters.";
  if (dateOfBirth) {
    const valid =
      /^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth) &&
      !Number.isNaN(Date.parse(dateOfBirth));
    if (!valid) fieldErrors.date_of_birth = "Pick a valid date.";
    else if (dateOfBirth > dayKey(new Date())) {
      fieldErrors.date_of_birth = "That date is in the future.";
    }
  }
  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "A few things need a look.",
      fieldErrors,
    };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      username,
      location,
      date_of_birth: dateOfBirth,
      bio,
    })
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505") {
      return {
        status: "error",
        message: "A few things need a look.",
        fieldErrors: { username: "That username is taken." },
      };
    }
    return {
      status: "error",
      message: "We couldn’t save your profile. Try again.",
    };
  }

  revalidatePath("/profile");
  return { status: "saved", message: "Profile saved." };
}
