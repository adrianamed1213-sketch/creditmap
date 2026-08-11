import { creditOutcomeForResult } from "./comparison";
import type {
  CreditComparisonOutcome,
  CreditOutcomeStatus,
} from "./comparison";
import type {
  AcademicDataset,
  AcademicSource,
  PlanResult,
  Recommendation,
  RequirementResult,
  StudentCredit,
} from "./types";

export type PlanBriefWarning = {
  id: "duplicates" | "verification" | "expected";
  title: string;
  detail: string;
};

export type PlanBriefCreditOutcome = {
  credit: StudentCredit;
  outcome: CreditComparisonOutcome;
};

export type PlanBrief = {
  planName: string;
  universityName: string;
  universityShortName: string;
  programName: string;
  catalogYear: string;
  updatedAt: string;
  metrics: {
    creditsEntered: number;
    acceptedCredits: number;
    applicableCredits: number;
    electiveCredits: number;
    duplicateCredits: number;
    progressPercent: number;
  };
  creditOutcomes: PlanBriefCreditOutcome[];
  requirements: RequirementResult[];
  nextOpportunity: Recommendation | null;
  warnings: PlanBriefWarning[];
  sources: AcademicSource[];
};

export const briefOutcomeLabels: Record<CreditOutcomeStatus, string> = {
  applicable: "Applies to degree",
  mixed: "Partly applies",
  elective: "Elective only",
  duplicate: "Duplicate",
  no_match: "No supported credit",
  verification_required: "Verification required",
};

export function buildPlanBrief(
  result: PlanResult,
  dataset: AcademicDataset,
): PlanBrief {
  const creditOutcomes = result.plan.credits.map((credit) => ({
    credit,
    outcome: creditOutcomeForResult(credit, result, dataset),
  }));
  const verificationCount = creditOutcomes.filter(
    (item) => item.outcome.status === "verification_required",
  ).length;
  const expectedCount = result.plan.credits.filter(
    (credit) => credit.status === "expected",
  ).length;
  const warnings: PlanBriefWarning[] = [];

  if (result.duplicateCredits > 0) {
    warnings.push({
      id: "duplicates",
      title: "Overlapping credit excluded",
      detail: `${result.duplicateCredits} course credits overlap another input and are not counted twice.`,
    });
  }
  if (verificationCount > 0) {
    warnings.push({
      id: "verification",
      title: "University review needed",
      detail: `${verificationCount} ${verificationCount === 1 ? "input requires" : "inputs require"} official transfer or record-level review.`,
    });
  }
  if (expectedCount > 0) {
    warnings.push({
      id: "expected",
      title: "Expected credit included",
      detail: `${expectedCount} ${expectedCount === 1 ? "input is" : "inputs are"} planned rather than already earned.`,
    });
  }

  const sourceIds = new Set<string>([
    result.program.sourceId,
    ...result.requirementResults.map((item) => item.requirement.sourceId),
    ...result.resolvedCredits.flatMap((item) =>
      item.courses.map((course) => course.sourceId),
    ),
    ...(result.recommendations[0] ? [result.recommendations[0].sourceId] : []),
  ]);

  return {
    planName: result.plan.profileName,
    universityName: result.university.name,
    universityShortName: result.university.shortName,
    programName: result.program.name,
    catalogYear: result.program.catalogYear,
    updatedAt: result.plan.updatedAt,
    metrics: {
      creditsEntered: result.plan.credits.length,
      acceptedCredits: result.acceptedCredits,
      applicableCredits: result.applicableCredits,
      electiveCredits: result.electiveCredits,
      duplicateCredits: result.duplicateCredits,
      progressPercent: result.progressPercent,
    },
    creditOutcomes,
    requirements: result.requirementResults,
    nextOpportunity: result.recommendations[0] ?? null,
    warnings,
    sources: dataset.sources.filter((source) => sourceIds.has(source.id)),
  };
}
