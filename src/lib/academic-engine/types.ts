export type CreditSourceType = "AP" | "CLEP" | "DUAL" | "IB" | "AICE";

export type VerificationStatus = "demo" | "verified" | "verification_required";

export type CreditStatus = "earned" | "expected";

export type RequirementStatus =
  | "completed"
  | "in_progress"
  | "remaining"
  | "verification_required";

export type AcademicSource = {
  id: string;
  title: string;
  url: string;
  academicYear: string;
  checkedAt: string;
  notes: string;
  verification: VerificationStatus;
};

export type University = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  location: string;
  tuitionPerCredit: number;
  tuitionAcademicYear: string;
  sourceId: string;
};

export type Exam = {
  id: string;
  name: string;
  sourceType: Exclude<CreditSourceType, "DUAL">;
  scoreLabel: string;
  scoreMin: number;
  scoreMax: number;
};

export type EquivalentCourse = {
  courseCode: string;
  courseName: string;
  credits: number;
};

export type ExamEquivalency = {
  id: string;
  universityId: string;
  examId: string;
  minimumScore: number;
  maximumScore: number;
  courses: EquivalentCourse[];
  verification: VerificationStatus;
  sourceId: string;
};

export type RequirementRule =
  | { type: "specific_course"; courseCode: string }
  | { type: "course_any"; courseCodes: string[]; requiredCount: number }
  | { type: "course_all"; courseCodes: string[] }
  | { type: "alternative_course_groups"; courseGroups: string[][] }
  | { type: "minimum_credits"; courseCodes: string[]; requiredCredits: number }
  | { type: "manual_verification"; reason: string };

export type DegreeRequirement = {
  id: string;
  groupId: string;
  groupLabel: string;
  title: string;
  description: string;
  credits: number;
  order: number;
  rule: RequirementRule;
  allowsSharedCourse?: boolean;
  verification: VerificationStatus;
  sourceId: string;
};

export type Program = {
  id: string;
  universityId: string;
  name: string;
  majorName: string;
  degreeType: string;
  catalogYear: string;
  totalCredits: number;
  sourceId: string;
  requirements: DegreeRequirement[];
};

type StudentCreditBase = {
  id: string;
  sourceType: CreditSourceType;
  label: string;
  status: CreditStatus;
  createdAt: string;
};

export type StudentExamCredit = StudentCreditBase & {
  kind: "exam";
  examId: string;
  score: number;
};

export type StudentCourseCredit = StudentCreditBase & {
  kind: "course";
  sourceType: "DUAL";
  institution: string;
  courseCode: string;
  courseName: string;
  credits: number;
  grade: string;
};

export type StudentCredit = StudentExamCredit | StudentCourseCredit;

export type StudentPlan = {
  id: string;
  profileName: string;
  universityId: string;
  programId: string;
  credits: StudentCredit[];
  updatedAt: string;
  recentChanges: Array<{ id: string; description: string; createdAt: string }>;
};

export type ResolvedCourse = EquivalentCourse & {
  sourceCreditId: string;
  verification: VerificationStatus;
  sourceId: string;
  duplicateOfCreditId?: string;
};

export type ResolvedCredit = {
  credit: StudentCredit;
  courses: ResolvedCourse[];
  acceptedCredits: number;
  verification: VerificationStatus;
  note: string;
  duplicateOfCreditId?: string;
};

export type RequirementResult = {
  requirement: DegreeRequirement;
  status: RequirementStatus;
  appliedCredits: number;
  matchedCourses: ResolvedCourse[];
  satisfiedBy: StudentCredit[];
  explanation: string;
};

export type Recommendation = {
  id: string;
  exam: Exam;
  minimumScore: number;
  courses: EquivalentCourse[];
  requirementId: string;
  requirementTitle: string;
  potentialCredits: number;
  reason: string;
  rank: number;
  verification: VerificationStatus;
  sourceId: string;
};

export type PlanResult = {
  plan: StudentPlan;
  program: Program;
  university: University;
  resolvedCredits: ResolvedCredit[];
  requirementResults: RequirementResult[];
  recommendations: Recommendation[];
  acceptedCredits: number;
  applicableCredits: number;
  electiveCredits: number;
  duplicateCredits: number;
  progressPercent: number;
  completedRequirements: number;
  totalRequirements: number;
};

export type AcademicDataset = {
  sources: AcademicSource[];
  universities: University[];
  programs: Program[];
  exams: Exam[];
  equivalencies: ExamEquivalency[];
};
