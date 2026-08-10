import {
  BookOpenCheck,
  CircleDot,
  FileCheck2,
  Route,
  Sparkles,
} from "lucide-react";

import { StatusPill } from "@/components/ui/status-pill";

const summaryItems = [
  { label: "Credits entered", value: "27" },
  { label: "Degree applicable", value: "22" },
  { label: "Elective credits", value: "3" },
] as const;

const requirements = [
  {
    title: "Written Communication",
    detail: "Illustrative composition course",
    status: "completed" as const,
    value: "3 / 3 credits",
  },
  {
    title: "Quantitative Foundation",
    detail: "Illustrative calculus course",
    status: "completed" as const,
    value: "4 / 4 credits",
  },
  {
    title: "Business Foundation",
    detail: "No supported match yet",
    status: "remaining" as const,
    value: "0 / 3 credits",
  },
] as const;

export function DegreeMapPreview() {
  return (
    <div className="relative mx-auto w-full max-w-2xl" id="preview">
      <div className="absolute -left-8 top-24 hidden h-36 w-36 rounded-full border border-[var(--mint-200)] lg:block" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-[1.75rem] border border-[var(--line-strong)] bg-white shadow-[0_30px_70px_rgba(21,55,65,0.12)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--surface-subtle)] px-5 py-3 sm:px-7">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.08em] text-[var(--brand-800)] uppercase">
            <Sparkles aria-hidden="true" className="size-3.5" />
            Illustrative demo data
          </span>
          <span className="text-xs font-medium text-[var(--text-muted)]">Not official academic data</span>
        </div>

        <div className="p-5 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold tracking-[0.08em] text-[var(--text-muted)] uppercase">
                Sample degree map
              </p>
              <h2 className="mt-1 text-xl font-bold tracking-[-0.03em] text-[var(--brand-950)] sm:text-2xl">
                Business pathway
              </h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">Illustrative 120-credit program</p>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="grid size-16 place-items-center rounded-full"
                style={{
                  background:
                    "conic-gradient(var(--brand-600) 0deg 66deg, var(--mint-100) 66deg 360deg)",
                }}
                aria-label="18 percent estimated progress"
              >
                <div className="grid size-12 place-items-center rounded-full bg-white text-center">
                  <span className="text-sm font-extrabold text-[var(--brand-950)]">18%</span>
                </div>
              </div>
              <p className="max-w-24 text-xs font-semibold leading-4 text-[var(--text-muted)]">
                Estimated degree progress
              </p>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-3 divide-x divide-[var(--line)] rounded-2xl border border-[var(--line)] bg-[var(--surface-subtle)] py-4">
            {summaryItems.map((item) => (
              <div className="px-3 sm:px-4" key={item.label}>
                <dt className="text-[0.65rem] font-semibold leading-4 text-[var(--text-muted)] sm:text-xs">
                  {item.label}
                </dt>
                <dd className="mt-1 text-lg font-extrabold tracking-[-0.03em] text-[var(--brand-950)] sm:text-xl">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 flex items-center justify-between gap-4">
            <h3 className="text-sm font-bold text-[var(--brand-950)]">Requirement map</h3>
            <span className="text-xs font-medium text-[var(--text-muted)]">2 of 3 shown complete</span>
          </div>

          <div className="relative mt-3 space-y-2.5 before:absolute before:bottom-8 before:left-[1.2rem] before:top-8 before:w-px before:bg-[var(--mint-200)]">
            {requirements.map((requirement, index) => (
              <article
                className="relative grid grid-cols-[auto_1fr] gap-3 rounded-2xl border border-[var(--line)] bg-white p-3.5 sm:grid-cols-[auto_1fr_auto] sm:items-center"
                key={requirement.title}
              >
                <div className="relative z-10 grid size-10 place-items-center rounded-xl bg-[var(--mint-50)] text-[var(--brand-700)]">
                  {index === 0 ? (
                    <FileCheck2 aria-hidden="true" className="size-5" />
                  ) : index === 1 ? (
                    <Route aria-hidden="true" className="size-5" />
                  ) : (
                    <CircleDot aria-hidden="true" className="size-5" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[var(--brand-950)]">{requirement.title}</p>
                  <p className="truncate text-xs text-[var(--text-muted)]">{requirement.detail}</p>
                </div>
                <div className="col-start-2 flex flex-wrap items-center gap-2 sm:col-auto sm:justify-end">
                  <span className="text-xs font-semibold text-[var(--text-muted)]">{requirement.value}</span>
                  <StatusPill status={requirement.status} />
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 flex gap-3 rounded-2xl border border-[var(--mint-200)] bg-[var(--mint-50)] p-4">
            <BookOpenCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[var(--brand-700)]" />
            <div>
              <p className="text-sm font-bold text-[var(--brand-950)]">Recommendations must map to a requirement.</p>
              <p className="mt-0.5 text-xs leading-5 text-[var(--text-muted)]">
                CreditMap will only suggest supported options that connect to something still remaining.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
