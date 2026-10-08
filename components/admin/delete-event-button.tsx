"use client";

import { Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { deleteEvent } from "@/lib/actions/admin";

export function DeleteEventButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  return (
    <form
      action={deleteEvent}
      onSubmit={(event) => {
        if (
          !window.confirm(
            `Delete “${title}”? Everyone’s RSVPs will be removed too.`,
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="ghost"
      disabled={pending}
      className="rounded-full text-destructive hover:bg-destructive/10 hover:text-destructive"
    >
      <Trash2 data-icon="inline-start" />
      {pending ? "Deleting…" : "Delete event"}
    </Button>
  );
}
