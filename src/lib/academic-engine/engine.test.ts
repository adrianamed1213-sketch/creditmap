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

function courseCredit(id: string, courseCode: string, credits = 3) {
  return {
    id,
    kind: "course" as const,
    sourceType: "DUAL" as const,
    label: courseCode,
    institution: "Florida public college",
    courseCode,
    courseName: "Test course",
    credits,
    grade: "A",
    status: "earned" as const,
    createdAt: "2026-08-09T00:00:00.000Z",
  };
}

describe("equivalency resolution", () => {
  it("resolves a score at the minimum threshold", () => {
    const credit = examCredit("calc", "ap-calculus-ab", 3);
    const result = resolveExamEquivalency(credit, "uf", academicDataset);
    expect(result.courses[0]?.courseCode).toBe("MAC 2311");
    expect(result.acceptedCredits).toBe(4);
    expect(result.verification).toBe("verified");
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

  it("keeps score-dependent AP equivalencies as separate ranges", () => {
    const scoreThree = resolveExamEquivalency(
      examCredit("english-3", "ap-english-language", 3),
      "uf",
      academicDataset,
    );
    const scoreFour = resolveExamEquivalency(
      examCredit("english-4", "ap-english-language", 4),
      "uf",
      academicDataset,
    );
    expect(scoreThree.acceptedCredits).toBe(3);
    expect(scoreFour.acceptedCredits).toBe(6);
  });
});

describe("requirement matching", () => {
  it("matches a specific-course requirement", () => {
    const result = calculatePlan(
      planWith([examCredit("stats", "ap-statistics", 3)]),
      academicDataset,
    );
    expect(result.requirementResults.find((item) => item.requirement.id === "uf-finance-statistics")?.status).toBe(
      "completed",
    );
  });

  it("supports OR requirements", () => {
    const result = calculatePlan(
      planWith([examCredit("calc", "ap-calculus-ab", 3)]),
      academicDataset,
    );
    expect(
      result.requirementResults.find((item) => item.requirement.id === "uf-finance-calculus-1")?.status,
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
    expect(oneCourse.requirementResults.find((item) => item.requirement.id === "uf-finance-economics")?.status).toBe(
      "in_progress",
    );
    expect(bothCourses.requirementResults.find((item) => item.requirement.id === "uf-finance-economics")?.status).toBe(
      "completed",
    );
  });

  it("supports minimum-credit requirements", () => {
    const result = calculatePlan(
      planWith([
        examCredit("psych", "ap-psychology", 4),
        examCredit("soc", "clep-sociology", 55),
      ], "fsu"),
      academicDataset,
    );
    expect(
      result.requirementResults.find((item) => item.requirement.id === "fsu-social-science")?.status,
    ).toBe("completed");
  });

  it("marks expected credits as in progress", () => {
    const result = calculatePlan(
      planWith([examCredit("english", "ap-english-language", 4, "expected")]),
      academicDataset,
    );
    expect(result.requirementResults.find((item) => item.requirement.id === "uf-gen-ed-composition")?.status).toBe(
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

  it("gives a resolved dual-enrollment course precedence over exam credit", () => {
    const result = calculatePlan(
      planWith([
        examCredit("ap-psych", "ap-psychology", 4),
        courseCredit("dual-psych", "FSU-D-PSYCH"),
      ], "fsu"),
      academicDataset,
    );
    expect(result.acceptedCredits).toBe(3);
    expect(result.resolvedCredits[0]?.duplicateOfCreditId).toBe("dual-psych");
    expect(result.resolvedCredits[1]?.duplicateOfCreditId).toBeUndefined();
  });

  it("requires university review for manually entered UF transfer courses", () => {
    const result = calculatePlan(
      planWith([courseCredit("dual-english", "ENC 1101")]),
      academicDataset,
    );
    expect(result.acceptedCredits).toBe(0);
    expect(result.resolvedCredits[0]?.verification).toBe("verification_required");
  });

  it("classifies unused accepted credit as elective credit", () => {
    const result = calculatePlan(
      planWith([examCredit("psych", "ap-psychology", 4)]),
      academicDataset,
    );
    expect(result.acceptedCredits).toBe(3);
    expect(result.electiveCredits).toBe(3);
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
    expect(result.applicableCredits).toBe(6);
    expect(result.progressPercent).toBe(5);
  });

  it("counts the actual credits of a matched variable-credit option", () => {
    const result = calculatePlan(
      planWith([examCredit("calc", "ap-calculus-ab", 3)]),
      academicDataset,
    );
    expect(result.applicableCredits).toBe(4);
    expect(result.acceptedCredits).toBe(result.applicableCredits + result.electiveCredits);
  });

  it("generates recommendations tied to remaining requirements", () => {
    const result = calculatePlan(planWith([]), academicDataset);
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.recommendations.every((item) => item.requirementId.length > 0)).toBe(true);
    expect(result.recommendations[0]?.reason).toContain("requirement");
  });
});

describe("FIU verified Finance pathway", () => {
  it("resolves the published AP Calculus AB equivalency into UCC progress", () => {
    const result = calculatePlan(
      planWith([examCredit("fiu-calc", "ap-calculus-ab", 3)], "fiu"),
      academicDataset,
    );

    expect(result.program.id).toBe("fiu-finance-bba-current");
    expect(result.resolvedCredits[0]?.courses[0]?.courseCode).toBe("MAC 2311");
    expect(result.resolvedCredits[0]?.verification).toBe("verified");
    expect(
      result.requirementResults.find(
        (item) => item.requirement.id === "fiu-ucc-math-group-one",
      )?.status,
    ).toBe("completed");
    expect(result.applicableCredits).toBe(4);
  });

  it("shows a shared course in UCC and pre-core without counting its credits twice", () => {
    const result = calculatePlan(
      planWith([examCredit("fiu-macro", "ap-macroeconomics", 3)], "fiu"),
      academicDataset,
    );

    expect(
      result.requirementResults.find(
        (item) => item.requirement.id === "fiu-pre-core-eco-2013",
      )?.status,
    ).toBe("completed");
    expect(
      result.requirementResults.find(
        (item) => item.requirement.id === "fiu-ucc-social-group-one",
      )?.status,
    ).toBe("completed");
    expect(result.applicableCredits).toBe(3);
  });

  it("keeps FIU CLEP Sociology as accepted elective credit", () => {
    const result = calculatePlan(
      planWith([examCredit("fiu-soc", "clep-sociology", 50)], "fiu"),
      academicDataset,
    );

    expect(result.acceptedCredits).toBe(3);
    expect(result.applicableCredits).toBe(0);
    expect(result.electiveCredits).toBe(3);
  });

  it("applies FIU's published duplicate-credit policy", () => {
    const result = calculatePlan(
      planWith([
        examCredit("fiu-ap-psych", "ap-psychology", 3),
        examCredit("fiu-clep-psych", "clep-psychology", 50),
      ], "fiu"),
      academicDataset,
    );

    expect(result.acceptedCredits).toBe(3);
    expect(result.duplicateCredits).toBe(3);
  });

  it("labels FIU recommendations with the correct published institution", () => {
    const result = calculatePlan(planWith([], "fiu"), academicDataset);
    const recommendation = result.recommendations.find(
      (item) => item.exam.id === "clep-calculus",
    );

    expect(recommendation?.verification).toBe("verified");
    expect(recommendation?.reason).toContain("published FIU equivalency");
  });
});
