import { cn } from "cn";

export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 36 36"
      className={cn("size-9", className)}
      aria-hidden="true"
    >
      <rect width="36" height="36" rx="12" className="fill-primary" />
      <circle cx="13" cy="15" r="2.6" className="fill-primary-foreground" />
      <circle cx="23" cy="15" r="2.6" className="fill-primary-foreground" />
      <path
        d="M12 22.5c2.2 2.4 9.8 2.4 12 0"
        fill="none"
        className="stroke-primary-foreground"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Mark />
      <span className="leading-none">
        <span className="block font-heading text-lg tracking-tight">IHAF</span>
        <span className="mt-0.5 block text-[0.68rem] tracking-wide text-muted-foreground">
          I have a friend
        </span>
      </span>
    </span>
  );
}
