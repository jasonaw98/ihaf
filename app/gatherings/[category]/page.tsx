import { cn } from "cn";
import { ArrowRight, CalendarHeart, Lock } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventCard } from "@/components/event-card";
import { InstagramButton } from "@/components/instagram-button";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TierJourney } from "@/components/tier-journey";
import { buttonVariants } from "@/components/ui/button";
import { gatherings } from "@/lib/content";
import { getCurrentUser, getMyTiers, getUpcomingEvents } from "@/lib/events";
import {
  categoryPages,
  ihafPlusBenefits,
  ihafPlusPlans,
  tierPlans,
} from "@/lib/tier-plans";
import { categoryInfo, isCategory, nextStepText } from "@/lib/tiers";

export const dynamicParams = false;

const [firstPlusBenefit, ...lockedPlusBenefits] = ihafPlusBenefits;
const basePlusRate = ihafPlusPlans[0].perMonth;
const bestPlusPlan = ihafPlusPlans.reduce((best, plan) =>
  plan.perMonth < best.perMonth ? plan : best,
);

export function generateStaticParams() {
  return gatherings.map((item) => ({ category: item.key }));
}

export async function generateMetadata({
  params,
}: PageProps<"/gatherings/[category]">): Promise<Metadata> {
  const { category } = await params;
  const info = categoryInfo(category);
  if (!info || !isCategory(category)) return {};
  return {
    title: `${info.title} — IHAF`,
    description: `${categoryPages[category].tagline} ${info.body} See how the ${info.label} tiers and perks work.`,
  };
}

export default async function CategoryPage({
  params,
}: PageProps<"/gatherings/[category]">) {
  const { category } = await params;
  const info = categoryInfo(category);
  if (!info || !isCategory(category)) notFound();

  const page = categoryPages[category];
  const plan = tierPlans[category];
  const user = await getCurrentUser();
  const [events, mine] = await Promise.all([
    getUpcomingEvents(user?.id, 6, category),
    user ? getMyTiers(user.id) : null,
  ]);
  const myTier = mine?.tiers.find((tier) => tier.category.key === category);
  const others = gatherings.filter((item) => item.key !== category);
  const plusTier = plan.find((tier) =>
    tier.benefits.some((benefit) => benefit.title.startsWith("IHAF+")),
  );

  const steps = [
    {
      emoji: "🎟️",
      title: "Save a seat",
      body: `RSVP to any IHAF ${info.label} event on the site. Come alone, that’s the point.`,
    },
    {
      emoji: "✅",
      title: "Show up",
      body: "Your host checks you in after the night. Only confirmed attendance counts.",
    },
    {
      emoji: "👯",
      title: "Bring a new friend",
      body: "Higher tiers ask you to bring newcomers along. Your host records who brought who.",
    },
    {
      emoji: "🎁",
      title: "Unlock perks",
      body: "Level up from 陌生人 to the final tier, with discounts, free drinks, and more along the way.",
    },
  ];

  return (
    <>
      <SiteHeader />
      <main id="content" className="flex-1">
        <section className="relative overflow-hidden px-5 pt-28 pb-16 sm:px-8 sm:pt-36 sm:pb-24">
          <div
            className={cn(
              "pointer-events-none absolute -top-32 -right-32 size-[34rem] rounded-full opacity-60 blur-3xl",
              info.tone,
            )}
            aria-hidden="true"
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal>
              <nav
                aria-label="Breadcrumb"
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Link href="/#gatherings" className="hover:text-foreground">
                  Gatherings
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-foreground">{info.label}</span>
              </nav>
              <p
                className={cn(
                  "mt-6 inline-block rounded-full px-4 py-1.5 text-xs font-bold tracking-[0.16em]",
                  info.tone,
                )}
              >
                {info.title}
              </p>
              <h1 className="mt-5 font-heading text-5xl leading-[1.02] tracking-tight text-balance sm:text-7xl">
                {page.tagline}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground">
                {page.intro}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#upcoming"
                  className={buttonVariants({
                    size: "lg",
                    className: "h-12 rounded-full px-6 text-base",
                  })}
                >
                  See upcoming {info.label} events
                </a>
                <a
                  href="#tiers"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "h-12 rounded-full bg-card px-6 text-base",
                  })}
                >
                  How tiers work
                </a>
              </div>
              {myTier ? (
                <div className="mt-8 inline-flex flex-wrap items-center gap-3 rounded-2xl bg-card px-4 py-3 ring-1 ring-foreground/10">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-bold",
                      info.tone,
                    )}
                  >
                    {myTier.tier.code}
                  </span>
                  <span className="font-medium">
                    You’re {myTier.tier.title}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {nextStepText(myTier)}
                  </span>
                </div>
              ) : null}
            </Reveal>

            <Reveal delay={0.1} className="relative mx-auto w-full max-w-sm">
              <div
                className={cn(
                  "absolute inset-0 translate-x-4 translate-y-4 rotate-3 rounded-[2.5rem]",
                  info.tone,
                )}
                aria-hidden="true"
              />
              <div className="relative aspect-[4/5] -rotate-2 overflow-hidden rounded-[2.5rem] ring-1 ring-foreground/10">
                <Image
                  src={info.image}
                  alt={`An ${info.title} gathering`}
                  fill
                  priority
                  sizes="(min-width: 1024px) 24rem, 90vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-4 rotate-[-4deg] rounded-2xl bg-foreground px-4 py-3 text-background shadow-xl">
                <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-butter uppercase">
                  {plan.length} tiers
                </p>
                <p className="font-heading text-xl">
                  {plan[0].code} → {plan[plan.length - 1].code}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="border-y border-border/70 bg-card/50 px-5 py-14 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                {page.activitiesLabel}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2.5">
                {page.activities.map((activity) => (
                  <li
                    key={activity.en}
                    className="rounded-full bg-background px-4 py-2 text-sm font-medium ring-1 ring-foreground/10"
                  >
                    {activity.en}
                    {activity.zh ? (
                      <span className="ml-2 text-muted-foreground">
                        {activity.zh}
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
              {page.comingSoon.length > 0 ? (
                <>
                  <p className="mt-8 text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    Coming soon
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2.5">
                    {page.comingSoon.map((activity) => (
                      <li
                        key={activity.en}
                        className="rounded-full border border-dashed border-foreground/25 px-4 py-2 text-sm font-medium"
                      >
                        ✨ {activity.en}
                        {activity.zh ? (
                          <span className="ml-2 text-muted-foreground">
                            {activity.zh}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </Reveal>
          </div>
        </section>

        <section
          id="tiers"
          className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <Reveal className="max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                The {info.label} journey
              </p>
              <h2 className="mt-3 font-heading text-4xl tracking-tight text-balance sm:text-5xl">
                Keep showing up. The perks find you.
              </h2>
              <p className="mt-4 text-lg text-pretty text-muted-foreground">
                Every confirmed IHAF {info.label} event moves you up the ladder.
                Here’s how it works.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <Reveal
                  key={step.title}
                  delay={index * 0.06}
                  className="h-full"
                >
                  <div className="flex h-full flex-col rounded-3xl bg-card p-6 ring-1 ring-foreground/10">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl" aria-hidden="true">
                        {step.emoji}
                      </span>
                      <span className="font-heading text-sm text-muted-foreground">
                        0{index + 1}
                      </span>
                    </div>
                    <p className="mt-6 font-heading text-xl tracking-tight">
                      {step.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-16">
              <p className="mb-6 text-center text-sm text-muted-foreground">
                Tap a tier to see what it unlocks.
              </p>
              <TierJourney
                label={info.label}
                tone={info.tone}
                tiers={plan}
                currentLevel={myTier?.level ?? null}
              />
            </Reveal>

            {plusTier ? (
              <Reveal className="mt-10">
                <div className="relative overflow-hidden rounded-[2rem] bg-foreground p-8 text-background sm:p-10">
                  <div
                    className="pointer-events-none absolute -right-16 -bottom-24 size-72 rounded-full bg-primary/50 blur-3xl"
                    aria-hidden="true"
                  />
                  <div className="relative grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
                    <div>
                      <p className="text-xs font-semibold tracking-[0.16em] text-butter uppercase">
                        ✨ IHAF+ membership
                      </p>
                      <p className="mt-3 font-heading text-3xl tracking-tight">
                        Unlocks at {plusTier.code} {plusTier.title}.
                      </p>
                      <p className="mt-2 text-background/75">
                        Reach {plusTier.code} and you can apply for IHAF+, our
                        optional membership for regulars who want even more.
                      </p>
                      <ul className="mt-6 grid gap-3">
                        <li className="flex gap-3 rounded-2xl bg-background/5 p-4 ring-1 ring-background/10">
                          <span aria-hidden="true">
                            {firstPlusBenefit.emoji}
                          </span>
                          <span>
                            <span className="block font-medium">
                              {firstPlusBenefit.title}
                            </span>
                            <span className="mt-0.5 block text-sm text-background/65">
                              {firstPlusBenefit.detail}
                            </span>
                          </span>
                        </li>
                        <li className="relative">
                          <ul
                            className="pointer-events-none grid select-none gap-3 blur-[6px] sm:grid-cols-2"
                            aria-hidden="true"
                          >
                            {lockedPlusBenefits.map((benefit) => (
                              <li
                                key={benefit.title}
                                className="flex gap-3 rounded-2xl bg-background/5 p-4 ring-1 ring-background/10 last:odd:sm:col-span-2"
                              >
                                <span>{benefit.emoji}</span>
                                <span>
                                  <span className="block font-medium">
                                    {benefit.title}
                                  </span>
                                  <span className="mt-0.5 block text-sm text-background/65">
                                    {benefit.detail}
                                  </span>
                                </span>
                              </li>
                            ))}
                          </ul>
                          <div className="absolute inset-0 grid place-items-center">
                            <span className="grid size-12 place-items-center rounded-full bg-background text-foreground shadow-lg ring-4 ring-background/20">
                              <Lock className="size-5" aria-hidden="true" />
                              <span className="sr-only">
                                {lockedPlusBenefits.length} more IHAF+ perks,
                                unlocked when you join
                              </span>
                            </span>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <ul className="grid content-center gap-3">
                      {ihafPlusPlans.map((option) => {
                        const saving = Math.round(
                          (1 - option.perMonth / basePlusRate) * 100,
                        );
                        const best = option === bestPlusPlan;
                        return (
                          <li
                            key={option.months}
                            className={cn(
                              "flex items-center justify-between gap-4 rounded-2xl p-5 ring-1",
                              best
                                ? "bg-background text-foreground ring-background"
                                : "bg-background/10 ring-background/20",
                            )}
                          >
                            <div>
                              <p className="flex flex-wrap items-center gap-2 font-medium">
                                {option.months} months
                                {saving > 0 ? (
                                  <span
                                    className={cn(
                                      "rounded-full px-2 py-0.5 text-xs font-semibold",
                                      best
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-butter text-ink",
                                    )}
                                  >
                                    Save {saving}%
                                  </span>
                                ) : null}
                              </p>
                              <p
                                className={cn(
                                  "mt-1 text-sm",
                                  best
                                    ? "text-muted-foreground"
                                    : "text-background/65",
                                )}
                              >
                                RM {option.perMonth.toFixed(2)} / month
                              </p>
                            </div>
                            <p className="font-heading text-3xl tracking-tight">
                              <span className="align-top text-sm font-sans">
                                RM
                              </span>
                              {option.price}
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ) : null}
          </div>
        </section>

        <section
          id="upcoming"
          className="scroll-mt-24 px-5 pb-20 sm:px-8 sm:pb-28"
        >
          <div className="mx-auto max-w-6xl">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-heading text-4xl tracking-tight">
                Upcoming {info.label} events
              </h2>
              <Link
                href="/events"
                className="inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
              >
                All events
                <ArrowRight className="size-4" />
              </Link>
            </Reveal>
            {events.length > 0 ? (
              <ul className="mt-8 grid gap-4 lg:grid-cols-2">
                {events.map((event) => (
                  <li key={event.id}>
                    <EventCard event={event} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-8 rounded-3xl border border-dashed bg-card/60 p-10 text-center">
                <div
                  className={cn(
                    "mx-auto grid size-14 place-items-center rounded-2xl",
                    info.tone,
                  )}
                >
                  <CalendarHeart className="size-6" />
                </div>
                <p className="mt-5 font-heading text-2xl tracking-tight">
                  The next {info.label} night is being planned.
                </p>
                <p className="mx-auto mt-2 max-w-sm text-muted-foreground">
                  New dates drop on Instagram first, then show up here.
                </p>
                <InstagramButton className="mt-6">
                  Follow on Instagram
                </InstagramButton>
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-border/70 px-5 py-16 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              More ways to connect
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {others.map((item) => (
                <Link
                  key={item.key}
                  href={`/gatherings/${item.key}`}
                  className="group flex items-center gap-5 rounded-3xl bg-card p-4 ring-1 ring-foreground/10 transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-28px_rgba(60,32,16,0.7)]"
                >
                  <div
                    className={cn(
                      "relative size-20 shrink-0 overflow-hidden rounded-2xl",
                      item.tone,
                    )}
                  >
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-2xl tracking-tight">
                      {item.title}
                    </p>
                    <p className="truncate text-sm text-muted-foreground">
                      {categoryPages[item.key].tagline}
                    </p>
                  </div>
                  <ArrowRight className="size-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
