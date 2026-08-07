# Fresh Review Request — F-006 QA Guard Remediation

**You must have no prior involvement in this build, the F-001/F-002/F-003
remediation, or the F-006 finding itself.** If you have any memory of
writing `scripts/qa/external-style-font-policy.mjs` or this document, you
are not the intended reviewer.

**Use a detached exact-SHA worktree. Product code is read-only.** Verify,
don't fix.

## 0. Why this document exists

An independent re-review of `c64637efb1e9aaf86078c5f56b9605dc0ae205fa`
confirmed F-001/F-002/F-003 all PASS, but found **F-006 (MAJOR)**: the
static external-font guard (`validate-site.mjs` check 16) was a host/vendor
denylist that four ordinary remote-loading mechanisms could bypass
undetected. Evidence:
`C:\Users\82103\jerrybay-review-evidence\c64637e\REMEDIATION_WORK_ORDER.md`.
This Writer added a mechanism-class guard on top of `c64637e` without
touching any product-facing file. Full detail:
`12_F006_QA_GUARD_REMEDIATION.md`. **Do not trust that document's numbers
without independently re-running everything below.**

## 1. Provenance to verify first

| Field | Expected value |
| --- | --- |
| Parent SHA | `c64637efb1e9aaf86078c5f56b9605dc0ae205fa` |
| New Fixed SHA | **confirm with `git rev-parse HEAD` — do not trust any SHA written in prose** |

```bash
git worktree add C:\Users\82103\jerrybay-site-worktrees\review-phase1-<new-sha-prefix> <new-sha>
cd C:\Users\82103\jerrybay-site-worktrees\review-phase1-<new-sha-prefix>
git status -sb                       # expect: clean, detached at <new-sha>
git log --oneline --decorate -3
git diff --name-status c64637efb1e9aaf86078c5f56b9605dc0ae205fa..HEAD
git diff --check c64637efb1e9aaf86078c5f56b9605dc0ae205fa..HEAD
```

## 2. Verify the product diff is QA-only

```bash
git diff --stat c64637efb1e9aaf86078c5f56b9605dc0ae205fa..HEAD
```

Expected: only `scripts/qa/validate-site.mjs` (modified),
`scripts/qa/external-style-font-policy.mjs` (added),
`scripts/qa/test-external-style-font-policy.mjs` (added), plus
documentation and one confirmatory Lighthouse evidence file. **No route
HTML, no `assets/css/site.css`, no `assets/js/site.js` should appear.** If
any product-facing file appears in this diff without a clear justification
in `12_F006_QA_GUARD_REMEDIATION.md`, that is a review finding.

## 3. Independent code inspection of the guard

Read `scripts/qa/external-style-font-policy.mjs` yourself — don't just
trust the Writer's description of it. Confirm it actually:

1. Scans `<link>` tags for `rel~=stylesheet` or `rel=preload` with
   `as=font`/`as=style`, and flags a remote (`http:`, `https:`, or
   protocol-relative `//`) `href`.
2. Scans CSS text for `@import` (both `url(...)` and bare-string forms)
   with a remote target.
3. Scans `@font-face` blocks' `src:` lists for any remote `url(...)`, even
   when a `local(...)` entry is present in the same list.
4. Extracts inline `<style>` blocks from HTML and runs the same CSS checks
   on their content.
5. Does **not** flag `<a href="https://...">` links, bare
   `<link rel="preconnect">`, `data:` URLs, or local/relative paths.
6. Has an empty `ALLOWLISTED_ORIGINS` array.

## 4. Independently inject at least 3 alternate forbidden mechanisms

Do not just re-run `scripts/qa/test-external-style-font-policy.mjs` and
trust its own fixtures — write your own, different from the Writer's list.
Suggestions (pick at least 3, prefer ones not already in the Writer's
fixture file):

- A remote stylesheet from a domain never mentioned anywhere in this repo
  (e.g. `https://static.example.org/theme.css`).
- A `@font-face` with `src:` split across multiple lines/declarations.
- An `@import` using a fully uppercase `HTTPS://` scheme.
- A remote stylesheet `<link>` with extra/unusual attribute ordering or
  extra whitespace inside the tag.
- A `<link rel="stylesheet preload">` (multiple space-separated rel
  tokens) with a remote href.

For each, confirm `findExternalStyleFontViolations()` (or the full
`node scripts/qa/validate-site.mjs` run, if you inject it into a temporary
copy of a route file — **never** the committed product file) actually
flags it. Report any mechanism you find that still bypasses the guard.

## 5. Verify the current product remains zero external stylesheet/font dependency

```bash
grep -rn "fonts.googleapis.com\|fonts.gstatic.com\|@import\|@font-face" \
  *.html */index.html assets/css/site.css
```

Confirm any `@import`/`@font-face` hits (if none, that's fine — the current
product uses neither) are local/relative, not remote. Then serve locally
and confirm zero font network requests:

```bash
python -m http.server 4173
npx --yes lighthouse http://127.0.0.1:4173/ --output=json \
  --chrome-flags="--headless=new --no-sandbox --disable-gpu" \
  --only-categories=performance --throttling-method=devtools --quiet
```
Check the `network-requests` audit — 4 requests, 0 `Font`-typed, as in prior
runs.

## 6. Independent commands to re-run — do not trust this document's numbers

```bash
node scripts/qa/validate-site.mjs
# expect: 97/97 checks passed, exit 0

node scripts/qa/test-external-style-font-policy.mjs
# expect: 22/22 fixtures behaved correctly, exit 0

npx --yes html-validate index.html capabilities/index.html work/index.html \
  collaborate/index.html about/index.html contact/index.html privacy/index.html
# expect: 0 problems, exit 0

node scripts/qa/browser-qa.mjs http://127.0.0.1:9222 http://127.0.0.1:4173 <scratch-dir>
# expect: 119/119 checks passed, exit 0
```

If any of these produce different numbers than documented, that is a review
finding, not something to silently reconcile.

## 7. Re-confirm F-001/F-002/F-003 are still closed

Product files did not change in this cycle, so these should reproduce
identically to the prior independent review (95 targets/0 undersized,
7/7 scroll-lock, 89/88/87 Mobile DevTools). A spot-check (one route for
F-001, Home for F-002/F-003) is sufficient — a full re-audit is not
required unless you find product files changed unexpectedly (see §2).

## 8. Claim / commercial / privacy regression

This cycle touched only QA scripts — no copy, no CTA, no price, no route.
A light spot-check is sufficient: confirm the Commercial Lock strings
(`조직 AI 적용 상담 요청`, `대표 수행 방식 보기`, `4–8주`, `₩5,000,000부터`,
`₩1,500,000`) are unchanged, and `/privacy/` still carries its placeholder
notice and no invented legal details.

## 9. PASS / FAIL rubric

| Verdict | Criteria |
| --- | --- |
| **REVIEW PASS** | All commands in §6 match documented counts; independent code inspection (§3) confirms the guard works as described; at least 3 independently-authored forbidden mechanisms (§4) are all detected; zero external font/stylesheet network dependency confirmed (§5); product diff vs `c64637e` is QA-only (§2); F-001/F-002/F-003 spot-check clean (§7) |
| **REVIEW PASS WITH NOTES** | Above, plus minor documentation issues that don't affect the guard's correctness or product behavior |
| **REVIEW FAIL** | Any command produces a different result than documented, any independently-injected mechanism bypasses the guard, any product-facing file changed without justification, or any commercial/claim/privacy regression is found |

## 10. What you are not asked to do

- Do not push, open a PR, merge, or deploy — regardless of verdict.
- Do not resolve the open `OWNER_DECISION` items in `07_FINAL_HANDOFF.md`
  §12 — Jerry's decisions, not review blockers.
- Do not modify product code or the QA guard itself. If you believe the
  guard is wrong or incomplete, report exactly how — do not silently patch
  it and re-approve your own patch.
- Do not average or hide any Lighthouse run that fails a threshold.
