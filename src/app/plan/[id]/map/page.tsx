"use client";

import {
  AlertTriangle,
  BadgeDollarSign,
  BookCheck,
  CheckCircle2,
  CircleDotDashed,
  ExternalLink,
  GitCompareArrows,
  GraduationCap,
  Layers3,
  Shapes,
} from "lucide-react";
import Link from "next/link";

import { MetricCard } from "@/components/app/metric-card";
import { PageHeading } from "@/components/app/page-heading";
import { ProgressRing } from "@/components/app/progress-ring";
import { StatusPill } from "@/components/ui/status-pill";
import { academicDataset } from "@/data/demo-data";
import { usePlan } from "@/features/plans/plan-provider";

const statusMap = {
  completed: "completed",
  in_progress: "in_progress",
  remaining: "remaining",
  verification_required: "verification",
} as const;

export default function DegreeMapPage() {
  const { plan, result, setUniversity } = usePlan();
  const groups = new Map<string, typeof result.requirementResults>();
  result.requirementResults.forEach((requirementResult) => {
    const current = groups.get(requirementResult.requirement.groupLabel) ?? [];
    groups.set(requirementResult.requirement.groupLabel, [...current, requirementResult]);
  });
  const savingsEstimate = result.applicableCredits * result.university.tuitionPerCredit;

  return (
    <section className="page-shell py-10 sm:py-14">
      <PageHeading
        eyebrow="Your degree map"
        title={`${result.university.shortName} · ${result.program.majorName}`}
        description="A deterministic estimate of how the credits in this plan connect to the selected degree pathway, with verification shown record by record."
        action={
          <label className="w-full sm:w-auto">
            <span className="sr-only">Change university</span>
            <select className="form-input min-w-64" onChange={(event) => setUniversity(event.target.value)} value={plan.universityId}>
              {academicDataset.universities.map((university) => <option key={university.id} value={university.id}>{university.name}</option>)}
            </select>
          </label>
        }
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard detail="Unique course credit after duplicate suppression" icon={BookCheck} label="Accepted credits" value={result.acceptedCredits} />
        <MetricCard detail="Credits allocated to a modeled requirement" icon={CheckCircle2} label="Degree applicable" value={result.applicableCredits} />
        <MetricCard detail="Accepted but unused by the modeled rules" icon={Shapes} label="Elective credits" value={result.electiveCredits} />
        <MetricCard detail={`${result.completedRequirements} of ${result.totalRequirements} requirements completed`} icon={GraduationCap} label="Estimated progress" value={`${result.progressPercent}%`} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto]">
        <div className="rounded-3xl border border-[var(--line)] bg-white p-6 sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <ProgressRing value={result.progressPercent} />
            <div>
              <p className="text-xs font-bold tracking-[0.08em] text-[var(--brand-700)] uppercase">Overall estimate</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-[var(--brand-950)]">{result.applicableCredits} of {result.program.totalCredits} credits connected</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">Progress uses applicable credits, not every accepted credit. Unmodeled requirements remain verification-required instead of being guessed.</p>
            </div>
          </div>
        </div>
        <Link className="inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl border border-[var(--line-strong)] bg-white px-5 text-sm font-bold text-[var(--brand-900)] hover:bg-[var(--mint-50)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--focus)] lg:min-w-52" href="/compare">
          <GitCompareArrows aria-hidden="true" className="size-5" />Compare colleges
        </Link>
      </div>

      {result.duplicateCredits > 0 && (
        <div className="mt-5 flex gap-3 rounded-2xl border border-[var(--warning-line)] bg-[var(--warning-soft)] p-4 text-[var(--warning-strong)]">
          <AlertTriangle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <div><p className="text-sm font-bold">{result.duplicateCredits} overlapping credits were not counted twice.</p><p className="mt-1 text-xs leading-5">Open Credits to see which inputs resolve to the same course equivalent.</p></div>
        </div>
      )}

      <div className="mt-10 space-y-9">
        {[...groups.entries()].map(([group, requirements]) => (
          <section key={group}>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-extrabold tracking-[-0.03em] text-[var(--brand-950)]">{group}</h2>
              <span className="text-xs font-semibold text-[var(--text-muted)]">{requirements.filter((item) => item.status === "completed").length} of {requirements.length} complete</span>
            </div>
            <div className="mt-3 space-y-3">
              {requirements.map((requirementResult) => (
                <details className="group rounded-2xl border border-[var(--line)] bg-white open:border-[var(--mint-200)]" key={requirementResult.requirement.id}>
                  <summary className="grid cursor-pointer list-none grid-cols-[auto_1fr] gap-3 p-4 marker:hidden sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-5">
                    <div className="grid size-10 place-items-center rounded-xl bg-[var(--surface-subtle)] text-[var(--brand-700)]">
                      {requirementResult.status === "completed" ? <CheckCircle2 aria-hidden="true" className="size-5" /> : <CircleDotDashed aria-hidden="true" className="size-5" />}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-[var(--brand-950)]">{requirementResult.requirement.title}</h3>
                      <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{requirementResult.appliedCredits} / {requirementResult.requirement.credits} credits connected</p>
                    </div>
                    <div className="col-start-2 flex flex-wrap items-center gap-2 sm:col-auto">
                      <StatusPill status={statusMap[requirementResult.status]} />
                      <span className="text-xs font-semibold text-[var(--brand-700)] group-open:hidden">View details</span>
                    </div>
                  </summary>
                  <div className="border-t border-[var(--line)] px-4 py-5 sm:px-5">
                    <p className="text-sm leading-6 text-[var(--text-muted)]">{requirementResult.requirement.description}</p>
                    <p className="mt-3 text-sm font-semibold text-[var(--brand-950)]">{requirementResult.explanation}</p>
                    {requirementResult.matchedCourses.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{requirementResult.matchedCourses.map((course) => <span className="rounded-lg bg-[var(--mint-50)] px-2.5 py-1.5 text-xs font-bold text-[var(--brand-800)]" key={`${course.sourceCreditId}-${course.courseCode}`}>{course.courseCode} · {course.credits} credits</span>)}</div>}
                    {(() => {
                      const source = academicDataset.sources.find(
                        (item) => item.id === requirementResult.requirement.sourceId,
                      );
                      if (!source) return null;
                      const external = source.url.startsWith("http");
                      return (
                        <a
                          className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--brand-700)] hover:underline"
                          href={source.url}
                          rel={external ? "noreferrer" : undefined}
                          target={external ? "_blank" : undefined}
                        >
                          Source: {source.title} · checked {source.checkedAt}
                          <ExternalLink aria-hidden="true" className="size-3" />
                        </a>
                      );
                    })()}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-10 rounded-3xl border border-[var(--line)] bg-[var(--brand-950)] p-6 text-white sm:p-8">
        <div className="grid gap-6 md:grid-cols-[auto_1fr_auto] md:items-center">
          <div className="grid size-12 place-items-center rounded-2xl bg-white/10"><BadgeDollarSign aria-hidden="true" className="size-6 text-[var(--mint-300)]" /></div>
          <div>
            <p className="text-xs font-bold tracking-[0.08em] text-[var(--mint-300)] uppercase">Optional savings estimate</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.035em]">${savingsEstimate.toLocaleString(undefined, { maximumFractionDigits: 0 })} estimated tuition value</h2>
            <p className="mt-2 text-sm leading-6 text-white/70">Assumption: {result.applicableCredits} applicable credits × ${result.university.tuitionPerCredit.toFixed(2)} illustrative cost per credit. This does not mean tuition will decrease by this amount.</p>
          </div>
          <Layers3 aria-hidden="true" className="hidden size-16 text-white/10 md:block" />
        </div>
      </section>
    </section>
  );
}
