import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { gatherings } from "@/lib/content";

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
            Choose your way{" "}
            <span className="text-primary font-semibold text-6xl">
              TO CONNECT
            </span>
          </h2>
          <p className="mt-4 max-w-xl text-lg text-pretty text-muted-foreground">
            The lineup changes with the week. What’s on next lives on Instagram,
            and it usually feels like one of these.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {gatherings.map((item, index) => {
            return (
              <Reveal key={item.title} delay={index * 0.05} className="h-full">
                <Card className="h-full rounded-lg bg-card transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-28px_rgba(60,32,16,0.7)]">
                  <CardContent>
                    <div className="flex items-center justify-center">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={500}
                        height={100}
                        className="rounded-lg"
                      />
                    </div>
                  </CardContent>
                  <CardHeader className="flex flex-col items-center justify-center">
                    <CardTitle className="font-heading text-2xl text-center">
                      {item.title}
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {item.body}
                      </p>
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
