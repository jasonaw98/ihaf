"use client";

import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  type ProfileField,
  type ProfileState,
  updateProfile,
} from "@/lib/actions/profile";

export type ProfileValues = Record<ProfileField, string>;

export function ProfileForm({
  values,
  today,
}: {
  values: ProfileValues;
  today: string;
}) {
  const [state, formAction, pending] = useActionState<ProfileState, FormData>(
    updateProfile,
    {
      status: "idle",
    },
  );
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="full_name" label="Name" error={errors.full_name}>
          <Input
            id="full_name"
            name="full_name"
            autoComplete="name"
            defaultValue={values.full_name}
            maxLength={80}
            required
            aria-invalid={Boolean(errors.full_name)}
            aria-describedby={errors.full_name ? "full_name-error" : undefined}
            className="h-11 rounded-xl px-4"
          />
        </Field>
        <Field
          id="username"
          label="Username"
          hint="Optional · letters, numbers, underscores"
          error={errors.username}
        >
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted-foreground">
              @
            </span>
            <Input
              id="username"
              name="username"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              defaultValue={values.username}
              maxLength={24}
              aria-invalid={Boolean(errors.username)}
              aria-describedby={
                errors.username ? "username-error" : "username-hint"
              }
              className="h-11 rounded-xl pr-4 pl-8"
            />
          </div>
        </Field>
        <Field
          id="location"
          label="Where in KL?"
          hint="Optional"
          error={errors.location}
        >
          <Input
            id="location"
            name="location"
            placeholder="e.g. Bangsar, PJ, Mont Kiara"
            defaultValue={values.location}
            maxLength={80}
            aria-invalid={Boolean(errors.location)}
            aria-describedby={
              errors.location ? "location-error" : "location-hint"
            }
            className="h-11 rounded-xl px-4"
          />
        </Field>
        <Field
          id="date_of_birth"
          label="Birthday"
          hint="Optional · only you see this"
          error={errors.date_of_birth}
        >
          <Input
            id="date_of_birth"
            name="date_of_birth"
            type="date"
            max={today}
            defaultValue={values.date_of_birth}
            aria-invalid={Boolean(errors.date_of_birth)}
            aria-describedby={
              errors.date_of_birth
                ? "date_of_birth-error"
                : "date_of_birth-hint"
            }
            className="h-11 rounded-xl px-4"
          />
        </Field>
      </div>
      <Field
        id="bio"
        label="A little about you"
        hint="Optional · up to 280 characters"
        error={errors.bio}
      >
        <Textarea
          id="bio"
          name="bio"
          rows={4}
          maxLength={280}
          placeholder="What you’re into, what you’re hoping to find, your go-to karaoke song…"
          defaultValue={values.bio}
          aria-invalid={Boolean(errors.bio)}
          aria-describedby={errors.bio ? "bio-error" : "bio-hint"}
          className="rounded-xl px-4 py-3"
        />
      </Field>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="h-11 rounded-full px-6"
        >
          {pending ? "Saving…" : "Save profile"}
        </Button>
        <AnimatePresence mode="wait">
          {state.message && !pending ? (
            <motion.p
              key={`${state.status}-${state.message}`}
              role="status"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={
                state.status === "saved"
                  ? "inline-flex items-center gap-1.5 text-sm font-medium text-secondary-foreground"
                  : "text-sm text-destructive"
              }
            >
              {state.status === "saved" ? <Check className="size-4" /> : null}
              {state.message}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
