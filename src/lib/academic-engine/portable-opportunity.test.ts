import { describe, expect, it } from "vitest";

import {
  academicDataset,
  programForUniversity,
  samplePlan,
  verifiedUniversities,
} from "../../data/demo-data";

import { compareExamOpportunity } from "./portable-opportunity";
import type { StudentCredit, StudentPlan } from "./types";

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

function planWith(credits: StudentCredit[]): StudentPlan {
  return {
    ...samplePlan,
    credits,
  };
}

describe("portable opportunity comparison", () => {
  it("shows AP Psychology as elective at UF and applicable at FIU and UCF", () => {
    const comparison = compareExamOpportunity(
      planWith([]),
      targets,
      "ap-psychology",
      3,
      academicDataset,
    );

    expect(comparison.results).toHaveLength(3);
    expect(comparison.acceptedUniversityCount).toBe(3);
    expect(comparison.applicableUniversityCount).toBe(2);
    expect(comparison.bestApplicableDelta).toBe(3);
    expect(
      comparison.results.find((result) => result.university.id === "uf")?.status,
    ).toBe("elective");
    expect(
      comparison.results.find((result) => result.university.id === "fiu")?.status,
    ).toBe("applicable");
    expect(
      comparison.results.find((result) => result.university.id === "ucf")?.status,
    ).toBe("applicable");
    expect(comparison.variesByUniversity).toBe(true);
  });

  it("identifies the university with the largest applicable-credit gain", () => {
    const comparison = compareExamOpportunity(
      planWith([]),
      targets,
      "ap-macroeconomics",
      3,
      academicDataset,
    );

    expect(comparison.acceptedUniversityCount).toBe(3);
    expect(comparison.applicableUniversityCount).toBe(3);
    expect(comparison.bestApplicableDelta).toBe(4);
    expect(comparison.bestUniversityIds).toEqual(["uf"]);
  });

  it("keeps the judge-demo macro projection stable for the sample plan", () => {
    const comparison = compareExamOpportunity(
      samplePlan,
      targets,
      "ap-macroeconomics",
      3,
      academicDataset,
    );

    expect(
      comparison.results.map((result) => ({
        universityId: result.university.id,
        accepted: result.projection.deltas.acceptedCredits,
        applicable: result.projection.deltas.applicableCredits,
      })),
    ).toEqual([
      { universityId: "uf", accepted: 4, applicable: 4 },
      { universityId: "fiu", accepted: 3, applicable: 3 },
      { universityId: "ucf", accepted: 3, applicable: 3 },
    ]);
  });

  it("shows no gain when the score is below every published threshold", () => {
    const comparison = compareExamOpportunity(
      planWith([]),
      targets,
      "ap-psychology",
      2,
      academicDataset,
    );

    expect(comparison.acceptedUniversityCount).toBe(0);
    expect(comparison.applicableUniversityCount).toBe(0);
    expect(comparison.bestApplicableDelta).toBe(0);
    expect(comparison.bestUniversityIds).toEqual([]);
    expect(comparison.results.every((result) => result.status === "no_match")).toBe(
      true,
    );
    expect(comparison.variesByUniversity).toBe(false);
  });

  it("detects the same duplicate independently at every university", () => {
    const comparison = compareExamOpportunity(
      planWith([examCredit("existing-psych", "ap-psychology", 3)]),
      targets,
      "clep-psychology",
      50,
      academicDataset,
    );

    expect(comparison.results.every((result) => result.status === "duplicate")).toBe(
      true,
    );
    expect(comparison.acceptedUniversityCount).toBe(0);
    expect(comparison.applicableUniversityCount).toBe(0);
  });

  it("requires at least two university targets", () => {
    expect(() =>
      compareExamOpportunity(
        planWith([]),
        targets.slice(0, 1),
        "ap-psychology",
        3,
        academicDataset,
      ),
    ).toThrow("at least two targets");
  });
});
