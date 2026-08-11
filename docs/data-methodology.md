# Academic data methodology

## Non-negotiable rule

CreditMap must not invent academic information. If a reliable source does not support a result, the result is `verification_required`.

## Source priority

1. official university catalog;
2. official university credit-by-exam or registrar publication;
3. official admissions or transfer policy;
4. Florida state education and common-course-numbering material;
5. College Board, CLEP, IB, or Cambridge official material.

Third-party transfer websites may help locate an official source, but they should not establish a verified academic equivalency.

## Required record context

An official academic record should retain:

- institution;
- source title and URL;
- academic or catalog year;
- date checked;
- verification state;
- reviewer notes when useful;
- effective and expiration dates when the source provides them.

## Verification states

- `demo`: illustrative development data that is never presented as official;
- `unverified`: entered but not reviewed against an authoritative source;
- `in_review`: undergoing comparison with its cited source;
- `verified`: reviewed and approved for the stated institution and catalog context;
- `superseded`: retained for history but replaced by a newer record.

Moving a record to `verified` must be an explicit review action.

## Collection workflow

1. Select the exact institution, program, and catalog year.
2. Locate the authoritative source.
3. Capture source metadata before transcribing facts.
4. Enter structured courses, score ranges, requirements, or policies.
5. Run automated structural validation.
6. Compare the entered record with the source in a separate review pass.
7. Publish the record as verified.
8. Preserve the prior record when a catalog year changes.

## Automated data-quality checks

The seed and import workflow should reject:

- verified records without sources;
- missing referenced courses;
- invalid or overlapping score ranges;
- negative or zero credit values where they are not permitted;
- requirements that reference another institution’s course;
- invalid catalog dates;
- demo data without a visible demo state.

## Demo-data separation

Demo data is useful for developing the user flow before official records are ready. It must be separated by a verification field and displayed with a persistent “Illustrative demo data—not official academic data” notice.

Demo values must never silently become verified data. A source must be attached and a reviewer must explicitly approve the replacement record.

The current build follows this boundary record by record: the supported UF, FIU, and UCF Finance and exam-credit records are verified, while FSU and USF remain expansion fixtures. The two unverified institutions are excluded from public numerical planning, and tuition estimates are withheld until their sources and assumptions are verified. See `docs/verified-uf-sources.md`, `docs/verified-fiu-sources.md`, and `docs/verified-ucf-sources.md` for the reviewed slices and their deliberate limitations.

## User-facing explanation

For an important result, a student should eventually be able to see:

- what the result is;
- which input produced it;
- which course or rule was matched;
- whether duplicate credit affected it;
- the source supporting it;
- the catalog year and date checked;
- whether adviser confirmation is still required.
