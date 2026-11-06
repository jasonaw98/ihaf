"use client";

import { cn } from "cn";
import { ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Tier } from "@/lib/tier-plans";

export function TierJourney({
  label,
  tone,
  tiers,
  currentLevel,
}: {
  label: string;
  tone: string;
  tiers: Tier[];
  /** Member's current level (1-based), or null when signed out. */
  currentLevel: number | null;
}) {
  const [selected, setSelected] = useState(
    currentLevel ? Math.min(currentLevel, tiers.length - 1) : 1,
  );
  const tier = tiers[selected];
  const reachedCount = currentLevel ?? 0;
  const isFinal = selected === tiers.length - 1;

  const status =
    currentLevel === selected + 1
      ? { text: "You’re here", className: "bg-foreground text-background" }
      : selected < reachedCount
        ? { text: "Unlocked", className: "bg-sage text-ink" }
        : tier.locked
          ? { text: "🔒 Locked", className: "bg-muted text-muted-foreground" }
          : null;

  return (
    <div>
      <div className="relative">
        <div
          className="absolute top-6 right-[10%] left-[10%] h-1 rounded-full bg-muted"
          aria-hidden="true"
        >
          <motion.div
            className={cn("h-full rounded-full", tone)}
            initial={{ width: 0 }}
            whileInView={{
              width: `${(Math.max(reachedCount - 1, 0) / (tiers.length - 1)) * 100}%`,
            }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <ol className="relative grid grid-cols-5 gap-1">
          {tiers.map((step, index) => {
            const reached = index < reachedCount;
            const active = index === selected;
            return (
              <li key={step.code} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setSelected(index)}
                  aria-pressed={active}
                  aria-label={`${step.code} ${step.title}`}
                  className={cn(
                    "relative grid size-12 place-items-center rounded-full font-heading text-base transition-all",
                    "outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    reached || active
                      ? tone
                      : "bg-card text-muted-foreground ring-1 ring-foreground/15",
                    active
                      ? "scale-110 shadow-[0_10px_30px_-12px_oklch(0.27_0.028_50/0.6)] ring-2 ring-foreground"
                      : "hover:scale-105",
                  )}
                >
                  {step.locked && !reached ? (
                    <Lock className="size-4" />
                  ) : (
                    step.code
                  )}
                  {currentLevel === index + 1 ? (
                    <span className="absolute -top-2 -right-2 grid size-5 place-items-center rounded-full bg-foreground text-[0.6rem] text-background">
                      ★
                    </span>
                  ) : null}
                </button>
                <span
                  className={cn(
                    "mt-3 text-center text-xs font-semibold sm:text-sm",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {step.title}
                </span>
                <span className="hidden text-center text-[0.7rem] text-muted-foreground sm:block">
                  {step.code}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-10 overflow-hidden rounded-[2rem] bg-card ring-1 ring-foreground/10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={tier.code}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[0.8fr_1.2fr]"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-bold tracking-[0.1em]",
                    tone,
                  )}
                >
                  {tier.code}
                </span>
                {status ? (
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold",
                      status.className,
                    )}
                  >
                    {status.text}
                  </span>
                ) : null}
                {isFinal ? (
                  <span className="rounded-full bg-foreground px-3 py-1 text-xs font-semibold text-background">
                    💎 Final tier
                  </span>
                ) : null}
              </div>
              <h3 className="mt-5 font-heading text-5xl tracking-tight sm:text-6xl">
                {tier.title}
              </h3>
              <p className="mt-1 text-lg text-muted-foreground">
                {tier.english}
              </p>

              <div className="mt-8 rounded-2xl bg-muted/60 p-5">
                <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {tier.events === 0 ? "Starting point" : "How to reach it"}
                </p>
                <p className="mt-2 font-medium">
                  {tier.events === 0
                    ? "Everyone starts here. Your first event levels you up."
                    : `Attend ${tier.events} IHAF ${label} ${tier.events === 1 ? "event" : "events"} in total${
                        tier.friends > 0
                          ? `, and bring ${tier.friends} new ${tier.friends === 1 ? "friend" : "friends"} along`
                          : ""
                      }.`}
                </p>
                {tier.events > 0 ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    累计参加 {tier.events} 场 IHAF {label.toUpperCase()}
                    {tier.friends > 0 ? ` + ${tier.friends} 位新朋友` : ""}
                  </p>
                ) : null}
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelected((value) => Math.max(value - 1, 0))}
                  disabled={selected === 0}
                  aria-label="Previous tier"
                  className="grid size-10 place-items-center rounded-full ring-1 ring-foreground/15 transition hover:bg-muted disabled:opacity-40"
                >
                  <ChevronLeft className="size-5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSelected((value) =>
                      Math.min(value + 1, tiers.length - 1),
                    )
                  }
                  disabled={isFinal}
                  aria-label="Next tier"
                  className="grid size-10 place-items-center rounded-full ring-1 ring-foreground/15 transition hover:bg-muted disabled:opacity-40"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                Perks · 福利
              </p>
              {tier.benefits.length === 0 ? (
                <div className="mt-4 grid min-h-48 place-items-center rounded-2xl border border-dashed p-8 text-center">
                  <div>
                    <p className="text-4xl">👋</p>
                    <p className="mt-3 font-medium">
                      No perks yet, just new faces.
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Come to your first IHAF {label} night and the next tier is
                      yours.
                    </p>
                  </div>
                </div>
              ) : (
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {tier.benefits.map((benefit, index) => (
                    <motion.li
                      key={benefit.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + index * 0.05 }}
                      className={cn(
                        "rounded-2xl p-4 ring-1 ring-foreground/10",
                        index === 0 ? "sm:col-span-2" : "",
                        tier.locked && selected >= reachedCount
                          ? "bg-muted/40"
                          : "bg-background",
                      )}
                    >
                      <p className="flex items-center gap-2 font-semibold">
                        <span className="text-xl" aria-hidden="true">
                          {benefit.emoji}
                        </span>
                        {benefit.title}
                      </p>
                      {benefit.detail ? (
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {benefit.detail}
                        </p>
                      ) : null}
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
