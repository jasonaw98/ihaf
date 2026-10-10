import { CalendarPlus, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { DateBlock } from "@/components/event-card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getAdminOverview } from "@/lib/admin";
import { formatTimeRange } from "@/lib/dates";
import type { EventSummary } from "@/lib/events";

export const metadata: Metadata = {
  title: "Admin — IHAF",
  robots: { index: false },
};

export default async function AdminPage() {
  const { upcoming, past, memberCount, upcomingSeats } =
    await getAdminOverview();

  const stats = [
    { label: "Upcoming events", value: upcoming.length },
    { label: "Seats booked", value: upcomingSeats },
    { label: "Members", value: memberCount },
  ];

  return (
    <AdminShell
      title="Events dashboard"
      actions={
        <Link
          href="/admin/events/new"
          className={buttonVariants({
            size: "lg",
            className: "h-11 rounded-full px-5",
          })}
        >
          <CalendarPlus data-icon="inline-start" />
          New event
        </Link>
      }
    >
      <dl className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl bg-card p-6 ring-1 ring-foreground/10"
          >
            <dt className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              {stat.label}
            </dt>
            <dd className="mt-2 font-heading text-4xl tracking-tight">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <EventTable
        title="Upcoming"
        events={upcoming}
        emptyText="Nothing scheduled. Create the next night!"
      />
      <EventTable title="Past" events={past} emptyText="No past events yet." />
    </AdminShell>
  );
}

function EventTable({
  title,
  events,
  emptyText,
}: {
  title: string;
  events: (EventSummary & { confirmedCount?: number })[];
  emptyText: string;
}) {
  return (
    <section className="mt-12">
      <h2 className="font-heading text-2xl tracking-tight">{title}</h2>
      {events.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-dashed px-5 py-8 text-center text-sm text-muted-foreground">
          {emptyText}
        </p>
      ) : (
        <ul className="mt-4 divide-y overflow-hidden rounded-3xl bg-card ring-1 ring-foreground/10">
          {events.map((event) => (
            <li key={event.id}>
              <Link
                href={`/admin/events/${event.id}`}
                className="flex items-center gap-4 px-4 py-4 transition-colors hover:bg-butter/30 sm:px-6"
              >
                <DateBlock value={event.starts_at} className="w-14 py-2" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{event.title}</p>
                  <p className="truncate text-sm text-muted-foreground">
                    {[
                      formatTimeRange(event.starts_at, event.ends_at),
                      event.location,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {event.category ? null : (
                      <Badge variant="outline">No category</Badge>
                    )}
                    {event.confirmedCount === undefined ||
                    event.attendeeCount === 0 ? null : event.confirmedCount ===
                      0 ? (
                      <Badge>Confirm attendance</Badge>
                    ) : (
                      <Badge variant="secondary">
                        {event.confirmedCount}/{event.attendeeCount} attended
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-heading text-2xl leading-none">
                    {event.attendeeCount}
                    {event.capacity ? (
                      <span className="text-base text-muted-foreground">
                        /{event.capacity}
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">going</p>
                </div>
                <ChevronRight className="size-5 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
