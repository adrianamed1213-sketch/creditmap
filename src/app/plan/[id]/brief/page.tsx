"use client";

import {
  AlertTriangle,
  BookOpenCheck,
  CheckCircle2,
  CircleDotDashed,
  ExternalLink,
  FileCheck2,
  Lightbulb,
  Printer,
  ShieldCheck,
} from "lucide-react";

import { PageHeading } from "@/components/app/page-heading";
import { CreditMapLogo } from "@/components/brand/creditmap-logo";
import { academicDataset } from "@/data/demo-data";
import { usePlan } from "@/features/plans/plan-provider";
import {
  briefOutcomeLabels,
  buildPlanBrief,
} from "@/lib/academic-engine/brief";
import type { CreditOutcomeStatus } from "@/lib/academic-engine/comparison";
import type { StudentCredit } from "@/lib/academic-engine/types";
import { product } from "@/lib/product";

const outcomeStyles: Record<CreditOutcomeStatus, string> = {
  applicable: "bg-emerald-50 text-emerald-700",
  mixed: "bg-sky-50 text-sky-700",
  elective: "bg-violet-50 text-violet-700",
  duplicate: "bg-amber-50 text-amber-800",
  no_match: "bg-slate-100 text-slate-700",
  verification_required: "bg-[var(--warning-soft)] text-[var(--warning-strong)]",
};

const requirementLabels = {
  completed: "Completed",
  in_progress: "In progress",
  remaining: "Remaining",
  verification_required: "Verify",
} as const;

function creditDetail(credit: StudentCredit) {
  return credit.kind === "exam"
    ? `${credit.sourceType} · score ${credit.score}`
    : `${credit.courseCode} · ${credit.credits} credits · grade ${credit.grade}`;
}

function stableDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(value));
}

export default function PlanBriefPage() {
  const { result } = usePlan();
  const brief = buildPlanBrief(result, academicDataset);
  const requirementGroups = new Map<string, typeof brief.requirements>();

  brief.requirements.forEach((requirement) => {
    const group = requirement.requirement.groupLabel;
    requirementGroups.set(group, [
      ...(requirementGroups.get(group) ?? []),
      requirement,
    ]);
  });

  return (
    <section className="print-page page-shell py-10 sm:py-14">
      <div className="print-hidden">
        <PageHeading
          eyebrow="Plan brief"
          title="A clear handoff for a counselor conversation"
          description="Print this evidence-linked summary or use your browser's Save as PDF option. It reflects the current local plan without exposing private student records."
          action={
            <button
              className="primary-button w-full sm:w-auto"
              onClick={() => window.print()}
              type="button"
            >
              <Printer aria-hidden="true" className="size-4" />
              Print or save PDF
            </button>
          }
        />
      </div>

      <article className="print-report mt-8 overflow-hidden rounded-3xl border border-[var(--line)] bg-white shadow-[0_22px_60px_rgba(21,55,65,0.08)]">
        <header className="border-b border-[var(--line)] p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CreditMapLogo />
              <p className="mt-6 text-xs font-bold tracking-[0.09em] text-[var(--brand-700)] uppercase">
                Student planning brief
              </p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.045em] text-[var(--brand-950)] sm:text-4xl">
                {brief.planName}
              </h1>
              <p className="mt-2 font-bold text-[var(--brand-950)]">
                {brief.universityName} · {brief.programName}
              </p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Catalog: {brief.catalogYear} · Plan updated {stableDate(brief.updatedAt)}
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--mint-50)] px-3 py-2 text-xs font-extrabold text-[var(--brand-700)] uppercase">
              <ShieldCheck aria-hidden="true" className="size-4" />
              Planning estimate
            </span>
          </div>

          <dl className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-[var(--line)] sm:grid-cols-4">
            {[
              ["Degree progress", `${brief.metrics.progressPercent}%`],
              ["Accepted", brief.metrics.acceptedCredits],
              ["Degree applicable", brief.metrics.applicableCredits],
              ["Elective", brief.metrics.electiveCredits],
            ].map(([label, value]) => (
              <div className="bg-[var(--surface-subtle)] p-4" key={label}>
                <dt className="text-[0.68rem] font-bold text-[var(--text-muted)] uppercase">{label}</dt>
                <dd className="mt-1 text-2xl font-extrabold text-[var(--brand-950)]">{value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <div className="space-y-9 p-6 sm:p-8">
          <section className="print-avoid-break">
            <div className="flex items-center gap-2">
              <FileCheck2 aria-hidden="true" className="size-5 text-[var(--brand-700)]" />
              <h2 className="text-xl font-extrabold tracking-[-0.03em] text-[var(--brand-950)]">Decision signals</h2>
            </div>
            {brief.warnings.length > 0 ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {brief.warnings.map((warning) => (
                  <div className="rounded-2xl border border-[var(--warning-line)] bg-[var(--warning-soft)] p-4" key={warning.id}>
                    <div className="flex items-center gap-2 text-[var(--warning-strong)]">
                      <AlertTriangle aria-hidden="true" className="size-4 shrink-0" />
                      <h3 className="text-sm font-extrabold">{warning.title}</h3>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-[var(--warning-strong)]">{warning.detail}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 flex gap-2 rounded-2xl bg-emerald-50 p-4 text-emerald-800">
                <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                <p className="text-sm">No duplicate, expected-credit, or record-verification flags appear in the current modeled inputs.</p>
              </div>
            )}
          </section>

          <section>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold tracking-[0.08em] text-[var(--brand-700)] uppercase">Entered credit</p>
                <h2 className="mt-1 text-xl font-extrabold tracking-[-0.03em] text-[var(--brand-950)]">Outcome by input</h2>
              </div>
              <p className="text-xs font-semibold text-[var(--text-muted)]">{brief.metrics.creditsEntered} inputs · duplicates counted once</p>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {brief.creditOutcomes.map(({ credit, outcome }) => {
                const requirementTitles = brief.requirements
                  .filter((requirement) =>
                    requirement.matchedCourses.some(
                      (course) => course.sourceCreditId === credit.id,
                    ),
                  )
                  .map((requirement) => requirement.requirement.title);
                return (
                  <article className="print-avoid-break rounded-2xl border border-[var(--line)] p-4" key={credit.id}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-extrabold text-[var(--brand-950)]">{credit.label}</h3>
                        <p className="mt-1 text-xs text-[var(--text-muted)]">{creditDetail(credit)} · {credit.status}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-[0.62rem] font-extrabold uppercase ${outcomeStyles[outcome.status]}`}>
                        {briefOutcomeLabels[outcome.status]}
                      </span>
                    </div>
                    <div className="mt-3 rounded-xl bg-[var(--surface-subtle)] p-3">
                      <p className="text-xs font-bold text-[var(--brand-950)]">
                        {outcome.courses.length > 0
                          ? outcome.courses.map((course) => `${course.courseCode} (${course.credits})`).join(" + ")
                          : "No verified course equivalent shown"}
                      </p>
                      {requirementTitles.length > 0 && (
                        <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">Connects to: {requirementTitles.join(" · ")}</p>
                      )}
                    </div>
                    <p className="mt-3 text-xs leading-5 text-[var(--text-muted)]">{outcome.note}</p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="print-avoid-break rounded-2xl bg-[var(--brand-950)] p-5 text-white sm:p-6">
            <div className="flex gap-3">
              <Lightbulb aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[var(--mint-300)]" />
              <div>
                <p className="text-xs font-bold tracking-[0.08em] text-[var(--mint-300)] uppercase">Possible next credit</p>
                {brief.nextOpportunity ? (
                  <>
                    <h2 className="mt-1 text-xl font-extrabold">{brief.nextOpportunity.exam.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-white/75">
                      A score of {brief.nextOpportunity.minimumScore}+ may produce {brief.nextOpportunity.courses.map((course) => course.courseCode).join(", ")} and connect to {brief.nextOpportunity.requirementTitle}.
                    </p>
                  </>
                ) : (
                  <p className="mt-2 text-sm text-white/75">No additional supported exam currently connects directly to a remaining modeled requirement.</p>
                )}
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2">
              <BookOpenCheck aria-hidden="true" className="size-5 text-[var(--brand-700)]" />
              <h2 className="text-xl font-extrabold tracking-[-0.03em] text-[var(--brand-950)]">Requirements at a glance</h2>
            </div>
            <div className="mt-4 space-y-5">
              {[...requirementGroups.entries()].map(([group, requirements]) => (
                <section className="print-avoid-break" key={group}>
                  <h3 className="text-sm font-extrabold text-[var(--brand-950)]">{group}</h3>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {requirements.map((requirement) => (
                      <div className="flex items-start gap-2 rounded-xl border border-[var(--line)] p-3" key={requirement.requirement.id}>
                        {requirement.status === "completed" ? (
                          <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-emerald-700" />
                        ) : (
                          <CircleDotDashed aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--text-muted)]" />
                        )}
                        <div>
                          <p className="text-xs font-bold text-[var(--brand-950)]">{requirement.requirement.title}</p>
                          <p className="mt-1 text-[0.68rem] leading-4 text-[var(--text-muted)]">
                            {requirementLabels[requirement.status]} · {requirement.appliedCredits}/{requirement.requirement.credits} credits
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>

          <section className="print-avoid-break">
            <h2 className="text-xl font-extrabold tracking-[-0.03em] text-[var(--brand-950)]">Evidence used</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {brief.sources.map((source) => (
                <li className="rounded-xl border border-[var(--line)] p-3" key={source.id}>
                  <a className="inline-flex items-start gap-1.5 text-xs font-bold leading-5 text-[var(--brand-700)] hover:underline" href={source.url} rel="noreferrer" target="_blank">
                    {source.title}
                    <ExternalLink aria-hidden="true" className="mt-1 size-3 shrink-0" />
                  </a>
                  <p className="mt-1 text-[0.68rem] text-[var(--text-muted)]">{source.academicYear} · checked {source.checkedAt}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="print-avoid-break flex gap-3 border-t border-[var(--line)] pt-6">
            <ShieldCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-[var(--brand-700)]" />
            <div>
              <h2 className="text-sm font-extrabold text-[var(--brand-950)]">Scope and caution</h2>
              <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{product.disclaimer} This brief is generated from the current plan and does not modify or certify the student record.</p>
            </div>
          </section>
        </div>
      </article>
    </section>
  );
}
