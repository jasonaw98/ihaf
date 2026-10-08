"use client";

import { cn } from "cn";
import { Check, Copy, UserX } from "lucide-react";
import { useState, useTransition } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { removeAttendee, setAttendance } from "@/lib/actions/admin";
import type { AdminAttendee } from "@/lib/admin";

const rsvpFormat = new Intl.DateTimeFormat("en-MY", {
  timeZone: "Asia/Kuala_Lumpur",
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
});

export function AttendeeList({
  eventId,
  attendees,
  started,
}: {
  eventId: string;
  attendees: AdminAttendee[];
  started: boolean;
}) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [, startTransition] = useTransition();

  const emails = attendees.map((person) => person.email).filter(Boolean);
  const attendedCount = attendees.filter((person) => person.attended_at).length;

  function run(attendeeId: string, action: () => Promise<{ error?: string }>) {
    setError(null);
    setPendingId(attendeeId);
    startTransition(async () => {
      const result = await action();
      if (result.error) setError(result.error);
      setPendingId(null);
    });
  }

  async function copyEmails() {
    await navigator.clipboard.writeText(emails.join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (attendees.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed px-5 py-8 text-center text-sm text-muted-foreground">
        No one has saved a seat yet.
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {attendees.length} going
          {started ? ` · ${attendedCount} marked as attended` : ""}
        </p>
        {emails.length > 0 ? (
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={copyEmails}
          >
            {copied ? (
              <Check data-icon="inline-start" />
            ) : (
              <Copy data-icon="inline-start" />
            )}
            {copied ? "Copied" : "Copy emails"}
          </Button>
        ) : null}
      </div>
      {error ? (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}
      <ul className="mt-4 divide-y rounded-2xl ring-1 ring-foreground/10">
        {attendees.map((person) => {
          const name =
            person.full_name || person.username || person.email || "Unnamed";
          const busy = pendingId === person.attendee_id;
          return (
            <li
              key={person.attendee_id}
              className={cn(
                "flex flex-wrap items-center gap-4 px-4 py-3",
                busy && "opacity-60",
              )}
            >
              <Avatar className="size-10">
                {person.avatar_url ? (
                  <AvatarImage src={person.avatar_url} alt="" />
                ) : null}
                <AvatarFallback className="bg-butter font-semibold text-ink">
                  {name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">
                  {name}
                  {person.username ? (
                    <span className="ml-2 text-sm font-normal text-muted-foreground">
                      @{person.username}
                    </span>
                  ) : null}
                </p>
                <p className="truncate text-sm text-muted-foreground">
                  {[person.email, person.location].filter(Boolean).join(" · ")}
                </p>
                {person.rsvped_at ? (
                  <p className="text-xs text-muted-foreground">
                    RSVP’d {rsvpFormat.format(new Date(person.rsvped_at))}
                  </p>
                ) : null}
              </div>
              <div className="flex items-center gap-1.5">
                {started ? (
                  <Button
                    size="sm"
                    variant={person.attended_at ? "secondary" : "outline"}
                    className="rounded-full"
                    disabled={busy}
                    aria-pressed={Boolean(person.attended_at)}
                    onClick={() =>
                      run(person.attendee_id, () =>
                        setAttendance(
                          person.attendee_id,
                          eventId,
                          !person.attended_at,
                        ),
                      )
                    }
                  >
                    {person.attended_at ? (
                      <Check data-icon="inline-start" />
                    ) : null}
                    {person.attended_at ? "Attended" : "Mark attended"}
                  </Button>
                ) : null}
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="rounded-full text-muted-foreground hover:text-destructive"
                  disabled={busy}
                  aria-label={`Remove ${name}`}
                  onClick={() => {
                    if (window.confirm(`Remove ${name} from this event?`)) {
                      run(person.attendee_id, () =>
                        removeAttendee(person.attendee_id, eventId),
                      );
                    }
                  }}
                >
                  <UserX />
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
