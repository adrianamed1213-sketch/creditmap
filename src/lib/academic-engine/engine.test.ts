import { describe, expect, it } from "vitest";

import { academicDataset, programForUniversity, samplePlan } from "../../data/demo-data";

import { calculatePlan, resolveExamEquivalency } from "./engine";
import type { StudentCredit, StudentPlan } from "./types";

function planWith(credits: StudentCredit[], universityId = "uf"): StudentPlan {
  const program = programForUniversity(universityId);
  return {
    ...samplePlan,
    universityId,
    programId: program.id,
    credits,
  };
}

function examCredit(id: string, examId: string, score: number, status: "earned" | "expected" = "earned") {
  const exam = academicDataset.exams.find((item) => item.id === examId)!;
  return {
    id,
    kind: "exam" as const,
    sourceType: exam.sourceType,
    label: exam.name,
    examId,
    score,
    status,
    createdAt: "2026-08-09T00:00:00.000Z",
  };
}

describe("equivalency resolution", () => {
  it("resolves a score at the minimum threshold", () => {
    const credit = examCredit("calc", "ap-calculus-ab", 3);
    const result = resolveExamEquivalency(credit, "uf", academicDataset);
    expect(result.courses[0]?.courseCode).toBe("UF-D-CALC1");
    expect(result.acceptedCredits).toBe(4);
  });

  it("does not resolve a score below the threshold", () => {
    const result = resolveExamEquivalency(
      examCredit("calc", "ap-calculus-ab", 2),
      "uf",
      academicDataset,
    );
    expect(result.courses).toHaveLength(0);
    expect(result.note).toContain("does not meet");
  });

  it("changes the result when an exam score changes", () => {
    const low = calculatePlan(planWith([examCredit("calc", "ap-calculus-ab", 2)]), academicDataset);
    const high = calculatePlan(planWith([examCredit("calc", "ap-calculus-ab", 4)]), academicDataset);
    expect(low.acceptedCredits).toBe(0);
    expect(high.acceptedCredits).toBe(4);
  });
});

describe("requirement matching", () => {
  it("matches a specific-course requirement", () => {
    const result = calculatePlan(
      planWith([examCredit("english", "ap-english-language", 4)]),
      academicDataset,
    );
    expect(result.requirementResults.find((item) => item.requirement.id === "uf-writing")?.status).toBe(
      "completed",
    );
  });

  it("supports OR requirements", () => {
    const result = calculatePlan(
      planWith([examCredit("algebra", "clep-college-algebra", 55)]),
      academicDataset,
    );
    expect(
      result.requirementResults.find((item) => item.requirement.id === "uf-quantitative")?.status,
    ).toBe("completed");
  });

  it("supports AND requirements", () => {
    const oneCourse = calculatePlan(
      planWith([examCredit("micro", "ap-microeconomics", 4)]),
      academicDataset,
    );
    const bothCourses = calculatePlan(
      planWith([
        examCredit("micro", "ap-microeconomics", 4),
        examCredit("macro", "ap-macroeconomics", 4),
      ]),
      academicDataset,
    );
    expect(oneCourse.requirementResults.find((item) => item.requirement.id === "uf-economics")?.status).toBe(
      "in_progress",
    );
    expect(bothCourses.requirementResults.find((item) => item.requirement.id === "uf-economics")?.status).toBe(
      "completed",
    );
  });

  it("supports minimum-credit requirements", () => {
    const result = calculatePlan(
      planWith([
        examCredit("psych", "ap-psychology", 4),
        examCredit("soc", "clep-sociology", 55),
      ]),
      academicDataset,
    );
    expect(
      result.requirementResults.find((item) => item.requirement.id === "uf-social-science")?.status,
    ).toBe("completed");
  });

  it("marks expected credits as in progress", () => {
    const result = calculatePlan(
      planWith([examCredit("english", "ap-english-language", 4, "expected")]),
      academicDataset,
    );
    expect(result.requirementResults.find((item) => item.requirement.id === "uf-writing")?.status).toBe(
      "in_progress",
    );
  });
});

describe("allocation and plan changes", () => {
  it("suppresses duplicate course credit", () => {
    const result = calculatePlan(
      planWith([
        examCredit("ap-psych", "ap-psychology", 4),
        examCredit("clep-psych", "clep-psychology", 55),
      ]),
      academicDataset,
    );
    expect(result.acceptedCredits).toBe(3);
    expect(result.duplicateCredits).toBe(3);
    expect(result.resolvedCredits[1]?.duplicateOfCreditId).toBe("ap-psych");
  });

  it("classifies unused accepted credit as elective credit", () => {
    const result = calculatePlan(
      planWith([examCredit("bc", "ap-calculus-bc", 4)]),
      academicDataset,
    );
    expect(result.acceptedCredits).toBe(8);
    expect(result.electiveCredits).toBe(4);
  });

  it("recalculates after deleting a credit", () => {
    const withCredit = calculatePlan(
      planWith([examCredit("english", "ap-english-language", 4)]),
      academicDataset,
    );
    const withoutCredit = calculatePlan(planWith([]), academicDataset);
    expect(withCredit.applicableCredits).toBeGreaterThan(withoutCredit.applicableCredits);
    expect(withoutCredit.progressPercent).toBe(0);
  });

  it("recalculates for a changed university", () => {
    const credit = examCredit("calc", "ap-calculus-ab", 3);
    const uf = calculatePlan(planWith([credit], "uf"), academicDataset);
    const fsu = calculatePlan(planWith([credit], "fsu"), academicDataset);
    expect(uf.acceptedCredits).toBe(4);
    expect(fsu.acceptedCredits).toBe(0);
  });

  it("calculates degree progress from applicable credits", () => {
    const result = calculatePlan(
      planWith([examCredit("english", "ap-english-language", 4)]),
      academicDataset,
    );
    expect(result.applicableCredits).toBe(3);
    expect(result.progressPercent).toBe(3);
  });

  it("generates recommendations tied to remaining requirements", () => {
    const result = calculatePlan(planWith([]), academicDataset);
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.recommendations.every((item) => item.requirementId.length > 0)).toBe(true);
    expect(result.recommendations[0]?.reason).toContain("requirement");
  });
});
