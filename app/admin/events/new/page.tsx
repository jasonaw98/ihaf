import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { EventForm } from "@/components/admin/event-form";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = {
  title: "New event — IHAF admin",
  robots: { index: false },
};

export default async function NewEventPage() {
  await requireAdmin();

  return (
    <AdminShell title="New event" back={{ href: "/admin", label: "Dashboard" }}>
      <div className="max-w-3xl rounded-[2rem] bg-card p-6 ring-1 ring-foreground/10 sm:p-8">
        <EventForm />
      </div>
    </AdminShell>
  );
}
