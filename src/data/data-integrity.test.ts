import { describe, expect, it } from "vitest";

import {
  academicDataset,
  programForUniversity,
  upcomingUniversities,
  verifiedUniversities,
} from "./demo-data";

describe("academic dataset integrity", () => {
  it("publishes exactly the three reviewed Finance pathways", () => {
    expect(verifiedUniversities.map((university) => university.id)).toEqual([
      "uf",
      "fiu",
      "ucf",
    ]);
    expect(upcomingUniversities.map((university) => university.id)).toEqual([
      "fsu",
      "usf",
    ]);
  });

  it("connects every verified program requirement to a verified source", () => {
    const sources = new Map(
      academicDataset.sources.map((source) => [source.id, source]),
    );

    verifiedUniversities.forEach((university) => {
      const program = programForUniversity(university.id);
      expect(sources.get(program.sourceId)?.verification).toBe("verified");
      program.requirements.forEach((requirement) => {
        expect(sources.get(requirement.sourceId)?.verification).toBe("verified");
        expect(requirement.verification).toBe("verified");
        if (requirement.rule.type === "alternative_course_groups") {
          expect(requirement.rule.courseGroups.length).toBeGreaterThan(1);
          expect(
            requirement.rule.courseGroups.every((group) => group.length > 0),
          ).toBe(true);
        }
      });
    });
  });

  it("keeps verified score ranges valid, non-overlapping, and sourced", () => {
    const sources = new Map(
      academicDataset.sources.map((source) => [source.id, source]),
    );
    const groups = new Map<string, typeof academicDataset.equivalencies>();

    academicDataset.equivalencies
      .filter((equivalency) => equivalency.verification === "verified")
      .forEach((equivalency) => {
        expect(equivalency.minimumScore).toBeLessThanOrEqual(
          equivalency.maximumScore,
        );
        expect(equivalency.courses.length).toBeGreaterThan(0);
        expect(equivalency.courses.every((course) => course.credits > 0)).toBe(
          true,
        );
        expect(sources.get(equivalency.sourceId)?.verification).toBe("verified");

        const key = `${equivalency.universityId}:${equivalency.examId}`;
        groups.set(key, [...(groups.get(key) ?? []), equivalency]);
      });

    groups.forEach((equivalencies) => {
      const sorted = [...equivalencies].sort(
        (a, b) => a.minimumScore - b.minimumScore,
      );
      sorted.slice(1).forEach((current, index) => {
        expect(current.minimumScore).toBeGreaterThan(
          sorted[index]!.maximumScore,
        );
      });
    });
  });
});
