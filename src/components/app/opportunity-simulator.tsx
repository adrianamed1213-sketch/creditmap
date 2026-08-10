"use client";

import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FlaskConical,
  GitBranch,
  Plus,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { useMemo, useState } from "react";

import { academicDataset } from "@/data/demo-data";
import { createCreditId, usePlan } from "@/features/plans/plan-provider";
import { simulateExamOpportunity } from "@/lib/academic-engine/simulator";

function formatDelta(value: number, suffix = "") {
  return `${value > 0 ? "+" : ""}${value}${suffix}`;
}

function statusLabel(value: string) {
  return value.replaceAll("_", " ");
}

export function OpportunitySimulator() {
  const { addCredit, plan, result } = usePlan();
  const firstRecommendation = result.recommendations[0];
  const [scenario, setScenario] = useState(() => ({
    recommendationId: firstRecommendation?.id ?? "",
    score: firstRecommendation?.minimumScore ?? 1,
  }));
  const recommendation =
    result.recommendations.find((item) => item.id === scenario.recommendationId) ??
    firstRecommendation;

  const simulatedScore = recommendation
    ? scenario.recommendationId === recommendation.id
      ? Math.min(
          recommendation.exam.scoreMax,
          Math.max(recommendation.exam.scoreMin, scenario.score),
        )
      : recommendation.minimumScore
    : 1;

  const projection = useMemo(
    () =>
      recommendation
        ? simulateExamOpportunity(
            plan,
            recommendation.exam.id,
            simulatedScore,
            academicDataset,
          )
        : null,
    [plan, recommendation, simulatedScore],
  );

  if (!recommendation || !projection) return null;

  const source = academicDataset.sources.find(
    (item) => item.id === projection.resolution.courses[0]?.sourceId,
  );
  const duplicateCredit = plan.credits.find(
    (credit) => credit.id === projection.resolution.duplicateOfCreditId,
  );
  const canAdd =
    projection.resolution.courses.length > 0 &&
    !projection.resolution.duplicateOfCreditId;

  function selectRecommendation(recommendationId: string) {
    const next = result.recommendations.find((item) => item.id === recommendationId);
    if (!next) return;
    setScenario({ recommendationId, score: next.minimumScore });
  }

  function addExpectedCredit() {
    if (!canAdd || !projection) return;
    addCredit({
      ...projection.hypotheticalCredit,
      id: createCreditId("expected-exam"),
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <section className="mt-8 overflow-hidden rounded-3xl bg-[var(--brand-950)] text-white shadow-[0_24px_70px_rgba(21,55,65,0.16)]">
      <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.08em] text-[var(--mint-300)] uppercase">
              <FlaskConical aria-hidden="true" className="size-4" />
              Opportunity Simulator
            </span>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[0.65rem] font-bold text-white/75 uppercase">
              Preview only
            </span>
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em]">
            What could one more exam change?
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/70">
            Try a score without changing your saved plan. CreditMap reruns the same equivalency, duplicate, and degree-rule engine used everywhere else.
          </p>

          <div className="mt-6 grid gap-4">
            <label>
              <span className="text-xs font-bold text-white/75">Opportunity</span>
              <select
                className="mt-2 min-h-12 w-full rounded-xl border border-white/15 bg-white px-3 text-sm font-bold text-[var(--brand-950)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--mint-300)]"
                onChange={(event) => selectRecommendation(event.target.value)}
                value={recommendation.id}
              >
                {result.recommendations.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.exam.name} → {item.requirementTitle}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="flex items-center justify-between gap-3 text-xs font-bold text-white/75">
                Hypothetical {recommendation.exam.scoreLabel.toLowerCase()}
                <span>Published minimum: {recommendation.minimumScore}</span>
              </span>
              <input
                className="mt-2 min-h-12 w-full rounded-xl border border-white/15 bg-white px-3 text-sm font-bold text-[var(--brand-950)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--mint-300)]"
                max={recommendation.exam.scoreMax}
                min={recommendation.exam.scoreMin}
                onChange={(event) =>
                  setScenario({
                    recommendationId: recommendation.id,
                    score: Number(event.target.value),
                  })
                }
                type="number"
                value={simulatedScore}
              />
            </label>
          </div>

          <button
            className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-extrabold text-[var(--brand-950)] transition-colors hover:bg-[var(--mint-50)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--mint-300)] disabled:cursor-not-allowed disabled:opacity-55"
            disabled={!canAdd}
            onClick={addExpectedCredit}
            type="button"
          >
            <Plus aria-hidden="true" className="size-4" />
            {projection.resolution.duplicateOfCreditId
              ? "Already covered by another credit"
              : projection.resolution.courses.length === 0
                ? "Score does not earn supported credit"
                : "Add to plan as expected credit"}
          </button>
        </div>

        <div className="rounded-2xl bg-white p-5 text-[var(--brand-950)] sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.08em] text-[var(--brand-700)] uppercase">Projected outcome</p>
              <h3 className="mt-1 text-2xl font-extrabold tracking-[-0.04em]">
                {result.progressPercent}% <ArrowRight aria-hidden="true" className="inline size-5 text-[var(--brand-500)]" /> {projection.projected.progressPercent}%
              </h3>
            </div>
            <span className="rounded-full bg-[var(--mint-50)] px-3 py-1.5 text-xs font-extrabold text-[var(--brand-700)]">
              {formatDelta(projection.deltas.progressPercent, "%")}
            </span>
          </div>

          <dl className="mt-5 grid grid-cols-3 divide-x divide-[var(--line)] rounded-2xl bg-[var(--surface-subtle)] py-4 text-center">
            <div className="px-2">
              <dt className="text-[0.65rem] font-semibold text-[var(--text-muted)]">Applicable</dt>
              <dd className="mt-1 text-lg font-extrabold">{formatDelta(projection.deltas.applicableCredits)}</dd>
            </div>
            <div className="px-2">
              <dt className="text-[0.65rem] font-semibold text-[var(--text-muted)]">Accepted</dt>
              <dd className="mt-1 text-lg font-extrabold">{formatDelta(projection.deltas.acceptedCredits)}</dd>
            </div>
            <div className="px-2">
              <dt className="text-[0.65rem] font-semibold text-[var(--text-muted)]">Requirements</dt>
              <dd className="mt-1 text-lg font-extrabold">{projection.impactedRequirements.length}</dd>
            </div>
          </dl>

          <ol className="mt-5 space-y-3" aria-label="Opportunity calculation trace">
            <li className="flex gap-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[var(--mint-50)] text-xs font-extrabold text-[var(--brand-700)]">1</span>
              <div><p className="text-sm font-bold">Input</p><p className="mt-0.5 text-xs leading-5 text-[var(--text-muted)]">{recommendation.exam.name}, score {simulatedScore}</p></div>
            </li>
            <li className="flex gap-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[var(--mint-50)] text-xs font-extrabold text-[var(--brand-700)]">2</span>
              <div><p className="text-sm font-bold">University equivalent</p><p className="mt-0.5 text-xs leading-5 text-[var(--text-muted)]">{projection.resolution.courses.length > 0 ? projection.resolution.courses.map((course) => `${course.courseCode} (${course.credits})`).join(", ") : projection.resolution.note}</p></div>
            </li>
            <li className="flex gap-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[var(--mint-50)] text-xs font-extrabold text-[var(--brand-700)]">3</span>
              <div><p className="text-sm font-bold">Requirement impact</p><p className="mt-0.5 text-xs leading-5 text-[var(--text-muted)]">{projection.impactedRequirements.length > 0 ? projection.impactedRequirements.map((item) => `${item.requirement.title}: ${statusLabel(item.status)}`).join(" · ") : "No modeled requirement changes at this score."}</p></div>
            </li>
          </ol>

          {duplicateCredit ? (
            <div className="mt-5 flex gap-2 rounded-xl border border-[var(--warning-line)] bg-[var(--warning-soft)] p-3 text-[var(--warning-strong)]">
              <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <p className="text-xs leading-5">Duplicate detected: this opportunity overlaps <strong>{duplicateCredit.label}</strong>, so projected credit does not increase.</p>
            </div>
          ) : projection.resolution.courses.length === 0 ? (
            <div className="mt-5 flex gap-2 rounded-xl border border-[var(--warning-line)] bg-[var(--warning-soft)] p-3 text-[var(--warning-strong)]">
              <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <p className="text-xs leading-5">This score is below the supported published threshold, so no course credit or degree progress is projected.</p>
            </div>
          ) : (
            <div className="mt-5 flex gap-2 rounded-xl bg-emerald-50 p-3 text-emerald-800">
              <CheckCircle2 aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
              <p className="text-xs leading-5">No duplicate conflict was found for the projected equivalent.</p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--text-muted)]"><GitBranch aria-hidden="true" className="size-3.5" />Deterministic preview</span>
            {source?.url.startsWith("http") && (
              <a className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--brand-700)] hover:underline" href={source.url} rel="noreferrer" target="_blank">Official source<ExternalLink aria-hidden="true" className="size-3.5" /></a>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-2 border-t border-white/10 bg-white/5 px-5 py-3 text-xs leading-5 text-white/65 sm:px-8">
        <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--mint-300)]" />
        This scenario is a planning estimate. Adding it records an expected credit; it does not claim the exam has been taken or officially awarded.
      </div>
    </section>
  );
}
