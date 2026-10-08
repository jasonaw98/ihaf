import { Reveal } from "@/components/reveal";
import { reasons } from "@/lib/content";

export function Difference() {
  return (
    <section className="px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            Why people return
          </p>
          <h2 className="mt-3 font-heading text-4xl tracking-tight text-balance sm:text-5xl">
            You don’t need a bigger network.
          </h2>
          <p className="mt-6 font-heading text-2xl leading-snug text-pretty italic sm:text-3xl">
            You need a table where someone asks your name and means it.
          </p>
        </Reveal>
        <ol className="lg:col-span-7">
          {reasons.map((reason, index) => (
            <li key={reason.title}>
              <Reveal delay={index * 0.06}>
                <div className="grid grid-cols-[auto_1fr] gap-5 border-t border-border py-7">
                  <span className="font-heading text-lg text-primary italic">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="font-heading text-2xl tracking-tight">
                      {reason.title}
                    </h3>
                    <p className="mt-2 max-w-lg text-base leading-relaxed text-muted-foreground">
                      {reason.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
