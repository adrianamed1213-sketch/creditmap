"use client";

import { AlertCircle, CheckCircle2, GitCompareArrows, Info, Shapes } from "lucide-react";

import { DemoBanner } from "@/components/app/demo-banner";
import { PageHeading } from "@/components/app/page-heading";
import { ProgressRing } from "@/components/app/progress-ring";
import { academicDataset, programForUniversity } from "@/data/demo-data";
import { usePlan } from "@/features/plans/plan-provider";
import { calculatePlan } from "@/lib/academic-engine/engine";

export default function ComparePage() {
  const { plan } = usePlan();
  const comparisons = academicDataset.universities.map((university) => {
    const program = programForUniversity(university.id);
    return calculatePlan({ ...plan, universityId: university.id, programId: program.id }, academicDataset);
  });

  return (
    <>
      <DemoBanner />
      <section className="page-shell py-10 sm:py-14">
        <PageHeading eyebrow="College comparison" title="Same credits, different maps" description="Each institution applies its own illustrative thresholds and degree rules. More accepted credit does not make one university better." />
        <div className="mt-6 flex gap-3 rounded-2xl border border-[var(--line)] bg-white p-4"><Info aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[var(--brand-700)]" /><p className="text-sm leading-6 text-[var(--text-muted)]">Comparison keeps your {plan.credits.length} credit inputs unchanged and reruns the engine for each university. A manually entered university-specific course may require verification elsewhere.</p></div>

        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {comparisons.map((comparison) => (
            <article className={`rounded-3xl border bg-white p-5 sm:p-6 ${comparison.university.id === plan.universityId ? "border-[var(--brand-500)] shadow-[0_16px_35px_rgba(21,55,65,0.08)]" : "border-[var(--line)]"}`} key={comparison.university.id}>
              <div className="flex items-start justify-between gap-4">
                <div><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-extrabold tracking-[0.1em] text-[var(--brand-700)] uppercase">{comparison.university.shortName}</span>{comparison.university.id === plan.universityId && <span className="rounded-full bg-[var(--mint-50)] px-2 py-1 text-[0.65rem] font-bold text-[var(--brand-700)] uppercase">Current plan</span>}</div><h2 className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-[var(--brand-950)]">{comparison.university.name}</h2><p className="mt-1 text-xs text-[var(--text-muted)]">{comparison.program.name}</p></div>
                <ProgressRing size="small" value={comparison.progressPercent} />
              </div>
              <dl className="mt-5 grid grid-cols-3 divide-x divide-[var(--line)] rounded-2xl bg-[var(--surface-subtle)] py-4">
                <div className="px-3"><dt className="text-[0.65rem] font-semibold leading-4 text-[var(--text-muted)]">Accepted</dt><dd className="mt-1 text-xl font-extrabold text-[var(--brand-950)]">{comparison.acceptedCredits}</dd></div>
                <div className="px-3"><dt className="text-[0.65rem] font-semibold leading-4 text-[var(--text-muted)]">Applicable</dt><dd className="mt-1 text-xl font-extrabold text-[var(--brand-950)]">{comparison.applicableCredits}</dd></div>
                <div className="px-3"><dt className="text-[0.65rem] font-semibold leading-4 text-[var(--text-muted)]">Elective</dt><dd className="mt-1 text-xl font-extrabold text-[var(--brand-950)]">{comparison.electiveCredits}</dd></div>
              </dl>
              <div className="mt-5 grid gap-2 text-sm">
                <p className="flex items-center gap-2 text-[var(--text-muted)]"><CheckCircle2 aria-hidden="true" className="size-4 text-[var(--success-strong)]" />{comparison.completedRequirements} modeled requirements complete</p>
                <p className="flex items-center gap-2 text-[var(--text-muted)]"><Shapes aria-hidden="true" className="size-4 text-violet-700" />{comparison.duplicateCredits} overlapping credits suppressed</p>
                <p className="flex items-center gap-2 text-[var(--text-muted)]"><AlertCircle aria-hidden="true" className="size-4 text-[var(--warning-strong)]" />{comparison.resolvedCredits.filter((item) => item.verification === "verification_required").length} inputs need verification</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex gap-3 rounded-2xl bg-[var(--brand-950)] p-5 text-white"><GitCompareArrows aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[var(--mint-300)]" /><p className="text-sm leading-6 text-white/75"><strong className="text-white">Interpret carefully:</strong> degree structures differ. This view compares how credits map, not academic quality, fit, admissions, or affordability.</p></div>
      </section>
    </>
  );
}
