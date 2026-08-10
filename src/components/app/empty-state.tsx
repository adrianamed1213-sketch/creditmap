import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="rounded-3xl border border-dashed border-[var(--line-strong)] bg-white px-6 py-12 text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[var(--mint-50)] text-[var(--brand-700)]">
        <Icon aria-hidden="true" className="size-6" />
      </div>
      <h2 className="mt-5 text-xl font-bold text-[var(--brand-950)]">{title}</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[var(--text-muted)]">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
