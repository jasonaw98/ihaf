import type { Metadata } from "next";
import { AboutView } from "@/components/about-view";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "About us — IHAF",
  description:
    "IHAF is a Kuala Lumpur social community built on one idea: meeting new people should feel natural, meaningful, and fun. Chapter two starts here.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main id="content" className="flex-1">
        <AboutView />
      </main>
      <SiteFooter />
    </>
  );
}
