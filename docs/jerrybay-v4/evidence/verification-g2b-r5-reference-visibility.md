# G2-B-R5 — Reference Visibility Remediation

## Purpose

Address Owner review feedback that the Reference categories and the AIKUS external homepage link were not sufficiently discoverable in the rendered review flow.

## Implemented rendering contract

- `/references/` now shows four persistent category dividers in the default all-record view: `프로젝트 레퍼런스`, `강의 레퍼런스`, `기획 레퍼런스`, and `정부사업 레퍼런스`.
- The filter controls visibly include counts: 전체 28, 프로젝트 6, 강의 8, 기획 8, 정부사업 6.
- Query-filter routes retain the same category divider and show only the selected record type.
- `/#lectures` contains the explicit external CTA `AIKUS 교육 플랫폼 홈페이지 열기 ↗` to `https://aikus.kr/`.

## Verification

| Check | Result |
| --- | --- |
| `node scripts/qa/validate-site.mjs` | 206/206 PASS |
| `node scripts/qa/test-external-style-font-policy.mjs` | 29/29 PASS |
| `npx --yes html-validate` across 13 public route files | 0 problems |
| `git diff --check` | PASS |
| Chrome/CDP browser QA | 235/235 PASS |

Browser assertions include all four category headings and all five count labels in the default Reference view, and the AIKUS lecture link at `319×50px` after scrolling it into view.

## Rendered artifacts

- `screenshots-g2b-r5-reference-visibility/references-desktop.png`
- `screenshots-g2b-r5-reference-visibility/home-lectures-desktop.png`
- 27 additional desktop, mobile, menu, and detail-route frames in the same directory.

## Candidate and isolation

- Implementation SHA: `66ddf94c97ad4c80d2677f528d11daa52ec09837`
- Review deployment: `dpl_7KvveXGbSKHpKW1Pw2t3aH7bMTNF`
- Review URL: `https://jerrybay-v4-g2a-review-59k33wfuh-jerrybay889s-projects.vercel.app`
- The deployment belongs only to the isolated protected `jerrybay-v4-g2a-review` project. No `main`, existing-site production, domain, tracking, payment, database, authentication, or RLS change occurred.
