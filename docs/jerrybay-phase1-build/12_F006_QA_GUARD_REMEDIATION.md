# F-006 QA Guard Remediation — Mechanism-Class Remote Font/Stylesheet Guard

> **Writer verdict: WRITER F-006 REMEDIATION COMPLETE — FRESH REVIEW READY**
> Writer self-verification only. Never claims Independent PASS.

## Provenance

| Field | Value |
| --- | --- |
| Parent SHA | `c64637efb1e9aaf86078c5f56b9605dc0ae205fa` |
| Independent re-review verdict at parent | FAIL — F-006 only (F-001/F-002/F-003 all independently confirmed PASS) |
| Review evidence | `C:\Users\82103\jerrybay-review-evidence\c64637e\` (`REMEDIATION_WORK_ORDER.md`; no separate `REVIEW_REPORT.md` was present in this pack — noted, not fabricated) |
| Reproduction independently re-verified | Yes — `qa-gate-adversarial-audit.mjs`/`.json` read and its four payloads independently checked against the actual current `EXTERNAL_FONT_PATTERNS` in `scripts/qa/validate-site.mjs`, not just trusted from the pack's prose |

## What independently passed at c64637e (not re-litigated)

Per `REMEDIATION_WORK_ORDER.md`: F-001 (95 targets, 0 undersized), F-002
(7/7 real CDP scroll-lock tests), F-003 (Mobile DevTools 89/88/87, Desktop
100, 0 font requests), `validate-site` 89/89, `browser-qa` 119/119,
html-validate 0 problems, commercial/claim/data/route/privacy regression,
and visual regression. None of this was touched in this cycle.

## Exact reviewer finding — F-006 (MAJOR)

`scripts/qa/validate-site.mjs` check 16 was a host/vendor-name denylist
(`fonts.googleapis.com`, `fonts.gstatic.com`, `material-symbols`,
`material-icons`, `typekit`/`fast.fonts.net`/`fonts.adobe.com`). Four
ordinary remote-loading mechanisms produced zero matches against that exact
pattern list:

1. `<link rel="stylesheet" href="https://cdn.example.test/assets/site.css">`
2. `@import url("https://cdn.example.test/assets/site.css");`
3. `@font-face { src: url("https://cdn.example.test/assets/test.woff2"); }`
4. `<style>@font-face { src: url("https://cdn.example.test/assets/test.woff2"); }</style>`

## Root cause of the old guard

The prior remediation (which fixed the actual F-003 defect) added detection
for the *specific* hosts and vendor names observed in that incident. It
never modeled the general mechanism — that a remote stylesheet or font can
be introduced from any origin, under any domain name, and still reproduce
the same class of performance regression. A denylist keyed on today's known
bad actors cannot catch tomorrow's different domain using the same
mechanism.

## New detection policy

New module: `scripts/qa/external-style-font-policy.mjs`, exporting one pure
function `findExternalStyleFontViolations(text, { source, fileLabel })`.
`tools/` does not exist in this repository (the same path this Writer noted
in the prior remediation's F-005 finding); the real, working path is
`scripts/qa/`, used throughout.

Detects the **mechanism**, not the vendor:

| Mechanism | What it catches |
| --- | --- |
| `remote-stylesheet` | `<link rel="stylesheet" href="...">` where href is `http:`, `https:`, or protocol-relative `//` |
| `remote-font-preload` | `<link rel="preload" as="font"\|"style" href="...">` with a remote href |
| `remote-import` | CSS `@import url(...)` or `@import "..."` with a remote target, either quoting form |
| `remote-font-face` | Any `url(...)` inside an `@font-face` block's `src:` list that is remote, even when mixed with a `local(...)` entry in the same list |

Inline `<style>` blocks in HTML are extracted and run through the same CSS
checks — mechanisms 7 and 8 in the review's fixture list.

**Policy: zero remote stylesheets/fonts unless explicitly allowlisted with
documented Owner approval.** `ALLOWLISTED_ORIGINS` is exported from the
module and is empty by default — exactly as required. Adding an origin
requires an explicit code change to that array, which is itself visible in
any future diff/review.

**Explicitly not flagged, by design:**
- Ordinary `<a href="https://...">` links — never inspected; only `<link>`
  tags are scanned.
- Bare `<link rel="preconnect">` / `dns-prefetch` — a connection hint that
  loads no resource by itself; flagging it would be over-broad per the work
  order's explicit instruction not to create a blanket "no external URLs
  anywhere" rule.
- `data:` URLs — not a remote-network request; the remote-URL regex
  (`^(?:https?:)?\/\//i`) does not match the `data:` scheme, so no special
  case was needed.
- Local absolute (`/assets/...`) and relative (`../assets/...`) paths.

## Malicious fixture results — 15/15 detected

All 4 required fixtures plus 11 additional variations (case/whitespace,
known Google URLs re-tested through the *new* mechanism-based path, single
vs. double quoting, `preload as=font`/`as=style`) — run via
`scripts/qa/test-external-style-font-policy.mjs`:

```
PASS  [malicious]  1-html-remote-stylesheet-https             remote-stylesheet
PASS  [malicious]  2-html-remote-stylesheet-protocol-relative remote-stylesheet
PASS  [malicious]  3-css-remote-import-url-form               remote-import
PASS  [malicious]  4-css-remote-import-bare-string-form       remote-import
PASS  [malicious]  5-css-remote-font-face-src-url             remote-font-face
PASS  [malicious]  6-css-remote-font-face-src-list-mixed-with-local remote-font-face
PASS  [malicious]  7-html-inline-style-remote-import          remote-import
PASS  [malicious]  8-html-inline-style-remote-font-face       remote-font-face
PASS  [malicious]  9a-mixed-case-protocol-and-rel             remote-stylesheet
PASS  [malicious]  9b-whitespace-variation-import             remote-import
PASS  [malicious]  9c-preload-as-font-remote                  remote-font-preload
PASS  [malicious]  9d-preload-as-style-remote                 remote-font-preload
PASS  [malicious]  9e-known-google-fonts-stylesheet            remote-stylesheet
PASS  [malicious]  9f-known-gstatic-font-face                  remote-font-face
PASS  [malicious]  9g-single-quoted-import                     remote-import
```

## Allowed fixture results — 7/7 stay clean

All 4 required allowed cases plus 3 additional (bare preconnect, a data-URL
font-face, a local `@import`):

```
PASS  [allowed]  a1-local-absolute-stylesheet
PASS  [allowed]  a2-relative-font-url-in-font-face
PASS  [allowed]  a3-system-font-stack-no-url
PASS  [allowed]  a4-ordinary-external-anchor-link
PASS  [allowed]  a5-bare-preconnect-loads-nothing
PASS  [allowed]  a6-data-url-font-face
PASS  [allowed]  a7-local-import
```

**Total: 22/22 fixtures behaved correctly, exit 0.** None of these fixtures
touch any committed product file — the self-test operates entirely on
in-memory strings.

## Static QA before / after

| | Before | After |
| --- | --- | --- |
| `validate-site.mjs` total checks | 89 | **97** (+8: check 17, one per route + site.css) |
| Existing checks removed or weakened | — | **0** |
| `test-external-style-font-policy.mjs` | did not exist | **22/22 PASS, exit 0** |

Check 16 (the old vendor-name denylist) was **kept, not replaced** — it
still runs and still passes. Check 17 (the new mechanism-class guard) was
added alongside it as defense in depth. No existing assertion was deleted,
skipped, or had its threshold lowered.

## Browser QA result

`node scripts/qa/browser-qa.mjs` — **119/119 PASS, exit 0** (unchanged count
and unchanged script; re-run for full regression per the work order, output
directed to a scratch directory rather than overwriting the committed
`evidence/screenshots/` since no product-facing file changed and the work
order's default expectation is that screenshots do not need regeneration
in that case).

## HTML validation result

`html-validate` 11.6.2, all 7 pages — **0 problems, exit 0**.

## Product-facing files changed?

**NO.** `git status --porcelain` after this cycle shows exactly three
changed paths, all QA tooling:

```
M  scripts/qa/validate-site.mjs
A  scripts/qa/external-style-font-policy.mjs
A  scripts/qa/test-external-style-font-policy.mjs
```

No route HTML, `assets/css/site.css`, `assets/js/site.js`, `robots.txt`, or
`vercel.json` was touched. Per the work order, F-001/F-002/F-003 standalone
re-audits, the 3-cold-run Lighthouse gate, and screenshot regeneration are
therefore **not required** — but one confirmatory single DevTools-throttled
Lighthouse run on Home Mobile was taken anyway, at negligible cost, since
the prior review's own acceptance test #4 explicitly asked for it:

| Metric | Result |
| --- | --- |
| Performance | **93** (threshold ≥75) |
| Accessibility | **100** (threshold ≥95) |
| Best Practices | **100** (threshold ≥90) |
| Network requests | 4 |
| Font requests | **0** |

Consistent with the prior three cold runs (91/94/94) and the independent
reviewer's own reproduction (89/88/87) — as expected, since no product file
changed. Raw report: `evidence/f006/lighthouse-home-mobile-devtools-confirmatory.json`.

## Remaining Limitations

- The mechanism-class guard is static (source-text pattern analysis), not a
  runtime network monitor. It cannot catch a remote resource introduced via
  JavaScript at runtime (e.g. `document.createElement('link')` with a
  remote href) — `site.js` contains no such code today, and this is
  consistent with the review's own minimal-fix boundary ("Modify only the
  static QA guard"), not an oversight to be silently expanded here.
- `ALLOWLISTED_ORIGINS` is empty and enforced only by code review going
  forward — there is no separate policy-file signing mechanism. This
  matches the work order's own phrasing ("explicitly allowlisted in code
  with documented Owner approval").
- Chrome-only browser QA; no second rendering engine, no real devices.
- All owner decisions and blockers listed in `07_FINAL_HANDOFF.md` §12–13
  remain open; none were in scope for this narrow QA-guard cycle.

## Writer Verdict

**WRITER F-006 REMEDIATION COMPLETE — FRESH REVIEW READY.** The
mechanism-class guard is implemented, its adversarial self-test passes
22/22 including all 4 payloads the independent review demonstrated bypassed
the old guard, static/browser/HTML regression all pass with counts equal to
or greater than before, and product-facing files are unchanged (confirmed
by `git status --porcelain`, not just asserted). Final release authorization
remains with an independent Fresh-Context reviewer — see
`13_FRESH_REVIEW_REQUEST_F006.md`.
