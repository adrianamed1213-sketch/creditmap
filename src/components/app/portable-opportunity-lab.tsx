"use client";

import {
  Ban,
  CheckCircle2,
  Copy,
  ExternalLink,
  FlaskConical,
  GitCompareArrows,
  Route,
  Shapes,
  ShieldCheck,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
  academicDataset,
  programForUniversity,
  verifiedUniversities,
} from "@/data/demo-data";
import { usePlan } from "@/features/plans/plan-provider";
import {
  compareExamOpportunity,
  type PortableOpportunityStatus,
} from "@/lib/academic-engine/portable-opportunity";

const targets = verifiedUniversities.map((university) => ({
  universityId: university.id,
  programId: programForUniversity(university.id).id,
}));

const targetIds = new Set(targets.map((target) => target.universityId));

const supportedExams = academicDataset.exams
  .filter((exam) =>
    academicDataset.equivalencies.some(
      (equivalency) =>
        targetIds.has(equivalency.universityId) &&
        equivalency.examId === exam.id &&
        equivalency.verification === "verified",
    ),
  )
  .sort(
    (a, b) =>
      a.sourceType.localeCompare(b.sourceType) || a.name.localeCompare(b.name),
  );

const statusDetails = {
  applicable: {
    label: "Degree applicable",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-800",
  },
  mixed: {
    label: "Applicable + elective",
    icon: Route,
    className: "bg-sky-50 text-sky-800",
  },
  elective: {
    label: "Elective only",
    icon: Shapes,
    className: "bg-violet-50 text-violet-800",
  },
  duplicate: {
    label: "Duplicate",
    icon: Copy,
    className: "bg-amber-50 text-amber-800",
  },
  no_match: {
    label: "No supported credit",
    icon: Ban,
    className: "bg-slate-100 text-slate-700",
  },
} satisfies Record<
  PortableOpportunityStatus,
  { label: string; icon: typeof CheckCircle2; className: string }
>;

function minimumPublishedScore(examId: string) {
  const scores = academicDataset.equivalencies
    .filter(
      (equivalency) =>
        targetIds.has(equivalency.universityId) &&
        equivalency.examId === examId &&
        equivalency.verification === "verified",
    )
    .map((equivalency) => equivalency.minimumScore);
  return scores.length > 0 ? Math.min(...scores) : 1;
}

function formatDelta(value: number, suffix = "") {
  return `${value > 0 ? "+" : ""}${value}${suffix}`;
}

export function PortableOpportunityLab() {
  const { plan } = usePlan();
  const initialExam =
    supportedExams.find((exam) => exam.id === "ap-macroeconomics") ??
    supportedExams[0]!;
  const [scenario, setScenario] = useState(() => ({
    examId: initialExam.id,
    score: minimumPublishedScore(initialExam.id),
  }));
  const exam =
    supportedExams.find((item) => item.id === scenario.examId) ?? initialExam;
  const score = Math.min(
    exam.scoreMax,
    Math.max(exam.scoreMin, scenario.score),
  );
  const comparison = useMemo(
    () =>
      compareExamOpportunity(
        plan,
        targets,
        exam.id,
        score,
        academicDataset,
      ),
    [exam.id, plan, score],
  );
  const bestUniversityNames = comparison.results
    .filter((result) =>
      comparison.bestUniversityIds.includes(result.university.id),
    )
    .map((result) => result.university.shortName)
    .join(", ");

  function selectExam(examId: string) {
    setScenario({ examId, score: minimumPublishedScore(examId) });
  }

  return (
    <section className="mt-8 overflow-hidden rounded-3xl border border-[var(--line)] bg-white shadow-[0_18px_50px_rgba(21,55,65,0.08)]">
      <div className="grid gap-7 bg-[var(--brand-950)] p-5 text-white sm:p-7 lg:grid-cols-[1fr_0.9fr] lg:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.08em] text-[var(--mint-300)] uppercase">
              <FlaskConical aria-hidden="true" className="size-4" />
              Portable opportunity lab
            </span>
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-[0.65rem] font-bold text-white/75 uppercase">
              Preview only
            </span>
          </div>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl">
            Test one exam across every verified college.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
            Keep the same plan, change one hypothetical score, and see where the resulting credit would add degree progress, remain elective, or duplicate something already earned.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_8rem]">
          <label>
            <span className="text-xs font-bold text-white/75">Exam opportunity</span>
            <select
              className="mt-2 min-h-12 w-full rounded-xl border border-white/15 bg-white px-3 text-sm font-bold text-[var(--brand-950)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--mint-300)]"
              onChange={(event) => selectExam(event.target.value)}
              value={exam.id}
            >
              {supportedExams.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-xs font-bold text-white/75">{exam.scoreLabel}</span>
            <input
              className="mt-2 min-h-12 w-full rounded-xl border border-white/15 bg-white px-3 text-sm font-bold text-[var(--brand-950)] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--mint-300)]"
              max={exam.scoreMax}
              min={exam.scoreMin}
              onChange={(event) =>
                setScenario({ examId: exam.id, score: Number(event.target.value) })
              }
              type="number"
              value={score}
            />
          </label>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        <div className="grid gap-3 sm:grid-cols-3">
          <article className="rounded-2xl bg-[var(--surface-subtle)] p-4">
            <p className="text-xs font-bold text-[var(--text-muted)]">Credit awarded</p>
            <p className="mt-1 text-2xl font-extrabold tracking-[-0.04em] text-[var(--brand-950)]">
              {comparison.acceptedUniversityCount} of {comparison.results.length}
            </p>
            <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">universities add unique credit</p>
          </article>
          <article className="rounded-2xl bg-[var(--surface-subtle)] p-4">
            <p className="text-xs font-bold text-[var(--text-muted)]">Degree progress</p>
            <p className="mt-1 text-2xl font-extrabold tracking-[-0.04em] text-[var(--brand-950)]">
              {comparison.applicableUniversityCount} of {comparison.results.length}
            </p>
            <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">universities connect it to modeled requirements</p>
          </article>
          <article className="rounded-2xl bg-[var(--mint-50)] p-4">
            <p className="text-xs font-bold text-[var(--brand-700)]">Largest modeled gain</p>
            <p className="mt-1 text-2xl font-extrabold tracking-[-0.04em] text-[var(--brand-950)]">
              {formatDelta(comparison.bestApplicableDelta)} credits
            </p>
            <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
              {bestUniversityNames || "No degree-credit gain at this score"}
            </p>
          </article>
        </div>

        <div className="mt-5 flex items-start gap-2 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sky-900">
          <GitCompareArrows aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p className="text-xs leading-5">
            {comparison.variesByUniversity
              ? "This opportunity changes by university. The cards below explain the equivalent, degree use, and source behind each result."
              : "This opportunity currently produces the same modeled result at all three universities."}
          </p>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {comparison.results.map((result) => {
            const details = statusDetails[result.status];
            const Icon = details.icon;
            const source = academicDataset.sources.find(
              (item) => item.id === result.sourceId,
            );
            const equivalent = result.projection.resolution.courses
              .map((course) => `${course.courseCode} (${course.credits})`)
              .join(", ");
            const requirementImpact = result.projection.impactedRequirements
              .slice(0, 2)
              .map((item) => item.requirement.title)
              .join(" · ");

            return (
              <article
                className="rounded-2xl border border-[var(--line)] p-5"
                key={result.university.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-extrabold tracking-[0.08em] text-[var(--brand-700)] uppercase">
                      {result.university.shortName}
                    </p>
                    <h3 className="mt-1 font-extrabold text-[var(--brand-950)]">
                      {result.university.name}
                    </h3>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-extrabold uppercase ${details.className}`}
                  >
                    <Icon aria-hidden="true" className="size-3.5" />
                    {details.label}
                  </span>
                </div>

                <dl className="mt-5 grid grid-cols-3 divide-x divide-[var(--line)] rounded-xl bg-[var(--surface-subtle)] py-3 text-center">
                  <div className="px-2">
                    <dt className="text-[0.6rem] font-semibold text-[var(--text-muted)]">Accepted</dt>
                    <dd className="mt-1 text-lg font-extrabold text-[var(--brand-950)]">
                      {formatDelta(result.projection.deltas.acceptedCredits)}
                    </dd>
                  </div>
                  <div className="px-2">
                    <dt className="text-[0.6rem] font-semibold text-[var(--text-muted)]">Applicable</dt>
                    <dd className="mt-1 text-lg font-extrabold text-[var(--brand-950)]">
                      {formatDelta(result.projection.deltas.applicableCredits)}
                    </dd>
                  </div>
                  <div className="px-2">
                    <dt className="text-[0.6rem] font-semibold text-[var(--text-muted)]">Progress</dt>
                    <dd className="mt-1 text-lg font-extrabold text-[var(--brand-950)]">
                      {formatDelta(result.projection.deltas.progressPercent, "%")}
                    </dd>
                  </div>
                </dl>

                <div className="mt-4 space-y-3 text-xs leading-5">
                  <div>
                    <p className="font-bold text-[var(--brand-950)]">University equivalent</p>
                    <p className="mt-0.5 text-[var(--text-muted)]">
                      {equivalent || result.projection.resolution.note}
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-[var(--brand-950)]">Requirement impact</p>
                    <p className="mt-0.5 text-[var(--text-muted)]">
                      {requirementImpact ||
                        (result.status === "duplicate"
                          ? "Existing credit already covers this equivalent."
                          : "No modeled requirement changes at this score.")}
                    </p>
                  </div>
                </div>

                {source?.url.startsWith("http") && (
                  <a
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--brand-700)] hover:underline"
                    href={source.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Official evidence
                    <ExternalLink aria-hidden="true" className="size-3.5" />
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2 border-t border-[var(--line)] bg-[var(--surface-subtle)] px-5 py-3 text-xs leading-5 text-[var(--text-muted)] sm:px-7">
        <ShieldCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-[var(--brand-700)]" />
        This compares degree-credit effects only. It is not a ranking of college quality, admissions, affordability, or personal fit.
      </div>
    </section>
  );
}
