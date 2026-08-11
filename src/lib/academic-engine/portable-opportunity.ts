import { simulateExamOpportunity, type OpportunityProjection } from "./simulator";
import type {
  AcademicDataset,
  Exam,
  Program,
  StudentPlan,
  University,
} from "./types";

export type PortableOpportunityTarget = {
  universityId: string;
  programId: string;
};

export type PortableOpportunityStatus =
  | "applicable"
  | "mixed"
  | "elective"
  | "duplicate"
  | "no_match";

export type PortableOpportunityResult = {
  university: University;
  program: Program;
  projection: OpportunityProjection;
  status: PortableOpportunityStatus;
  sourceId?: string;
};

export type PortableOpportunityComparison = {
  exam: Exam;
  score: number;
  results: PortableOpportunityResult[];
  acceptedUniversityCount: number;
  applicableUniversityCount: number;
  bestApplicableDelta: number;
  bestUniversityIds: string[];
  variesByUniversity: boolean;
};

function classifyProjection(
  projection: OpportunityProjection,
): PortableOpportunityStatus {
  if (projection.resolution.duplicateOfCreditId) return "duplicate";
  if (projection.resolution.courses.length === 0) return "no_match";
  if (
    projection.deltas.applicableCredits > 0 &&
    projection.deltas.electiveCredits > 0
  ) {
    return "mixed";
  }
  if (projection.deltas.applicableCredits > 0) return "applicable";
  return "elective";
}

function resultSignature(result: PortableOpportunityResult) {
  return [
    result.status,
    result.projection.resolution.courses
      .map((course) => course.courseCode)
      .sort()
      .join(","),
    result.projection.deltas.acceptedCredits,
    result.projection.deltas.applicableCredits,
    result.projection.deltas.electiveCredits,
    result.projection.deltas.progressPercent,
  ].join(":");
}

export function compareExamOpportunity(
  plan: StudentPlan,
  targets: PortableOpportunityTarget[],
  examId: string,
  score: number,
  dataset: AcademicDataset,
): PortableOpportunityComparison {
  if (targets.length < 2) {
    throw new Error("Portable opportunity comparison requires at least two targets.");
  }
  const exam = dataset.exams.find((item) => item.id === examId);
  if (!exam) throw new Error("The selected exam is not available.");

  const results = targets.map((target) => {
    const university = dataset.universities.find(
      (item) => item.id === target.universityId,
    );
    const program = dataset.programs.find(
      (item) =>
        item.id === target.programId &&
        item.universityId === target.universityId,
    );
    if (!university || !program) {
      throw new Error("A portable opportunity target is not available.");
    }
    const targetPlan = {
      ...plan,
      universityId: target.universityId,
      programId: target.programId,
    };
    const projection = simulateExamOpportunity(
      targetPlan,
      examId,
      score,
      dataset,
    );
    const sourceId =
      projection.resolution.courses[0]?.sourceId ??
      dataset.equivalencies.find(
        (equivalency) =>
          equivalency.universityId === target.universityId &&
          equivalency.examId === examId,
      )?.sourceId;

    return {
      university,
      program,
      projection,
      status: classifyProjection(projection),
      sourceId,
    };
  });
  const bestApplicableDelta = Math.max(
    0,
    ...results.map((result) => result.projection.deltas.applicableCredits),
  );

  return {
    exam,
    score,
    results,
    acceptedUniversityCount: results.filter(
      (result) => result.projection.deltas.acceptedCredits > 0,
    ).length,
    applicableUniversityCount: results.filter(
      (result) => result.projection.deltas.applicableCredits > 0,
    ).length,
    bestApplicableDelta,
    bestUniversityIds:
      bestApplicableDelta > 0
        ? results
            .filter(
              (result) =>
                result.projection.deltas.applicableCredits ===
                bestApplicableDelta,
            )
            .map((result) => result.university.id)
        : [],
    variesByUniversity:
      new Set(results.map((result) => resultSignature(result))).size > 1,
  };
}
