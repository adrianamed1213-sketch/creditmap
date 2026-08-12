"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

import { CreditMapLogo } from "@/components/brand/creditmap-logo";
import { ButtonLink } from "@/components/ui/button-link";

const navigation = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/plan/demo-plan/map", label: "Degree map" },
  { href: "/compare", label: "Compare" },
  { href: "/competition", label: "Competition" },
  { href: "/about", label: "Methodology" },
] as const;

export function SiteHeader() {
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);

  function closeMobileMenu() {
    if (mobileMenuRef.current) {
      mobileMenuRef.current.open = false;
    }
  }

  return (
    <header className="print-hidden sticky top-0 z-50 border-b border-[var(--line)] bg-[color:rgba(250,252,251,0.92)] backdrop-blur-md">
      <div className="page-shell flex h-[4.5rem] items-center justify-between gap-5">
        <CreditMapLogo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:bg-white hover:text-[var(--brand-950)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--focus)]"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <ButtonLink href="/start" variant="secondary">
            Build my CreditMap
          </ButtonLink>
        </div>

        <details className="group relative md:hidden" ref={mobileMenuRef}>
          <summary
            aria-label="Open navigation menu"
            className="flex size-11 cursor-pointer list-none items-center justify-center rounded-xl border border-[var(--line-strong)] bg-white text-[var(--brand-950)] marker:hidden focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--focus)]"
          >
            <Menu aria-hidden="true" className="size-5" />
            <span className="sr-only">Open navigation</span>
          </summary>
          <nav
            className="absolute right-0 top-13 flex w-64 flex-col gap-1 rounded-2xl border border-[var(--line)] bg-white p-2 shadow-xl"
            aria-label="Mobile navigation"
          >
            {navigation.map((item) => (
              <Link
                className="rounded-xl px-3 py-3 text-sm font-semibold text-[var(--brand-950)] hover:bg-[var(--mint-50)]"
                href={item.href}
                key={item.href}
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
