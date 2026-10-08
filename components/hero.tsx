"use client";

import { cn } from "cn";
import { MapPin } from "lucide-react";
import { motion } from "motion/react";
import { InstagramButton } from "@/components/instagram-button";
import { TableScene } from "@/components/table-scene";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

const fade = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20"
    >
      <div className="pointer-events-none absolute -top-24 right-[-4rem] size-80 rounded-full bg-butter/80 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -left-20 size-72 rounded-full bg-sage/50 blur-3xl" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: 0.08, delayChildren: 0.05 },
            },
          }}
        >
          <motion.div variants={fade}>
            <Badge
              variant="secondary"
              className="h-7 rounded-full px-3 tracking-[0.08em] uppercase"
            >
              <MapPin data-icon="inline-start" />
              Kuala Lumpur
            </Badge>
          </motion.div>
          <motion.h1
            variants={fade}
            className="mt-6 max-w-xl font-heading text-5xl leading-[0.95] tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            Come as a stranger.{" "}
            <span className="text-primary italic">Leave with a friend.</span>
          </motion.h1>
          <motion.p
            variants={fade}
            className="mt-6 max-w-lg text-lg leading-relaxed text-pretty text-muted-foreground"
          >
            IHAF is Kuala Lumpur’s offline community for turning strangers into
            friends. We host the table, the walk, the game night — so the only
            thing you have to do is show up.
          </motion.p>
          <motion.div
            variants={fade}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <InstagramButton className="h-12 rounded-full px-5">
              Follow on Instagram
            </InstagramButton>
            <a
              href="#gatherings"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 rounded-full bg-card px-5",
              )}
            >
              Gatherings
            </a>
          </motion.div>
          <motion.p
            variants={fade}
            className="mt-6 text-sm text-muted-foreground"
          >
            300+ gatherings in the first sixteen months.
          </motion.p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <TableScene />
        </motion.div>
      </div>
    </section>
  );
}
