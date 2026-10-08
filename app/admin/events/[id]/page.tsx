import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { AttendeeList } from "@/components/admin/attendee-list";
import { DeleteEventButton } from "@/components/admin/delete-event-button";
import { EventForm } from "@/components/admin/event-form";
import { buttonVariants } from "@/components/ui/button";
import { getAdminEvent } from "@/lib/admin";
import { formatLongDate, toLocalInput } from "@/lib/dates";
import { hasStarted } from "@/lib/events";

export const metadata: Metadata = {
  title: "Manage event — IHAF admin",
  robots: { index: false },
};

export default async function ManageEventPage({
  params,
  searchParams,
}: PageProps<"/admin/events/[id]">) {
  const { id } = await params;
  const { created } = await searchParams;
  const { event, attendees } = await getAdminEvent(id);
  const started = hasStarted(event);

  return (
    <AdminShell
      title={event.title}
      eyebrow={formatLongDate(event.starts_at)}
      back={{ href: "/admin", label: "Dashboard" }}
      actions={
        <>
          <Link
            href={`/events/${event.id}`}
            className={buttonVariants({
              variant: "outline",
              className: "rounded-full",
            })}
          >
            View public page
            <ExternalLink data-icon="inline-end" />
          </Link>
          <DeleteEventButton id={event.id} title={event.title} />
        </>
      }
    >
      <div className="grid items-start gap-8 lg:grid-cols-[1.1fr_1fr]">
        <section
          aria-labelledby="attendees-heading"
          className="rounded-[2rem] bg-card p-6 ring-1 ring-foreground/10 sm:p-8 lg:order-2"
        >
          <h2
            id="attendees-heading"
            className="font-heading text-2xl tracking-tight"
          >
            Who’s coming
          </h2>
          <div className="mt-4">
            <AttendeeList
              eventId={event.id}
              attendees={attendees}
              started={started}
            />
          </div>
        </section>

        <section
          aria-labelledby="details-heading"
          className="rounded-[2rem] bg-card p-6 ring-1 ring-foreground/10 sm:p-8 lg:order-1"
        >
          <h2
            id="details-heading"
            className="font-heading text-2xl tracking-tight"
          >
            Event details
          </h2>
          <div className="mt-6">
            <EventForm
              id={event.id}
              initialMessage={
                created
                  ? "Event created. It’s live on the events page."
                  : undefined
              }
              values={{
                title: event.title,
                description: event.description ?? "",
                location: event.location ?? "",
                starts_at: toLocalInput(event.starts_at),
                ends_at: toLocalInput(event.ends_at),
                capacity: event.capacity?.toString() ?? "",
                cover_image_url: event.cover_image_url ?? "",
              }}
            />
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
