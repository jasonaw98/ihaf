"use client";

import { cn } from "cn";
import { Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  type EventField,
  type EventFormState,
  saveEvent,
} from "@/lib/actions/admin";
import { gatherings } from "@/lib/content";

export type EventFormValues = Record<EventField, string>;

const empty: EventFormValues = {
  title: "",
  category: "",
  description: "",
  location: "",
  starts_at: "",
  ends_at: "",
  capacity: "",
  cover_image_url: "",
};

export function EventForm({
  id,
  values = empty,
  initialMessage,
}: {
  id?: string;
  values?: EventFormValues;
  initialMessage?: string;
}) {
  const [state, formAction, pending] = useActionState<EventFormState, FormData>(
    saveEvent,
    {
      status: initialMessage ? "saved" : "idle",
      message: initialMessage,
    },
  );
  const errors = state.fieldErrors ?? {};

  const field = (name: EventField) => ({
    id: name,
    name,
    defaultValue: values[name],
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${name}-error` : undefined,
  });

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {id ? <input type="hidden" name="id" value={id} /> : null}

      <Field name="title" label="Title" error={errors.title}>
        <Input
          {...field("title")}
          required
          maxLength={120}
          placeholder="Dinner with strangers"
          className="h-11 rounded-xl px-4"
        />
      </Field>

      <fieldset
        className="space-y-2"
        aria-describedby={errors.category ? "category-error" : "category-hint"}
      >
        <legend className="text-sm font-medium">Category</legend>
        <div className="flex flex-wrap gap-2 pt-2">
          {gatherings.map((item) => (
            <label
              key={item.key}
              className={cn(
                "cursor-pointer rounded-full px-4 py-2 text-sm font-medium ring-1 ring-foreground/15 transition",
                "has-checked:ring-2 has-checked:ring-foreground has-focus-visible:outline-2 has-focus-visible:outline-ring",
                item.tone,
              )}
            >
              <input
                type="radio"
                name="category"
                value={item.key}
                defaultChecked={values.category === item.key}
                required
                className="sr-only"
              />
              {item.title}
            </label>
          ))}
        </div>
        {errors.category ? (
          <p id="category-error" className="text-sm text-destructive">
            {errors.category}
          </p>
        ) : (
          <p id="category-hint" className="text-xs text-muted-foreground">
            Counts towards members’ tier in this category.
          </p>
        )}
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          name="starts_at"
          label="Starts"
          hint="Kuala Lumpur time"
          error={errors.starts_at}
        >
          <Input
            {...field("starts_at")}
            type="datetime-local"
            required
            className="h-11 rounded-xl px-4"
          />
        </Field>
        <Field
          name="ends_at"
          label="Ends"
          hint="Optional"
          error={errors.ends_at}
        >
          <Input
            {...field("ends_at")}
            type="datetime-local"
            className="h-11 rounded-xl px-4"
          />
        </Field>
        <Field
          name="location"
          label="Where"
          hint="Optional"
          error={errors.location}
        >
          <Input
            {...field("location")}
            maxLength={120}
            placeholder="Bangsar, Kuala Lumpur"
            className="h-11 rounded-xl px-4"
          />
        </Field>
        <Field
          name="capacity"
          label="Seats"
          hint="Leave empty for no limit"
          error={errors.capacity}
        >
          <Input
            {...field("capacity")}
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            placeholder="12"
            className="h-11 rounded-xl px-4"
          />
        </Field>
      </div>

      <Field
        name="description"
        label="Description"
        hint="Optional · leave a blank line between paragraphs"
        error={errors.description}
      >
        <Textarea
          {...field("description")}
          rows={6}
          maxLength={4000}
          placeholder="What’s the night about? What should people bring?"
          className="rounded-xl px-4 py-3"
        />
      </Field>

      <Field
        name="cover_image_url"
        label="Cover image link"
        hint="Optional · an https:// image URL"
        error={errors.cover_image_url}
      >
        <Input
          {...field("cover_image_url")}
          type="url"
          placeholder="https://…"
          className="h-11 rounded-xl px-4"
        />
      </Field>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="h-11 rounded-full px-6"
        >
          {pending ? "Saving…" : id ? "Save changes" : "Create event"}
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
  name,
  label,
  hint,
  error,
  children,
}: {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      {children}
      {error ? (
        <p id={`${name}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
