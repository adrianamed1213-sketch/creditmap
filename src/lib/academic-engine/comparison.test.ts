import { describe, expect, it } from "vitest";

import {
  academicDataset,
  programForUniversity,
  samplePlan,
  verifiedUniversities,
} from "../../data/demo-data";

import { buildCreditPortabilityComparison } from "./comparison";
import type { StudentCredit } from "./types";

const targets = verifiedUniversities.map((university) => ({
  universityId: university.id,
  programId: programForUniversity(university.id).id,
}));

function examCredit(id: string, examId: string, score: number): StudentCredit {
  const exam = academicDataset.exams.find((item) => item.id === examId)!;
  return {
    id,
    kind: "exam",
    sourceType: exam.sourceType,
    label: exam.name,
    examId,
    score,
    status: "earned",
    createdAt: "2026-08-10T00:00:00.000Z",
  };
}

describe("credit portability comparison", () => {
  it("reruns every credit against every selected university", () => {
    const comparison = buildCreditPortabilityComparison(
      samplePlan,
      targets,
      academicDataset,
    );

    expect(comparison.results).toHaveLength(3);
    expect(comparison.rows).toHaveLength(samplePlan.credits.length);
    expect(comparison.rows.every((row) => row.outcomes.length === 3)).toBe(true);
  });

  it("reveals when one course is elective at UF but applicable at FIU and UCF", () => {
    const comparison = buildCreditPortabilityComparison(
      { ...samplePlan, credits: [examCredit("psych", "ap-psychology", 4)] },
      targets,
      academicDataset,
    );
    const row = comparison.rows[0]!;

    expect(row.outcomes.find((item) => item.universityId === "uf")?.status).toBe(
      "elective",
    );
    expect(row.outcomes.find((item) => item.universityId === "fiu")?.status).toBe(
      "applicable",
    );
    expect(row.outcomes.find((item) => item.universityId === "ucf")?.status).toBe(
      "applicable",
    );
    expect(row.variesByUniversity).toBe(true);
  });

  it("shows duplicate suppression independently for every university", () => {
    const comparison = buildCreditPortabilityComparison(
      {
        ...samplePlan,
        credits: [
          examCredit("ap-psych", "ap-psychology", 4),
          examCredit("clep-psych", "clep-psychology", 58),
        ],
      },
      targets,
      academicDataset,
    );
    const duplicate = comparison.rows.find(
      (row) => row.credit.id === "clep-psych",
    )!;

    expect(duplicate.outcomes.every((outcome) => outcome.status === "duplicate")).toBe(
      true,
    );
    expect(duplicate.outcomes.every((outcome) => outcome.acceptedCredits === 0)).toBe(
      true,
    );
  });

  it("keeps manual dual-enrollment records verification-required", () => {
    const dualCredit = samplePlan.credits.find((credit) => credit.kind === "course")!;
    const comparison = buildCreditPortabilityComparison(
      { ...samplePlan, credits: [dualCredit] },
      targets,
      academicDataset,
    );

    expect(
      comparison.rows[0]?.outcomes.every(
        (outcome) => outcome.status === "verification_required",
      ),
    ).toBe(true);
    expect(comparison.verificationCount).toBe(1);
  });

  it("detects different awarded credit values even when both outcomes apply", () => {
    const comparison = buildCreditPortabilityComparison(
      { ...samplePlan, credits: [examCredit("macro", "ap-macroeconomics", 4)] },
      targets,
      academicDataset,
    );
    const row = comparison.rows[0]!;

    expect(row.outcomes.map((outcome) => outcome.acceptedCredits).sort()).toEqual([3, 3, 4]);
    expect(row.variesByUniversity).toBe(true);
  });

  it("requires at least two comparison targets", () => {
    expect(() =>
      buildCreditPortabilityComparison(samplePlan, targets.slice(0, 1), academicDataset),
    ).toThrow("at least two university targets");
  });
});
