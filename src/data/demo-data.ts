import type {
  AcademicDataset,
  AcademicSource,
  DegreeRequirement,
  Exam,
  ExamEquivalency,
  Program,
  StudentCredit,
  StudentPlan,
  University,
} from "@/lib/academic-engine/types";

export const DEMO_NOTICE =
  "Illustrative demo data—not official academic information. Verify all decisions with the university or an academic adviser.";

const demoSource: AcademicSource = {
  id: "creditmap-demo-source",
  title: "CreditMap competition demo dataset",
  url: "/about#methodology",
  academicYear: "Illustrative only",
  checkedAt: "2026-08-09",
  notes: "Fictional, structurally realistic records created to demonstrate the CreditMap workflow.",
  verification: "demo",
};

export const universities: University[] = [
  {
    id: "uf",
    slug: "university-of-florida",
    name: "University of Florida",
    shortName: "UF",
    location: "Gainesville, Florida",
    tuitionPerCredit: 212.71,
    tuitionAcademicYear: "Demo estimate",
    sourceId: demoSource.id,
  },
  {
    id: "fiu",
    slug: "florida-international-university",
    name: "Florida International University",
    shortName: "FIU",
    location: "Miami, Florida",
    tuitionPerCredit: 205.57,
    tuitionAcademicYear: "Demo estimate",
    sourceId: demoSource.id,
  },
  {
    id: "fsu",
    slug: "florida-state-university",
    name: "Florida State University",
    shortName: "FSU",
    location: "Tallahassee, Florida",
    tuitionPerCredit: 215.55,
    tuitionAcademicYear: "Demo estimate",
    sourceId: demoSource.id,
  },
  {
    id: "ucf",
    slug: "university-of-central-florida",
    name: "University of Central Florida",
    shortName: "UCF",
    location: "Orlando, Florida",
    tuitionPerCredit: 212.28,
    tuitionAcademicYear: "Demo estimate",
    sourceId: demoSource.id,
  },
  {
    id: "usf",
    slug: "university-of-south-florida",
    name: "University of South Florida",
    shortName: "USF",
    location: "Tampa, Florida",
    tuitionPerCredit: 211.19,
    tuitionAcademicYear: "Demo estimate",
    sourceId: demoSource.id,
  },
];

export const exams: Exam[] = [
  { id: "ap-calculus-ab", name: "AP Calculus AB", sourceType: "AP", scoreLabel: "AP score", scoreMin: 1, scoreMax: 5 },
  { id: "ap-calculus-bc", name: "AP Calculus BC", sourceType: "AP", scoreLabel: "AP score", scoreMin: 1, scoreMax: 5 },
  { id: "ap-psychology", name: "AP Psychology", sourceType: "AP", scoreLabel: "AP score", scoreMin: 1, scoreMax: 5 },
  { id: "ap-english-language", name: "AP English Language and Composition", sourceType: "AP", scoreLabel: "AP score", scoreMin: 1, scoreMax: 5 },
  { id: "ap-microeconomics", name: "AP Microeconomics", sourceType: "AP", scoreLabel: "AP score", scoreMin: 1, scoreMax: 5 },
  { id: "ap-macroeconomics", name: "AP Macroeconomics", sourceType: "AP", scoreLabel: "AP score", scoreMin: 1, scoreMax: 5 },
  { id: "clep-sociology", name: "CLEP Introductory Sociology", sourceType: "CLEP", scoreLabel: "CLEP score", scoreMin: 20, scoreMax: 80 },
  { id: "clep-psychology", name: "CLEP Introductory Psychology", sourceType: "CLEP", scoreLabel: "CLEP score", scoreMin: 20, scoreMax: 80 },
  { id: "clep-government", name: "CLEP American Government", sourceType: "CLEP", scoreLabel: "CLEP score", scoreMin: 20, scoreMax: 80 },
  { id: "clep-college-algebra", name: "CLEP College Algebra", sourceType: "CLEP", scoreLabel: "CLEP score", scoreMin: 20, scoreMax: 80 },
  { id: "ib-business-management", name: "IB Business Management", sourceType: "IB", scoreLabel: "IB score", scoreMin: 1, scoreMax: 7 },
  { id: "aice-mathematics", name: "AICE Mathematics", sourceType: "AICE", scoreLabel: "Numeric demo score", scoreMin: 1, scoreMax: 5 },
];

type CourseKey = "calc1" | "calc2" | "psych" | "soc" | "comp" | "gov" | "micro" | "macro" | "algebra" | "business" | "stats";

function courseCode(shortName: string, key: CourseKey) {
  return `${shortName}-D-${key.toUpperCase()}`;
}

function courseName(key: CourseKey) {
  const names: Record<CourseKey, string> = {
    calc1: "Calculus I (Demo)",
    calc2: "Calculus II (Demo)",
    psych: "Introduction to Psychology (Demo)",
    soc: "Introduction to Sociology (Demo)",
    comp: "Written Composition (Demo)",
    gov: "American Government (Demo)",
    micro: "Microeconomics (Demo)",
    macro: "Macroeconomics (Demo)",
    algebra: "College Algebra (Demo)",
    business: "Business Foundations (Demo)",
    stats: "Business Statistics (Demo)",
  };
  return names[key];
}

function requirement(
  shortName: string,
  values: Omit<DegreeRequirement, "sourceId" | "verification">,
): DegreeRequirement {
  return {
    ...values,
    sourceId: demoSource.id,
    verification: "demo",
  };
}

function buildProgram(university: University): Program {
  const code = (key: CourseKey) => courseCode(university.shortName, key);
  const requirements: DegreeRequirement[] = [
    requirement(university.shortName, {
      id: `${university.id}-writing`,
      groupId: "general-education",
      groupLabel: "General Education",
      title: "Written Communication",
      description: "Complete the supported written-composition course.",
      credits: 3,
      order: 1,
      rule: { type: "specific_course", courseCode: code("comp") },
    }),
    requirement(university.shortName, {
      id: `${university.id}-quantitative`,
      groupId: "general-education",
      groupLabel: "General Education",
      title: "Quantitative Foundation",
      description: "Complete one supported mathematics option.",
      credits: 3,
      order: 2,
      rule: { type: "course_any", courseCodes: [code("calc1"), code("algebra")], requiredCount: 1 },
    }),
    requirement(university.shortName, {
      id: `${university.id}-social-science`,
      groupId: "general-education",
      groupLabel: "General Education",
      title: "Social Science Breadth",
      description: "Complete six credits from the supported social-science list.",
      credits: 6,
      order: 3,
      rule: {
        type: "minimum_credits",
        courseCodes: [code("psych"), code("soc"), code("gov"), code("micro"), code("macro")],
        requiredCredits: 6,
      },
    }),
    requirement(university.shortName, {
      id: `${university.id}-government`,
      groupId: "university-requirements",
      groupLabel: "University Requirements",
      title: "Civic Literacy Demonstration",
      description: "Illustrative government-course requirement for the demo.",
      credits: 3,
      order: 4,
      rule: { type: "specific_course", courseCode: code("gov") },
    }),
    requirement(university.shortName, {
      id: `${university.id}-economics`,
      groupId: "major-prerequisites",
      groupLabel: "Major Prerequisites",
      title: "Economics Sequence",
      description: "Complete both supported economics courses.",
      credits: 6,
      order: 5,
      rule: { type: "course_all", courseCodes: [code("micro"), code("macro")] },
    }),
    requirement(university.shortName, {
      id: `${university.id}-calculus`,
      groupId: "major-prerequisites",
      groupLabel: "Major Prerequisites",
      title: "Calculus for Business",
      description: "Complete the supported calculus course.",
      credits: 4,
      order: 6,
      rule: { type: "specific_course", courseCode: code("calc1") },
    }),
    requirement(university.shortName, {
      id: `${university.id}-statistics`,
      groupId: "major-core",
      groupLabel: "Major Core",
      title: "Business Statistics",
      description: "Complete the supported statistics course.",
      credits: 3,
      order: 7,
      rule: { type: "specific_course", courseCode: code("stats") },
    }),
    requirement(university.shortName, {
      id: `${university.id}-business-foundation`,
      groupId: "major-core",
      groupLabel: "Major Core",
      title: "Business Foundation",
      description: "Complete the supported introductory business course.",
      credits: 3,
      order: 8,
      rule: { type: "specific_course", courseCode: code("business") },
    }),
    requirement(university.shortName, {
      id: `${university.id}-unmodeled`,
      groupId: "additional-requirements",
      groupLabel: "Additional Program Requirements",
      title: "Requirements outside the demo dataset",
      description: "This competition dataset intentionally does not model every requirement in the degree.",
      credits: 89,
      order: 9,
      rule: { type: "manual_verification", reason: "Official program requirements have not been loaded." },
    }),
  ];

  return {
    id: `${university.id}-business-finance-demo`,
    universityId: university.id,
    name: "Business / Finance Pathway (Demo)",
    majorName: "Finance",
    degreeType: "Bachelor's pathway",
    catalogYear: "Illustrative demo",
    totalCredits: 120,
    sourceId: demoSource.id,
    requirements,
  };
}

export const programs = universities.map(buildProgram);

const baseMappings: Array<{
  examId: string;
  key: CourseKey;
  credits: number;
  apScore?: number;
  clepScore?: number;
  otherScore?: number;
}> = [
  { examId: "ap-calculus-ab", key: "calc1", credits: 4, apScore: 3 },
  { examId: "ap-psychology", key: "psych", credits: 3, apScore: 3 },
  { examId: "ap-english-language", key: "comp", credits: 3, apScore: 3 },
  { examId: "ap-microeconomics", key: "micro", credits: 3, apScore: 3 },
  { examId: "ap-macroeconomics", key: "macro", credits: 3, apScore: 3 },
  { examId: "clep-sociology", key: "soc", credits: 3, clepScore: 50 },
  { examId: "clep-psychology", key: "psych", credits: 3, clepScore: 50 },
  { examId: "clep-government", key: "gov", credits: 3, clepScore: 50 },
  { examId: "clep-college-algebra", key: "algebra", credits: 3, clepScore: 50 },
  { examId: "ib-business-management", key: "business", credits: 3, otherScore: 5 },
  { examId: "aice-mathematics", key: "stats", credits: 3, otherScore: 3 },
];

const thresholdOffsets: Record<string, number> = { uf: 0, fiu: -1, fsu: 1, ucf: 0, usf: 0 };

function buildEquivalencies(university: University): ExamEquivalency[] {
  const offset = thresholdOffsets[university.id] ?? 0;
  const regular = baseMappings.map((mapping) => {
    const exam = exams.find((item) => item.id === mapping.examId)!;
    const baseThreshold = mapping.apScore ?? mapping.clepScore ?? mapping.otherScore ?? exam.scoreMin;
    const adjusted = exam.sourceType === "AP" ? Math.max(1, Math.min(5, baseThreshold + offset)) : baseThreshold;
    return {
      id: `${university.id}-${mapping.examId}`,
      universityId: university.id,
      examId: mapping.examId,
      minimumScore: adjusted,
      maximumScore: exam.scoreMax,
      courses: [
        {
          courseCode: courseCode(university.shortName, mapping.key),
          courseName: courseName(mapping.key),
          credits: mapping.credits,
        },
      ],
      verification: "demo" as const,
      sourceId: demoSource.id,
    };
  });

  const calcBcExam = exams.find((item) => item.id === "ap-calculus-bc")!;
  regular.push({
    id: `${university.id}-ap-calculus-bc`,
    universityId: university.id,
    examId: calcBcExam.id,
    minimumScore: Math.max(1, Math.min(5, 3 + offset)),
    maximumScore: calcBcExam.scoreMax,
    courses: [
      { courseCode: courseCode(university.shortName, "calc1"), courseName: courseName("calc1"), credits: 4 },
      { courseCode: courseCode(university.shortName, "calc2"), courseName: courseName("calc2"), credits: 4 },
    ],
    verification: "demo",
    sourceId: demoSource.id,
  });

  return regular;
}

export const equivalencies = universities.flatMap(buildEquivalencies);

export const academicDataset: AcademicDataset = {
  sources: [demoSource],
  universities,
  programs,
  exams,
  equivalencies,
};

export const sampleCredits: StudentCredit[] = [
  {
    id: "sample-ap-calc",
    kind: "exam",
    sourceType: "AP",
    label: "AP Calculus AB",
    examId: "ap-calculus-ab",
    score: 4,
    status: "earned",
    createdAt: "2026-08-01T14:00:00.000Z",
  },
  {
    id: "sample-ap-psych",
    kind: "exam",
    sourceType: "AP",
    label: "AP Psychology",
    examId: "ap-psychology",
    score: 4,
    status: "earned",
    createdAt: "2026-08-01T14:01:00.000Z",
  },
  {
    id: "sample-clep-soc",
    kind: "exam",
    sourceType: "CLEP",
    label: "CLEP Introductory Sociology",
    examId: "clep-sociology",
    score: 56,
    status: "earned",
    createdAt: "2026-08-01T14:02:00.000Z",
  },
  {
    id: "sample-clep-psych",
    kind: "exam",
    sourceType: "CLEP",
    label: "CLEP Introductory Psychology",
    examId: "clep-psychology",
    score: 58,
    status: "earned",
    createdAt: "2026-08-01T14:03:00.000Z",
  },
  {
    id: "sample-dual-english",
    kind: "course",
    sourceType: "DUAL",
    label: "English Composition (Demo)",
    institution: "Florida public college (Demo)",
    courseCode: "UF-D-COMP",
    courseName: "Written Composition (Demo)",
    credits: 3,
    grade: "A",
    status: "earned",
    createdAt: "2026-08-01T14:04:00.000Z",
  },
];

export const samplePlan: StudentPlan = {
  id: "demo-plan",
  profileName: "Alex's plan",
  universityId: "uf",
  programId: "uf-business-finance-demo",
  credits: sampleCredits,
  updatedAt: "2026-08-09T16:00:00.000Z",
  recentChanges: [
    { id: "change-1", description: "Loaded the competition demo profile", createdAt: "2026-08-09T16:00:00.000Z" },
  ],
};

export function programForUniversity(universityId: string) {
  return programs.find((program) => program.universityId === universityId) ?? programs[0];
}
