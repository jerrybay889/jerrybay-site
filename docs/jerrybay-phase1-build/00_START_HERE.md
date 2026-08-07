# JerryBay Phase 1 Commercial Private Build — START HERE

> **Status:** IMPLEMENTATION COMPLETE / REVIEW REQUIRED
> **This is a private, non-production preview.** It has not been pushed, deployed,
> or reviewed. Do not treat Writer completion as approval.

## What this is

A working static multi-page implementation of the approved Phase 1 Commercial
Decision Lock. Seven routes, no build step, no framework, no database, no forms.

## Provenance

| Field | Value |
| --- | --- |
| Base branch | `audit/jerrybay-manyfast-reconciliation-v1` |
| Base SHA | `b51033ac7541dbd8cfb728cb040e68e5cf32e06c` |
| Writer branch | `build/jerrybay-phase1-commercial-v1` |
| Worktree | `C:\Users\82103\jerrybay-site-worktrees\phase1-commercial-v1` |
| Remote status | Not pushed. No PR. No merge. No deployment. |

## Run it locally

```bash
python -m http.server 4173      # from the repo root
# open http://127.0.0.1:4173/
```

Root-absolute paths (`/capabilities/`, `/assets/css/site.css`) require serving
from the repo root. Opening `index.html` from the filesystem will not resolve
navigation.

## Verify it

```bash
node scripts/qa/validate-site.mjs        # 81 static contract checks
```

Browser QA needs a headless Chrome with CDP enabled:

```bash
chrome --headless=new --remote-debugging-port=9222 --user-data-dir=<tmp> about:blank
node scripts/qa/browser-qa.mjs http://127.0.0.1:9222 http://127.0.0.1:4173 \
  docs/jerrybay-phase1-build/evidence/screenshots
```

Both were executed on this branch. Results: **81/81 static, 111/111 browser.**

## Read in this order

1. `01_COMMERCIAL_LOCK.md` — what was locked and how it landed in the build
2. `03_ROUTE_AND_COMPONENT_CONTRACT.md` — routes, files, shared components
3. `02_CONTENT_AND_CLAIM_LEDGER.csv` — every claim-bearing component
4. `04_QA_CONTRACT.md` — the 15 required checks and where each lives
5. `06_BROWSER_QA.md` — what was actually run in a real browser
6. `05_PLATFORM_EVIDENCE.md` — platform capability classification
7. `07_FINAL_HANDOFF.md` — verdict, blockers, and the one pending approval

## Hard boundaries respected

- No push, PR, merge, or deployment
- No modification of `docs/jerrybay-manyfast-reconciliation/` or `main`
- No database, auth, payment, or analytics
- No personal data collected in-page — `mailto:` only
- No legal policy text authored; `/privacy/` is a placeholder
- No customer names, logos, counts, or outcome claims
