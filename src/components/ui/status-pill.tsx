import { CircleCheck, CircleDashed, Clock3, Shapes, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

type StatusPillProps = {
  status: "completed" | "in_progress" | "remaining" | "verification" | "elective";
};

const statusDetails = {
  completed: {
    label: "Completed",
    icon: CircleCheck,
    className: "bg-[var(--success-soft)] text-[var(--success-strong)]",
  },
  in_progress: {
    label: "In progress",
    icon: Clock3,
    className: "bg-blue-50 text-blue-800",
  },
  remaining: {
    label: "Remaining",
    icon: CircleDashed,
    className: "bg-[var(--neutral-soft)] text-[var(--neutral-strong)]",
  },
  verification: {
    label: "Verification required",
    icon: TriangleAlert,
    className: "bg-[var(--warning-soft)] text-[var(--warning-strong)]",
  },
  elective: {
    label: "Elective only",
    icon: Shapes,
    className: "bg-violet-50 text-violet-800",
  },
} as const;

export function StatusPill({ status }: StatusPillProps) {
  const details = statusDetails[status];
  const Icon = details.icon;

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6875rem] font-bold tracking-[0.045em] uppercase",
        details.className,
      )}
    >
      <Icon aria-hidden="true" className="size-3.5" strokeWidth={2.25} />
      {details.label}
    </span>
  );
}
