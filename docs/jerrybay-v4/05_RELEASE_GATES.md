# Release Gates

| Gate | Status | Exit condition |
| --- | --- | --- |
| V4-G0 — Evidence & Source Freeze | PASS / CLOSED | Canonical sources and original lineage fixed |
| V4-G1 — Original Baseline Reconstruction | PASS / CLOSED | Baseline `cab7459e865adfb9c892a636d7a3710179965802` and evidence recorded |
| V4-G2 — Content & Project Expansion | G2-A-R1 IN PROGRESS | Owner-requested visual remediation and Content/Projects archive are being verified; then publish one updated isolated protected review revision and hold G2-B for Jerry feedback |
| V4-G3 — Responsive / SEO / QA | BLOCKED | G2 content contract complete |
| V4-G4 — Fresh Fixed-SHA Review | BLOCKED | Candidate SHA frozen |
| V4-G5 — Production Publish | BLOCKED — OWNER APPROVAL | Jerry visual/story UAT and explicit release approval |

Production, domain, tracking, payment, database, auth, RLS, secrets, and destructive Git operations always remain Owner-gated.

## Current G2-A-R1 checkpoint

`V4-G2 / G2-A-R1 — READY FOR OWNER REVIEW`

- Updated isolated review deployment: `dpl_J7YzNzZwS1xJtDsM1hZ1skjgwbXF`, state `READY`.
- It is in the separate protected project `jerrybay-v4-g2a-review`, not the existing `jerrybay-site` project.
- Jerry review is the sole next approval point. G2-B and every release action remain blocked pending that feedback.
