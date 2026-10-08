"use client";

import { cn } from "cn";
import { MailCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type AuthState, signIn, signUp } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/client";

type Mode = "signup" | "login";

const copy = {
  signup: {
    title: "Save your first seat.",
    subtitle:
      "Make an account to RSVP for gatherings and keep your nights in one place.",
    submit: "Create account",
    pending: "Creating account…",
    switchText: "Already one of us?",
    switchLabel: "Log in",
    switchHref: "/login",
  },
  login: {
    title: "Welcome back.",
    subtitle: "Log in to see your seats and grab the next one.",
    submit: "Log in",
    pending: "Logging in…",
    switchText: "New here?",
    switchLabel: "Create an account",
    switchHref: "/signup",
  },
} as const;

export function AuthForm({
  mode,
  next,
  initialError,
}: {
  mode: Mode;
  next: string;
  initialError?: string;
}) {
  const text = copy[mode];
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    mode === "signup" ? signUp : signIn,
    { status: initialError ? "error" : "idle", message: initialError },
  );
  const [googleError, setGoogleError] = useState<string | null>(null);
  const [googlePending, setGooglePending] = useState(false);

  async function continueWithGoogle() {
    setGoogleError(null);
    setGooglePending(true);
    if (!(await googleEnabled())) {
      setGooglePending(false);
      setGoogleError(
        "Google sign-in isn’t switched on yet. Use email for now.",
      );
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setGooglePending(false);
      setGoogleError(error.message);
    }
  }

  const switchHref = `${text.switchHref}${next === "/events" ? "" : `?next=${encodeURIComponent(next)}`}`;

  return (
    <div className="w-full max-w-md">
      <AnimatePresence mode="wait" initial={false}>
        {state.status === "check-email" ? (
          <motion.div
            key="check"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="rounded-3xl bg-card p-8 text-center ring-1 ring-foreground/10"
          >
            <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-sage text-ink">
              <MailCheck className="size-6" />
            </div>
            <h1 className="mt-6 font-heading text-3xl tracking-tight">
              Check your inbox.
            </h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              We sent a confirmation link to{" "}
              <span className="font-medium text-foreground">{state.email}</span>
              . Open it on this device and you’ll land right back here, signed
              in.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <h1 className="font-heading text-4xl tracking-tight text-balance sm:text-5xl">
              {text.title}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-pretty text-muted-foreground">
              {text.subtitle}
            </p>

            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={continueWithGoogle}
              disabled={googlePending}
              className="mt-8 h-12 w-full rounded-full bg-card text-base"
            >
              <GoogleIcon />
              {googlePending ? "Opening Google…" : "Continue with Google"}
            </Button>
            {googleError ? (
              <p role="alert" className="mt-3 text-sm text-destructive">
                {googleError}
              </p>
            ) : null}

            <div className="my-7 flex items-center gap-4 text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
              <span className="h-px flex-1 bg-border" />
              or with email
              <span className="h-px flex-1 bg-border" />
            </div>

            <form action={formAction} className="space-y-4">
              <input type="hidden" name="next" value={next} />
              {mode === "signup" ? (
                <Field label="Your name" htmlFor="full_name">
                  <Input
                    id="full_name"
                    name="full_name"
                    autoComplete="name"
                    placeholder="What friends call you"
                    defaultValue={state.fullName}
                    required
                    maxLength={80}
                    className="h-12 rounded-xl bg-card px-4"
                  />
                </Field>
              ) : null}
              <Field label="Email" htmlFor="email">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  defaultValue={state.email}
                  required
                  className="h-12 rounded-xl bg-card px-4"
                />
              </Field>
              {mode === "signup" ? (
                <Field label="Phone number" htmlFor="phone">
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="012-345 6789"
                    defaultValue={state.phone}
                    required
                    aria-describedby="phone-hint"
                    className="h-12 rounded-xl bg-card px-4"
                  />
                  <p id="phone-hint" className="text-xs text-muted-foreground">
                    Only organisers see this, so they can reach you about
                    events.
                  </p>
                </Field>
              ) : null}
              <Field label="Password" htmlFor="password">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete={
                    mode === "signup" ? "new-password" : "current-password"
                  }
                  minLength={mode === "signup" ? 8 : undefined}
                  placeholder={
                    mode === "signup" ? "At least 8 characters" : undefined
                  }
                  required
                  className="h-12 rounded-xl bg-card px-4"
                />
              </Field>

              {state.status === "error" && state.message ? (
                <p
                  role="alert"
                  className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
                >
                  {state.message}
                </p>
              ) : null}

              <Button
                type="submit"
                size="lg"
                disabled={pending}
                className={cn(
                  "h-12 w-full rounded-full text-base",
                  pending && "opacity-80",
                )}
              >
                {pending ? text.pending : text.submit}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {text.switchText}{" "}
              <Link
                href={switchHref}
                className="font-medium text-foreground underline underline-offset-4"
              >
                {text.switchLabel}
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

async function googleEnabled() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/settings`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
        },
      },
    );
    if (!response.ok) return true;
    const settings: { external?: { google?: boolean } } = await response.json();
    return settings.external?.google !== false;
  } catch {
    return true;
  }
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.6 10.6 0 0 0 12 1 11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}
