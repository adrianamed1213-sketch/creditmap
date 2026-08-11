import { calculatePlan, normalizeCourseCode } from "./engine";
import type {
  AcademicDataset,
  PlanResult,
  ResolvedCourse,
  StudentCredit,
  StudentPlan,
} from "./types";

export type ComparisonTarget = {
  universityId: string;
  programId: string;
};

export type CreditOutcomeStatus =
  | "applicable"
  | "mixed"
  | "elective"
  | "duplicate"
  | "no_match"
  | "verification_required";

export type CreditComparisonOutcome = {
  universityId: string;
  universityName: string;
  universityShortName: string;
  status: CreditOutcomeStatus;
  courses: ResolvedCourse[];
  acceptedCredits: number;
  applicableCredits: number;
  electiveCredits: number;
  duplicateCredits: number;
  note: string;
  sourceIds: string[];
};

export type CreditComparisonRow = {
  credit: StudentCredit;
  outcomes: CreditComparisonOutcome[];
  variesByUniversity: boolean;
};

export type CreditPortabilityComparison = {
  results: PlanResult[];
  rows: CreditComparisonRow[];
  portableCount: number;
  variesCount: number;
  verificationCount: number;
};

function courseKey(course: ResolvedCourse) {
  return `${course.sourceCreditId}:${normalizeCourseCode(course.courseCode)}`;
}

function uniqueCourses(courses: ResolvedCourse[]) {
  return [
    ...new Map(courses.map((course) => [courseKey(course), course])).values(),
  ];
}

function classifyOutcome(
  verificationRequired: boolean,
  canonicalCourses: ResolvedCourse[],
  applicableCredits: number,
  electiveCredits: number,
  duplicateCredits: number,
): CreditOutcomeStatus {
  if (verificationRequired) return "verification_required";
  if (applicableCredits > 0 && electiveCredits > 0) return "mixed";
  if (duplicateCredits > 0 && canonicalCourses.length > 0) return "mixed";
  if (applicableCredits > 0) return "applicable";
  if (electiveCredits > 0) return "elective";
  if (duplicateCredits > 0 && canonicalCourses.length === 0) return "duplicate";
  return "no_match";
}

export function creditOutcomeForResult(
  credit: StudentCredit,
  result: PlanResult,
  dataset: AcademicDataset,
): CreditComparisonOutcome {
  const resolved = result.resolvedCredits.find((item) => item.credit.id === credit.id);
  if (!resolved) {
    throw new Error(`Credit ${credit.id} is missing from a comparison result.`);
  }

  const canonicalCourses = resolved.courses.filter(
    (course) => !course.duplicateOfCreditId,
  );
  const matchedCourses = uniqueCourses(
    result.requirementResults.flatMap((requirement) =>
      requirement.matchedCourses.filter(
        (course) => course.sourceCreditId === credit.id,
      ),
    ),
  );
  const matchedKeys = new Set(matchedCourses.map(courseKey));
  const applicableCredits = matchedCourses.reduce(
    (total, course) => total + course.credits,
    0,
  );
  const electiveCredits = canonicalCourses
    .filter((course) => !matchedKeys.has(courseKey(course)))
    .reduce((total, course) => total + course.credits, 0);
  const duplicateCredits = resolved.courses
    .filter((course) => course.duplicateOfCreditId)
    .reduce((total, course) => total + course.credits, 0);
  const fallbackSourceId =
    credit.kind === "exam"
      ? dataset.equivalencies.find(
          (equivalency) =>
            equivalency.universityId === result.university.id &&
            equivalency.examId === credit.examId,
        )?.sourceId
      : undefined;
  const sourceIds = [
    ...new Set([
      ...resolved.courses.map((course) => course.sourceId),
      ...(fallbackSourceId ? [fallbackSourceId] : []),
    ]),
  ];

  return {
    universityId: result.university.id,
    universityName: result.university.name,
    universityShortName: result.university.shortName,
    status: classifyOutcome(
      resolved.verification === "verification_required",
      canonicalCourses,
      applicableCredits,
      electiveCredits,
      duplicateCredits,
    ),
    courses: resolved.courses,
    acceptedCredits: resolved.acceptedCredits,
    applicableCredits,
    electiveCredits,
    duplicateCredits,
    note: resolved.note,
    sourceIds,
  };
}

function outcomeSignature(outcome: CreditComparisonOutcome) {
  const courses = outcome.courses
    .map((course) => normalizeCourseCode(course.courseCode))
    .sort()
    .join(",");
  return [
    outcome.status,
    courses,
    outcome.acceptedCredits,
    outcome.applicableCredits,
    outcome.electiveCredits,
    outcome.duplicateCredits,
  ].join(":");
}

export function buildCreditPortabilityComparison(
  plan: StudentPlan,
  targets: ComparisonTarget[],
  dataset: AcademicDataset,
): CreditPortabilityComparison {
  if (targets.length < 2) {
    throw new Error("Credit portability requires at least two university targets.");
  }

  const results = targets.map((target) =>
    calculatePlan(
      {
        ...plan,
        universityId: target.universityId,
        programId: target.programId,
      },
      dataset,
    ),
  );
  const rows = plan.credits.map((credit) => {
    const outcomes = results.map((result) =>
      creditOutcomeForResult(credit, result, dataset),
    );
    return {
      credit,
      outcomes,
      variesByUniversity: new Set(outcomes.map(outcomeSignature)).size > 1,
    };
  });

  return {
    results,
    rows,
    portableCount: rows.filter((row) =>
      row.outcomes.every((outcome) =>
        outcome.status === "applicable" || outcome.status === "mixed",
      ),
    ).length,
    variesCount: rows.filter((row) => row.variesByUniversity).length,
    verificationCount: rows.filter((row) =>
      row.outcomes.some((outcome) => outcome.status === "verification_required"),
    ).length,
  };
}
