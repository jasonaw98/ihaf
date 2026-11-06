"use client";

import { cn } from "cn";
import { ArrowUpRight, Lock } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { tierPlans } from "@/lib/tier-plans";
import { nextStepText, type TierProgress } from "@/lib/tiers";

export function TierCards({ tiers }: { tiers: TierProgress[] }) {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {tiers.map((progress, index) => {
        const plan = tierPlans[progress.category.key];
        return (
          <motion.li
            key={progress.category.key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            className="flex flex-col rounded-[1.75rem] bg-card p-5 ring-1 ring-foreground/10"
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "relative size-12 shrink-0 overflow-hidden rounded-2xl",
                  progress.category.tone,
                )}
              >
                <Image
                  src={progress.category.image}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {progress.category.title}
                </p>
                <p className="font-heading text-2xl leading-tight tracking-tight">
                  {progress.tier.code} · {progress.tier.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {progress.tier.english}
                </p>
              </div>
            </div>

            <div
              className="mt-5 h-2.5 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-label={`${progress.category.label} tier progress`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(progress.progress * 100)}
            >
              <motion.div
                className={cn("h-full rounded-full", progress.category.tone)}
                initial={{ width: 0 }}
                whileInView={{
                  width: `${Math.max(progress.progress * 100, 4)}%`,
                }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.2 + index * 0.08,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {progress.count} confirmed{" "}
              {progress.count === 1 ? "event" : "events"} · {progress.friends}{" "}
              {progress.friends === 1 ? "friend" : "friends"} brought
            </p>
            <p className="mt-1 text-sm font-medium">{nextStepText(progress)}</p>

            <ol
              className="mt-5 flex flex-wrap gap-1.5"
              aria-label={`${progress.category.label} tiers`}
            >
              {plan.map((step, stepIndex) => {
                const reached = stepIndex < progress.level;
                return (
                  <li
                    key={step.code}
                    title={`${step.code} ${step.title} (${step.english})`}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                      reached
                        ? progress.category.tone
                        : "bg-muted text-muted-foreground",
                      stepIndex === progress.level - 1 &&
                        "ring-1 ring-foreground/40",
                    )}
                  >
                    {step.locked && !reached ? (
                      <Lock className="size-3" aria-label="Locked" />
                    ) : null}
                    {step.code}
                  </li>
                );
              })}
            </ol>

            <Link
              href={`/gatherings/${progress.category.key}`}
              className="mt-5 inline-flex items-center gap-1 self-start text-sm font-medium underline-offset-4 hover:underline"
            >
              See {progress.category.label} perks
              <ArrowUpRight className="size-4" />
            </Link>
          </motion.li>
        );
      })}
    </ul>
  );
}
