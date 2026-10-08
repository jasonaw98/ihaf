import {
  Coffee,
  Dices,
  Footprints,
  Music,
  Palette,
  UtensilsCrossed,
} from "lucide-react";
import type { ComponentType } from "react";
import { Reveal } from "@/components/reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { gatherings } from "@/lib/content";

const icons: Record<
  (typeof gatherings)[number]["icon"],
  ComponentType<{ className?: string }>
> = {
  table: UtensilsCrossed,
  games: Dices,
  walk: Footprints,
  coffee: Coffee,
  music: Music,
  make: Palette,
};

export function Gatherings() {
  return (
    <section
      id="gatherings"
      className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            Gatherings
          </p>
          <h2 className="mt-3 max-w-2xl font-heading text-4xl tracking-tight text-balance sm:text-5xl">
            Different nights. Same reason to come.
          </h2>
          <p className="mt-4 max-w-xl text-lg text-pretty text-muted-foreground">
            The lineup changes with the week. What’s on next lives on Instagram,
            and it usually feels like one of these.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gatherings.map((item, index) => {
            const Icon = icons[item.icon];
            return (
              <Reveal key={item.title} delay={index * 0.05} className="h-full">
                <Card className="h-full rounded-3xl bg-card transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-28px_rgba(60,32,16,0.7)]">
                  <CardHeader>
                    <div
                      className={`mb-2 grid size-11 place-items-center rounded-2xl ${item.tone}`}
                    >
                      <Icon className="size-5" />
                    </div>
                    <CardTitle className="font-heading text-2xl">
                      {item.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
