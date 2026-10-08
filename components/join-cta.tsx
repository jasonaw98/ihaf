import { InstagramButton } from "@/components/instagram-button";
import { Reveal } from "@/components/reveal";
import { INSTAGRAM_HANDLE } from "@/lib/content";

export function JoinCta() {
  return (
    <section className="px-5 pb-20 sm:px-8 sm:pb-28">
      <Reveal>
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-foreground px-6 py-16 text-background sm:px-14 sm:py-20">
          <div className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full bg-primary/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-10 size-56 rounded-full bg-butter/30 blur-3xl" />
          <div className="relative max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.16em] text-butter uppercase">
              Kuala Lumpur
            </p>
            <h2 className="mt-3 font-heading text-4xl tracking-tight text-balance sm:text-6xl">
              Your seat is open.
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-pretty text-background/75">
              New gatherings land on Instagram first. Follow along, pick a
              night, and come exactly as you are.
            </p>
            <InstagramButton className="mt-8 h-12 rounded-full px-5">
              Follow {INSTAGRAM_HANDLE}
            </InstagramButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
