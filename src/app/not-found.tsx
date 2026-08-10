import { Compass } from "lucide-react";

import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <section className="page-shell grid min-h-[55vh] place-items-center py-20 text-center">
      <div className="max-w-lg">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[var(--mint-50)] text-[var(--brand-700)]">
          <Compass aria-hidden="true" className="size-7" />
        </div>
        <p className="mt-6 text-xs font-bold tracking-[0.1em] text-[var(--brand-700)] uppercase">404 · Route not found</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.045em] text-[var(--brand-950)]">This path isn’t on the map.</h1>
        <p className="mt-4 leading-7 text-[var(--text-muted)]">The page may have moved, or the address may be incorrect.</p>
        <ButtonLink className="mt-7" href="/">
          Return to CreditMap
        </ButtonLink>
      </div>
    </section>
  );
}
