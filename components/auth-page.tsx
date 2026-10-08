import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCurrentUser } from "@/lib/events";
import { safeNext } from "@/lib/redirect";

const promises = [
  "RSVP to gatherings in a tap",
  "See every seat you’ve saved",
  "Come alone. That’s the point.",
];

export async function AuthPage({
  mode,
  searchParams,
}: {
  mode: "signup" | "login";
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const next = safeNext(typeof params.next === "string" ? params.next : null);
  const error = typeof params.error === "string" ? params.error : undefined;

  if (await getCurrentUser()) redirect(next);

  return (
    <>
      <SiteHeader />
      <main id="content" className="flex-1 px-5 pt-28 pb-20 sm:px-8 sm:pt-36">
        <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <aside className="relative hidden overflow-hidden rounded-[2rem] bg-foreground p-10 text-background lg:block">
            <div className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full bg-primary/50 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 left-6 size-56 rounded-full bg-butter/30 blur-3xl" />
            <div className="relative">
              <p className="text-xs font-semibold tracking-[0.16em] text-butter uppercase">
                I have a friend
              </p>
              <p className="mt-4 font-heading text-4xl leading-tight tracking-tight">
                Meet a stranger.
                <br />
                <span className="text-butter italic">Leave with a friend.</span>
              </p>
              <ul className="mt-10 space-y-4">
                {promises.map((line) => (
                  <li
                    key={line}
                    className="flex items-center gap-3 text-background/80"
                  >
                    <span className="size-2 rounded-full bg-butter" />
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          <div className="flex justify-center lg:justify-start lg:pt-6">
            <AuthForm mode={mode} next={next} initialError={error} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
