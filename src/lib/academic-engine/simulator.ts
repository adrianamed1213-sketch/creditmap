import { calculatePlan } from "./engine";
import type {
  AcademicDataset,
  PlanResult,
  RequirementResult,
  ResolvedCredit,
  StudentExamCredit,
  StudentPlan,
} from "./types";

const SIMULATION_CREDIT_ID = "creditmap-opportunity-simulation";

export type OpportunityProjection = {
  current: PlanResult;
  projected: PlanResult;
  hypotheticalCredit: StudentExamCredit;
  resolution: ResolvedCredit;
  impactedRequirements: RequirementResult[];
  deltas: {
    acceptedCredits: number;
    applicableCredits: number;
    electiveCredits: number;
    progressPercent: number;
    completedRequirements: number;
  };
};

export function simulateExamOpportunity(
  plan: StudentPlan,
  examId: string,
  score: number,
  dataset: AcademicDataset,
): OpportunityProjection {
  const exam = dataset.exams.find((item) => item.id === examId);
  if (!exam) throw new Error("The selected exam is not available.");
  if (!Number.isFinite(score) || score < exam.scoreMin || score > exam.scoreMax) {
    throw new Error(`Enter a score from ${exam.scoreMin} to ${exam.scoreMax}.`);
  }

  const hypotheticalCredit: StudentExamCredit = {
    id: SIMULATION_CREDIT_ID,
    kind: "exam",
    sourceType: exam.sourceType,
    label: exam.name,
    examId: exam.id,
    score,
    status: "expected",
    createdAt: plan.updatedAt,
  };
  const current = calculatePlan(plan, dataset);
  const projected = calculatePlan(
    { ...plan, credits: [...plan.credits, hypotheticalCredit] },
    dataset,
  );
  const resolution = projected.resolvedCredits.find(
    (item) => item.credit.id === SIMULATION_CREDIT_ID,
  );
  if (!resolution) throw new Error("CreditMap could not calculate this opportunity.");

  const currentRequirements = new Map(
    current.requirementResults.map((item) => [item.requirement.id, item]),
  );
  const impactedRequirements = projected.requirementResults.filter((after) => {
    const before = currentRequirements.get(after.requirement.id);
    return before?.status !== after.status || before.appliedCredits !== after.appliedCredits;
  });

  return {
    current,
    projected,
    hypotheticalCredit,
    resolution,
    impactedRequirements,
    deltas: {
      acceptedCredits: projected.acceptedCredits - current.acceptedCredits,
      applicableCredits: projected.applicableCredits - current.applicableCredits,
      electiveCredits: projected.electiveCredits - current.electiveCredits,
      progressPercent: projected.progressPercent - current.progressPercent,
      completedRequirements:
        projected.completedRequirements - current.completedRequirements,
    },
  };
}
