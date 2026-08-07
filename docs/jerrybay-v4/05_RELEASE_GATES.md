# Release Gates

| Gate | Status | Exit condition |
| --- | --- | --- |
| V4-G0 — Evidence & Source Freeze | PASS / CLOSED | Canonical sources and original lineage fixed |
| V4-G1 — Original Baseline Reconstruction | PASS / CLOSED | Baseline `cab7459e865adfb9c892a636d7a3710179965802` and evidence recorded |
| V4-G2 — Content & Project Expansion | G2-B-R5 REFERENCE VISIBILITY REMEDIATION PASS / OWNER REVIEW | Reference archive, attribution checks, visibly separated lecture/planning/government categories, external-reference health checks, capability remediation, and IA cleanup pass; final G2 freeze awaits Jerry visual/story UAT |
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

## Current G2-B-R1 checkpoint

`V4-G2 / G2-B-R1 — READY FOR OWNER REVIEW`

- Updated isolated protected review deployment: `dpl_4f9VWdUE3g3sDTNzzbVwA4VJXifr`, state `READY`.
- Source implementation SHA: `610b69d9a360db97fbc942f166f83758938297b7`; static `214/214`, resource guard `29/29`, HTML `0`, and Chrome/CDP `245/245` all pass.
- It is in the separate protected project `jerrybay-v4-g2a-review`, not the existing `jerrybay-site` project. This review deployment does not authorize a `main` merge or any production action.

## Current G2-B-R2 checkpoint

`V4-G2 / G2-B-R2 — READY FOR OWNER REVIEW`

- Updated isolated protected review deployment: `dpl_AJP2wgdQt9JjnejAbTsTmpHPkXYP`, state `READY`.
- Implementation SHA `57b0ae9b0cf4f83aec0079567dbd1ace57eb2b73`; static `201/201`, resource guard `29/29`, HTML `0`, and Chrome/CDP `230/230` pass.
- The privacy route/menu is removed and the complete Content/Projects archive is now Reference/Projects at `/references/`; no production or `main` action is authorized.

## Current G2-B-R3 checkpoint

`V4-G2 / G2-B-R3 — READY FOR OWNER REVIEW`

- Updated isolated protected review deployment: `dpl_BQuGt4nVDkYkSZyk368UiMhf5PDH`, state `READY`.
- Implementation SHA `0790583b2a9ef9b05e135431252e3634289a72f5`; static `202/202`, resource guard `29/29`, HTML `0`, and Chrome/CDP `230/230` pass.
- Global navigation uses `레퍼런스` only. `프로젝트` remains a Reference-internal content filter and detail classification; no production or `main` action is authorized.

## Current G2-B-R4 checkpoint

`V4-G2 / G2-B-R4 — READY FOR OWNER REVIEW`

- Updated isolated protected review deployment: `dpl_86uDZzutXuAJ1RmW2dCq52vPwUWW`, state `READY`.
- Implementation SHA `39b9b89d98e4f55d7f16b1bc70e31ce2b75838ba`; static `206/206`, resource guard `29/29`, HTML `0`, and Chrome/CDP `233/233` pass.
- Reference hub exposes project, lecture, planning, and government categories. Planning keeps source and attribution boundaries; no production or `main` action is authorized.

## Current G2-B-R5 checkpoint

`V4-G2 / G2-B-R5 — READY FOR OWNER REVIEW`

- Updated isolated protected review deployment: `dpl_7KvveXGbSKHpKW1Pw2t3aH7bMTNF`, state `READY`.
- Implementation SHA `66ddf94c97ad4c80d2677f528d11daa52ec09837`; static `206/206`, resource guard `29/29`, HTML `0`, and Chrome/CDP `235/235` pass.
- Four labelled Reference category sections and the emphasized AIKUS link in the home lecture section are rendered and separately asserted. No production or `main` action is authorized.
