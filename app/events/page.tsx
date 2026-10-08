import { CalendarHeart } from "lucide-react";
import type { Metadata } from "next";
import { EventCalendar } from "@/components/event-calendar";
import { EventCard } from "@/components/event-card";
import { InstagramButton } from "@/components/instagram-button";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { dayKey, monthParam, monthRange, parseMonth } from "@/lib/dates";
import {
  getCurrentUser,
  getEventsBetween,
  getUpcomingEvents,
} from "@/lib/events";

export const metadata: Metadata = {
  title: "Events — IHAF",
  description:
    "Upcoming IHAF gatherings in Kuala Lumpur. Pick a night, save your seat, and come meet some new friends.",
};

export default async function EventsPage({
  searchParams,
}: PageProps<"/events">) {
  const { month: monthValue } = await searchParams;
  const month = parseMonth(monthValue);
  const { start, end } = monthRange(month);
  const user = await getCurrentUser();

  const [upcoming, monthEvents] = await Promise.all([
    getUpcomingEvents(user?.id),
    getEventsBetween(start, end, user?.id),
  ]);

  return (
    <>
      <SiteHeader />
      <main id="content" className="flex-1 px-5 pt-28 pb-24 sm:px-8 sm:pt-36">
        <div className="mx-auto max-w-6xl">
          <header className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              Events
            </p>
            <h1 className="mt-3 font-heading text-5xl leading-[1.02] tracking-tight text-balance sm:text-6xl">
              Pick a night.{" "}
              <span className="text-primary italic">
                We’ll save you a seat.
              </span>
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-pretty text-muted-foreground">
              Every gathering is small on purpose. Come alone, sit with
              strangers, and leave with a few new names in your phone.
            </p>
          </header>

          <div className="mt-14 grid items-start gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-12">
            <section aria-labelledby="upcoming-heading">
              <h2
                id="upcoming-heading"
                className="font-heading text-3xl tracking-tight"
              >
                Coming up
              </h2>
              {upcoming.length > 0 ? (
                <ul className="mt-6 space-y-4">
                  {upcoming.map((event) => (
                    <li key={event.id}>
                      <EventCard event={event} />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-6 rounded-3xl border border-dashed bg-card/60 p-8 text-center sm:p-10">
                  <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-butter text-ink">
                    <CalendarHeart className="size-6" />
                  </div>
                  <p className="mt-5 font-heading text-2xl tracking-tight">
                    The next night is being planned.
                  </p>
                  <p className="mx-auto mt-2 max-w-sm text-muted-foreground">
                    New dates drop on Instagram first. Follow along and they’ll
                    show up here too.
                  </p>
                  <InstagramButton className="mt-6">
                    Follow on Instagram
                  </InstagramButton>
                </div>
              )}
            </section>

            <section
              aria-label="Event calendar"
              className="lg:sticky lg:top-28"
            >
              <EventCalendar
                key={monthParam(month)}
                month={month}
                today={dayKey(new Date())}
                events={monthEvents.map(
                  ({ id, title, starts_at, ends_at, location, isGoing }) => ({
                    id,
                    title,
                    starts_at,
                    ends_at,
                    location,
                    isGoing,
                  }),
                )}
              />
              <p className="mt-3 px-2 text-xs text-muted-foreground">
                All times are Kuala Lumpur time.
              </p>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
