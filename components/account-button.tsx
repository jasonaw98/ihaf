"use client";

import { cn } from "cn";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type Account = {
  name: string;
  avatarUrl: string | null;
  isAdmin: boolean;
} | null;

export function useAccount() {
  const [account, setAccount] = useState<Account | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    async function load(userId: string | undefined, email: string | undefined) {
      if (!userId) {
        if (active) setAccount(null);
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, is_admin")
        .eq("id", userId)
        .maybeSingle();
      if (active) {
        setAccount({
          name: data?.full_name ?? email?.split("@")[0] ?? "You",
          avatarUrl: data?.avatar_url ?? null,
          isAdmin: data?.is_admin === true,
        });
      }
    }

    supabase.auth
      .getUser()
      .then(({ data }) => load(data.user?.id, data.user?.email));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (
          event === "SIGNED_IN" ||
          event === "SIGNED_OUT" ||
          event === "USER_UPDATED"
        ) {
          // Supabase calls made inside this callback can deadlock the auth lock.
          setTimeout(() => load(session?.user.id, session?.user.email), 0);
        }
      },
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return account;
}

export function AccountButton({
  account,
  className,
  onNavigate,
}: {
  account: Account | undefined;
  className?: string;
  onNavigate?: () => void;
}) {
  if (account === undefined) {
    return (
      <span
        className={cn("block size-10 rounded-full bg-muted", className)}
        aria-hidden="true"
      />
    );
  }

  if (!account) {
    return (
      <Link
        href="/login"
        onClick={onNavigate}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "h-10 rounded-full px-4 text-sm",
          className,
        )}
      >
        Log in
      </Link>
    );
  }

  return (
    <Link
      href="/profile"
      onClick={onNavigate}
      aria-label={`Your profile (${account.name})`}
      className={cn(
        "rounded-full outline-none transition-transform hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <Avatar className="size-10 ring-2 ring-butter">
        {account.avatarUrl ? (
          <AvatarImage src={account.avatarUrl} alt="" />
        ) : null}
        <AvatarFallback className="bg-butter font-semibold text-ink">
          {account.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </Link>
  );
}
