"use client";

import { cn } from "cn";
import { motion } from "motion/react";
import Image from "next/image";
import { tierPlans } from "@/lib/content";
import type { TierProgress } from "@/lib/tiers";

export function TierCards({ tiers }: { tiers: TierProgress[] }) {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {tiers.map((tier, index) => {
        const plan = tierPlans[tier.category.key];
        return (
          <motion.li
            key={tier.category.key}
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
                  tier.category.tone,
                )}
              >
                <Image
                  src={tier.category.image}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {tier.category.title}
                </p>
                <p className="font-heading text-2xl leading-tight tracking-tight">
                  Tier {tier.level} · {tier.name}
                </p>
              </div>
            </div>

            <div
              className="mt-5 h-2.5 overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-label={`${tier.category.label} tier progress`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(tier.progress * 100)}
            >
              <motion.div
                className={cn("h-full rounded-full", tier.category.tone)}
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.max(tier.progress * 100, 4)}%` }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.2 + index * 0.08,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {tier.count} confirmed {tier.count === 1 ? "event" : "events"}
              {tier.next
                ? ` · ${tier.next.remaining} more to ${tier.next.name}`
                : " · top tier reached!"}
            </p>

            <ol
              className="mt-5 flex flex-wrap gap-1.5"
              aria-label={`${tier.category.label} tiers`}
            >
              {plan.map((step, stepIndex) => {
                const reached = stepIndex < tier.level;
                return (
                  <li
                    key={step.name}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-xs font-medium",
                      reached
                        ? tier.category.tone
                        : "bg-muted text-muted-foreground",
                      stepIndex === tier.level - 1 &&
                        "ring-1 ring-foreground/40",
                    )}
                    title={`Tier ${stepIndex + 1}: ${step.from}+ events`}
                  >
                    {stepIndex + 1}. {step.name}
                  </li>
                );
              })}
            </ol>
          </motion.li>
        );
      })}
    </ul>
  );
}
