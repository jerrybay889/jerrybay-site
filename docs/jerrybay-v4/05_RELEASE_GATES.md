# Release Gates

| Gate | Status | Exit condition |
| --- | --- | --- |
| V4-G0 — Evidence & Source Freeze | PASS / CLOSED | Canonical sources and original lineage fixed |
| V4-G1 — Original Baseline Reconstruction | PASS / CLOSED | Baseline `cab7459e865adfb9c892a636d7a3710179965802` and evidence recorded |
| V4-G2 — Content & Project Expansion | IN PROGRESS — G2-A REVIEW CHECKPOINT | Owner approved `WO-V4-02`; review-only non-production Preview before G2 completion |
| V4-G3 — Responsive / SEO / QA | BLOCKED | G2 content contract complete |
| V4-G4 — Fresh Fixed-SHA Review | BLOCKED | Candidate SHA frozen |
| V4-G5 — Production Publish | BLOCKED — OWNER APPROVAL | Jerry visual/story UAT and explicit release approval |

Production, domain, tracking, payment, database, auth, RLS, secrets, and destructive Git operations always remain Owner-gated.
