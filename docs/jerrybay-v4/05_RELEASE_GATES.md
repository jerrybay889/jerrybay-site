# Release Gates

| Gate | Status | Exit condition |
| --- | --- | --- |
| V4-G0 — Evidence & Source Freeze | PASS / CLOSED | Canonical sources and original lineage fixed |
| V4-G1 — Original Baseline Reconstruction | PASS / CLOSED | Baseline `cab7459e865adfb9c892a636d7a3710179965802` and evidence recorded |
| V4-G2 — Content & Project Expansion | G2-B EVIDENCE COMPLETE / OWNER VISUAL UAT PENDING | Content/Projects archive, attribution checks, and external-reference health checks pass; final G2 freeze awaits Jerry visual/story UAT |
| V4-G3 — Responsive / SEO / QA | BLOCKED | G2 content contract complete |
| V4-G4 — Fresh Fixed-SHA Review | BLOCKED | Candidate SHA frozen |
| V4-G5 — Production Publish | BLOCKED — OWNER APPROVAL | Jerry visual/story UAT and explicit release approval |

Production, domain, tracking, payment, database, auth, RLS, secrets, and destructive Git operations always remain Owner-gated.

## Current G2-A-R1 checkpoint

`V4-G2 / G2-A-R1 — READY FOR OWNER REVIEW`

- Updated isolated review deployment: `dpl_J7YzNzZwS1xJtDsM1hZ1skjgwbXF`, state `READY`.
- It is in the separate protected project `jerrybay-v4-g2a-review`, not the existing `jerrybay-site` project.
- Jerry review is the sole next approval point. G2-B and every release action remain blocked pending that feedback.

## G2-B overnight evidence status

`V4-G2 / G2-B EVIDENCE COMPLETE — OWNER VISUAL UAT PENDING`

- The Owner's 2026-08-08 overnight instruction authorized the remaining role-attribution and external-reference evidence work.
- The final G2 completion SHA, G4 fresh review, and G5 production publish remain blocked until a separate visual/story UAT outcome and release approval.
