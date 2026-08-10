import Link from "next/link";

import { CreditMapLogo } from "@/components/brand/creditmap-logo";
import { product } from "@/lib/product";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)] bg-white">
      <div className="page-shell grid gap-8 py-10 md:grid-cols-[1fr_auto] md:items-end">
        <div className="max-w-2xl space-y-4">
          <CreditMapLogo />
          <p className="text-sm leading-6 text-[var(--text-muted)]">{product.disclaimer}</p>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-[var(--text-muted)]" aria-label="Footer">
          <Link className="hover:text-[var(--brand-900)]" href="/about">
            About &amp; methodology
          </Link>
          <Link className="hover:text-[var(--brand-900)]" href="/dashboard">
            Dashboard
          </Link>
          <Link className="hover:text-[var(--brand-900)]" href="/settings">
            Settings
          </Link>
          <Link className="hover:text-[var(--brand-900)]" href="/admin">
            Data workspace
          </Link>
        </nav>
      </div>
    </footer>
  );
}
