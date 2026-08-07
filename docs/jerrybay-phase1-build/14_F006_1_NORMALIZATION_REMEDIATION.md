# F-006.1 Normalization Remediation — Preload `as` Attribute Trim

> **Writer verdict: WRITER F-006.1 REMEDIATION COMPLETE — FRESH REVIEW READY**
> Writer self-verification only. Never claims Independent PASS.

## Provenance

| Field | Value |
| --- | --- |
| Parent SHA | `20098410fd5a91239c9a707e6ad3a726d137dbea` |
| Independent status at parent | Product defect: NONE. F-001/F-002/F-003 PASS. `validate-site` 97/97, `browser-qa` 119/119, html-validate 0 problems. Reviewer-owned fixtures: forbidden **8/9**, allowed 5/5 — one bypass |
| Review evidence | `C:\Users\82103\jerrybay-review-evidence\2009841\REMEDIATION_WORK_ORDER.md`, `independent-f006-fixtures.json` |
| Bypass independently reproduced before fixing | Yes — ran the exact reviewer fixture string against the actual current `findExternalStyleFontViolations()`, confirmed 0 violations, before touching any code |

## Exact independent bypass

Reviewer-owned fixture `H-case-and-whitespace-preload`:

```html
<link REL='  PreLoAd  ' AS='  StYlE  ' HREF='https://alternate-cdn.invalid/styles.css'>
```

Produced **0 violations** against the F-006 guard shipped at the parent SHA,
despite being an ordinary remote stylesheet-preload with a remote `href`.

## Root cause — confirmed by isolated reproduction, not assumed

Traced to the exact line, not just the general area. In
`external-style-font-policy.mjs`, `rel` was already tokenized
(`.split(/\s+/)`), and JavaScript's `String.split` on a string with leading
whitespace produces a leading empty-string token — so `relTokens.includes
("preload")` was already true even with `rel="  PreLoAd  "`. **The `rel`
side was never the problem.** The `as` value, by contrast, was compared with
exact string equality (`as === "font" || as === "style"`) after only
`.toLowerCase()` — no `.trim()`. `"  style  ".toLowerCase()` is
`"  style  "`, which does not equal `"style"`, so the whole `<link>` was
silently skipped even though its `rel` token and remote `href` were both
correctly identified. Verified this precise mechanism in isolation:

```
"  preload  ".split(/\s+/)  →  ["", "preload", ""]   (rel token match: fine)
"  style  " === "style"     →  false                 (as comparison: broken)
```

## Exact fix

One narrow change in `findExternalStyleFontViolations()`'s HTML branch: a
single `normalize = (v) => (v || "").trim().toLowerCase()` helper, applied
identically to both `rel` and `as` before any comparison, plus
`.filter(Boolean)` on the split token list (removes the harmless-but-untidy
empty-string tokens from leading/trailing whitespace, matching the work
order's "compare tokens robustly" instruction). No behavior for `rel` token
matching changed — it was already correct; using one shared helper for both
attributes means they cannot drift out of sync again. No allowlist entry was
added. No vendor name was added. No domain-specific special-casing.

## New malicious normalization fixtures — all detected

Added to `scripts/qa/test-external-style-font-policy.mjs`, none removed:

```
PASS  [malicious]  10a-as-leading-trailing-space-style        remote-font-preload
PASS  [malicious]  10b-as-leading-trailing-space-font         remote-font-preload
PASS  [malicious]  10c-as-whitespace-and-uppercase            remote-font-preload
PASS  [malicious]  10d-rel-whitespace-and-uppercase           remote-font-preload
PASS  [malicious]  10e-whitespace-case-protocol-relative      remote-font-preload
PASS  [malicious]  10f-reviewer-reported-bypass-exact         remote-font-preload
```

`10f` is the exact reviewer string, byte-for-byte, so the specific bypass
that was reported is directly covered — not just the general class.

## Allowed neighboring fixture — stays clean

```
PASS  [allowed]  a8-preconnect-whitespace-and-case-variation
```

Confirms the normalization fix did not over-correct into flagging
`preconnect` (which loads no resource by itself and must stay allowed
regardless of whitespace/case on `rel`).

## Self-test result

`node scripts/qa/test-external-style-font-policy.mjs`:
**29/29 fixtures behaved correctly** (21 malicious detected, 8 allowed clean;
was 22 total — 15/7 — before this cycle, so total strictly increased as
required and nothing was removed).

## Independent-fixture re-run — reviewer's own file, not just mine

The review evidence pack's own `verify-independent-f006-fixtures.mjs` was
adapted (only its hardcoded worktree path changed, to point at this Writer's
worktree instead of a review-only path that doesn't exist here — no fixture
content was altered) and re-run against the fixed module:

```
OVERALL PASS: forbidden 9/9; allowed 5/5
```

(Was 8/9 forbidden before this fix — the one prior failure was exactly
`H-case-and-whitespace-preload`, now passing.)

## Static / Browser / HTML results

| Suite | Result |
| --- | --- |
| `node scripts/qa/test-external-style-font-policy.mjs` | **29/29 PASS**, exit 0 |
| `node scripts/qa/validate-site.mjs` | **97/97 PASS**, exit 0 (unchanged — this module wasn't touched this cycle) |
| `node scripts/qa/browser-qa.mjs` | **119/119 PASS**, exit 0 (unchanged) |
| `npx html-validate` (7 pages) | **0 problems**, exit 0 |

## Product-facing diff = 0 — evidence

```
$ git status --porcelain
 M scripts/qa/external-style-font-policy.mjs
 M scripts/qa/test-external-style-font-policy.mjs
```

Only the policy module and its self-test changed. No route HTML, no
`assets/css/site.css`, no `assets/js/site.js`, no `robots.txt`, no public
copy, CTA, price, or route structure — confirmed by direct inspection of
`git status --porcelain`, not asserted from memory. Because product-facing
diff is zero, Lighthouse and screenshot regeneration were not required and
were not performed this cycle, per the work order's own scope boundary.

## Remaining Limitations

- The guard remains static (source-text analysis), not a runtime network
  monitor — unchanged limitation from the F-006 cycle, out of scope here.
- `ALLOWLISTED_ORIGINS` remains empty; no entry was added.
- Chrome-only browser QA; no second rendering engine, no real devices.
- All owner decisions and blockers listed in `07_FINAL_HANDOFF.md` §12–13
  remain open; none were in scope for this micro-remediation.

## Writer Verdict

**WRITER F-006.1 REMEDIATION COMPLETE — FRESH REVIEW READY.** The exact
reported bypass is closed and independently re-verified two ways: against
the Writer's own expanded self-test (29/29) and against the reviewer's own
unmodified fixture logic re-pointed at the fixed code (9/9 forbidden, up
from 8/9). Static/browser/HTML regression all pass at counts equal to or
greater than before. Product-facing diff is zero, confirmed by direct git
inspection. Final release authorization remains with an independent
Fresh-Context reviewer — see `15_FRESH_REVIEW_REQUEST_F006_1.md`.
