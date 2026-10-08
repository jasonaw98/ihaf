"use client";

import { cn } from "cn";
import { ChevronLeft, ChevronRight, Clock, MapPin } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import {
  dayKey,
  formatLongDate,
  formatTimeRange,
  type MonthKey,
  monthGrid,
  monthLabel,
  monthParam,
  shiftMonth,
} from "@/lib/dates";

export type CalendarEvent = {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string | null;
  location: string | null;
  isGoing: boolean;
};

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function EventCalendar({
  month,
  today,
  events,
}: {
  month: MonthKey;
  today: string;
  events: CalendarEvent[];
}) {
  const byDay = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const key = dayKey(event.starts_at);
    byDay.set(key, [...(byDay.get(key) ?? []), event]);
  }

  const monthPrefix = monthParam(month);
  const firstEventDay = events[0] ? dayKey(events[0].starts_at) : null;
  const upcomingDay = events
    .map((event) => dayKey(event.starts_at))
    .find((key) => key >= today);
  const initial =
    today.startsWith(monthPrefix) && byDay.has(today)
      ? today
      : (upcomingDay ?? firstEventDay);

  const [selected, setSelected] = useState<string | null>(initial);
  const selectedEvents = selected ? (byDay.get(selected) ?? []) : [];

  const prev = monthParam(shiftMonth(month, -1));
  const next = monthParam(shiftMonth(month, 1));

  return (
    <div className="rounded-[2rem] bg-card p-5 ring-1 ring-foreground/10 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-2xl tracking-tight" aria-live="polite">
          {monthLabel(month)}
        </h2>
        <div className="flex gap-1.5">
          <MonthLink href={`/events?month=${prev}`} label="Previous month">
            <ChevronLeft className="size-5" />
          </MonthLink>
          <MonthLink href={`/events?month=${next}`} label="Next month">
            <ChevronRight className="size-5" />
          </MonthLink>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-1 text-center text-[0.7rem] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
        {weekdays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1">
        {monthGrid(month).map((key, index) => {
          if (!key) {
            // biome-ignore lint/suspicious/noArrayIndexKey: padding cells have no identity
            return <span key={`pad-${index}`} aria-hidden="true" />;
          }
          const dayEvents = byDay.get(key) ?? [];
          const hasEvents = dayEvents.length > 0;
          const isSelected = selected === key;
          const isToday = key === today;
          const isPast = key < today;
          const going = dayEvents.some((event) => event.isGoing);
          const dayNumber = Number(key.slice(-2));

          return (
            <button
              key={key}
              type="button"
              disabled={!hasEvents}
              onClick={() => setSelected(key)}
              aria-pressed={hasEvents ? isSelected : undefined}
              aria-label={`${formatLongDate(`${key}T12:00:00+08:00`)}${
                hasEvents
                  ? `, ${dayEvents.length} ${dayEvents.length === 1 ? "event" : "events"}`
                  : ""
              }`}
              className={cn(
                "relative grid aspect-square place-items-center rounded-xl text-sm transition-colors",
                hasEvents
                  ? "cursor-pointer font-semibold hover:bg-butter/60"
                  : "cursor-default text-muted-foreground/70",
                isPast && !hasEvents && "text-muted-foreground/40",
                isToday && !isSelected && "ring-1 ring-primary/50",
                isSelected && "text-primary-foreground",
              )}
            >
              {isSelected ? (
                <motion.span
                  layoutId="calendar-selected"
                  className="absolute inset-0 rounded-xl bg-primary"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              ) : null}
              <span className="relative">{dayNumber}</span>
              {hasEvents ? (
                <span className="absolute bottom-1.5 flex gap-0.5">
                  {dayEvents.slice(0, 3).map((event) => (
                    <span
                      key={event.id}
                      className={cn(
                        "size-1.5 rounded-full",
                        isSelected
                          ? "bg-primary-foreground"
                          : going
                            ? "bg-sage"
                            : "bg-primary",
                      )}
                    />
                  ))}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-6 border-t border-dashed pt-5">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={selected ?? "empty"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {selected && selectedEvents.length > 0 ? (
              <>
                <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {formatLongDate(`${selected}T12:00:00+08:00`)}
                </p>
                <ul className="mt-3 space-y-2">
                  {selectedEvents.map((event) => (
                    <li key={event.id}>
                      <Link
                        href={`/events/${event.id}`}
                        className="block rounded-2xl bg-muted/60 px-4 py-3 transition-colors hover:bg-butter/50"
                      >
                        <span className="flex items-center justify-between gap-2 font-medium">
                          {event.title}
                          {event.isGoing ? (
                            <span className="shrink-0 rounded-full bg-sage px-2 py-0.5 text-[0.7rem] font-semibold text-ink">
                              Going
                            </span>
                          ) : null}
                        </span>
                        <span className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="size-3.5" />
                            {formatTimeRange(event.starts_at, event.ends_at)}
                          </span>
                          {event.location ? (
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="size-3.5" />
                              {event.location}
                            </span>
                          ) : null}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                {events.length === 0
                  ? "Nothing on the calendar this month yet. Try the next one, or follow along on Instagram."
                  : "Pick a highlighted day to see what’s on."}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function MonthLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-label={label}
      className="grid size-10 place-items-center rounded-full ring-1 ring-foreground/10 transition-colors hover:bg-butter/60"
    >
      {children}
    </Link>
  );
}
