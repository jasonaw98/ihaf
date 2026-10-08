import type { VariantProps } from "class-variance-authority";
import { cn } from "cn";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import { INSTAGRAM_URL } from "@/lib/content";

export function InstagramButton({
  children,
  className,
  variant = "default",
  size = "lg",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
} & VariantProps<typeof buttonVariants>) {
  return (
    <a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={cn(
        buttonVariants({ variant, size }),
        "rounded-full",
        className,
      )}
    >
      {children}
      <ArrowUpRight data-icon="inline-end" />
    </a>
  );
}
