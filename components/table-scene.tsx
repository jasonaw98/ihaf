"use client";

import { motion } from "motion/react";

const seats = [
  { line: "New here", tone: "bg-primary text-primary-foreground" },
  { line: "Me too", tone: "bg-butter text-ink" },
  { line: "Sit here", tone: "bg-foreground text-background" },
  { line: "Try this", tone: "bg-sage text-ink" },
  { line: "Your turn", tone: "bg-blush text-ink" },
  {
    line: "Next week?",
    tone: "bg-card text-foreground ring-1 ring-foreground/10",
  },
];

export function TableScene() {
  return (
    <div className="relative mx-auto w-full max-w-[26rem]">
      <motion.p
        className="absolute -top-1 left-2 z-10 rounded-full bg-card px-3 py-1.5 text-xs font-medium shadow-sm ring-1 ring-foreground/10 sm:left-0"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: [0, -6, 0] }}
        transition={{
          opacity: { duration: 0.5, delay: 0.8 },
          y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 },
        }}
      >
        No plus-one required
      </motion.p>
      <motion.p
        className="absolute right-2 -bottom-1 z-10 rounded-full bg-foreground px-3 py-1.5 text-xs font-medium text-background shadow-sm sm:right-0"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{
          opacity: { duration: 0.5, delay: 1 },
          y: { duration: 5.6, repeat: Infinity, ease: "easeInOut", delay: 1.2 },
        }}
      >
        Names before small talk
      </motion.p>
      <div className="relative aspect-square">
        <div className="absolute inset-[14%] rounded-full bg-card shadow-[0_24px_60px_-30px_rgba(60,32,16,0.45)] ring-1 ring-foreground/10" />
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-[8%] size-[84%] text-foreground/25"
          aria-hidden="true"
        >
          <motion.circle
            cx="50"
            cy="50"
            r="34"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="1.4 1.8"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.3, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-foreground text-center text-background shadow-xl sm:size-24">
          <span className="text-[0.6rem] font-semibold tracking-[0.18em] text-butter uppercase">
            Tonight
          </span>
          <span className="font-heading text-base leading-none sm:text-lg">
            the table
          </span>
        </div>
        {seats.map((seat, index) => {
          const angle = (index / seats.length) * Math.PI * 2 + Math.PI / 2;
          const radius = 34;
          const left = 50 + Math.cos(angle) * radius;
          const top = 50 + Math.sin(angle) * radius;
          return (
            <motion.div
              key={seat.line}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${left}%`, top: `${top}%` }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 + index * 0.08, duration: 0.45 }}
            >
              <motion.div
                animate={{ y: [0, index % 2 === 0 ? -7 : 7, 0] }}
                transition={{
                  duration: 4.2 + index * 0.25,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.6 + index * 0.15,
                }}
                className={`grid h-14 w-[4.7rem] place-items-center rounded-2xl px-2 text-center text-[11px] leading-tight font-semibold shadow-md ${seat.tone}`}
              >
                {seat.line}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
