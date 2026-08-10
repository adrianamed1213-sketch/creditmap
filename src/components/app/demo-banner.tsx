import { FlaskConical } from "lucide-react";

import { DEMO_NOTICE } from "@/data/demo-data";

export function DemoBanner() {
  return (
    <div className="border-b border-[var(--warning-line)] bg-[var(--warning-soft)]">
      <div className="page-shell flex gap-2.5 py-2.5 text-xs font-semibold leading-5 text-[var(--warning-strong)]">
        <FlaskConical aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
        <p>{DEMO_NOTICE}</p>
      </div>
    </div>
  );
}
