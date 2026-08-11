import { describe, expect, it } from "vitest";

import { academicDataset, samplePlan } from "../../data/demo-data";

import { buildPlanBrief } from "./brief";
import { calculatePlan } from "./engine";

describe("plan brief", () => {
  it("turns the complete plan result into a counselor-ready summary", () => {
    const result = calculatePlan(samplePlan, academicDataset);
    const brief = buildPlanBrief(result, academicDataset);

    expect(brief.planName).toBe(samplePlan.profileName);
    expect(brief.metrics.creditsEntered).toBe(samplePlan.credits.length);
    expect(brief.metrics.applicableCredits).toBe(result.applicableCredits);
    expect(brief.requirements).toHaveLength(result.requirementResults.length);
    expect(brief.nextOpportunity?.requirementId).toBeTruthy();
    expect(brief.sources.length).toBeGreaterThan(0);
    expect(brief.sources.every((source) => source.verification === "verified")).toBe(
      true,
    );
  });

  it("labels elective, duplicate, and verification-required inputs", () => {
    const brief = buildPlanBrief(
      calculatePlan(samplePlan, academicDataset),
      academicDataset,
    );

    expect(
      brief.creditOutcomes.find((item) => item.credit.id === "sample-ap-psych")
        ?.outcome.status,
    ).toBe("elective");
    expect(
      brief.creditOutcomes.find((item) => item.credit.id === "sample-clep-psych")
        ?.outcome.status,
    ).toBe("duplicate");
    expect(
      brief.creditOutcomes.find((item) => item.credit.id === "sample-dual-english")
        ?.outcome.status,
    ).toBe("verification_required");
    expect(brief.warnings.map((warning) => warning.id)).toEqual(
      expect.arrayContaining(["duplicates", "verification"]),
    );
  });

  it("separates expected credits from credits already earned", () => {
    const expectedCalculus = {
      ...samplePlan.credits[0]!,
      status: "expected" as const,
    };
    const plan = { ...samplePlan, credits: [expectedCalculus] };
    const brief = buildPlanBrief(
      calculatePlan(plan, academicDataset),
      academicDataset,
    );

    expect(brief.warnings.find((warning) => warning.id === "expected")?.detail).toContain(
      "1 input is",
    );
    expect(brief.creditOutcomes[0]?.credit.status).toBe("expected");
  });

  it("reports a below-threshold score as unsupported instead of accepted", () => {
    const lowScore = {
      ...samplePlan.credits[0]!,
      score: 2,
    };
    const plan = { ...samplePlan, credits: [lowScore] };
    const brief = buildPlanBrief(
      calculatePlan(plan, academicDataset),
      academicDataset,
    );

    expect(brief.creditOutcomes[0]?.outcome.status).toBe("no_match");
    expect(brief.creditOutcomes[0]?.outcome.acceptedCredits).toBe(0);
    expect(brief.creditOutcomes[0]?.outcome.note).toContain("does not meet");
  });
});
