# CreditMap competition submission packet

This packet prepares CreditMap for the 2026 Congressional App Challenge. It is a working draft, not a substitute for the official rules or Adrian's own account of his work.

## Read this before submitting

The 2026 rules say that all coding and technical development must be done by the student or student team. They permit AI tools only when the use is fully disclosed, supports specific parts of the project, and does not constitute the entire technical development. The entrant must also demonstrate significant personal contribution and technical understanding.

Because an AI coding assistant helped with this repository, Adrian must:

1. document exactly which parts used AI assistance;
2. identify the parts he personally designed, coded, reviewed, tested, or changed;
3. understand and be able to explain the submitted code;
4. make additional personal technical contributions if his present contribution does not satisfy the rule; and
5. disclose the assistance honestly in the application and video.

Do not claim personal experiences, coding work, research, testing, or learning that did not happen. Replace every bracketed prompt below with Adrian's own truthful details.

Official references:

- [2026 Congressional App Challenge Rules](https://www.congressionalappchallenge.us/wp-content/uploads/2026/05/2026-CAC-Rules.pdf)
- [Congressional App Challenge student registration](https://www.congressionalappchallenge.us/students/student-registration/)
- [Congressional App Challenge participating districts](https://www.congressionalappchallenge.us/students/participating-districts/)

## Submission facts

| Item | Ready-to-use value |
| --- | --- |
| App title | CreditMap |
| Entrant | Adrian Hernandez |
| Live app | https://creditmap-eta.vercel.app/ |
| Competition overview | https://creditmap-eta.vercel.app/competition |
| Source code | https://github.com/adrianamed1213-sketch/creditmap |
| Platform | Responsive web application |
| Languages | TypeScript, TSX, SQL, CSS |
| Core tools | Next.js, React, Tailwind CSS, Vitest, Supabase schema, GitHub, Vercel |
| Submission deadline | Monday, October 26, 2026 at 12:00 p.m. EDT |
| Required demo length | 1–3 minutes; maximum 3 minutes |
| Video hosting | Public YouTube or Vimeo link |

Confirm district eligibility, student eligibility, parent/guardian information, school and home nine-digit ZIP codes, and the exact portal fields before recording the final video.

## Core story

### One-sentence purpose

CreditMap helps high school students see how early college credit may transfer, apply to a selected degree, overlap with other credit, and change across universities.

### Target audience

The primary audience is high school students earning AP, CLEP, dual-enrollment, IB, or AICE credit who are comparing colleges or planning a degree. Counselors and families are a secondary audience because they can use the printable plan brief to discuss next steps with the student.

### Short description

Students can earn college credit before graduation and still not know whether it will actually move them toward a degree. CreditMap connects exam and transfer equivalencies with university-specific degree requirements. It flags duplicate credit, distinguishes requirement progress from electives, explains every supported result, and marks uncertain cases for verification instead of guessing. Students can test a future exam score, compare the same credit across verified UF, FIU, and UCF Finance pathways, and print a counselor-ready plan brief. The public demo needs no account and uses dated official-source records with a deterministic, automated-tested rules engine.

### What makes the idea different

Most credit tools stop at “this score may equal this course.” CreditMap continues through the decision that matters: what that course does inside a particular degree. It also projects one hypothetical exam across multiple universities and shows duplicate handling, degree use, explanation, and evidence side by side.

## Draft answers to likely questions

These are structures, not statements to copy blindly. Keep only claims Adrian can personally support.

### What inspired you to create this app?

> [Describe the real moment, question, or person that exposed this problem.] I realized that knowing an exam's course equivalent still did not answer whether the credit would help with a student's intended degree. I wanted to make those rules understandable before a student commits time, money, or a college decision.

### What technical difficulty did you face, and how did you address it?

> The hardest technical problem was separating “a university awards this course” from “this course satisfies this degree requirement.” The calculation also had to avoid counting duplicate courses twice. The implementation models equivalency resolution, duplicate detection, requirement allocation, progress calculation, and recommendations as separate typed steps. I validated the behavior with tests for score thresholds, OR and AND requirements, course alternatives, minimum-credit rules, duplicates, university changes, and multi-university projections. [Add exactly what Adrian personally implemented, debugged, or changed and one specific example he can demonstrate.]

### What did you learn, and what was your biggest takeaway?

> [Write this from Adrian's experience.] Useful topics may include separating data from UI code, translating real policies into deterministic rules, testing edge cases, designing for uncertainty, or learning why academic data provenance matters.

### What would you change in a 2.0 version?

> I would expand the verified dataset beyond the current UF, FIU, and UCF Finance pathways, add catalog-year selection, and let students securely synchronize saved plans. I would also add transcript import only after building a careful privacy and verification workflow. The priority would remain trustworthy data, not unsupported numerical coverage.

### AI and external-tools disclosure

Use the portal's exact requested format. A truthful starting structure is:

> I used OpenAI Codex as an AI coding assistant for [list the specific planning, design, coding, debugging, documentation, or testing tasks it assisted with]. I personally [list the features, code, tests, research, decisions, reviews, and modifications Adrian actually completed]. I reviewed [identify the code or behavior actually reviewed], can explain [identify the systems Adrian understands], and used the following open-source frameworks and libraries: Next.js, React, Tailwind CSS, Lucide, Zod, Vitest, and Supabase libraries.

Do not delete or minimize this disclosure. The rules require full AI disclosure.

## Demonstration video script — target 2:40

Speak naturally and use the exact screen named in each cue. Rehearse with a timer before recording.

### 0:00–0:18 — Name, app, and purpose

**Screen:** Competition page hero.

> Hi, I'm Adrian Hernandez, and this is CreditMap. CreditMap helps high school students see how early college credit may transfer, apply to a selected degree, overlap with other credit, and change across universities.

### 0:18–0:35 — Audience and problem

**Screen:** Competition page problem card.

> It is designed for students earning AP, CLEP, dual-enrollment, IB, or AICE credit. Official information is spread across equivalency tables and degree catalogs, so earning credit does not automatically tell a student whether it moves them toward graduation.

### 0:35–0:55 — Tools and disclosure

**Screen:** Source repository or competition page engineering card.

> I built CreditMap as a TypeScript web app using Next.js, React, Tailwind CSS, Vitest, a Supabase database design, GitHub, and Vercel. [State Adrian's actual personal technical contribution.] I used OpenAI Codex to assist with [brief, complete disclosure of the specific tasks].

### 0:55–1:15 — Load the demo

**Screen:** `/start`, then dashboard.

> The demo needs no account. It loads a realistic Finance plan with five early credits and immediately calculates progress using university-specific rules.

### 1:15–1:35 — Show duplicate safety

**Screen:** Credits page, psychology entries.

> These two inputs both resolve to psychology, but CreditMap catches the overlap and refuses to count the same course twice. Every result explains what happened.

### 1:35–1:55 — Show the degree map

**Screen:** Degree map; expand a requirement.

> The degree map separates equivalency from degree use. A course may complete a requirement, count only as an elective, or need verification. Supported decisions include the matching rule and dated source evidence.

### 1:55–2:15 — Show a future opportunity

**Screen:** Opportunities; change one hypothetical score.

> The opportunity simulator lets a student test a future score before taking an exam. It shows the awarded course, projected progress, duplicate warning, and calculation trace without modifying the saved plan.

### 2:15–2:32 — Compare colleges

**Screen:** Compare; AP Macroeconomics in the opportunity lab, then portability matrix.

> The same exam can produce a different academic result at a different university. CreditMap projects one opportunity across UF, FIU, and UCF and shows why each outcome changes.

### 2:32–2:45 — Close

**Screen:** Plan brief or competition page.

> CreditMap turns scattered policy into a clear next conversation for students, families, and counselors—while saying “verification required” whenever the evidence is incomplete.

## Technical-understanding rehearsal

Before submitting, Adrian should be able to open the repository and explain, without a script:

- how `resolveExamEquivalency` selects a score band;
- how `resolveCredits` detects duplicate course awards;
- how `calculatePlan` allocates courses into degree requirements;
- how `simulateExamOpportunity` calculates a before-and-after result without saving it;
- how `compareExamOpportunity` applies one hypothetical exam to several universities;
- why academic records include a source URL, checked date, and verification status;
- what the 52 tests protect and one failure that a test would catch;
- why browser-local storage is used in the demo and how the Supabase/RLS architecture would change production persistence; and
- which work was personally completed and which work received AI assistance.

If any answer is unclear, study that file, change a small behavior, add or modify a test, and verify the result before entering the competition.

## Final submission checklist

- [ ] Confirm Adrian is eligible and his district is participating.
- [ ] Confirm the app was created after October 30, 2025, or accurately identify only new 2.0 work.
- [ ] Confirm the entry complies with the originality and student-development requirements.
- [ ] Complete a full, specific AI and open-source disclosure.
- [ ] Replace every bracketed prompt in this packet with truthful personal details.
- [ ] Run `pnpm.cmd check` and confirm every check passes.
- [ ] Test the live app in a private/incognito window on desktop and mobile.
- [ ] Confirm the demo loads with no account and every video click matches the script.
- [ ] Record at 1080p with readable browser zoom and clear audio.
- [ ] Keep the final video between one and three minutes.
- [ ] Include participant name, app name, one-sentence purpose, audience, tools/languages, and working functionality.
- [ ] Upload the video publicly to YouTube or Vimeo and test its link while signed out.
- [ ] Test the live app and source links while signed out.
- [ ] Save a copy of every written response and the exact submitted source revision.
- [ ] Submit before 12:00 p.m. EDT on October 26, 2026; do not wait until the final hour.

After the deadline, the submission cannot be modified. The live app can still receive normal updates, but preserve the exact submitted Git commit and do not contradict the submitted claims.
