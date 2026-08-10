export default function Loading() {
  return (
    <div className="page-shell py-20" role="status" aria-live="polite">
      <div className="h-4 w-28 animate-pulse rounded bg-[var(--line)]" />
      <div className="mt-5 h-12 max-w-xl animate-pulse rounded-xl bg-[var(--line)]" />
      <div className="mt-4 h-5 max-w-2xl animate-pulse rounded bg-[var(--line)]" />
      <span className="sr-only">Loading CreditMap</span>
    </div>
  );
}
