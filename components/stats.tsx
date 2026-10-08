"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/reveal";
import { stats } from "@/lib/content";

function StatValue({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1.25,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span
      ref={ref}
      className="font-heading text-5xl tracking-tight text-butter sm:text-6xl"
    >
      {display.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

export function Stats() {
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            Since 2025
          </p>
          <h2 className="mt-3 max-w-xl font-heading text-4xl tracking-tight text-balance sm:text-5xl">
            Sixteen months of saying hello.
          </h2>
        </Reveal>
        <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-[2rem] bg-background/15 sm:mt-12 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-foreground px-6 py-8 text-background sm:px-8 sm:py-10"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <StatValue value={stat.value} suffix={stat.suffix} />
                <p className="mt-3 max-w-[12rem] text-sm leading-snug text-background/70">
                  {stat.label}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
