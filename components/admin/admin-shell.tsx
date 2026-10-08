import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function AdminShell({
  title,
  eyebrow = "Admin",
  back,
  actions,
  children,
}: {
  title: string;
  eyebrow?: string;
  back?: { href: string; label: string };
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main id="content" className="flex-1 px-5 pt-28 pb-24 sm:px-8 sm:pt-36">
        <div className="mx-auto max-w-6xl">
          {back ? (
            <Link
              href={back.href}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              {back.label}
            </Link>
          ) : null}
          <header className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                {eyebrow}
              </p>
              <h1 className="mt-2 font-heading text-4xl tracking-tight text-balance sm:text-5xl">
                {title}
              </h1>
            </div>
            {actions ? (
              <div className="flex flex-wrap gap-2">{actions}</div>
            ) : null}
          </header>
          <div className="mt-10">{children}</div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
