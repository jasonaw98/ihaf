import { Logo } from "@/components/logo";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            A Kuala Lumpur community for people who came alone and left with
            plans.
          </p>
        </div>
        <div className="space-y-1 text-sm text-muted-foreground sm:text-right">
          <a
            href="/events"
            className="block font-medium text-foreground underline-offset-4 hover:underline"
          >
            Events
          </a>
          <a
            href="/about"
            className="block font-medium text-foreground underline-offset-4 hover:underline"
          >
            About us
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block font-medium text-foreground underline-offset-4 hover:underline"
          >
            {INSTAGRAM_HANDLE}
          </a>
          <p>Founded in 2025 by Alex Yew</p>
          <p>© {new Date().getFullYear()} I Have A Friend</p>
        </div>
      </div>
    </footer>
  );
}
