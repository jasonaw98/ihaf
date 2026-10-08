import Link from "next/link";
import { Reveal } from "@/components/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs, INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/content";

export function Questions() {
  return (
    <section
      id="questions"
      className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-12">
        <Reveal className="lg:col-span-4">
          <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            Questions
          </p>
          <h2 className="mt-3 font-heading text-4xl tracking-tight text-balance sm:text-5xl">
            Before you talk yourself out of it.
          </h2>
        </Reveal>
        <Reveal className="lg:col-span-8" delay={0.08}>
          <Accordion multiple className="border-t border-border">
            {faqs.map((faq) => (
              <AccordionItem key={faq.q} value={faq.q}>
                <AccordionTrigger className="py-5 font-heading text-xl hover:no-underline sm:text-2xl">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="max-w-2xl pb-5 text-base leading-relaxed text-muted-foreground">
                  {faq.q.startsWith("How do I") ? (
                    <p>
                      Pick a night on the{" "}
                      <Link
                        href="/events"
                        className="font-medium text-foreground underline underline-offset-4"
                      >
                        events page
                      </Link>{" "}
                      and save your seat with a free account. New dates are
                      announced on{" "}
                      <a
                        href={INSTAGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-foreground underline underline-offset-4"
                      >
                        {INSTAGRAM_HANDLE}
                      </a>{" "}
                      too.
                    </p>
                  ) : (
                    <p>{faq.a}</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
