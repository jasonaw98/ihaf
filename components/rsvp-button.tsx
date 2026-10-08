"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type RsvpState, toggleRsvp } from "@/lib/actions/events";

export function RsvpButton({
  eventId,
  signedIn,
  isGoing,
  isFull,
  hasStarted,
  needsPhone,
}: {
  eventId: string;
  signedIn: boolean;
  isGoing: boolean;
  isFull: boolean;
  hasStarted: boolean;
  needsPhone: boolean;
}) {
  const [state, formAction, pending] = useActionState<RsvpState, FormData>(
    toggleRsvp,
    {},
  );

  if (hasStarted) {
    return (
      <p className="rounded-2xl bg-muted px-5 py-4 text-sm text-muted-foreground">
        {isGoing
          ? "You were there. We hope you left with a friend."
          : "This one’s already happened. Catch the next one!"}
      </p>
    );
  }

  if (!signedIn) {
    return (
      <div className="space-y-3">
        <Link
          href={`/signup?next=${encodeURIComponent(`/events/${eventId}`)}`}
          className={buttonVariants({
            size: "lg",
            className: "h-12 w-full rounded-full text-base",
          })}
        >
          Sign up to save a seat
        </Link>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href={`/login?next=${encodeURIComponent(`/events/${eventId}`)}`}
            className="font-medium text-foreground underline underline-offset-4"
          >
            Log in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="event_id" value={eventId} />
      {isGoing ? (
        <>
          <p className="flex items-center gap-2 rounded-2xl bg-sage/40 px-5 py-4 font-medium">
            <span className="grid size-6 place-items-center rounded-full bg-sage text-ink">
              <Check className="size-4" />
            </span>
            You’re going. See you there!
          </p>
          <Button
            type="submit"
            name="intent"
            value="leave"
            variant="ghost"
            disabled={pending}
            className="w-full rounded-full text-muted-foreground"
          >
            {pending ? "Cancelling…" : "Can’t make it? Give up my seat"}
          </Button>
        </>
      ) : (
        <>
          {needsPhone && !isFull ? (
            <div className="space-y-2">
              <Label htmlFor="rsvp-phone">Your phone number</Label>
              <Input
                id="rsvp-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                placeholder="012-345 6789"
                required
                aria-describedby="rsvp-phone-hint"
                className="h-11 rounded-xl px-4"
              />
              <p id="rsvp-phone-hint" className="text-xs text-muted-foreground">
                So organisers can reach you about this event. Saved to your
                profile.
              </p>
            </div>
          ) : null}
          <Button
            type="submit"
            name="intent"
            value="join"
            size="lg"
            disabled={pending || isFull}
            className="h-12 w-full rounded-full text-base"
          >
            {isFull
              ? "This one’s full"
              : pending
                ? "Saving your seat…"
                : "Save my seat"}
          </Button>
        </>
      )}
      {state.error ? (
        <p role="alert" className="text-center text-sm text-destructive">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
