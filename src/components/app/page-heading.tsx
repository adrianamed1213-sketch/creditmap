import type { ReactNode } from "react";

export function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        <p className="text-xs font-bold tracking-[0.1em] text-[var(--brand-700)] uppercase">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.045em] text-[var(--brand-950)] sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl leading-7 text-[var(--text-muted)]">{description}</p>
      </div>
      {action}
    </div>
  );
}
