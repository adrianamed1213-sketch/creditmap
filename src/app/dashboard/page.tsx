"use client";

import { ArrowRight, BookPlus, CheckCircle2, Clock3, GitCompareArrows, GraduationCap, Lightbulb, Map, Shapes } from "lucide-react";
import Link from "next/link";

import { DemoBanner } from "@/components/app/demo-banner";
import { MetricCard } from "@/components/app/metric-card";
import { PageHeading } from "@/components/app/page-heading";
import { ProgressRing } from "@/components/app/progress-ring";
import { usePlan } from "@/features/plans/plan-provider";

export default function DashboardPage() {
  const { plan, result } = usePlan();

  return (
    <>
      <DemoBanner />
      <section className="page-shell py-10 sm:py-14">
        <PageHeading eyebrow="Saved locally" title={`Welcome back to ${plan.profileName}`} description={`${result.university.name} · ${result.program.name}`} action={<span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-3 py-2 text-xs font-bold text-[var(--text-muted)]"><Clock3 aria-hidden="true" className="size-4" />Updated {new Date(plan.updatedAt).toLocaleDateString()}</span>} />

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-[var(--line)] bg-[var(--brand-950)] p-6 text-white sm:p-8">
            <div className="flex flex-col gap-7 sm:flex-row sm:items-center">
              <ProgressRing value={result.progressPercent} />
              <div>
                <p className="text-xs font-bold tracking-[0.08em] text-[var(--mint-300)] uppercase">Estimated degree progress</p>
                <h2 className="mt-2 text-3xl font-extrabold tracking-[-0.045em]">{result.applicableCredits} applicable credits</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">{result.completedRequirements} modeled requirements complete. {result.duplicateCredits > 0 ? `${result.duplicateCredits} overlapping credits are safely excluded.` : "No duplicate credits detected."}</p>
                <Link className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-[var(--brand-950)] hover:bg-[var(--mint-50)]" href="/plan/demo-plan/map">View my CreditMap<ArrowRight aria-hidden="true" className="size-4" /></Link>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[var(--line)] bg-white p-6">
            <div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-[var(--mint-50)] text-[var(--brand-700)]"><Lightbulb aria-hidden="true" className="size-5" /></div><div><p className="text-xs font-bold tracking-[0.06em] text-[var(--brand-700)] uppercase">Recommended next</p><h2 className="font-bold text-[var(--brand-950)]">{result.recommendations[0]?.exam.name ?? "No direct match found"}</h2></div></div>
            {result.recommendations[0] && <><p className="mt-4 text-sm leading-6 text-[var(--text-muted)]">Could connect {result.recommendations[0].potentialCredits} credits to <strong className="text-[var(--brand-950)]">{result.recommendations[0].requirementTitle}</strong>.</p><Link className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-700)] hover:underline" href="/plan/demo-plan/recommendations">Simulate this opportunity<ArrowRight aria-hidden="true" className="size-4" /></Link></>}
          </section>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard detail="All entered credits before resolution" icon={GraduationCap} label="Credits entered" value={plan.credits.length} />
          <MetricCard detail="Unique accepted course credits" icon={CheckCircle2} label="Accepted credits" value={result.acceptedCredits} />
          <MetricCard detail="Connected to modeled requirements" icon={Map} label="Applicable credits" value={result.applicableCredits} />
          <MetricCard detail="Accepted but not currently allocated" icon={Shapes} label="Elective credits" value={result.electiveCredits} />
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_0.8fr]">
          <section className="rounded-3xl border border-[var(--line)] bg-white p-6">
            <h2 className="text-lg font-extrabold text-[var(--brand-950)]">Recent changes</h2>
            <ol className="mt-4 divide-y divide-[var(--line)]">
              {plan.recentChanges.slice(0, 5).map((change) => <li className="flex gap-3 py-3 text-sm first:pt-0" key={change.id}><span className="mt-1.5 size-2 shrink-0 rounded-full bg-[var(--brand-500)]" /><div><p className="font-semibold text-[var(--brand-950)]">{change.description}</p><p className="mt-0.5 text-xs text-[var(--text-muted)]">{new Date(change.createdAt).toLocaleString()}</p></div></li>)}
            </ol>
          </section>
          <section className="rounded-3xl border border-[var(--line)] bg-white p-6">
            <h2 className="text-lg font-extrabold text-[var(--brand-950)]">Quick actions</h2>
            <div className="mt-4 grid gap-2">
              <Link className="dashboard-action" href="/plan/demo-plan/credits"><BookPlus aria-hidden="true" className="size-5" /><span><strong>Add or edit credit</strong><small>Update scores and courses</small></span><ArrowRight aria-hidden="true" className="ml-auto size-4" /></Link>
              <Link className="dashboard-action" href="/plan/demo-plan/map"><Map aria-hidden="true" className="size-5" /><span><strong>View degree map</strong><small>Inspect every requirement</small></span><ArrowRight aria-hidden="true" className="ml-auto size-4" /></Link>
              <Link className="dashboard-action" href="/compare"><GitCompareArrows aria-hidden="true" className="size-5" /><span><strong>Compare colleges</strong><small>Reuse the same credits</small></span><ArrowRight aria-hidden="true" className="ml-auto size-4" /></Link>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
