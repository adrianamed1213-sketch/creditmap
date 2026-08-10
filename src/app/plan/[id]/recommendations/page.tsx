"use client";

import { ArrowRight, BookOpenCheck, ExternalLink, Lightbulb, SearchX, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/app/empty-state";
import { PageHeading } from "@/components/app/page-heading";
import { usePlan } from "@/features/plans/plan-provider";

export default function RecommendationsPage() {
  const { result } = usePlan();

  return (
    <section className="page-shell py-10 sm:py-14">
      <PageHeading eyebrow="What should I take next?" title="Options connected to what remains" description="CreditMap ranks only supported demo options that produce a course used by an incomplete modeled requirement." />

      <div className="mt-7 flex gap-3 rounded-2xl border border-[var(--mint-200)] bg-[var(--mint-50)] p-4">
        <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[var(--brand-700)]" />
        <p className="text-sm leading-6 text-[var(--text-muted)]"><strong className="text-[var(--brand-950)]">Explainable ranking:</strong> direct requirement matches rank first, then potential applicable credits. Difficulty is not estimated.</p>
      </div>

      {result.recommendations.length === 0 ? (
        <div className="mt-8"><EmptyState icon={SearchX} title="No direct options found" description="We haven’t found another supported exam that directly matches your remaining modeled requirements." /></div>
      ) : (
        <div className="mt-8 grid gap-4 lg:grid-cols-2">
          {result.recommendations.map((recommendation, index) => (
            <article className="rounded-3xl border border-[var(--line)] bg-white p-5 sm:p-6" key={recommendation.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="grid size-11 place-items-center rounded-2xl bg-[var(--mint-50)] text-[var(--brand-700)]"><Lightbulb aria-hidden="true" className="size-5" /></div>
                <span className="text-xs font-extrabold tracking-[0.08em] text-[var(--line-strong)]">#{index + 1}</span>
              </div>
              <p className="mt-5 text-xs font-bold tracking-[0.07em] text-[var(--brand-700)] uppercase">Possible next credit</p>
              <h2 className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-[var(--brand-950)]">{recommendation.exam.name}</h2>
              <dl className="mt-5 grid grid-cols-2 gap-4 rounded-2xl bg-[var(--surface-subtle)] p-4 text-sm">
                <div><dt className="text-xs font-semibold text-[var(--text-muted)]">Illustrative score</dt><dd className="mt-1 font-extrabold text-[var(--brand-950)]">{recommendation.minimumScore}+</dd></div>
                <div><dt className="text-xs font-semibold text-[var(--text-muted)]">Potential credits</dt><dd className="mt-1 font-extrabold text-[var(--brand-950)]">{recommendation.potentialCredits}</dd></div>
                <div className="col-span-2"><dt className="text-xs font-semibold text-[var(--text-muted)]">Potential equivalent</dt><dd className="mt-1 font-bold text-[var(--brand-950)]">{recommendation.courses.map((course) => course.courseCode).join(", ")}</dd></div>
              </dl>
              <div className="mt-4 flex gap-2"><BookOpenCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--brand-700)]" /><p className="text-sm leading-6 text-[var(--text-muted)]">Could satisfy: <strong className="text-[var(--brand-950)]">{recommendation.requirementTitle}</strong></p></div>
              <p className="mt-3 text-xs leading-5 text-[var(--text-muted)]">{recommendation.reason}</p>
              <Link className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--brand-700)] hover:underline" href="/about#methodology">View demo source <ExternalLink aria-hidden="true" className="size-3" /></Link>
            </article>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-end"><Link className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[var(--brand-900)] px-4 text-sm font-bold text-white hover:bg-[var(--brand-800)]" href="/compare">Compare colleges<ArrowRight aria-hidden="true" className="size-4" /></Link></div>
    </section>
  );
}
