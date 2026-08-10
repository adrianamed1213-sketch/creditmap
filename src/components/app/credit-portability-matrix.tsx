import {
  AlertTriangle,
  CheckCircle2,
  CircleOff,
  CopyX,
  ExternalLink,
  GitCompareArrows,
  Shapes,
  Split,
} from "lucide-react";

import type {
  CreditComparisonOutcome,
  CreditOutcomeStatus,
  CreditPortabilityComparison,
} from "@/lib/academic-engine/comparison";
import type { AcademicSource, StudentCredit } from "@/lib/academic-engine/types";

const statusDisplay: Record<
  CreditOutcomeStatus,
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  applicable: {
    label: "Applies to degree",
    className: "bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
  mixed: {
    label: "Partly applies",
    className: "bg-sky-50 text-sky-700",
    icon: Split,
  },
  elective: {
    label: "Elective only",
    className: "bg-violet-50 text-violet-700",
    icon: Shapes,
  },
  duplicate: {
    label: "Duplicate",
    className: "bg-amber-50 text-amber-800",
    icon: CopyX,
  },
  no_match: {
    label: "No supported credit",
    className: "bg-slate-100 text-slate-700",
    icon: CircleOff,
  },
  verification_required: {
    label: "Verification required",
    className: "bg-[var(--warning-soft)] text-[var(--warning-strong)]",
    icon: AlertTriangle,
  },
};

function creditDetail(credit: StudentCredit) {
  return credit.kind === "exam"
    ? `${credit.sourceType} · score ${credit.score}`
    : `${credit.courseCode} · ${credit.credits} credits · grade ${credit.grade}`;
}

function outcomeMetric(outcome: CreditComparisonOutcome) {
  if (outcome.status === "verification_required") return "University review needed";
  if (outcome.status === "no_match") return "0 supported credits";
  if (outcome.status === "duplicate") {
    return `${outcome.duplicateCredits} overlapping credits suppressed`;
  }
  if (outcome.status === "mixed") {
    return [
      outcome.applicableCredits > 0 ? `${outcome.applicableCredits} applicable` : "",
      outcome.electiveCredits > 0 ? `${outcome.electiveCredits} elective` : "",
      outcome.duplicateCredits > 0 ? `${outcome.duplicateCredits} duplicate` : "",
    ]
      .filter(Boolean)
      .join(" · ");
  }
  if (outcome.status === "elective") {
    return `${outcome.electiveCredits} elective credits`;
  }
  return `${outcome.applicableCredits} applicable credits`;
}

function OutcomeCell({
  outcome,
  sources,
}: {
  outcome: CreditComparisonOutcome;
  sources: AcademicSource[];
}) {
  const display = statusDisplay[outcome.status];
  const Icon = display.icon;
  const source = sources.find((item) => outcome.sourceIds.includes(item.id));

  return (
    <div>
      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-extrabold uppercase ${display.className}`}
      >
        <Icon aria-hidden="true" className="size-3.5" />
        {display.label}
      </span>
      <p className="mt-3 text-sm font-extrabold text-[var(--brand-950)]">
        {outcome.courses.length > 0
          ? outcome.courses.map((course) => course.courseCode).join(" + ")
          : "No course equivalent shown"}
      </p>
      <p className="mt-1 text-xs font-semibold leading-5 text-[var(--text-muted)]">
        {outcomeMetric(outcome)}
      </p>
      <details className="group mt-3 text-xs">
        <summary className="cursor-pointer list-none rounded font-bold text-[var(--brand-700)] marker:hidden focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--focus)]">
          <span className="group-open:hidden">Why this result?</span>
          <span className="hidden group-open:inline">Hide explanation</span>
        </summary>
        <p className="mt-2 leading-5 text-[var(--text-muted)]">{outcome.note}</p>
        {source?.url.startsWith("http") && (
          <a
            className="mt-2 inline-flex items-center gap-1 font-bold text-[var(--brand-700)] hover:underline"
            href={source.url}
            rel="noreferrer"
            target="_blank"
          >
            Official evidence
            <ExternalLink aria-hidden="true" className="size-3" />
          </a>
        )}
      </details>
    </div>
  );
}

export function CreditPortabilityMatrix({
  comparison,
  sources,
}: {
  comparison: CreditPortabilityComparison;
  sources: AcademicSource[];
}) {
  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-[var(--line)] bg-white">
      <div className="border-b border-[var(--line)] p-5 sm:p-7">
        <div className="flex gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[var(--mint-50)] text-[var(--brand-700)]">
            <GitCompareArrows aria-hidden="true" className="size-5" />
          </div>
          <div>
            <p className="text-xs font-bold tracking-[0.08em] text-[var(--brand-700)] uppercase">
              Credit portability matrix
            </p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-[-0.04em] text-[var(--brand-950)]">
              Follow every credit, not just the totals
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-muted)]">
              Each row keeps the student input fixed and shows the university equivalent, degree use, duplicate handling, explanation, and evidence.
            </p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-3 divide-x divide-[var(--line)] rounded-2xl bg-[var(--surface-subtle)] py-4 text-center">
          <div className="px-2">
            <dt className="text-[0.65rem] font-semibold leading-4 text-[var(--text-muted)]">Applies at both</dt>
            <dd className="mt-1 text-xl font-extrabold text-[var(--brand-950)]">{comparison.portableCount}</dd>
          </div>
          <div className="px-2">
            <dt className="text-[0.65rem] font-semibold leading-4 text-[var(--text-muted)]">Changes by college</dt>
            <dd className="mt-1 text-xl font-extrabold text-[var(--brand-950)]">{comparison.variesCount}</dd>
          </div>
          <div className="px-2">
            <dt className="text-[0.65rem] font-semibold leading-4 text-[var(--text-muted)]">Needs review</dt>
            <dd className="mt-1 text-xl font-extrabold text-[var(--brand-950)]">{comparison.verificationCount}</dd>
          </div>
        </dl>
      </div>

      <div className="divide-y divide-[var(--line)] md:hidden">
        {comparison.rows.map((row) => (
          <article className="p-5" key={row.credit.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-[var(--brand-950)]">{row.credit.label}</h3>
                <p className="mt-1 text-xs text-[var(--text-muted)]">{creditDetail(row.credit)}</p>
              </div>
              {row.variesByUniversity && (
                <span className="rounded-full bg-sky-50 px-2 py-1 text-[0.65rem] font-extrabold text-sky-700 uppercase">
                  Varies
                </span>
              )}
            </div>
            <div className="mt-4 grid gap-3">
              {row.outcomes.map((outcome) => (
                <section className="rounded-2xl border border-[var(--line)] p-4" key={outcome.universityId}>
                  <h4 className="mb-3 text-xs font-extrabold tracking-[0.08em] text-[var(--brand-700)] uppercase">
                    {outcome.universityShortName}
                  </h4>
                  <OutcomeCell outcome={outcome} sources={sources} />
                </section>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full table-fixed border-collapse text-left">
          <thead className="bg-[var(--surface-subtle)]">
            <tr>
              <th className="w-[28%] px-5 py-4 text-xs font-extrabold tracking-[0.07em] text-[var(--text-muted)] uppercase" scope="col">Credit entered</th>
              {comparison.results.map((result) => (
                <th className="px-5 py-4 text-xs font-extrabold tracking-[0.07em] text-[var(--brand-700)] uppercase" key={result.university.id} scope="col">
                  {result.university.shortName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {comparison.rows.map((row) => (
              <tr className="align-top" key={row.credit.id}>
                <th className="px-5 py-5 font-normal" scope="row">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-[var(--brand-950)]">{row.credit.label}</span>
                    {row.variesByUniversity && (
                      <span className="rounded-full bg-sky-50 px-2 py-1 text-[0.6rem] font-extrabold text-sky-700 uppercase">Varies</span>
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{creditDetail(row.credit)}</p>
                </th>
                {row.outcomes.map((outcome) => (
                  <td className="border-l border-[var(--line)] px-5 py-5" key={outcome.universityId}>
                    <OutcomeCell outcome={outcome} sources={sources} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
