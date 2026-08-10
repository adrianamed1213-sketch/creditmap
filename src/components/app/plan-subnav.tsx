"use client";

import { BookPlus, Compass, Lightbulb, Map } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Overview", mobileLabel: "Overview", icon: Compass },
  { href: "/plan/demo-plan/credits", label: "Credits", mobileLabel: "Credits", icon: BookPlus },
  { href: "/plan/demo-plan/map", label: "Degree map", mobileLabel: "Map", icon: Map },
  { href: "/plan/demo-plan/recommendations", label: "Next steps", mobileLabel: "Next", icon: Lightbulb },
] as const;

export function PlanSubnav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-[var(--line)] bg-white" aria-label="Plan navigation">
      <div className="page-shell grid grid-cols-4 gap-1 py-2 sm:flex">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex min-h-12 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[0.6875rem] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--focus)] sm:min-h-10 sm:shrink-0 sm:flex-row sm:gap-2 sm:px-3 sm:text-sm",
                active
                  ? "bg-[var(--brand-900)] text-white"
                  : "text-[var(--text-muted)] hover:bg-[var(--mint-50)] hover:text-[var(--brand-950)]",
              )}
              href={item.href}
              key={item.href}
            >
              <Icon aria-hidden="true" className="size-4" />
              <span className="sm:hidden">{item.mobileLabel}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
