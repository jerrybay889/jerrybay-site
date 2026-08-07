# State

## Current Gate

`V4-G2 — Content & Project Expansion / G2-B-R2 REFERENCE IA REMEDIATION PASS / READY FOR OWNER REVIEW`

## Active execution

- Branch: `build/jerrybay-v4-original-first`
- Worktree: `C:\Users\82103\jerrybay-site-worktrees\v4-original-first`
- Base SHA: `d50f9dc85f4b0d0630d06e3df1b40cf404963d78`
- Source baseline: `cb9da0ee5b318cfd33b83b6283babdb0d9e9e7fe`
- Active work order: `WO-V4-02`
- V4-G1 baseline SHA: `cab7459e865adfb9c892a636d7a3710179965802`

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

## Next Action

Jerry reviews the updated isolated protected checkpoint and provides either visual/story UAT feedback or a separate final-G2 freeze approval. Do not change `main` or publish the existing site without that direction.
