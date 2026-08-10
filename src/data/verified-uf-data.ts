import type {
  AcademicSource,
  DegreeRequirement,
  ExamEquivalency,
  Program,
} from "@/lib/academic-engine/types";

const checkedAt = "2026-08-09";
const liveCatalogLabel = "Live UF catalog; year not stated on page";

export const ufFinanceSource: AcademicSource = {
  id: "uf-finance-catalog-current",
  title: "UF Undergraduate Catalog — Finance BSBA",
  url: "https://catalog.ufl.edu/UGRD/colleges-schools/UGBUS/FIN_BSBA/",
  academicYear: liveCatalogLabel,
  checkedAt,
  notes:
    "Finance degree, critical-tracking, core, major, restricted-elective, professional-communication, and career-readiness requirements checked against the live UF catalog.",
  verification: "verified",
};

export const ufExamCreditSource: AcademicSource = {
  id: "uf-exam-credit-current",
  title: "UF Undergraduate Catalog — Exam Credit",
  url: "https://catalog.ufl.edu/UGRD/academic-advising/exam-credit/exam-credit.pdf",
  academicYear: liveCatalogLabel,
  checkedAt,
  notes:
    "Supported AP and CLEP score thresholds, course equivalents, credit amounts, and duplicate-credit rules checked against UF's live Exam Credit PDF.",
  verification: "verified",
};

export const ufGeneralEducationSource: AcademicSource = {
  id: "uf-general-education-current",
  title: "UF Undergraduate Catalog — General Education",
  url: "https://catalog.ufl.edu/UGRD/academic-programs/general-education/",
  academicYear: liveCatalogLabel,
  checkedAt,
  notes:
    "The 36-credit General Education structure and incoming-credit guidance were checked against UF's live catalog. Category placement still depends on the student's matriculation year and record.",
  verification: "verified",
};

function verifiedRequirement(
  sourceId: string,
  values: Omit<DegreeRequirement, "sourceId" | "verification">,
): DegreeRequirement {
  return {
    ...values,
    sourceId,
    verification: "verified",
  };
}

const generalEducationRequirements: DegreeRequirement[] = [
  verifiedRequirement(ufGeneralEducationSource.id, {
    id: "uf-gen-ed-composition",
    groupId: "general-education",
    groupLabel: "General Education",
    title: "Composition",
    description:
      "Six composition credits are required. The supported UF exam-credit records can resolve to ENC 1101 and ENC 1102.",
    credits: 6,
    order: 1,
    rule: { type: "course_all", courseCodes: ["ENC 1101", "ENC 1102"] },
  }),
  verifiedRequirement(ufGeneralEducationSource.id, {
    id: "uf-gen-ed-science",
    groupId: "general-education",
    groupLabel: "General Education",
    title: "Biological and Physical Sciences",
    description:
      "UF requires six credits across biological and physical sciences, including three State Core credits. Course-category review is not yet automated in this dataset.",
    credits: 6,
    order: 2,
    rule: {
      type: "manual_verification",
      reason: "Verification required: select courses must be checked for current UF science and State Core designations.",
    },
  }),
  verifiedRequirement(ufGeneralEducationSource.id, {
    id: "uf-gen-ed-humanities",
    groupId: "general-education",
    groupLabel: "General Education",
    title: "Humanities and Quest 1",
    description:
      "The Finance model plan includes Quest 1 and State Core Humanities coursework. Exact incoming-credit placement requires category review.",
    credits: 6,
    order: 3,
    rule: {
      type: "manual_verification",
      reason: "Verification required: humanities and Quest applicability depends on the approved course and student record.",
    },
  }),
  verifiedRequirement(ufGeneralEducationSource.id, {
    id: "uf-gen-ed-additional",
    groupId: "general-education",
    groupLabel: "General Education",
    title: "Additional Gen Ed, International, and Civic Literacy",
    description:
      "The UF General Education structure includes six additional credits, while the Finance model plan also identifies International and Civic Literacy checks.",
    credits: 6,
    order: 4,
    rule: {
      type: "manual_verification",
      reason: "Verification required: these overlapping designations and the civic-literacy assessment must be reviewed individually.",
    },
  }),
];

const criticalTrackingRequirements: DegreeRequirement[] = [
  verifiedRequirement(ufFinanceSource.id, {
    id: "uf-finance-economics",
    groupId: "major-prerequisites",
    groupLabel: "Critical Tracking",
    title: "Economics sequence",
    description: "Complete ECO 2013 and ECO 2023 as Finance critical-tracking courses.",
    credits: 8,
    order: 5,
    rule: { type: "course_all", courseCodes: ["ECO 2013", "ECO 2023"] },
  }),
  verifiedRequirement(ufFinanceSource.id, {
    id: "uf-finance-calculus-1",
    groupId: "major-prerequisites",
    groupLabel: "Critical Tracking",
    title: "First calculus requirement",
    description: "Complete MAC 2233 or MAC 2311.",
    credits: 3,
    order: 6,
    rule: { type: "course_any", courseCodes: ["MAC 2233", "MAC 2311"], requiredCount: 1 },
  }),
  verifiedRequirement(ufFinanceSource.id, {
    id: "uf-finance-calculus-2",
    groupId: "major-prerequisites",
    groupLabel: "Critical Tracking",
    title: "Second calculus requirement",
    description: "Complete MAC 2234 or MAC 2312.",
    credits: 3,
    order: 7,
    rule: { type: "course_any", courseCodes: ["MAC 2234", "MAC 2312"], requiredCount: 1 },
  }),
  verifiedRequirement(ufFinanceSource.id, {
    id: "uf-finance-acg-2021",
    groupId: "major-prerequisites",
    groupLabel: "Critical Tracking",
    title: "ACG 2021 — Introduction to Financial Accounting",
    description: "Finance students must earn at least a B; grade and attempt limits require adviser confirmation.",
    credits: 4,
    order: 8,
    rule: { type: "specific_course", courseCode: "ACG 2021" },
  }),
  verifiedRequirement(ufFinanceSource.id, {
    id: "uf-finance-acg-2071",
    groupId: "major-prerequisites",
    groupLabel: "Critical Tracking",
    title: "ACG 2071 — Introduction to Managerial Accounting",
    description: "Finance students must earn at least a B; grade and attempt limits require adviser confirmation.",
    credits: 4,
    order: 9,
    rule: { type: "specific_course", courseCode: "ACG 2071" },
  }),
  verifiedRequirement(ufFinanceSource.id, {
    id: "uf-finance-computing",
    groupId: "major-prerequisites",
    groupLabel: "Critical Tracking",
    title: "Computing requirement",
    description: "Complete CGS 2531 or ISM 3013.",
    credits: 3,
    order: 10,
    rule: { type: "course_any", courseCodes: ["CGS 2531", "ISM 3013"], requiredCount: 1 },
  }),
  verifiedRequirement(ufFinanceSource.id, {
    id: "uf-finance-statistics",
    groupId: "major-prerequisites",
    groupLabel: "Critical Tracking",
    title: "STA 2023 — Introduction to Statistics 1",
    description: "Complete STA 2023 as a Finance critical-tracking course.",
    credits: 3,
    order: 11,
    rule: { type: "specific_course", courseCode: "STA 2023" },
  }),
];

const coreCourseRequirements: Array<[string, string]> = [
  ["BUL 4310", "The Legal Environment of Business"],
  ["FIN 3403", "Business Finance — B or better within two attempts"],
  ["GEB 3373", "International Business"],
  ["MAN 3025", "Principles of Management"],
  ["MAN 4504", "Operations and Supply Chain Management"],
  ["MAR 3023", "Principles of Marketing"],
  ["QMB 3250", "Statistics for Business Decisions"],
  ["QMB 3302", "Foundations of Business Analytics and Artificial Intelligence (AI)"],
];

const majorCourseRequirements: Array<[string, string]> = [
  ["ACG 3101", "Financial Accounting and Reporting 1"],
  ["ACG 4111", "Financial Accounting and Reporting 2"],
  ["FIN 4414", "Financial Management"],
  ["FIN 4453", "Financial Modeling"],
  ["FIN 4504", "Equity and Capital Markets"],
];

const upperDivisionRequirements: DegreeRequirement[] = [
  verifiedRequirement(ufFinanceSource.id, {
    id: "uf-finance-professional-communication",
    groupId: "college-requirements",
    groupLabel: "Heavener Requirements",
    title: "Professional communication",
    description: "Select GEB 2216, GEB 3218, SPC 2608, ENC 3312, or an approved similar course with at least a C.",
    credits: 3,
    order: 12,
    rule: {
      type: "course_any",
      courseCodes: ["GEB 2216", "GEB 3218", "SPC 2608", "ENC 3312"],
      requiredCount: 1,
    },
  }),
  ...coreCourseRequirements.map(([courseCode, courseName], index) =>
    verifiedRequirement(ufFinanceSource.id, {
      id: `uf-finance-core-${courseCode.toLowerCase().replace(" ", "-")}`,
      groupId: "major-core",
      groupLabel: "Business Core",
      title: `${courseCode} — ${courseName}`,
      description:
        courseCode === "FIN 3403"
          ? "Required business-core course and critical-tracking checkpoint; the published grade and attempt limits require record review."
          : "Required Finance BSBA business-core course.",
      credits: 4,
      order: 13 + index,
      rule: { type: "specific_course", courseCode },
    }),
  ),
  ...majorCourseRequirements.map(([courseCode, courseName], index) =>
    verifiedRequirement(ufFinanceSource.id, {
      id: `uf-finance-major-${courseCode.toLowerCase().replace(" ", "-")}`,
      groupId: "major-courses",
      groupLabel: "Finance Major Courses",
      title: `${courseCode} — ${courseName}`,
      description: "Required Finance BSBA major course.",
      credits: 4,
      order: 21 + index,
      rule: { type: "specific_course", courseCode },
    }),
  ),
  verifiedRequirement(ufFinanceSource.id, {
    id: "uf-finance-restricted-electives",
    groupId: "restricted-electives",
    groupLabel: "Restricted Electives",
    title: "Restricted electives",
    description:
      "Complete seven credits from the catalog's approved level ranges. Internship, externship, independent-study, and assistantship credit do not count.",
    credits: 7,
    order: 26,
    rule: {
      type: "manual_verification",
      reason: "Verification required: approved level, exclusions, and course applicability must be reviewed.",
    },
  }),
  verifiedRequirement(ufFinanceSource.id, {
    id: "uf-finance-career-readiness",
    groupId: "college-requirements",
    groupLabel: "Heavener Requirements",
    title: "Career readiness sequence",
    description: "Complete six credits across the Explore, Apply, Enrich, and Advance phases.",
    credits: 6,
    order: 27,
    rule: {
      type: "manual_verification",
      reason: "Verification required: completion must be checked across all four career-readiness phases.",
    },
  }),
];

export const ufFinanceProgram: Program = {
  id: "uf-finance-bsba-current",
  universityId: "uf",
  name: "Finance BSBA",
  majorName: "Finance",
  degreeType: "Bachelor of Science in Business Administration",
  catalogYear: liveCatalogLabel,
  totalCredits: 120,
  sourceId: ufFinanceSource.id,
  requirements: [
    ...generalEducationRequirements,
    ...criticalTrackingRequirements,
    ...upperDivisionRequirements,
  ],
};

type VerifiedEquivalency = {
  examId: string;
  minimumScore: number;
  maximumScore: number;
  courses: Array<[courseCode: string, credits: number]>;
  suffix?: string;
};

const ufMappings: VerifiedEquivalency[] = [
  { examId: "ap-calculus-ab", minimumScore: 3, maximumScore: 5, courses: [["MAC 2311", 4]] },
  { examId: "ap-calculus-bc", minimumScore: 3, maximumScore: 3, courses: [["MAC 2311", 4]], suffix: "score-3" },
  { examId: "ap-calculus-bc", minimumScore: 4, maximumScore: 5, courses: [["MAC 2311", 4], ["MAC 2312", 4]], suffix: "scores-4-5" },
  { examId: "ap-psychology", minimumScore: 3, maximumScore: 5, courses: [["PSY 2012", 3]] },
  { examId: "ap-english-language", minimumScore: 3, maximumScore: 3, courses: [["ENC 1101", 3]], suffix: "score-3" },
  { examId: "ap-english-language", minimumScore: 4, maximumScore: 5, courses: [["ENC 1101", 3], ["ENC 1102", 3]], suffix: "scores-4-5" },
  { examId: "ap-microeconomics", minimumScore: 3, maximumScore: 5, courses: [["ECO 2023", 4]] },
  { examId: "ap-macroeconomics", minimumScore: 3, maximumScore: 5, courses: [["ECO 2013", 4]] },
  { examId: "ap-statistics", minimumScore: 3, maximumScore: 5, courses: [["STA 2023", 3]] },
  { examId: "ap-us-government", minimumScore: 3, maximumScore: 5, courses: [["POS 2041", 3]] },
  { examId: "clep-sociology", minimumScore: 50, maximumScore: 80, courses: [["SYG 2000", 3]] },
  { examId: "clep-psychology", minimumScore: 50, maximumScore: 80, courses: [["PSY 2012", 3]] },
  { examId: "clep-government", minimumScore: 50, maximumScore: 80, courses: [["POS 2041", 3]] },
  { examId: "clep-college-algebra", minimumScore: 50, maximumScore: 80, courses: [["MAC 1105", 3]] },
  { examId: "clep-calculus", minimumScore: 50, maximumScore: 80, courses: [["MAC 2233", 3]] },
  { examId: "clep-college-composition", minimumScore: 50, maximumScore: 80, courses: [["ENC 1101", 3], ["ENC 1102", 3]] },
  { examId: "clep-microeconomics", minimumScore: 50, maximumScore: 80, courses: [["ECO 2023", 4]] },
  { examId: "clep-macroeconomics", minimumScore: 50, maximumScore: 80, courses: [["ECO 2013", 4]] },
];

export const ufEquivalencies: ExamEquivalency[] = ufMappings.map((mapping) => ({
  id: `uf-${mapping.examId}${mapping.suffix ? `-${mapping.suffix}` : ""}`,
  universityId: "uf",
  examId: mapping.examId,
  minimumScore: mapping.minimumScore,
  maximumScore: mapping.maximumScore,
  courses: mapping.courses.map(([courseCode, credits]) => ({
    courseCode,
    courseName: `UF course equivalent: ${courseCode}`,
    credits,
  })),
  verification: "verified",
  sourceId: ufExamCreditSource.id,
}));

export const ufSources = [ufFinanceSource, ufExamCreditSource, ufGeneralEducationSource];
