"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="page-shell grid min-h-[55vh] place-items-center py-20 text-center">
      <div className="max-w-lg">
        <p className="text-xs font-bold tracking-[0.1em] text-[var(--brand-700)] uppercase">Something went wrong</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.04em] text-[var(--brand-950)]">We couldn’t load this page.</h1>
        <p className="mt-4 leading-7 text-[var(--text-muted)]">Your information has not been changed. Try loading the page again.</p>
        <button
          className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--brand-900)] px-4 py-2.5 text-sm font-bold text-white hover:bg-[var(--brand-800)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--focus)] focus-visible:ring-offset-3"
          onClick={reset}
          type="button"
        >
          <RotateCcw aria-hidden="true" className="size-4" />
          Try again
        </button>
      </div>
    </section>
  );
}
