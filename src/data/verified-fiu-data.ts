import type {
  AcademicSource,
  DegreeRequirement,
  ExamEquivalency,
  Program,
} from "@/lib/academic-engine/types";

const checkedAt = "2026-08-10";

export const fiuFinanceSource: AcademicSource = {
  id: "fiu-finance-catalog-current",
  title: "FIU Catalog — Finance BBA",
  url: "https://catalog.fiu.edu/programs/FIN%3ABBA/requirements-uz47h",
  academicYear: "Live FIU catalog; current requirements",
  checkedAt,
  notes:
    "The 120-credit Finance BBA, progression rules, 21-credit major, business electives, and comprehensive-exam requirement were checked against FIU's live catalog.",
  verification: "verified",
};

export const fiuFinanceCoursesSource: AcademicSource = {
  id: "fiu-finance-courses-current",
  title: "FIU College of Business — Finance BBA Courses",
  url: "https://business.fiu.edu/academics/undergraduate/bba-finance/",
  academicYear: "Current program page",
  checkedAt,
  notes:
    "The six required Finance courses and Finance or Real Estate elective were checked against the official FIU College of Business program page.",
  verification: "verified",
};

export const fiuBusinessPreCoreSource: AcademicSource = {
  id: "fiu-business-pre-core-current",
  title: "FIU College of Business — Business Pre-Core Courses",
  url: "https://business.fiu.edu/academics/undergraduate/advising/business-pre-core-courses/",
  academicYear: "Current program page",
  checkedAt,
  notes:
    "The seven common prerequisite courses, minimum grade, GPA, and attempt policies were checked against the official FIU College of Business advising page.",
  verification: "verified",
};

export const fiuBusinessCoreSource: AcademicSource = {
  id: "fiu-business-core-current",
  title: "FIU College of Business — Business Core Courses",
  url: "https://business.fiu.edu/academics/undergraduate/advising/business-core-courses/",
  academicYear: "Current program page",
  checkedAt,
  notes:
    "The 24-credit business core and three-credit professional-development sequence were checked against the official FIU College of Business advising page.",
  verification: "verified",
};

export const fiuExamCreditSource: AcademicSource = {
  id: "fiu-exam-credit-current",
  title: "FIU Transfer & Transition Services — Credit-By-Exam Tables",
  url: "https://transfer.fiu.edu/transfer-101/credit-options/credit-by-exam-tables/",
  academicYear: "Live FIU equivalency tables",
  checkedAt,
  notes:
    "Supported AP and CLEP score thresholds, course equivalents, UCC designations, maximum exam credit, and duplicate-credit policy were checked against FIU's live tables.",
  verification: "verified",
};

export const fiuUccSource: AcademicSource = {
  id: "fiu-ucc-2026",
  title: "FIU Catalog — 2026 University Core Curriculum",
  url: "https://catalog.fiu.edu/policiesandprocesses/program-graduation/undergraduate-requirements/universitycore",
  academicYear: "2026 University Core Curriculum",
  checkedAt,
  notes:
    "The 36-credit UCC category structure and 2026 entrant rules were checked against the live FIU catalog. Writing, grade, lab, civic-literacy, and other record-level conditions still require adviser review.",
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

const uccRequirements: DegreeRequirement[] = [
  verifiedRequirement(fiuUccSource.id, {
    id: "fiu-ucc-writing-sequence",
    groupId: "general-education",
    groupLabel: "University Core Curriculum",
    title: "Writing and Rhetoric sequence",
    description:
      "Complete ENC 1101 and ENC 1102 as two of the three required Communication courses. A grade of C or higher is required for UCC Communication coursework.",
    credits: 6,
    order: 1,
    allowsSharedCourse: true,
    rule: { type: "course_all", courseCodes: ["ENC 1101", "ENC 1102"] },
  }),
  verifiedRequirement(fiuUccSource.id, {
    id: "fiu-ucc-public-speaking",
    groupId: "general-education",
    groupLabel: "University Core Curriculum",
    title: "SPC 2608 — Public Speaking",
    description: "Complete SPC 2608 as the third required Communication course.",
    credits: 3,
    order: 2,
    allowsSharedCourse: true,
    rule: { type: "specific_course", courseCode: "SPC 2608" },
  }),
  verifiedRequirement(fiuUccSource.id, {
    id: "fiu-ucc-math-group-one",
    groupId: "general-education",
    groupLabel: "University Core Curriculum",
    title: "Mathematics Group One",
    description:
      "Complete one approved Group One mathematics course. This supported model includes MAC 1105, MAC 2311, and STA 2023.",
    credits: 3,
    order: 3,
    allowsSharedCourse: true,
    rule: {
      type: "course_any",
      courseCodes: ["MAC 1105", "MAC 2311", "STA 2023"],
      requiredCount: 1,
    },
  }),
  verifiedRequirement(fiuUccSource.id, {
    id: "fiu-ucc-math-group-two",
    groupId: "general-education",
    groupLabel: "University Core Curriculum",
    title: "Mathematics Group Two",
    description:
      "Complete a second approved mathematics course. This supported model includes MAC 2233 and MAC 2312.",
    credits: 3,
    order: 4,
    allowsSharedCourse: true,
    rule: {
      type: "course_any",
      courseCodes: ["MAC 2233", "MAC 2312"],
      requiredCount: 1,
    },
  }),
  verifiedRequirement(fiuUccSource.id, {
    id: "fiu-ucc-social-group-one",
    groupId: "general-education",
    groupLabel: "University Core Curriculum",
    title: "Social Science Group One",
    description:
      "Complete one approved Group One Social Science course. This supported model includes ECO 2013, POS 2041, and PSY 2012.",
    credits: 3,
    order: 5,
    allowsSharedCourse: true,
    rule: {
      type: "course_any",
      courseCodes: ["ECO 2013", "POS 2041", "PSY 2012"],
      requiredCount: 1,
    },
  }),
  verifiedRequirement(fiuUccSource.id, {
    id: "fiu-ucc-social-group-two",
    groupId: "general-education",
    groupLabel: "University Core Curriculum",
    title: "Social Science Group Two",
    description:
      "Complete one approved Group Two Social Science course. ECO 2023 is the supported Finance-pre-core option in this model.",
    credits: 3,
    order: 6,
    allowsSharedCourse: true,
    rule: { type: "specific_course", courseCode: "ECO 2023" },
  }),
  verifiedRequirement(fiuUccSource.id, {
    id: "fiu-ucc-remaining-categories",
    groupId: "general-education",
    groupLabel: "University Core Curriculum",
    title: "Humanities, Natural Science, lab, and Student Choice",
    description:
      "The remaining UCC categories require approved course, lab, writing, and record-level designation checks that are not yet automated.",
    credits: 15,
    order: 7,
    rule: {
      type: "manual_verification",
      reason:
        "Verification required: approved Humanities, Natural Science, lab, Student Choice, and writing-intensive designations must be checked against the student's record.",
    },
  }),
];

const preCoreCourses: Array<[string, string]> = [
  ["ACG 2021", "Accounting for Decisions"],
  ["ACG 3301", "Managerial Accounting"],
  ["CGS 2100", "Introduction to Microcomputer Applications for Business"],
  ["ECO 2013", "Principles of Macroeconomics"],
  ["ECO 2023", "Principles of Microeconomics"],
  ["STA 2023", "Statistical Methods"],
  ["MAC 2233", "Applied Calculus"],
];

const businessCoreCourses: Array<[string, string]> = [
  ["BUL 4310", "Legal Environment of Business"],
  ["ISM 3011", "Information Systems Management"],
  ["FIN 3403", "Financial Management"],
  ["MAN 3025", "Organization and Management"],
  ["QMB 4680", "Business Statistics and Analysis 2"],
  ["MAN 4720", "Strategic Management"],
  ["MAR 3023", "Introduction to Marketing"],
  ["QMB 3200", "Business Statistics and Analysis 1"],
];

const financeCourses: Array<[string, string]> = [
  ["FIN 3414", "Intermediate Finance"],
  ["FIN 4324", "Commercial Bank Management"],
  ["FIN 4303", "Financial Markets and Institutions"],
  ["FIN 4502", "Securities Analysis"],
  ["FIN 4604", "International Financial Management"],
  ["FIN 4486", "Financial Risk Management–Financial Engineering"],
];

const programRequirements: DegreeRequirement[] = [
  ...uccRequirements,
  ...preCoreCourses.map(([courseCode, courseName], index) =>
    verifiedRequirement(fiuBusinessPreCoreSource.id, {
      id: `fiu-pre-core-${courseCode.toLowerCase().replace(" ", "-")}`,
      groupId: "major-prerequisites",
      groupLabel: "Business Pre-Core",
      title: `${courseCode} — ${courseName}`,
      description:
        "Required Business pre-core course. FIU publishes a minimum C grade, a combined pre-core GPA rule, and attempt limits that require record review.",
      credits: 3,
      order: 8 + index,
      rule: { type: "specific_course", courseCode },
    }),
  ),
  ...businessCoreCourses.map(([courseCode, courseName], index) =>
    verifiedRequirement(fiuBusinessCoreSource.id, {
      id: `fiu-business-core-${courseCode.toLowerCase().replace(" ", "-")}`,
      groupId: "business-core",
      groupLabel: "Business Core",
      title: `${courseCode} — ${courseName}`,
      description: "Required course in FIU's 24-credit BBA business core.",
      credits: 3,
      order: 15 + index,
      rule: { type: "specific_course", courseCode },
    }),
  ),
  verifiedRequirement(fiuBusinessCoreSource.id, {
    id: "fiu-professional-com-3112",
    groupId: "professional-development",
    groupLabel: "Professional Development",
    title: "COM 3112 — Speech and Writing for Business Communication",
    description: "Required two-credit professional-development course.",
    credits: 2,
    order: 23,
    rule: { type: "specific_course", courseCode: "COM 3112" },
  }),
  verifiedRequirement(fiuBusinessCoreSource.id, {
    id: "fiu-professional-geb-3003",
    groupId: "professional-development",
    groupLabel: "Professional Development",
    title: "GEB 3003 — Career Management",
    description: "Required one-credit professional-development course.",
    credits: 1,
    order: 24,
    rule: { type: "specific_course", courseCode: "GEB 3003" },
  }),
  ...financeCourses.map(([courseCode, courseName], index) =>
    verifiedRequirement(fiuFinanceCoursesSource.id, {
      id: `fiu-finance-major-${courseCode.toLowerCase().replace(" ", "-")}`,
      groupId: "major-courses",
      groupLabel: "Finance Major Courses",
      title: `${courseCode} — ${courseName}`,
      description: "Required course in FIU's Finance BBA major sequence.",
      credits: 3,
      order: 25 + index,
      rule: { type: "specific_course", courseCode },
    }),
  ),
  verifiedRequirement(fiuFinanceCoursesSource.id, {
    id: "fiu-finance-major-elective",
    groupId: "major-courses",
    groupLabel: "Finance Major Courses",
    title: "Finance or Real Estate elective",
    description: "Complete one approved FIN or REE elective to finish the 21-credit major sequence.",
    credits: 3,
    order: 31,
    rule: {
      type: "manual_verification",
      reason: "Verification required: the selected upper-division FIN or REE elective must be approved for the student's catalog year.",
    },
  }),
  verifiedRequirement(fiuFinanceSource.id, {
    id: "fiu-upper-division-business-electives",
    groupId: "business-electives",
    groupLabel: "Upper-Division Business Electives",
    title: "Upper-division business electives",
    description: "Complete 12 credits of approved upper-division business electives.",
    credits: 12,
    order: 32,
    rule: {
      type: "manual_verification",
      reason: "Verification required: elective level, prefix, approval, and catalog-year applicability require adviser review.",
    },
  }),
  verifiedRequirement(fiuFinanceSource.id, {
    id: "fiu-additional-graduation-requirements",
    groupId: "additional-requirements",
    groupLabel: "Additional Graduation Requirements",
    title: "Record-level graduation checks",
    description:
      "FIU also applies GPA, residency, summer enrollment, foreign-language, civic-literacy, first-year, global-learning, and comprehensive-exam rules according to the student's record.",
    credits: 0,
    order: 33,
    rule: {
      type: "manual_verification",
      reason: "Verification required: these conditions depend on the student's entry term, history, grades, and official degree audit.",
    },
  }),
];

export const fiuFinanceProgram: Program = {
  id: "fiu-finance-bba-current",
  universityId: "fiu",
  name: "Finance BBA",
  majorName: "Finance",
  degreeType: "Bachelor of Business Administration",
  catalogYear: "Current FIU catalog with 2026 UCC",
  totalCredits: 120,
  sourceId: fiuFinanceSource.id,
  requirements: programRequirements,
};

type VerifiedEquivalency = {
  examId: string;
  minimumScore: number;
  maximumScore: number;
  courses: Array<[courseCode: string, courseName: string, credits: number]>;
  suffix?: string;
};

const fiuMappings: VerifiedEquivalency[] = [
  { examId: "ap-calculus-ab", minimumScore: 3, maximumScore: 5, courses: [["MAC 2311", "Calculus I", 4]] },
  { examId: "ap-calculus-bc", minimumScore: 3, maximumScore: 3, courses: [["MAC 2311", "Calculus I", 4]], suffix: "score-3" },
  { examId: "ap-calculus-bc", minimumScore: 4, maximumScore: 5, courses: [["MAC 2311", "Calculus I", 4], ["MAC 2312", "Calculus II", 4]], suffix: "scores-4-5" },
  { examId: "ap-psychology", minimumScore: 3, maximumScore: 5, courses: [["PSY 2012", "Introductory Psychology", 3]] },
  { examId: "ap-english-language", minimumScore: 3, maximumScore: 3, courses: [["ENC 1101", "Writing and Rhetoric I", 3]], suffix: "score-3" },
  { examId: "ap-english-language", minimumScore: 4, maximumScore: 5, courses: [["ENC 1101", "Writing and Rhetoric I", 3], ["ENC 1102", "Writing and Rhetoric II", 3]], suffix: "scores-4-5" },
  { examId: "ap-microeconomics", minimumScore: 3, maximumScore: 5, courses: [["ECO 2023", "Principles of Microeconomics", 3]] },
  { examId: "ap-macroeconomics", minimumScore: 3, maximumScore: 5, courses: [["ECO 2013", "Principles of Macroeconomics", 3]] },
  { examId: "ap-statistics", minimumScore: 3, maximumScore: 5, courses: [["STA 2023", "Statistical Methods", 3]] },
  { examId: "ap-us-government", minimumScore: 3, maximumScore: 5, courses: [["POS 2041", "American Government", 3]] },
  { examId: "clep-sociology", minimumScore: 50, maximumScore: 80, courses: [["SYG 2000", "Introductory Sociology", 3]] },
  { examId: "clep-psychology", minimumScore: 50, maximumScore: 80, courses: [["PSY 2012", "Introductory Psychology", 3]] },
  { examId: "clep-government", minimumScore: 50, maximumScore: 80, courses: [["POS 2041", "American Government", 3]] },
  { examId: "clep-college-algebra", minimumScore: 50, maximumScore: 80, courses: [["MAC 1105", "College Algebra", 3]] },
  { examId: "clep-calculus", minimumScore: 50, maximumScore: 80, courses: [["MAC 2233", "Applied Calculus", 3]] },
  { examId: "clep-college-composition", minimumScore: 50, maximumScore: 80, courses: [["ENC 1101", "Writing and Rhetoric I", 3], ["ENC 1102", "Writing and Rhetoric II", 3]] },
  { examId: "clep-microeconomics", minimumScore: 50, maximumScore: 80, courses: [["ECO 2023", "Principles of Microeconomics", 3]] },
  { examId: "clep-macroeconomics", minimumScore: 50, maximumScore: 80, courses: [["ECO 2013", "Principles of Macroeconomics", 3]] },
];

export const fiuEquivalencies: ExamEquivalency[] = fiuMappings.map((mapping) => ({
  id: `fiu-${mapping.examId}${mapping.suffix ? `-${mapping.suffix}` : ""}`,
  universityId: "fiu",
  examId: mapping.examId,
  minimumScore: mapping.minimumScore,
  maximumScore: mapping.maximumScore,
  courses: mapping.courses.map(([courseCode, courseName, credits]) => ({
    courseCode,
    courseName,
    credits,
  })),
  verification: "verified",
  sourceId: fiuExamCreditSource.id,
}));

export const fiuSources = [
  fiuFinanceSource,
  fiuFinanceCoursesSource,
  fiuBusinessPreCoreSource,
  fiuBusinessCoreSource,
  fiuExamCreditSource,
  fiuUccSource,
];
