"use client";

import { cn } from "cn";
import { motion } from "motion/react";
import Link from "next/link";
import { InstagramButton } from "@/components/instagram-button";
import { Reveal } from "@/components/reveal";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const fade = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const chapterOne = ["Browse the list", "Join an event", "Go home"] as const;
const chapterTwo = [
  "Meet people",
  "Create friendships",
  "Build community",
] as const;

const beliefs = [
  "Strangers are just friends who haven’t met yet.",
  "A drink, a game, a meal, or a run can become the beginning of a friendship.",
  "Activities are the starting point, not the destination.",
  "The best communities are not built for people. They are built with people.",
] as const;

const experiences = [
  "Hotpot",
  "Camping",
  "Murder mystery",
  "Board games",
  "Karaoke",
  "Book clubs",
  "Sports",
  "Drinks",
  "Dinners",
] as const;

const chapters = [
  {
    date: "8 Feb 2025",
    title: "Chapter one began",
    body: "IHAF started bringing strangers together through small, real-life social experiences in Kuala Lumpur.",
  },
  {
    date: "2025 — Jun 2026",
    title: "300+ events. 3,000+ participations.",
    body: "A year and a half of shared tables, games, and nights out.",
  },
  {
    date: "30 Jun 2026",
    title: "Chapter one ended",
    body: "After more than a year of experimenting, learning, and building, IHAF 1.0 took a break.",
    quote: "This isn’t the end. It’s simply the end of chapter one.",
  },
  {
    date: "1 Oct 2026",
    title: "Chapter two begins",
    body: "IHAF 2.0 is more than a calendar of events. Members join events and create them, join communities and build them, meet people, and make the connection themselves.",
  },
] as const;

export function AboutView() {
  return (
    <>
      <section className="px-5 pt-28 pb-16 sm:px-8 sm:pt-36 sm:pb-24">
        <motion.div
          className="mx-auto max-w-6xl"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.08, delayChildren: 0.05 },
            },
          }}
        >
          <motion.p
            variants={fade}
            className="text-xs font-semibold tracking-[0.16em] text-primary uppercase"
          >
            About IHAF
          </motion.p>
          <motion.h1
            variants={fade}
            className="mt-4 max-w-3xl font-heading text-5xl leading-[0.95] tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            We started with one simple idea.
          </motion.h1>
          <motion.p
            variants={fade}
            className="mt-5 max-w-2xl font-heading text-3xl text-primary italic sm:text-4xl"
          >
            Where strangers become friends.
          </motion.p>
          <motion.div
            variants={fade}
            className="mt-8 max-w-2xl space-y-4 text-lg leading-relaxed text-pretty text-muted-foreground"
          >
            <p>
              IHAF — I Have A Friend — is a Kuala Lumpur social lifestyle
              community. Meeting new people should feel natural, meaningful, and
              fun.
            </p>
            <p>
              We create real-life experiences where people meet new faces, share
              a moment, and slowly grow actual friendships.
            </p>
          </motion.div>
          <motion.p
            variants={fade}
            className="mt-8 max-w-xl font-heading text-2xl leading-snug text-pretty italic sm:text-3xl"
          >
            Activities are the starting point. Connection is the real purpose.
          </motion.p>
        </motion.div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              The shift
            </p>
            <h2 className="mt-3 max-w-2xl font-heading text-4xl tracking-tight text-balance sm:text-5xl">
              From hosting events to creating connections.
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <Reveal className="h-full">
              <Card className="h-full rounded-3xl bg-card">
                <CardHeader>
                  <Badge
                    variant="secondary"
                    className="h-7 rounded-full px-3 tracking-[0.08em] uppercase"
                  >
                    IHAF 1.0
                  </Badge>
                  <CardTitle className="mt-3 font-heading text-3xl">
                    Show up. Then head home.
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Flow steps={chapterOne} />
                </CardContent>
              </Card>
            </Reveal>
            <Reveal className="h-full" delay={0.08}>
              <Card className="h-full rounded-3xl bg-foreground text-background">
                <CardHeader>
                  <span className="inline-flex h-7 w-fit items-center rounded-full bg-butter px-3 text-xs font-semibold tracking-[0.08em] text-ink uppercase">
                    IHAF 2.0
                  </span>
                  <CardTitle className="mt-3 font-heading text-3xl text-background">
                    Stay long enough to belong.
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Flow steps={chapterTwo} inverted />
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-5">
            <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              What we believe
            </p>
            <h2 className="mt-3 font-heading text-4xl tracking-tight text-balance sm:text-5xl">
              Connection shouldn’t be complicated.
            </h2>
          </Reveal>
          <ol className="lg:col-span-7">
            {beliefs.map((belief, index) => (
              <li key={belief}>
                <Reveal delay={index * 0.05}>
                  <div className="grid grid-cols-[auto_1fr] gap-5 border-t border-border py-6">
                    <span className="font-heading text-lg text-primary italic">
                      0{index + 1}
                    </span>
                    <p className="font-heading text-2xl leading-snug tracking-tight text-pretty">
                      {belief}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
              The journey
            </p>
            <h2 className="mt-3 max-w-2xl font-heading text-4xl tracking-tight text-balance sm:text-5xl">
              Chapter one, then chapter two.
            </h2>
          </Reveal>
          <ol className="mt-12 max-w-3xl border-l border-border pl-6 sm:pl-8">
            {chapters.map((chapter, index) => (
              <li key={chapter.date} className="relative pb-12 last:pb-0">
                <span className="absolute top-1.5 -left-[1.7rem] size-3 rounded-full bg-primary ring-4 ring-background sm:-left-[2.2rem]" />
                <Reveal delay={index * 0.05}>
                  <p className="text-sm font-semibold tracking-[0.12em] text-primary uppercase">
                    {chapter.date}
                  </p>
                  <h3 className="mt-2 font-heading text-3xl tracking-tight">
                    {chapter.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
                    {chapter.body}
                  </p>
                  {chapter.date.startsWith("2025") ? (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {experiences.map((experience) => (
                        <li key={experience}>
                          <Badge
                            variant="outline"
                            className="h-7 rounded-full bg-card px-3"
                          >
                            {experience}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {"quote" in chapter ? (
                    <p className="mt-4 font-heading text-2xl text-pretty italic">
                      “{chapter.quote}”
                    </p>
                  ) : null}
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 sm:pb-28">
        <Reveal>
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-foreground px-6 py-16 text-background sm:px-14 sm:py-20">
            <div className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full bg-primary/50 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 left-10 size-56 rounded-full bg-butter/30 blur-3xl" />
            <div className="relative max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.16em] text-butter uppercase">
                The next chapter
              </p>
              <h2 className="mt-3 font-heading text-4xl tracking-tight text-balance sm:text-6xl">
                Chapter two starts here.
              </h2>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  "Join an event.",
                  "Join a community.",
                  "Create an event.",
                  "Build a community.",
                ].map((line) => (
                  <p key={line} className="font-heading text-2xl">
                    {line}
                  </p>
                ))}
              </div>
              <p className="mt-8 font-heading text-2xl text-butter italic sm:text-3xl">
                Meet a stranger. Leave with a friend.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/#gatherings"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "h-12 rounded-full border-background/20 bg-transparent px-5 text-background hover:bg-background hover:text-foreground",
                  )}
                >
                  Explore gatherings
                </Link>
                <InstagramButton className="h-12 rounded-full px-5">
                  Join IHAF
                </InstagramButton>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function Flow({
  steps,
  inverted = false,
}: {
  steps: readonly string[];
  inverted?: boolean;
}) {
  return (
    <ol className="space-y-3">
      {steps.map((step, index) => (
        <li key={step} className="flex items-center gap-3">
          <span
            className={cn(
              "grid size-8 shrink-0 place-items-center rounded-full font-heading text-sm",
              inverted
                ? "bg-butter text-ink"
                : "bg-accent text-accent-foreground",
            )}
          >
            {index + 1}
          </span>
          <span className="font-heading text-xl">{step}</span>
        </li>
      ))}
    </ol>
  );
}
