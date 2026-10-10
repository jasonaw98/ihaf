import { CalendarHeart, LogOut } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { EventCard } from "@/components/event-card";
import { ProfileForm } from "@/components/profile-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TierCards } from "@/components/tier-cards";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth";
import { dayKey } from "@/lib/dates";
import { getMyEvents, hasStarted } from "@/lib/events";
import { formatPhone } from "@/lib/phone";
import { createClient } from "@/lib/supabase/server";
import { tiersFromAttendance } from "@/lib/tiers";

export const metadata: Metadata = {
  title: "Your profile — IHAF",
  robots: { index: false },
};

const joinedFormat = new Intl.DateTimeFormat("en-MY", {
  month: "long",
  year: "numeric",
});

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?"
  );
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/profile");

  const [{ data: profile }, myEvents] = await Promise.all([
    supabase
      .from("profiles")
      .select(
        "full_name, username, phone, avatar_url, bio, date_of_birth, location, created_at",
      )
      .eq("id", user.id)
      .maybeSingle(),
    getMyEvents(user.id),
  ]);

  const name = profile?.full_name ?? user.email?.split("@")[0] ?? "Friend";
  const upcoming = myEvents.filter((event) => !hasStarted(event));
  const past = myEvents.filter((event) => hasStarted(event)).reverse();
  const joined = profile?.created_at ?? user.created_at;

  return (
    <>
      <SiteHeader />
      <main id="content" className="flex-1 px-5 pt-28 pb-24 sm:px-8 sm:pt-36">
        <div className="mx-auto max-w-5xl">
          <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <Avatar className="size-20 ring-4 ring-butter">
                {profile?.avatar_url ? (
                  <AvatarImage src={profile.avatar_url} alt="" />
                ) : null}
                <AvatarFallback className="bg-butter font-heading text-2xl text-ink">
                  {initials(name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                  Your profile
                </p>
                <h1 className="mt-1 font-heading text-4xl tracking-tight sm:text-5xl">
                  Hey, {name.split(" ")[0]}.
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {profile?.username ? `@${profile.username} · ` : ""}
                  Friend since {joinedFormat.format(new Date(joined))}
                </p>
              </div>
            </div>
            <form action={signOut}>
              <Button type="submit" variant="outline" className="rounded-full">
                <LogOut data-icon="inline-start" />
                Sign out
              </Button>
            </form>
          </header>

          <section aria-labelledby="tiers-heading" className="mt-12">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <h2
                id="tiers-heading"
                className="font-heading text-2xl tracking-tight"
              >
                Your tiers
              </h2>
              <p className="text-sm text-muted-foreground">
                Each event counts once your host confirms you were there.
              </p>
            </div>
            <div className="mt-5">
              <TierCards tiers={tiersFromAttendance(myEvents)} />
            </div>
          </section>

          <div className="mt-12 grid items-start gap-10 lg:grid-cols-[1.1fr_1fr]">
            <section
              aria-labelledby="details-heading"
              className="rounded-[2rem] bg-card p-6 ring-1 ring-foreground/10 sm:p-8"
            >
              <h2
                id="details-heading"
                className="font-heading text-2xl tracking-tight"
              >
                About you
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Signed in as {user.email}. This helps hosts seat you with people
                you’ll click with.
              </p>
              {profile?.phone ? null : (
                <p className="mt-4 rounded-xl bg-butter/50 px-4 py-3 text-sm text-ink">
                  Add your phone number so organisers can reach you. You’ll need
                  it to save a seat.
                </p>
              )}
              <div className="mt-6">
                <ProfileForm
                  today={dayKey(new Date())}
                  values={{
                    full_name: profile?.full_name ?? "",
                    username: profile?.username ?? "",
                    phone: profile?.phone ? formatPhone(profile.phone) : "",
                    location: profile?.location ?? "",
                    date_of_birth: profile?.date_of_birth ?? "",
                    bio: profile?.bio ?? "",
                  }}
                />
              </div>
            </section>

            <section aria-labelledby="seats-heading">
              <h2
                id="seats-heading"
                className="font-heading text-2xl tracking-tight"
              >
                Your seats
              </h2>
              {upcoming.length > 0 ? (
                <ul className="mt-5 space-y-4">
                  {upcoming.map((event) => (
                    <li key={event.id}>
                      <EventCard event={event} />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-5 rounded-3xl border border-dashed bg-card/60 p-7 text-center">
                  <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-butter text-ink">
                    <CalendarHeart className="size-5" />
                  </div>
                  <p className="mt-4 font-medium">No seats saved yet.</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Find a night that works and we’ll keep a chair warm.
                  </p>
                  <Link
                    href="/events"
                    className={buttonVariants({
                      className: "mt-5 rounded-full",
                    })}
                  >
                    Browse events
                  </Link>
                </div>
              )}

              {past.length > 0 ? (
                <>
                  <h3 className="mt-10 text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    Nights you’ve been to
                  </h3>
                  <ul className="mt-4 space-y-3 opacity-80">
                    {past.map((event) => (
                      <li key={event.id}>
                        <EventCard
                          event={event}
                          attendance={
                            event.attendedAt ? "confirmed" : "pending"
                          }
                        />
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
