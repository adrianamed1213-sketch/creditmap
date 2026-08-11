import type {
  AcademicSource,
  DegreeRequirement,
  ExamEquivalency,
  Program,
} from "@/lib/academic-engine/types";

const checkedAt = "2026-08-10";

export const ucfFinanceSource: AcademicSource = {
  id: "ucf-finance-bsba-current",
  title: "UCF - Finance BSBA",
  url: "https://www.ucf.edu/degree/finance-bsba/",
  academicYear: "Live UCF degree page; current requirements",
  checkedAt,
  notes:
    "The 120-credit Finance BSBA, 60-credit advanced business segment, major courses, electives, capstone, transfer notes, and exit requirements were checked against UCF's live degree page.",
  verification: "verified",
};

export const ucfFinancePlanSource: AcademicSource = {
  id: "ucf-finance-plan-current",
  title: "UCF Miller College of Business - Finance plan of study",
  url: "https://business.ucf.edu/degree/finance/",
  academicYear: "Current program page",
  checkedAt,
  notes:
    "The lower-division plan, Business Common Program Prerequisites, primary core, and four-year course sequence were checked against the official college page.",
  verification: "verified",
};

export const ucfBusinessAdmissionSource: AcademicSource = {
  id: "ucf-business-admission-current",
  title: "UCF Miller College of Business - Admission standards",
  url: "https://business.ucf.edu/centers-institutes/office-of-professional-development/cba-policies/",
  academicYear: "Current policy page",
  checkedAt,
  notes:
    "Primary-core courses, Finance admission grades, GPA rules, and attempt limits were checked against the official College of Business policy page.",
  verification: "verified",
};

export const ucfGepSource: AcademicSource = {
  id: "ucf-gep-2026-27",
  title: "UCF - 2026-2027 General Education Program worksheet",
  url: "https://undergrad.ucf.edu/wp-content/uploads/sites/7/2026/04/2026-2027-GEP-Worksheet.pdf",
  academicYear: "2026-2027",
  checkedAt,
  notes:
    "The 36-credit GEP, five foundations, state-core designations, and supported Communication, Mathematics, and Social Sciences courses were checked against the official worksheet revised May 14, 2026.",
  verification: "verified",
};

export const ucfCivicSource: AcademicSource = {
  id: "ucf-civic-literacy-current",
  title: "UCF - Civic Literacy",
  url: "https://undergrad.ucf.edu/civic-literacy/",
  academicYear: "2024-2025 entrants and after",
  checkedAt,
  notes:
    "The current course-and-assessment rule and the published AP U.S. Government and CLEP American Government pathways were checked against UCF's official Civic Literacy page.",
  verification: "verified",
};

export const floridaExamCreditSource: AcademicSource = {
  id: "florida-acc-exam-credit-aug-2026",
  title: "Florida Articulation Coordinating Committee - Credit-by-Exam Equivalencies",
  url: "https://www.flbog.edu/wp-content/uploads/2026/06/ACC-Credit-by-Exam-Equivalencies-List.pdf",
  academicYear: "Effective August 2026",
  checkedAt,
  notes:
    "Florida public colleges and universities must award these minimum AP and CLEP equivalents. CreditMap uses only the statewide minimum, maps statewide course-number placeholders to UCF course numbers, and suppresses duplicate exam or course credit.",
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

const gepRequirements: DegreeRequirement[] = [
  verifiedRequirement(ucfGepSource.id, {
    id: "ucf-gep-communication",
    groupId: "general-education",
    groupLabel: "General Education Program",
    title: "Communication Foundation: ENC 1101 and ENC 1102",
    description:
      "Complete both English composition courses in the 2026-2027 UCF GEP Communication Foundation.",
    credits: 6,
    order: 1,
    allowsSharedCourse: true,
    rule: { type: "course_all", courseCodes: ["ENC 1101", "ENC 1102"] },
  }),
  verifiedRequirement(ucfGepSource.id, {
    id: "ucf-gep-mathematics",
    groupId: "general-education",
    groupLabel: "General Education Program",
    title: "Mathematics Foundation",
    description:
      "Complete at least two approved Mathematics Foundation courses, including a Florida state core course. This supported model includes MAC 1105C, MAC 2311C, and STA 2023.",
    credits: 6,
    order: 2,
    allowsSharedCourse: true,
    rule: {
      type: "course_any",
      courseCodes: ["MAC 1105C", "MAC 2311C", "STA 2023"],
      requiredCount: 2,
    },
  }),
  verifiedRequirement(ucfGepSource.id, {
    id: "ucf-gep-social-sciences",
    groupId: "general-education",
    groupLabel: "General Education Program",
    title: "Social Sciences Foundation",
    description:
      "Complete at least two approved Social Sciences Foundation courses, including a Florida state core course. This supported model includes PSY 2012, ECO 2013, ECO 2023, and POS 2041.",
    credits: 6,
    order: 3,
    allowsSharedCourse: true,
    rule: {
      type: "course_any",
      courseCodes: ["PSY 2012", "ECO 2013", "ECO 2023", "POS 2041"],
      requiredCount: 2,
    },
  }),
  verifiedRequirement(ucfGepSource.id, {
    id: "ucf-gep-remaining-foundations",
    groupId: "general-education",
    groupLabel: "General Education Program",
    title: "Humanities, Natural Sciences, and remaining GEP choices",
    description:
      "The remaining 18 GEP credits require approved course, state-core, prerequisite, and record-level checks that are not yet automated.",
    credits: 18,
    order: 4,
    rule: {
      type: "manual_verification",
      reason:
        "Verification required: approved Humanities, Natural Sciences, and remaining GEP selections must be checked against the student's official degree audit.",
    },
  }),
  verifiedRequirement(ucfCivicSource.id, {
    id: "ucf-civic-literacy-course",
    groupId: "civic-literacy",
    groupLabel: "Civic Literacy",
    title: "Civic Literacy course pathway: POS 2041",
    description:
      "For 2024-2025 entrants and after, UCF requires a designated course and assessment. AP U.S. Government score 3 or CLEP American Government score 50 satisfies both through POS 2041.",
    credits: 3,
    order: 5,
    allowsSharedCourse: true,
    rule: { type: "specific_course", courseCode: "POS 2041" },
  }),
];

const commonPrerequisites: Array<[string, string]> = [
  ["MAC 1105C", "College Algebra"],
  ["ACG 2021", "Principles of Financial Accounting"],
  ["ACG 2071", "Principles of Managerial Accounting"],
  ["ECO 2013", "Principles of Macroeconomics"],
  ["ECO 2023", "Principles of Microeconomics"],
  ["CGS 2100C", "Computer Fundamentals for Business"],
];

const primaryCoreCourses: Array<[string, string]> = [
  ["ACG 3173", "Accounting for Decision-Makers"],
  ["QMB 3200", "Quantitative Business Tools II"],
  ["FIN 3403", "Business Finance"],
  ["MAN 3025", "Management of Organizations"],
  ["MAR 3023", "Marketing"],
];

const secondaryCoreCourses: Array<[string, string, number]> = [
  ["GEB 3006", "Introduction to Career Development and Financial Planning", 3],
  ["GEB 3005", "Career Search Strategy", 1],
  ["BUL 3130", "Legal and Ethical Environment of Business", 3],
  ["MAR 3203", "Supply Chain and Operations Management", 3],
  ["GEB 4223", "Business Interviewing Techniques", 1],
  ["GEB 4004", "Executing Your Career Plan", 1],
  ["QMB 3602", "Business Research for Decision Making", 3],
];

const financeMajorCourses: Array<[string, string]> = [
  ["FIN 3414", "Intermediate Corporate Finance"],
  ["FIN 4243", "Debt and Money Markets"],
  ["FIN 4504", "Equity and Capital Markets"],
  ["FIN 4424", "Advanced Topics in Financial Management"],
];

const financeElectiveCodes = [
  "FIN 3124",
  "FIN 3461",
  "FIN 4324",
  "FIN 4450",
  "FIN 4514",
  "FIN 4533",
  "FIN 4604",
  "FIN 4133",
];

const restrictedElectiveCodes = [
  "BUL 4135",
  "RMI 3011",
  "FIN 4560",
  "FIN 4433",
  "ACG 3141",
  "ECO 4412",
  "ECO 4422",
  "ECO 3101",
  "ECO 4443",
  "MAR 3391",
  "REE 4203",
  "REE 4303",
  "FIN 4941",
  "FIN 4451",
];

const programRequirements: DegreeRequirement[] = [
  ...gepRequirements,
  ...commonPrerequisites.map(([courseCode, courseName], index) =>
    verifiedRequirement(ucfFinancePlanSource.id, {
      id: `ucf-common-prerequisite-${courseCode.toLowerCase().replace(" ", "-")}`,
      groupId: "major-prerequisites",
      groupLabel: "Business Common Program Prerequisites",
      title: `${courseCode} - ${courseName}`,
      description:
        "Required Business Common Program Prerequisite. UCF publishes a minimum C grade and record-level progression rules.",
      credits: 3,
      order: 6 + index,
      rule: { type: "specific_course", courseCode },
    }),
  ),
  verifiedRequirement(ucfFinancePlanSource.id, {
    id: "ucf-common-prerequisite-quantitative-path",
    groupId: "major-prerequisites",
    groupLabel: "Business Common Program Prerequisites",
    title: "QMB 3003 or the STA 2023 + MAC 2233 waiver path",
    description:
      "Complete QMB 3003, or complete both STA 2023 and MAC 2233 to receive the published Quantitative Business Tools I waiver.",
    credits: 3,
    order: 12,
    allowsSharedCourse: true,
    rule: {
      type: "alternative_course_groups",
      courseGroups: [["QMB 3003"], ["STA 2023", "MAC 2233"]],
    },
  }),
  ...primaryCoreCourses.map(([courseCode, courseName], index) =>
    verifiedRequirement(ucfBusinessAdmissionSource.id, {
      id: `ucf-primary-core-${courseCode.toLowerCase().replace(" ", "-")}`,
      groupId: "primary-business-core",
      groupLabel: "Primary Business Core",
      title: `${courseCode} - ${courseName}`,
      description:
        "Required Primary Business Core course. Finance admission includes course-grade and combined-GPA conditions that require official record review.",
      credits: 3,
      order: 13 + index,
      rule: { type: "specific_course", courseCode },
    }),
  ),
  ...secondaryCoreCourses.map(([courseCode, courseName, credits], index) =>
    verifiedRequirement(ucfFinanceSource.id, {
      id: `ucf-secondary-core-${courseCode.toLowerCase().replace(" ", "-")}`,
      groupId: "secondary-business-core",
      groupLabel: "Secondary Business Core",
      title: `${courseCode} - ${courseName}`,
      description: "Required course in UCF's 15-credit Secondary Core.",
      credits,
      order: 18 + index,
      rule: { type: "specific_course", courseCode },
    }),
  ),
  ...financeMajorCourses.map(([courseCode, courseName], index) =>
    verifiedRequirement(ucfFinanceSource.id, {
      id: `ucf-finance-major-${courseCode.toLowerCase().replace(" ", "-")}`,
      groupId: "major-courses",
      groupLabel: "Finance Major Courses",
      title: `${courseCode} - ${courseName}`,
      description: "Required course in UCF's 12-credit Finance major sequence.",
      credits: 3,
      order: 25 + index,
      rule: { type: "specific_course", courseCode },
    }),
  ),
  verifiedRequirement(ucfFinanceSource.id, {
    id: "ucf-finance-electives",
    groupId: "major-electives",
    groupLabel: "Finance Electives",
    title: "Two approved Finance electives",
    description:
      "Complete at least six credits from the published Finance elective list; prerequisites and offering terms still require review.",
    credits: 6,
    order: 29,
    rule: {
      type: "minimum_credits",
      courseCodes: financeElectiveCodes,
      requiredCredits: 6,
    },
  }),
  verifiedRequirement(ucfFinanceSource.id, {
    id: "ucf-upper-level-business-elective",
    groupId: "major-electives",
    groupLabel: "Finance Electives",
    title: "Upper-level business elective",
    description: "Complete three credits from an approved upper-level business course.",
    credits: 3,
    order: 30,
    rule: {
      type: "manual_verification",
      reason:
        "Verification required: the selected upper-level business course and its applicability must be checked for the student's catalog year.",
    },
  }),
  verifiedRequirement(ucfFinanceSource.id, {
    id: "ucf-restricted-electives",
    groupId: "restricted-electives",
    groupLabel: "Restricted Electives",
    title: "Two approved restricted electives",
    description:
      "Complete at least six credits from UCF's published restricted-elective options. Substitution and prerequisite rules still require review.",
    credits: 6,
    order: 31,
    rule: {
      type: "minimum_credits",
      courseCodes: restrictedElectiveCodes,
      requiredCredits: 6,
    },
  }),
  verifiedRequirement(ucfFinanceSource.id, {
    id: "ucf-capstone-man-4720",
    groupId: "capstone",
    groupLabel: "Capstone",
    title: "MAN 4720 - Strategic Management",
    description:
      "Required three-credit capstone. Registration also requires senior standing and completion of the published business-core prerequisites.",
    credits: 3,
    order: 32,
    rule: { type: "specific_course", courseCode: "MAN 4720" },
  }),
  verifiedRequirement(ucfFinanceSource.id, {
    id: "ucf-additional-graduation-requirements",
    groupId: "additional-requirements",
    groupLabel: "Additional Graduation Requirements",
    title: "Record-level admission and graduation checks",
    description:
      "UCF also applies minimum grades, primary-core and major GPAs, attempt limits, residency, upper-division, summer, foreign-language, catalog-year, and 45-credit exam limits according to the student's record.",
    credits: 0,
    order: 33,
    rule: {
      type: "manual_verification",
      reason:
        "Verification required: these conditions depend on the student's entry term, grades, transfer history, and official UCF degree audit.",
    },
  }),
];

export const ucfFinanceProgram: Program = {
  id: "ucf-finance-bsba-2026-27",
  universityId: "ucf",
  name: "Finance BSBA",
  majorName: "Finance",
  degreeType: "Bachelor of Science in Business Administration",
  catalogYear: "Current UCF Finance requirements with 2026-2027 GEP",
  totalCredits: 120,
  sourceId: ucfFinanceSource.id,
  requirements: programRequirements,
};

type VerifiedEquivalency = {
  examId: string;
  minimumScore: number;
  maximumScore: number;
  courses: Array<[courseCode: string, courseName: string, credits: number]>;
  suffix?: string;
};

const ucfMappings: VerifiedEquivalency[] = [
  { examId: "ap-calculus-ab", minimumScore: 3, maximumScore: 5, courses: [["MAC 2311C", "Calculus with Analytic Geometry I", 4]] },
  { examId: "ap-calculus-bc", minimumScore: 3, maximumScore: 3, courses: [["MAC 2311C", "Calculus with Analytic Geometry I", 4]], suffix: "score-3" },
  { examId: "ap-calculus-bc", minimumScore: 4, maximumScore: 5, courses: [["MAC 2311C", "Calculus with Analytic Geometry I", 4], ["MAC 2312", "Calculus with Analytic Geometry II", 4]], suffix: "scores-4-5" },
  { examId: "ap-psychology", minimumScore: 3, maximumScore: 5, courses: [["PSY 2012", "General Psychology", 3]] },
  { examId: "ap-english-language", minimumScore: 3, maximumScore: 3, courses: [["ENC 1101", "English Composition I", 3]], suffix: "score-3" },
  { examId: "ap-english-language", minimumScore: 4, maximumScore: 5, courses: [["ENC 1101", "English Composition I", 3], ["ENC 1102", "English Composition II", 3]], suffix: "scores-4-5" },
  { examId: "ap-microeconomics", minimumScore: 3, maximumScore: 5, courses: [["ECO 2023", "Principles of Microeconomics", 3]] },
  { examId: "ap-macroeconomics", minimumScore: 3, maximumScore: 5, courses: [["ECO 2013", "Principles of Macroeconomics", 3]] },
  { examId: "ap-statistics", minimumScore: 3, maximumScore: 5, courses: [["STA 2023", "Statistical Methods I", 3]] },
  { examId: "ap-us-government", minimumScore: 3, maximumScore: 5, courses: [["POS 2041", "American National Government", 3]] },
  { examId: "clep-sociology", minimumScore: 50, maximumScore: 80, courses: [["SYG 2000", "Introductory Sociology", 3]] },
  { examId: "clep-psychology", minimumScore: 50, maximumScore: 80, courses: [["PSY 2012", "General Psychology", 3]] },
  { examId: "clep-government", minimumScore: 50, maximumScore: 80, courses: [["POS 2041", "American National Government", 3]] },
  { examId: "clep-college-algebra", minimumScore: 50, maximumScore: 80, courses: [["MAC 1105C", "College Algebra", 3]] },
  { examId: "clep-calculus", minimumScore: 50, maximumScore: 80, courses: [["MAC 2233", "Concepts of Calculus", 3]] },
  { examId: "clep-college-composition", minimumScore: 50, maximumScore: 80, courses: [["ENC 1101", "English Composition I", 3], ["ENC 1102", "English Composition II", 3]] },
  { examId: "clep-microeconomics", minimumScore: 50, maximumScore: 80, courses: [["ECO 2023", "Principles of Microeconomics", 3]] },
  { examId: "clep-macroeconomics", minimumScore: 50, maximumScore: 80, courses: [["ECO 2013", "Principles of Macroeconomics", 3]] },
];

export const ucfEquivalencies: ExamEquivalency[] = ucfMappings.map((mapping) => ({
  id: `ucf-${mapping.examId}${mapping.suffix ? `-${mapping.suffix}` : ""}`,
  universityId: "ucf",
  examId: mapping.examId,
  minimumScore: mapping.minimumScore,
  maximumScore: mapping.maximumScore,
  courses: mapping.courses.map(([courseCode, courseName, credits]) => ({
    courseCode,
    courseName,
    credits,
  })),
  verification: "verified",
  sourceId: floridaExamCreditSource.id,
}));

export const ucfSources = [
  ucfFinanceSource,
  ucfFinancePlanSource,
  ucfBusinessAdmissionSource,
  ucfGepSource,
  ucfCivicSource,
  floridaExamCreditSource,
];
