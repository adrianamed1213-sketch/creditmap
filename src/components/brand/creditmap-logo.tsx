import Link from "next/link";

import { cn } from "@/lib/utils";

type CreditMapLogoProps = {
  className?: string;
  compact?: boolean;
};

export function CreditMapLogo({ className, compact = false }: CreditMapLogoProps) {
  return (
    <Link
      className={cn(
        "inline-flex items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--focus)] focus-visible:ring-offset-3",
        className,
      )}
      href="/"
      aria-label="CreditMap home"
    >
      <svg
        aria-hidden="true"
        className="size-8 shrink-0"
        viewBox="0 0 36 36"
        fill="none"
      >
        <rect width="36" height="36" rx="10" fill="var(--brand-900)" />
        <path
          d="M10 24.5L16.3 18.2L21 21L27 11.5"
          stroke="var(--mint-300)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="10" cy="24.5" r="2.7" fill="white" />
        <circle cx="16.5" cy="18" r="2.7" fill="white" />
        <circle cx="21" cy="21" r="2.7" fill="white" />
        <circle cx="27" cy="11.5" r="2.7" fill="var(--gold-400)" />
      </svg>
      {!compact && (
        <span className="text-[1.05rem] font-bold tracking-[-0.025em] text-[var(--brand-950)]">
          CreditMap
        </span>
      )}
    </Link>
  );
}
