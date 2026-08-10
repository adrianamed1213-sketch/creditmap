import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary" | "quiet";
};

const variants = {
  primary:
    "bg-[var(--brand-900)] text-white shadow-[0_8px_20px_rgba(16,51,65,0.16)] hover:bg-[var(--brand-800)]",
  secondary:
    "border border-[var(--line-strong)] bg-white text-[var(--brand-950)] hover:border-[var(--brand-500)] hover:bg-[var(--mint-50)]",
  quiet: "text-[var(--brand-800)] hover:bg-[var(--mint-50)]",
} as const;

export function ButtonLink({
  className,
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--focus)] focus-visible:ring-offset-3",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
