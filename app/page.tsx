import { Difference } from "@/components/difference";
import { Gatherings } from "@/components/gatherings";
import { Hero } from "@/components/hero";
import { JoinCta } from "@/components/join-cta";
import { Questions } from "@/components/questions";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Stats } from "@/components/stats";
import { Ticker } from "@/components/ticker";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="content" className="flex-1">
        <Hero />
        <Ticker />
        <Stats />
        <Gatherings />
        <Difference />
        <Questions />
        <JoinCta />
      </main>
      <SiteFooter />
    </>
  );
}
