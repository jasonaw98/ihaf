import type { Metadata } from "next";
import { AuthPage } from "@/components/auth-page";

export const metadata: Metadata = {
  title: "Sign up — IHAF",
  description: "Create an IHAF account to RSVP for gatherings in Kuala Lumpur.",
};

export default function SignUpPage({ searchParams }: PageProps<"/signup">) {
  return <AuthPage mode="signup" searchParams={searchParams} />;
}
