import { cn } from "cn";
import { ArrowUpRight, Clock, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatTimeRange, TIME_ZONE } from "@/lib/dates";
import { type EventSummary, hasStarted, spotsLeft } from "@/lib/events";

const dayNumber = new Intl.DateTimeFormat("en-MY", {
  timeZone: TIME_ZONE,
  day: "numeric",
});
const monthShort = new Intl.DateTimeFormat("en-MY", {
  timeZone: TIME_ZONE,
  month: "short",
});
const weekdayShort = new Intl.DateTimeFormat("en-MY", {
  timeZone: TIME_ZONE,
  weekday: "short",
});

export function DateBlock({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const date = new Date(value);
  return (
    <div
      className={cn(
        "grid w-16 shrink-0 place-items-center rounded-2xl bg-butter py-2.5 text-ink",
        className,
      )}
    >
      <span className="text-[0.7rem] font-semibold tracking-[0.12em] uppercase">
        {monthShort.format(date)}
      </span>
      <span className="font-heading text-3xl leading-none">
        {dayNumber.format(date)}
      </span>
      <span className="text-[0.7rem] text-ink/70">
        {weekdayShort.format(date)}
      </span>
    </div>
  );
}

export function EventCard({ event }: { event: EventSummary }) {
  const started = hasStarted(event);
  const left = started ? null : spotsLeft(event);

  return (
    <Link
      href={`/events/${event.id}`}
      className="group flex gap-5 rounded-3xl bg-card p-5 ring-1 ring-foreground/10 transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_oklch(0.27_0.028_50/0.45)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:p-6"
    >
      <DateBlock value={event.starts_at} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-xl leading-snug tracking-tight text-balance sm:text-2xl">
            {event.title}
          </h3>
          <ArrowUpRight className="mt-1 size-5 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
        </div>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4" />
            {formatTimeRange(event.starts_at, event.ends_at)}
          </span>
          {event.location ? (
            <span className="inline-flex min-w-0 items-center gap-1.5">
              <MapPin className="size-4 shrink-0" />
              <span className="truncate">{event.location}</span>
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-4" />
            {event.attendeeCount} going
          </span>
        </div>
        {event.isGoing || left !== null ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {event.isGoing ? (
              <Badge className="bg-sage text-ink">
                {started ? "You went" : "You’re going"}
              </Badge>
            ) : null}
            {left !== null && !event.isGoing ? (
              <Badge variant={left === 0 ? "secondary" : "outline"}>
                {left === 0
                  ? "Full"
                  : `${left} ${left === 1 ? "seat" : "seats"} left`}
              </Badge>
            ) : null}
          </div>
        ) : null}
      </div>
    </Link>
  );
}
