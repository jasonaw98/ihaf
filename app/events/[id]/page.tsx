import { ArrowLeft, CalendarDays, Clock, MapPin, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DateBlock } from "@/components/event-card";
import { RsvpButton } from "@/components/rsvp-button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { formatLongDate, formatTimeRange } from "@/lib/dates";
import {
  getCurrentUser,
  getEvent,
  hasPhone,
  hasStarted,
  spotsLeft,
} from "@/lib/events";
import { categoryInfo } from "@/lib/tiers";

export async function generateMetadata({
  params,
}: PageProps<"/events/[id]">): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id, undefined);
  if (!event) return { title: "Event not found — IHAF" };
  return {
    title: `${event.title} — IHAF`,
    description:
      event.description ??
      `An IHAF gathering on ${formatLongDate(event.starts_at)}.`,
  };
}

export default async function EventPage({ params }: PageProps<"/events/[id]">) {
  const { id } = await params;
  const user = await getCurrentUser();
  const [event, userHasPhone] = await Promise.all([
    getEvent(id, user?.id),
    user ? hasPhone(user.id) : false,
  ]);
  if (!event) notFound();

  const left = spotsLeft(event);
  const started = hasStarted(event);
  const category = categoryInfo(event.category);

  return (
    <>
      <SiteHeader />
      <main id="content" className="flex-1 px-5 pt-28 pb-24 sm:px-8 sm:pt-36">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            All events
          </Link>

          <div
            className="relative mt-6 aspect-[16/9] sm:aspect-[3/1] overflow-hidden rounded-[2rem] bg-gradient-to-br from-butter via-blush to-sage"
            style={
              event.cover_image_url
                ? {
                    backgroundImage: `url(${JSON.stringify(event.cover_image_url)})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }
                : undefined
            }
          >
            {event.cover_image_url ? null : (
              <div className="absolute inset-0 grid place-items-center">
                <span className="font-heading text-[clamp(3rem,10vw,7rem)] text-ink/15 italic">
                  ihaf
                </span>
              </div>
            )}
          </div>

          <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_22rem]">
            <article>
              <div className="flex items-start gap-5">
                <DateBlock value={event.starts_at} className="hidden sm:grid" />
                <div>
                  {category ? (
                    <span
                      className={`mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold tracking-[0.08em] ${category.tone}`}
                    >
                      {category.title}
                    </span>
                  ) : null}
                  <h1 className="font-heading text-4xl leading-tight tracking-tight text-balance sm:text-5xl">
                    {event.title}
                  </h1>
                  {category ? (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Counts towards your {category.label} tier.
                    </p>
                  ) : null}
                </div>
              </div>
              {event.description ? (
                <div className="mt-8 space-y-4 text-lg leading-relaxed text-pretty text-muted-foreground">
                  {event.description.split(/\n{2,}/).map((paragraph) => (
                    <p key={paragraph} className="whitespace-pre-line">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="mt-8 text-lg text-muted-foreground">
                  Come as you are. We’ll handle the introductions.
                </p>
              )}
            </article>

            <aside className="rounded-3xl bg-card p-6 ring-1 ring-foreground/10 lg:sticky lg:top-28">
              <dl className="space-y-4 text-sm">
                <Detail icon={<CalendarDays className="size-4" />} label="Date">
                  {formatLongDate(event.starts_at)}
                </Detail>
                <Detail icon={<Clock className="size-4" />} label="Time">
                  {formatTimeRange(event.starts_at, event.ends_at)} (KL time)
                </Detail>
                {event.location ? (
                  <Detail icon={<MapPin className="size-4" />} label="Where">
                    {event.location}
                  </Detail>
                ) : null}
                <Detail
                  icon={<Users className="size-4" />}
                  label="Who’s coming"
                >
                  {event.attendeeCount} going
                  {left !== null && !started
                    ? ` · ${left === 0 ? "full" : `${left} ${left === 1 ? "seat" : "seats"} left`}`
                    : ""}
                </Detail>
              </dl>
              <div className="mt-6 border-t border-dashed pt-6">
                <RsvpButton
                  eventId={event.id}
                  signedIn={Boolean(user)}
                  isGoing={event.isGoing}
                  isFull={left === 0}
                  hasStarted={started}
                  needsPhone={Boolean(user) && !userHasPhone}
                />
              </div>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function Detail({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground">
        {icon}
      </span>
      <div>
        <dt className="text-xs font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          {label}
        </dt>
        <dd className="mt-0.5 font-medium">{children}</dd>
      </div>
    </div>
  );
}
