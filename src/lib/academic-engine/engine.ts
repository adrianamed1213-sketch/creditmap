import type {
  AcademicDataset,
  DegreeRequirement,
  ExamEquivalency,
  PlanResult,
  Program,
  Recommendation,
  RequirementResult,
  ResolvedCourse,
  ResolvedCredit,
  StudentCredit,
  StudentPlan,
} from "./types";

export function normalizeCourseCode(value: string) {
  return value.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function findProgram(plan: StudentPlan, dataset: AcademicDataset) {
  return (
    dataset.programs.find(
      (program) => program.id === plan.programId && program.universityId === plan.universityId,
    ) ?? dataset.programs.find((program) => program.universityId === plan.universityId)
  );
}

export function resolveExamEquivalency(
  credit: Extract<StudentCredit, { kind: "exam" }>,
  universityId: string,
  dataset: AcademicDataset,
): ResolvedCredit {
  const equivalency = dataset.equivalencies.find(
    (item) =>
      item.universityId === universityId &&
      item.examId === credit.examId &&
      credit.score >= item.minimumScore &&
      credit.score <= item.maximumScore,
  );

  if (!equivalency) {
    const possible = dataset.equivalencies.find(
      (item) => item.universityId === universityId && item.examId === credit.examId,
    );
    return {
      credit,
      courses: [],
      acceptedCredits: 0,
      verification: possible?.verification ?? "verification_required",
      note: possible
        ? `Score ${credit.score} does not meet the ${possible.verification === "verified" ? "published" : "illustrative"} threshold of ${possible.minimumScore}.`
        : "We could not verify an equivalency for this exam in the selected dataset.",
    };
  }

  const courses: ResolvedCourse[] = equivalency.courses.map((course) => ({
    ...course,
    sourceCreditId: credit.id,
    verification: equivalency.verification,
    sourceId: equivalency.sourceId,
  }));

  return {
    credit,
    courses,
    acceptedCredits: courses.reduce((total, course) => total + course.credits, 0),
    verification: equivalency.verification,
    note: `Score ${credit.score} meets the ${equivalency.verification === "verified" ? "published" : "illustrative"} threshold of ${equivalency.minimumScore}.`,
  };
}

function supportedCourseCodes(program: Program, dataset: AcademicDataset) {
  const codes = new Set<string>();
  for (const requirement of program.requirements) {
    const rule = requirement.rule;
    if (rule.type === "specific_course") codes.add(normalizeCourseCode(rule.courseCode));
    if (rule.type === "course_any" || rule.type === "course_all" || rule.type === "minimum_credits") {
      rule.courseCodes.forEach((code) => codes.add(normalizeCourseCode(code)));
    }
  }
  dataset.equivalencies
    .filter((equivalency) => equivalency.universityId === program.universityId)
    .flatMap((equivalency) => equivalency.courses)
    .forEach((course) => codes.add(normalizeCourseCode(course.courseCode)));
  return codes;
}

function resolveCourseCredit(
  credit: Extract<StudentCredit, { kind: "course" }>,
  program: Program,
  dataset: AcademicDataset,
): ResolvedCredit {
  const supported = supportedCourseCodes(program, dataset);
  if (!supported.has(normalizeCourseCode(credit.courseCode))) {
    return {
      credit,
      courses: [],
      acceptedCredits: 0,
      verification: "verification_required",
      note: "No supported transfer match exists for this manually entered course in the current dataset.",
    };
  }

  const programSource = dataset.sources.find((source) => source.id === program.sourceId);
  if (programSource?.verification === "verified") {
    return {
      credit,
      courses: [],
      acceptedCredits: 0,
      verification: "verification_required",
      note: "This course code appears in the selected degree, but CreditMap cannot confirm that this specific dual-enrollment record transfers. UF must review the institution, course equivalency, grade, and the student's catalog year.",
    };
  }

  const course: ResolvedCourse = {
    courseCode: credit.courseCode.trim().toUpperCase(),
    courseName: credit.courseName,
    credits: credit.credits,
    sourceCreditId: credit.id,
    verification: "demo",
    sourceId: program.sourceId,
  };
  return {
    credit,
    courses: [course],
    acceptedCredits: credit.credits,
    verification: "demo",
    note: "Matched to a supported illustrative course code. Official transfer review is still required.",
  };
}

export function resolveCredits(
  plan: StudentPlan,
  program: Program,
  dataset: AcademicDataset,
): ResolvedCredit[] {
  const initiallyResolved = plan.credits.map((credit) =>
    credit.kind === "exam"
      ? resolveExamEquivalency(credit, plan.universityId, dataset)
      : resolveCourseCredit(credit, program, dataset),
  );

  const resolutionOrder = initiallyResolved
    .map((resolved, index) => ({ resolved, index }))
    .sort((a, b) => {
      const aTransferPriority = a.resolved.credit.kind === "course" && a.resolved.courses.length > 0 ? 0 : 1;
      const bTransferPriority = b.resolved.credit.kind === "course" && b.resolved.courses.length > 0 ? 0 : 1;
      if (aTransferPriority !== bTransferPriority) return aTransferPriority - bTransferPriority;

      if (a.resolved.credit.kind === "exam" && b.resolved.credit.kind === "exam") {
        const creditDifference = b.resolved.acceptedCredits - a.resolved.acceptedCredits;
        if (creditDifference !== 0) return creditDifference;
      }

      return a.index - b.index;
    });

  const firstSourceByCourse = new Map<string, string>();
  const resolvedByCreditId = new Map<string, ResolvedCredit>();
  resolutionOrder.forEach(({ resolved }) => {
    let firstDuplicate: string | undefined;
    let acceptedCredits = 0;
    const courses = resolved.courses.map((course) => {
      const normalized = normalizeCourseCode(course.courseCode);
      const originalCreditId = firstSourceByCourse.get(normalized);
      if (originalCreditId) {
        firstDuplicate ??= originalCreditId;
        return { ...course, duplicateOfCreditId: originalCreditId };
      }
      firstSourceByCourse.set(normalized, resolved.credit.id);
      acceptedCredits += course.credits;
      return course;
    });

    resolvedByCreditId.set(resolved.credit.id, {
      ...resolved,
      courses,
      acceptedCredits,
      duplicateOfCreditId: firstDuplicate,
      note: firstDuplicate
        ? `${resolved.note} It overlaps another credit and is not counted twice.`
        : resolved.note,
    });
  });

  return initiallyResolved.map((resolved) => resolvedByCreditId.get(resolved.credit.id) ?? resolved);
}

function requirementPriority(requirement: DegreeRequirement) {
  const priorities = {
    specific_course: 1,
    course_all: 2,
    course_any: 3,
    minimum_credits: 4,
    manual_verification: 5,
  } as const;
  return priorities[requirement.rule.type];
}

function evaluateRequirement(
  requirement: DegreeRequirement,
  availableCourses: ResolvedCourse[],
  creditsById: Map<string, StudentCredit>,
  consumedCourseKeys: Set<string>,
): RequirementResult {
  if (requirement.rule.type === "manual_verification") {
    return {
      requirement,
      status: "verification_required",
      appliedCredits: 0,
      matchedCourses: [],
      satisfiedBy: [],
      explanation: requirement.rule.reason,
    };
  }

  const unused = availableCourses.filter(
    (course) => !consumedCourseKeys.has(`${course.sourceCreditId}:${normalizeCourseCode(course.courseCode)}`),
  );
  const byCodes = (codes: string[]) => {
    const normalized = new Set(codes.map(normalizeCourseCode));
    return unused.filter((course) => normalized.has(normalizeCourseCode(course.courseCode)));
  };

  let matched: ResolvedCourse[] = [];
  let complete = false;
  const rule = requirement.rule;

  if (rule.type === "specific_course") {
    const found = byCodes([rule.courseCode])[0];
    if (found) matched = [found];
    complete = Boolean(found);
  }

  if (rule.type === "course_any") {
    matched = byCodes(rule.courseCodes).slice(0, rule.requiredCount);
    complete = matched.length >= rule.requiredCount;
  }

  if (rule.type === "course_all") {
    const candidates = byCodes(rule.courseCodes);
    matched = rule.courseCodes
      .map((code) => candidates.find((course) => normalizeCourseCode(course.courseCode) === normalizeCourseCode(code)))
      .filter((course): course is ResolvedCourse => Boolean(course));
    complete = matched.length === rule.courseCodes.length;
  }

  if (rule.type === "minimum_credits") {
    const candidates = byCodes(rule.courseCodes);
    let credits = 0;
    for (const course of candidates) {
      if (credits >= rule.requiredCredits) break;
      matched.push(course);
      credits += course.credits;
    }
    complete = credits >= rule.requiredCredits;
  }

  matched.forEach((course) =>
    consumedCourseKeys.add(`${course.sourceCreditId}:${normalizeCourseCode(course.courseCode)}`),
  );
  const satisfiedBy = matched
    .map((course) => creditsById.get(course.sourceCreditId))
    .filter((credit): credit is StudentCredit => Boolean(credit));
  const appliedCredits = Math.min(
    requirement.credits,
    matched.reduce((total, course) => total + course.credits, 0),
  );
  const hasExpectedCredit = satisfiedBy.some((credit) => credit.status === "expected");
  const status = complete
    ? hasExpectedCredit
      ? "in_progress"
      : "completed"
    : matched.length > 0
      ? "in_progress"
      : "remaining";

  return {
    requirement,
    status,
    appliedCredits,
    matchedCourses: matched,
    satisfiedBy,
    explanation:
      status === "completed"
        ? `Satisfied by ${matched.map((course) => course.courseCode).join(", ")}.`
        : status === "in_progress"
          ? `${appliedCredits} of ${requirement.credits} credits are currently connected to this requirement.`
          : "No supported credit currently matches this requirement.",
  };
}

function evaluateRequirements(
  program: Program,
  plan: StudentPlan,
  resolvedCredits: ResolvedCredit[],
) {
  const canonicalCourses = resolvedCredits.flatMap((resolved) =>
    resolved.courses.filter((course) => !course.duplicateOfCreditId),
  );
  const creditsById = new Map(plan.credits.map((credit) => [credit.id, credit]));
  const consumedCourseKeys = new Set<string>();
  const evaluationOrder = [...program.requirements].sort(
    (a, b) => requirementPriority(a) - requirementPriority(b) || a.order - b.order,
  );
  const results = evaluationOrder.map((requirement) =>
    evaluateRequirement(requirement, canonicalCourses, creditsById, consumedCourseKeys),
  );
  return {
    results: results.sort((a, b) => a.requirement.order - b.requirement.order),
    consumedCourseKeys,
    canonicalCourses,
  };
}

function neededCourseCodes(result: RequirementResult) {
  const rule = result.requirement.rule;
  const matched = new Set(result.matchedCourses.map((course) => normalizeCourseCode(course.courseCode)));
  if (rule.type === "specific_course") return matched.size ? [] : [rule.courseCode];
  if (rule.type === "course_any") return matched.size >= rule.requiredCount ? [] : rule.courseCodes;
  if (rule.type === "course_all") {
    return rule.courseCodes.filter((code) => !matched.has(normalizeCourseCode(code)));
  }
  if (rule.type === "minimum_credits") return rule.courseCodes;
  return [];
}

export function generateRecommendations(
  plan: StudentPlan,
  requirementResults: RequirementResult[],
  canonicalCourses: ResolvedCourse[],
  dataset: AcademicDataset,
): Recommendation[] {
  const existingExamIds = new Set(
    plan.credits.filter((credit) => credit.kind === "exam").map((credit) => credit.examId),
  );
  const existingCourseCodes = new Set(canonicalCourses.map((course) => normalizeCourseCode(course.courseCode)));
  const candidates: Recommendation[] = [];

  for (const result of requirementResults) {
    if (result.status === "completed" || result.status === "verification_required") continue;
    const neededCodes = new Set(neededCourseCodes(result).map(normalizeCourseCode));
    if (neededCodes.size === 0) continue;

    const equivalencies = dataset.equivalencies.filter(
      (equivalency) =>
        equivalency.universityId === plan.universityId &&
        !existingExamIds.has(equivalency.examId) &&
        equivalency.courses.some(
          (course) =>
            neededCodes.has(normalizeCourseCode(course.courseCode)) &&
            !existingCourseCodes.has(normalizeCourseCode(course.courseCode)),
        ),
    );

    for (const equivalency of equivalencies) {
      const exam = dataset.exams.find((item) => item.id === equivalency.examId);
      if (!exam) continue;
      const connectedCourses = equivalency.courses.filter((course) =>
        neededCodes.has(normalizeCourseCode(course.courseCode)),
      );
      const potentialCredits = connectedCourses.reduce((sum, course) => sum + course.credits, 0);
      const directness = result.requirement.rule.type === "specific_course" ? 100 : 70;
      candidates.push({
        id: `${result.requirement.id}-${exam.id}`,
        exam,
        minimumScore: equivalency.minimumScore,
        courses: connectedCourses,
        requirementId: result.requirement.id,
        requirementTitle: result.requirement.title,
        potentialCredits,
        reason: `${exam.name} may produce ${connectedCourses.map((course) => course.courseCode).join(", ")}, which connects directly to the remaining ${result.requirement.title} requirement${equivalency.verification === "verified" ? " using the published UF equivalency" : " in this demo"}.`,
        rank: directness + potentialCredits * 10,
        verification: equivalency.verification,
        sourceId: equivalency.sourceId,
      });
    }
  }

  const bestByExam = new Map<string, Recommendation>();
  for (const candidate of candidates) {
    const current = bestByExam.get(candidate.exam.id);
    if (!current || candidate.rank > current.rank) bestByExam.set(candidate.exam.id, candidate);
  }
  return [...bestByExam.values()].sort(
    (a, b) => b.rank - a.rank || a.exam.name.localeCompare(b.exam.name),
  );
}

export function calculatePlan(plan: StudentPlan, dataset: AcademicDataset): PlanResult {
  const university = dataset.universities.find((item) => item.id === plan.universityId);
  const program = findProgram(plan, dataset);
  if (!university || !program) {
    throw new Error("The selected university or program is not available.");
  }

  const resolvedCredits = resolveCredits(plan, program, dataset);
  const evaluation = evaluateRequirements(program, plan, resolvedCredits);
  const applicableCourses = new Map<string, ResolvedCourse>();
  evaluation.results.forEach((result) => {
    result.matchedCourses.forEach((course) => {
      applicableCourses.set(
        `${course.sourceCreditId}:${normalizeCourseCode(course.courseCode)}`,
        course,
      );
    });
  });
  const applicableCredits = [...applicableCourses.values()].reduce(
    (total, course) => total + course.credits,
    0,
  );
  const acceptedCredits = resolvedCredits.reduce((total, result) => total + result.acceptedCredits, 0);
  const consumedCredits = new Set(
    evaluation.results.flatMap((result) =>
      result.matchedCourses.map(
        (course) => `${course.sourceCreditId}:${normalizeCourseCode(course.courseCode)}`,
      ),
    ),
  );
  const electiveCredits = evaluation.canonicalCourses
    .filter(
      (course) =>
        !consumedCredits.has(`${course.sourceCreditId}:${normalizeCourseCode(course.courseCode)}`),
    )
    .reduce((total, course) => total + course.credits, 0);
  const duplicateCredits = resolvedCredits
    .flatMap((resolved) => resolved.courses)
    .filter((course) => course.duplicateOfCreditId)
    .reduce((total, course) => total + course.credits, 0);
  const recommendations = generateRecommendations(
    plan,
    evaluation.results,
    evaluation.canonicalCourses,
    dataset,
  );

  return {
    plan,
    program,
    university,
    resolvedCredits,
    requirementResults: evaluation.results,
    recommendations,
    acceptedCredits,
    applicableCredits,
    electiveCredits,
    duplicateCredits,
    progressPercent: Math.min(100, Math.round((applicableCredits / program.totalCredits) * 100)),
    completedRequirements: evaluation.results.filter((result) => result.status === "completed").length,
    totalRequirements: evaluation.results.length,
  };
}

export function equivalencyForExam(
  universityId: string,
  examId: string,
  dataset: AcademicDataset,
): ExamEquivalency | undefined {
  return dataset.equivalencies.find(
    (equivalency) => equivalency.universityId === universityId && equivalency.examId === examId,
  );
}
