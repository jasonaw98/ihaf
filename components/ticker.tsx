import { ticker } from "@/lib/content";

const copies = ["first", "second"] as const;

export function Ticker() {
  return (
    <div
      className="marquee overflow-hidden border-y border-border bg-card/60 py-4"
      aria-hidden="true"
    >
      <div className="marquee-track flex w-max">
        {copies.map((copy) =>
          ticker.map((item) => (
            <span
              key={`${copy}-${item}`}
              className="inline-flex items-center gap-8 pr-8 font-heading text-lg text-foreground/80 italic"
            >
              {item}
              <span className="text-primary not-italic">·</span>
            </span>
          )),
        )}
      </div>
    </div>
  );
}
