# State

## Current Gate

`B2 — CURRENT PR HEAD PREVIEW READY / FRESH SEPARATE FIXED-SHA RE-REVIEW PENDING`

## Active execution

- Branch: `issue-7-b2-insights`
- Worktree: `C:\Users\jerry\JERRYBAY_SITE_B2_ISSUE7`
- Base SHA: `974ae38f31bc3480e879825fdf10d581fb0ff72c`
- Writer: sole delegated Writer `/root/b2_writer`
- Source baseline: `cb9da0ee5b318cfd33b83b6283babdb0d9e9e7fe`
- Active work order: `Issue #7 — B2 Search Foundation + Minimal /insights/ Authority Surface`
- Implementation commit: `c6568a09ce924c0298feac44e0d98f82f5b0101f`
- Historical narrow remediation commit: `495eca57f7e445315163ae3ca172d22ff61e13a3`
- Draft PR: `#8` — `https://github.com/jerrybay889/jerrybay-site/pull/8`
- Reviewed exact Head: `b6861d799b0c92ba8384872747a03b0b21dadbee`
- Current PR Head: the exact HEAD of `issue-7-b2-insights` after this State commit; resolve via `git rev-parse HEAD` and PR `#8` metadata.
- V4-G1 baseline SHA: `cab7459e865adfb9c892a636d7a3710179965802`

## G2-B-R5 reference visibility remediation

- Owner feedback identified that the category records and the AIKUS home link were not sufficiently visible in the review flow. The Reference hub now renders persistent, separately labelled category blocks for `프로젝트 레퍼런스`, `강의 레퍼런스`, `기획 레퍼런스`, and `정부사업 레퍼런스`; its filters show the counts `6 / 8 / 8 / 6`.
- The home `#lectures` section now carries a visible 50px-high external link labelled `AIKUS 교육 플랫폼 홈페이지 열기 ↗`, targeting `https://aikus.kr/`.
- Verified implementation SHA: `66ddf94c97ad4c80d2677f528d11daa52ec09837`.
- Static contract: `206/206 PASS`; external-resource adversarial fixtures: `29/29 PASS`; HTML validation: `0 problems`; `git diff --check`: PASS.
- Chrome/CDP browser QA: `235/235 PASS`, including the four category headings/count filters and the rendered AIKUS lecture-platform link (`319×50px`).
- Rendered evidence: `29 PNG` files at `docs/jerrybay-v4/evidence/screenshots-g2b-r5-reference-visibility/`; the Reference desktop and home-lecture desktop frames were visually inspected.
- Isolated protected review deployment: `dpl_7KvveXGbSKHpKW1Pw2t3aH7bMTNF`, state `READY`, URL `https://jerrybay-v4-g2a-review-59k33wfuh-jerrybay889s-projects.vercel.app`.
- Isolation: the deployment is in `jerrybay-v4-g2a-review` (`prj_yoWFPmidQa0rGubXIpjKeONWXD2P`); existing `jerrybay-site`, `main`, domains, and production remain unchanged.

## G5 production publish

- Owner explicitly authorized final production deployment on 2026-08-08. `main` was fast-forwarded from `d50f9dc85f4b0d0630d06e3df1b40cf404963d78` to `11941a29c916b24ed798cb1888998dc8f3d0488b`.
- Production deployment: `dpl_BofGLHee5vDtDfr1Ug5Fbb1JnEae`, source `main`, target `production`, state `READY`; aliases include `www.jerrybay.kr`, `jerrybay.kr`, and `jerrybay-site.vercel.app`.
- Pre-publish candidate evidence: static `206/206`, external-resource policy `29/29`, HTML `0`, browser `235/235`.
- Production smoke: `/`, `/references/`, and `?type=lecture`, `?type=planning`, `?type=government` each returned HTTP 200. The live DOM includes the AIKUS lecture-platform CTA and all four labelled Reference category sections. Production returned no `X-Robots-Tag: noindex/nofollow` header.
- Production Chrome/CDP browser QA: `235/235 PASS` at `https://www.jerrybay.kr`, with console/network, overflow, target size, mobile navigation, query filters, and the visible AIKUS CTA verified.
- Vercel production runtime error scan: no runtime errors in the 1-hour post-deploy window.
- Detailed record: `docs/jerrybay-v4/evidence/verification-g5-production-publish.md`.

## Evidence

- Static contract: `112/112 PASS`
- External resource adversarial fixtures: `29/29 PASS`
- HTML validation: `0 problems`
- Chrome/CDP browser QA: `123/123 PASS`
- Rendered evidence: `15 PNG` files, desktop/mobile/menu inspected
- Public-file categorical scan: internal markers, tracking, in-page collection, and secret-like signatures all `0`
- Full record: `docs/jerrybay-v4/evidence/verification.txt`

## G2-A evidence — local review candidate

- Static contract: `114/114 PASS`
- External resource adversarial fixtures: `29/29 PASS`
- HTML validation: `0 problems` across all seven public routes
- Chrome/CDP browser QA: `123/123 PASS` across all routes and desktop/mobile viewports
- Agent-browser visual/readiness check: home content, interactive navigation, and error-overlay check PASS; product/system cards have no internal scroll clipping
- Public-file scan: internal/sensitive markers `0`, tracking signatures `0`, and in-page collection mechanisms `0`
- Rendered evidence: `18 PNG` files in `docs/jerrybay-v4/evidence/screenshots-g2a/`
- Full record: `docs/jerrybay-v4/evidence/verification-g2a.md`
- Review deployment: `jerrybay-v4-g2a-review-6fj7c2qch-jerrybay889s-projects.vercel.app` is `READY` from the committed G2-A source tree.
- Deployment isolation: Vercel created a separate protected review project, `jerrybay-v4-g2a-review`; existing `jerrybay-site`, its domains, and `main` were not modified. The platform labels the separate review project's deployment target as `production`; this is recorded as an isolation fact, not represented as the existing-site Production release.

Automated accessibility audit reported zero violations and one incomplete color-contrast item for layered transparent/gradient backgrounds. This is recorded for manual quality closure in V4-G3 and does not replace the current keyboard, target-size, heading, overflow, and skip-link PASS evidence.

## G2-A-R1 evidence — local updated review candidate

- Verified implementation SHA: `98a03c96d3e0ce23fba68a2a6993384f2a84e9d9`
- Static contract: `212/212 PASS` across 14 public routes
- External resource adversarial fixtures: `29/29 PASS`
- HTML validation: `0 problems` across all 14 public routes
- Chrome/CDP browser QA: `245/245 PASS` across desktop/mobile, including Featured Build overlap and `/content/?type=project` assertions
- Public-file scan: internal/sensitive `0`, secret-like `0`, tracking `0`
- Rendered evidence: `33 PNG` files in `docs/jerrybay-v4/evidence/screenshots-g2a-r1/`
- Full record: `docs/jerrybay-v4/evidence/verification-g2a-r1.md`

## G2-A-R1 isolated review deployment

- Deployment ID: `dpl_J7YzNzZwS1xJtDsM1hZ1skjgwbXF`
- Review URL: `https://jerrybay-v4-g2a-review-j32tifa96-jerrybay889s-projects.vercel.app`
- State: `READY`; the deployment was requested as `preview` in the separate protected review project `prj_yoWFPmidQa0rGubXIpjKeONWXD2P`.
- Source metadata SHA: `4e2759a0d82be0fbeeb99664d806c5ab4d9bc7f7`; implementation SHA remains `98a03c96d3e0ce23fba68a2a6993384f2a84e9d9`.
- Isolation check: existing project `jerrybay-site` remains at `dpl_5uHsafs8LFiyKRLLs2Y4bXwBwGgW`; its domains and `main` were not changed.
- Review access remains protected by Vercel Authentication. No temporary share URL is recorded in repository evidence.

## G2-B overnight evidence update

- Owner authorized bounded G2-B evidence and record work on 2026-08-08; this does not substitute for visual/story UAT or production approval.
- All three historical project-detail routes carry both `재직 조직 프로젝트 참여` and `개인 직계 고객 프로젝트가 아닌` attribution language. Validator check `19h` enforces that boundary.
- Ten external references returned HTTP `200` with redirect-following GET checks. Tool-specific crawler access limits are recorded separately and are not treated as dead links.
- Current static contract rerun: `213/213 PASS`; external-style/font adversarial fixtures: `29/29 PASS`; HTML validation: `0 problems`; `git diff --check`: PASS.
- Full inventory and command result: `docs/jerrybay-v4/evidence/external-reference-recheck-2026-08-08.md`.

## G2-B-R1 capability & stack remediation

- Verified implementation SHA: `610b69d9a360db97fbc942f166f83758938297b7` (`feat: expand homepage capability system`).
- Home capability section now follows Hero and exposes three core pillars, three complementary execution capabilities, and five public-safe stack groups. Main navigation is `역량`; Hero has a direct `역량·스택 보기` anchor path.
- Static contract: `214/214 PASS` across 14 public routes; includes structural check `18i` for the capability and stack system.
- External resource adversarial fixtures: `29/29 PASS`; HTML validation: `0 problems`; `git diff --check`: PASS.
- Chrome/CDP browser QA: `245/245 PASS` across desktop/mobile and all 14 routes, including overflow, console, keyboard/menu/focus, target-size, CTA, project-filter, hero/profile, and build-card-overlap checks.
- Rendered evidence: `33 PNG` files in `docs/jerrybay-v4/evidence/screenshots-g2b-r1-capabilities/`; visually inspected capability desktop/mobile frames: `expertise-desktop.png` SHA-256 `CD9D2D336EA09B661DFFCCCCC1A3F554A39D13152C47BE3BC9209DF851A2E232`, `expertise-mobile.png` SHA-256 `2CF5C1A7F312FC611F527ABD31BF554730FB47FE8759191D9B9A6ABB5103763A`.
- Isolated protected review deployment: `dpl_4f9VWdUE3g3sDTNzzbVwA4VJXifr`, state `READY`, URL `https://jerrybay-v4-g2a-review-gwagmjmqt-jerrybay889s-projects.vercel.app`.
- Isolation check: this deployment belongs to the separate protected project `prj_yoWFPmidQa0rGubXIpjKeONWXD2P` (`jerrybay-v4-g2a-review`). Existing `jerrybay-site`, its domains, `main`, and its production deployment were not changed. Vercel Authentication remains enabled; no temporary share URL is stored.
- Full command/result record: `docs/jerrybay-v4/evidence/verification-g2b-r1-capabilities.md`.

## G2-B-R2 reference IA and privacy-route removal

- Verified implementation SHAs: `9be2f922c2d62aa9987e7dd7e11990e628d8b1f1` (route/file move) and `57b0ae9b0cf4f83aec0079567dbd1ace57eb2b73` (links, copy, validator, browser contract, and evidence).
- Owner-directed change: the dedicated `/privacy/` route and every visible Privacy/개인정보 link are absent. The former `/content/` hub and all six former `/content/projects/...` pages now live under `/references/` and `/references/projects/...`.
- Static contract: `201/201 PASS` across 13 public routes; checks `13` and `13b` assert privacy removal and zero legacy `/content/` links.
- External resource adversarial fixtures: `29/29 PASS`; HTML validation: `0 problems`; `git diff --check`: PASS.
- Chrome/CDP browser QA: `230/230 PASS` across desktop/mobile and all 13 routes, including the query-compatible `/references/?type=project` filter and mobile-menu link-count contracts.
- Rendered evidence: `28 PNG` files in `docs/jerrybay-v4/evidence/screenshots-g2b-r2-references/`.
- Isolated protected review deployment: `dpl_AJP2wgdQt9JjnejAbTsTmpHPkXYP`, state `READY`, URL `https://jerrybay-v4-g2a-review-qaf855qex-jerrybay889s-projects.vercel.app`.
- Isolation remains unchanged: deployment is in the separate protected review project `prj_yoWFPmidQa0rGubXIpjKeONWXD2P`; existing `jerrybay-site`, its domains, `main`, and existing-site production were not changed.
- Full command/result record: `docs/jerrybay-v4/evidence/verification-g2b-r2-references.md`.

## G2-B-R3 reference navigation consolidation

- Verified implementation SHA: `0790583b2a9ef9b05e135431252e3634289a72f5` (`fix: consolidate reference navigation`).
- The home header no longer presents a parallel `프로젝트` item. Reference hub and six detail-page headers now use the single archive destination `레퍼런스`; their footer archive link follows the same rule.
- `프로젝트` remains intentionally inside the Reference experience only: the `/references/?type=project` filter, project breadcrumbs, content types, and project-specific CTA wording.
- Static contract: `202/202 PASS`, including new check `19i` which rejects a home `#projects` global menu item or a Reference header project-filter menu item.
- External resource adversarial fixtures: `29/29 PASS`; HTML validation: `0 problems` across all 13 routes; `git diff --check`: PASS.
- Chrome/CDP browser QA: `230/230 PASS` across all 13 routes and both viewports. Mobile menu contracts now assert 8 home links, 5 Reference/detail links, and 7 preserved supporting-route links.
- Rendered evidence: `28 PNG` files in `docs/jerrybay-v4/evidence/screenshots-g2b-r3-reference-nav/`; desktop home and Reference header frames were visually inspected.
- Isolated protected review deployment: `dpl_BQuGt4nVDkYkSZyk368UiMhf5PDH`, state `READY`, URL `https://jerrybay-v4-g2a-review-a18wq4bux-jerrybay889s-projects.vercel.app`.
- Isolation remains unchanged: deployment is in the separate protected review project `prj_yoWFPmidQa0rGubXIpjKeONWXD2P`; existing `jerrybay-site`, its domains, `main`, and existing-site production were not changed.
- Full command/result record: `docs/jerrybay-v4/evidence/verification-g2b-r3-reference-nav.md`.

## G2-B-R4 reference category expansion

- Verified implementation SHA: `39b9b89d98e4f55d7f16b1bc70e31ce2b75838ba` (`feat: expand reference categories`).
- Reference hub now filters four public categories: 6 projects, 8 lectures, 8 planning records, and 6 government-project records.
- Lecture references restore the prior-home lecture history and link the existing public article, institution, and course evidence. The home lecture section now visibly links to `https://aikus.kr/`.
- Planning records use only public-safe category-level framing from the Notion collection: no raw notes, source URLs, scores, private records, or invented external-client attribution. The public `JERRY’S QA OS` title is now `Quality Engineering OS`.
- Government-project references restore the prior-home MyData, Youth Experience AI Creator, startup/R&amp;D, aquaculture AI, AI Voucher, and startup-support planning record set with role-context wording.
- Static contract: `206/206 PASS`, including category counts, lecture proof links, planning-source boundary, and home AIKUS-link checks. External-resource adversarial fixtures: `29/29 PASS`; HTML validation: `0 problems`; `git diff --check`: PASS.
- Chrome/CDP browser QA: `233/233 PASS` across 13 routes and both viewports, including the Project, Lecture, Planning, and Government query-filter routes.
- Rendered evidence: `28 PNG` files in `docs/jerrybay-v4/evidence/screenshots-g2b-r4-reference-expansion/`; Reference desktop was visually inspected.
- External link health: six public article/course/institution URLs returned HTTP `200` with redirects followed; the AIKUS domain timed out in this command but remains the Owner-designated external link and was not relabeled as a runtime-state claim.
- Isolated protected review deployment: `dpl_86uDZzutXuAJ1RmW2dCq52vPwUWW`, state `READY`, URL `https://jerrybay-v4-g2a-review-4aqtzbha4-jerrybay889s-projects.vercel.app`.
- Isolation remains unchanged: deployment is in the separate protected review project `prj_yoWFPmidQa0rGubXIpjKeONWXD2P`; existing `jerrybay-site`, its domains, `main`, and existing-site production were not changed.
- Full command/result record: `docs/jerrybay-v4/evidence/verification-g2b-r4-reference-expansion.md`.

## Next Action

Fresh separate fixed-SHA review pending at the resolved Current PR Head → if `P0/P1/P2 = 0`, STOP before Merge because Merge is Production-impacting.

## Current Gate / Evidence / Next Action — Issue #2 quick-win block

### Current Gate

- Active branch: `issue-2-quick-win`
- Base SHA: `bdd80c0e97f0c611fd320bfa42c880f7ada06a09` (`main`)
- Working tree scope: 2 files changed (`index.html`, `docs/jerrybay-v4/04_STATE.md`)
- Execution rule: keep diff local, do not touch production/release states.

### Evidence

- Git provenance captured on remediation head: `git rev-parse --show-toplevel` → `C:/Users/jerry/JERRYBAY_SITE_CANONICAL`, `git remote get-url origin` → `https://github.com/jerrybay889/jerrybay-site.git`, branch `issue-2-quick-win`, HEAD `f04a5f9f4fc879b616f151e1dc57acb2a946968a`.
- Static contract: `node scripts/qa/validate-site.mjs` → `206/206 PASS`.
- External-style/font defense: `node scripts/qa/test-external-style-font-policy.mjs` → `29/29 PASS` (21 malicious + 8 allowed fixtures).
- HTML validation: `npx --yes html-validate index.html` → `2 existing aria-label-misuse errors` (baseline/known; now not introduced by this issue scope).
- Browser QA (local preview evidence): `node scripts/qa/browser-qa.mjs http://127.0.0.1:9222 http://127.0.0.1:4173 ./.qa-browser-issue2-17e28cc` → `235/235 PASS` (desktop/mobile, skip-link, menu focus/close, scroll lock, filters, section checks).
- Authenticated Vercel Preview: deployment `dpl_C48669MxNT5ipRAtfRHboXbtu2uv` (`C48669MxN`) was `Ready`, branch `issue-2-quick-win`, exact source `f04a5f9f4fc879b616f151e1dc57acb2a946968a`, at `https://jerrybay-site-git-issue-2-quick-win-jerrybay889s-projects.vercel.app`.
- Preview desktop QA at `1440×900`: `#quick-win` rendered with valid `aria-labelledby="quick-win-title"`, the Latpeed CTA rendered at approximately `237×53px`, and horizontal overflow was absent.
- Preview mobile QA at `390×844`: horizontal overflow was absent; the menu control rendered at `48×48px`; opening it set `aria-expanded="true"` and exposed 8 navigation links at `350×52px` each; the Quick-Win block and CTA rendered; browser console errors were `0`.
- Local QA assets: `./.qa-browser-issue2-17e28cc/` (local suite) and `./.qa-browser-issue2-f04a5f9-preview-auth/` (authenticated Preview screenshots).

### Next Action

- Issue `#2` and PR `#3` are `CLOSED / MERGED` historical evidence. They are not the current authority and must not be reopened or resumed without contradictory evidence and a new Owner direction.
- No further Quick-Win Gate action is active.

## Current Gate / Evidence / Next Action — Issue #5 B1

### Current Gate

- Gate: `B1 — CLOSED / MERGED / PRODUCTION-LIVE HISTORICAL EVIDENCE`.
- Issue `#5` is CLOSED and PR `#6` is MERGED by Owner approval. Neither is current authority; do not reopen or resume B1 absent contradictory Production evidence and new Owner direction.
- Production baseline: `main@974ae38f31bc3480e879825fdf10d581fb0ff72c`.
- `/business/` Production smoke: PASS.

### Evidence

- `node scripts/qa/validate-site.mjs` → `224/224 PASS`, including route count 14, internal-link resolution, B1 required blocks, exact Primary CTA label/base URL, Quick-Win secondary hierarchy, unsupported-claim guard, and public-copy boundary.
- `node scripts/qa/test-external-style-font-policy.mjs` → `29/29 PASS` (`21` malicious fixtures rejected; `8` allowed fixtures accepted).
- `npx --yes html-validate business/index.html` → `0 problems`. Repository-wide 14-route validation reports `30` pre-existing `aria-label-misuse` errors in `index.html` and `references/index.html`; B1 introduces `0` new findings.
- `node scripts/qa/browser-qa.mjs http://127.0.0.1:9222 http://127.0.0.1:4173 .qa-browser-b1` → `256/256 PASS` across desktop `1440×900` and mobile `390×844`. `/business/` passed exact CTA, required-block, Quick-Win hierarchy, overflow, console/network, 44px-target, mobile-menu, focus-return, and scroll-lock assertions.
- Writer visually inspected `.qa-browser-b1/business-desktop.png` and `.qa-browser-b1/business-mobile.png`; the hero, CTA hierarchy, first solution block, typography, and responsive composition rendered without clipping or horizontal overflow.
- `git diff --check` → PASS after the B1 implementation and record update.
- Read-only Tally preflight: canonical base is `https://tally.so/r/Y5bypd`; a GET using `?source=jerrybay_site&content=business_primary` returned HTTP `200` and preserved the query URL. The parsed public form contained `39` blocks, `0` Hidden-field blocks, and no `utm_source` or `utm_content` fields. Submission attribution is therefore `UNVERIFIED / NOT CONFIGURED`; the site retains the exact base URL and makes no attribution claim.
- Historical PR: `#6` (`https://github.com/jerrybay889/jerrybay-site/pull/6`), now MERGED.
- Vercel GitHub deployment `5863445949`: environment `Preview`, state `success`, exact SHA `50989e2eb0487f296a4cda2c005065ad784551e4`, URL `https://jerrybay-site-hqn5yandw-jerrybay889s-projects.vercel.app`. Unauthenticated HTTP redirected to Vercel login and therefore remained `UNVERIFIED`; it is not used as runtime PASS evidence.
- Authenticated Preview desktop QA at `1440×900`: exact title and H1, all required sections, exact `BUILD / LEARN / PLAN` tracks, two exact `프로젝트·컨설팅 문의` Primary CTAs targeting `https://tally.so/r/Y5bypd`, secondary Quick-Win CTA, no horizontal overflow, and `0` console errors.
- Authenticated Preview mobile QA at `390×844`: visual render and no horizontal overflow confirmed; both Primary CTAs rendered at approximately `204.1×52.8px`; mobile menu opened with `aria-expanded="true"`, body scroll lock, and five links; Escape closed it with `aria-expanded="false"`, released scroll lock, and returned focus to the menu control; console errors were `0`.
- During a read-only review, the prior Reviewer accidentally created GitHub Deployment API metadata record `5863526070` at ref/SHA `faa935ec965ab61df46b39d1b519478b5775a958`, with environment label `production` and `0` status records. The record is retained and was not deleted because no cleanup authority exists.
- The current Owner-authoritative Production baseline is `main@974ae38f31bc3480e879825fdf10d581fb0ff72c`; `/business/` Production smoke PASS supersedes the earlier Preview-era baseline notes.

### Next Action

- No further B1 action is active. Do not reopen Issue `#5` or PR `#6`.
- Current authority and next action are the Issue `#7` B2 section below.

## Current Gate / Evidence / Next Action — Issue #7 B2

### Current Gate

- Gate: `B2 — CURRENT PR HEAD PREVIEW READY / FRESH SEPARATE FIXED-SHA RE-REVIEW PENDING`.
- Authority: GitHub Issue `#7`; Base `main@974ae38f31bc3480e879825fdf10d581fb0ff72c`.
- Branch/worktree/Writer: `issue-7-b2-insights` / `C:\Users\jerry\JERRYBAY_SITE_B2_ISSUE7` / sole delegated Writer `/root/b2_writer`.
- Implementation commit: `c6568a09ce924c0298feac44e0d98f82f5b0101f`; historical narrow remediation commit: `495eca57f7e445315163ae3ca172d22ff61e13a3`.
- Draft PR `#8` targets Base `974ae38f31bc3480e879825fdf10d581fb0ff72c`; exact Head `b6861d799b0c92ba8384872747a03b0b21dadbee` had a READY exact-Head Vercel Preview.
- Fresh separate fixed-SHA review at `b6861d7...` returned `REQUEST CHANGES`: the Insight and Build / How-to seed articles lacked a contextual, distinct public evidence link, and QA did not assert a per-seed evidence target.
- Historical remediation Preview evidence: exact Head `495eca57f7e445315163ae3ca172d22ff61e13a3` had an exact-Head Preview `READY`; this remains retained provenance.
- Historical handoff Preview evidence: exact Head `68dfc4cacb98c4015d0a1cd9b1112a9eb524161e3`, Vercel status `SUCCESS`, and deployment `dpl_DPq6VZvsxTybFK1wUCW7YHvdMqen` (`READY`) remain retained provenance; they are not the current Head authority after this State commit.
- Current Preview: the `READY` Vercel Preview attached to that exact PR Head; current branch alias `https://jerrybay-site-git-issue-7-b2-insights-jerrybay889s-projects.vercel.app`. Fresh separate fixed-SHA review is pending at that resolved Head.
- Current Writer scope is only that remediation in the two affected articles, static/browser QA contracts, and this State record. It does not reopen B1 or expand B2.
- No CMS, DB, publishing automation, Tally/search-account/Vercel/domain/environment mutation, or Merge occurred.

### Evidence

- `node scripts/qa/validate-site.mjs` → `303/303 PASS` across 18 public HTML routes, including unique title/description/canonical/OG, exactly three seed articles, JSON-LD parsing, sitemap/feed/robots, internal links, unsupported-claim and forbidden-route guards.
- `node scripts/qa/test-external-style-font-policy.mjs` → `29/29 PASS` (`21` malicious fixtures rejected; `8` allowed fixtures retained).
- `npx --yes html-validate` on the four new Insights routes and changed `/business/` → `0 findings`.
- Chrome/CDP browser QA at local source → `332/332 PASS` across all 18 routes at desktop `1440×900` and mobile `390×844`, including render, exact CTA, no overflow, console/network, 44px targets, mobile menu/focus/scroll lock, hub seed count, and article-contract assertions.
- Writer visually inspected `.qa-browser-b2/insights-desktop.png`, `.qa-browser-b2/insights-mobile.png`, and `.qa-browser-b2/insightsai-pilot-to-operating-system-desktop.png`; hierarchy, responsive composition, CTA order, and article layout render without clipping or overlap.
- `git diff --check` → PASS. QA screenshots and Chrome profile remain untracked local artifacts and are outside the source diff.
- External search registration status: `PREPARED / NOT SUBMITTED / NOT VERIFIED`.
- Historical implementation-commit GitHub Vercel status: `SUCCESS` at exact commit `c6568a09ce924c0298feac44e0d98f82f5b0101f`.
- Historical implementation-commit Preview: deployment `dpl_Wor6cpbbzh6K1NMzrVmwiFR64oe5`, target `preview`, state `READY`; immutable URL `https://jerrybay-site-hrxww3nxm-jerrybay889s-projects.vercel.app`; branch alias `https://jerrybay-site-git-issue-7-b2-insights-jerrybay889s-projects.vercel.app`.
- Historical authenticated implementation-commit Preview desktop probe: `/insights/` and all three seed articles rendered exact title/H1, `canonical = og:url`, and the exact Primary CTA; hub seed count `3`; JSON-LD parsed; horizontal overflow `0`; console logs `0`.
- The visible authenticated Preview hub screenshot was inspected for implementation commit `c6568a09...`; the historical remediation Preview at `495eca57...` was `READY`. Historical handoff Preview evidence is recorded above; current Preview authority is the `READY` deployment attached to the resolved Current PR Head.
- Narrow remediation adds the contextual evidence targets `/references/?type=government`, `/references/projects/aikus/`, and `/references/` to the three respective seed article contracts. Static and browser QA now compare each route against its exact expected evidence target inside the article body.
- Historical remediation local evidence: static/search `303/303 PASS`; external style/font guard `29/29 PASS`; `html-validate` on the two changed articles `0 findings`; Chrome/CDP desktop/mobile full-route browser QA `332/332 PASS`; `git diff --check` PASS.

### Next Action

- Fresh separate fixed-SHA review pending at the resolved Current PR Head → if `P0/P1/P2 = 0`, STOP before Merge.
- STOP before Merge. Under current Vercel integration, Merge is Production-impacting.
