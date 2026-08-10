import type { LucideIcon } from "lucide-react";

type MetricCardProps = {
  label: string;
  value: string | number;
  detail: string;
  icon: LucideIcon;
};

export function MetricCard({ label, value, detail, icon: Icon }: MetricCardProps) {
  return (
    <article className="rounded-2xl border border-[var(--line)] bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.06em] text-[var(--text-muted)] uppercase">{label}</p>
          <p className="mt-2 text-3xl font-extrabold tracking-[-0.04em] text-[var(--brand-950)]">{value}</p>
        </div>
        <div className="grid size-10 place-items-center rounded-xl bg-[var(--mint-50)] text-[var(--brand-700)]">
          <Icon aria-hidden="true" className="size-5" />
        </div>
      </div>
      <p className="mt-3 text-xs leading-5 text-[var(--text-muted)]">{detail}</p>
    </article>
  );
}
