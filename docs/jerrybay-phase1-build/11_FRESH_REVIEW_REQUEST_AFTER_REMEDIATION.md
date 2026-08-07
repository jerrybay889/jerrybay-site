# Fresh Review Request — After F-001/F-002/F-003 Remediation

**You must have no prior involvement in this build or in the prior FAIL
review.** If you have any memory of writing this site, the prior review at
`e4fe3b8`, or this remediation, you are not the intended reviewer.

**Use a detached worktree. Product code is read-only.** Verify, don't fix. If
you find a real defect, report it — do not patch it and re-approve your own
patch.

## 0. Why this document exists

An independent Fresh-Context review of commit `e4fe3b8` returned **FAIL**:
`C:\Users\82103\jerrybay-review-evidence\e4fe3b8\REVIEW_REPORT.md`. It found
F-001 (Critical, 44×44 targets), F-002 (Major, scroll lock), F-003 (Critical,
Mobile Performance), and two Minor findings. This Writer remediated all five
on top of `e4fe3b8` without amending it. Full before/after evidence:
`10_REMEDIATION_EVIDENCE.md`. **Do not trust that document's numbers without
re-running the commands below yourself.**

## 1. Provenance to verify first

| Field | Expected value |
| --- | --- |
| Parent (failed review) SHA | `e4fe3b8cf353b1f210ee5b9916d6145b8ed2d72e` |
| Branch | `build/jerrybay-phase1-commercial-v1` |
| New Exact Final Fixed SHA | **confirm with `git rev-parse HEAD` — do not trust any SHA written in prose, in this file, or spoken in a session summary** |

```bash
git worktree add C:\Users\82103\jerrybay-site-worktrees\review-phase1-<new-sha-prefix> <new-sha>
cd C:\Users\82103\jerrybay-site-worktrees\review-phase1-<new-sha-prefix>
git status -sb                       # expect: clean, detached at <new-sha>
git log --oneline --decorate -8
git diff --name-status e4fe3b8cf353b1f210ee5b9916d6145b8ed2d72e..HEAD
git diff --check e4fe3b8cf353b1f210ee5b9916d6145b8ed2d72e..HEAD
```

Use a **new** detached worktree, separate from both the Writer's worktree and
the prior review's `review-phase1-e4fe3b8` worktree — do not reuse either.

## 2. Changed files since the failed review

`assets/css/site.css`, `assets/js/site.js`, `scripts/qa/validate-site.mjs`,
`scripts/qa/browser-qa.mjs`, all 7 route HTML files (Google Fonts `<link>`
tags removed), one line-targeted whitespace fix in a committed Lighthouse
evidence file, and new docs `10_REMEDIATION_EVIDENCE.md` /
`11_FRESH_REVIEW_REQUEST_AFTER_REMEDIATION.md`.

## 3. F-001 — independently verify every visible target is ≥44×44

Do not just re-run `browser-qa.mjs` and trust its `touch` check — that check
was written by the same Writer who wrote the code. Write your own
measurement, or at minimum inspect these specific elements the original
review named, at both 1440×900 and 390×844:

- Home nav `홈` — previously 41×44
- Footer `Work` and `About` — previously 37×69 and 42×69
- `/capabilities/` inline "Related Work" links (`AIKUS`, `AIKUS Books 01`,
  `OMYQT`, `Sprint`, `Paid Diagnostic`) — previously ~19px tall
- `/work/` inline links — previously ~18px tall
- `/contact/` `범위 경계 보기` and the direct email link — previously ~18px
  tall

```js
// paste into a fresh CDP Runtime.evaluate against each route
JSON.stringify([...document.querySelectorAll("a[href]")].map(a => {
  const r = a.getBoundingClientRect();
  return { text: a.textContent.trim().slice(0,24), w: Math.round(r.width), h: Math.round(r.height) };
}).filter(x => x.w > 0 && x.h > 0 && (x.w < 44 || x.h < 44)))
```
This should return an empty array on every route at both viewports. Also
open the page visually and judge whether the fix created ugly button-blob
whitespace inside body copy — the acceptance criterion is real usability,
not just a passing number.

## 4. F-002 — independently verify the scroll lock with real input

A script-dispatched `WheelEvent` does **not** trigger a browser's native
scroll response — only trusted/OS-level input does. Testing with
`document.dispatchEvent(new WheelEvent(...))` would pass regardless of
whether the fix works. Use CDP's `Input.dispatchMouseEvent` with
`type: "mouseWheel"` instead (this is what `browser-qa.mjs`'s
`testScrollLock()` does — read it before trusting it, then reproduce
independently):

1. At 390×844, scroll to a non-zero position on any route.
2. Open the mobile menu.
3. Dispatch a real `mouseWheel` event via CDP. Confirm the page does not
   scroll.
4. Press Escape. Confirm the menu closes, focus returns to the toggle, and
   the original scroll position is preserved.
5. Dispatch another real `mouseWheel` event. Confirm the page scrolls again.
6. Separately: open the menu at mobile width, then resize the viewport past
   900px. Confirm the lock releases (check `document.body.classList` no
   longer contains `nav-open`).

## 5. F-003 — independently reproduce the Lighthouse mobile gate

```bash
python -m http.server 4173      # from the repo root, separate terminal

npx --yes lighthouse http://127.0.0.1:4173/ --output=json \
  --chrome-flags="--headless=new --no-sandbox --disable-gpu" \
  --only-categories=performance,accessibility,best-practices \
  --throttling-method=devtools --quiet
```

Run this **at least twice, independently** (fresh Chrome process each time,
not reused). Both runs should score **≥75** Performance. Also confirm:

```bash
grep -rn "fonts.googleapis.com\|fonts.gstatic.com" *.html */index.html assets/css/site.css
```
This must return nothing. If it does, the fix was reverted or incomplete —
that is a review finding. Also spot-check the network-requests audit in your
own Lighthouse JSON output — it should show 4 requests, ~30KB total, on Home,
with zero `Font`-typed requests.

Also confirm Home Desktop Performance ≥85 and Accessibility ≥95 /
Best Practices ≥90 on Home and at least two other routes.

## 6. Independent commands to re-run — do not trust this document's numbers

```bash
node scripts/qa/validate-site.mjs
# expect: 89/89 checks passed, exit 0

npx --yes html-validate index.html capabilities/index.html work/index.html \
  collaborate/index.html about/index.html contact/index.html privacy/index.html
# expect: 0 problems, exit 0

node scripts/qa/browser-qa.mjs http://127.0.0.1:9222 http://127.0.0.1:4173 <scratch-dir>
# expect: 119/119 checks passed, exit 0
```

If any of these three produce different numbers than documented, that is a
review finding, not something to silently reconcile with this packet.

## 7. Claim / commercial / privacy regression audit

Everything from the original `09_FRESH_CODEX_REVIEW_REQUEST.md` still
applies and should be re-run in full — this remediation touched only CSS/JS/
QA scripts and font `<link>` tags, never copy, so:

1. Open `02_CONTENT_AND_CLAIM_LEDGER.csv` side-by-side with the 7 rendered
   pages. Find any claim-bearing text with no ledger row.
2. Confirm zero `PROVEN` labels applied to any Work card (one explanatory
   sentence stating PROVEN is *not* used is expected and correct — read it,
   don't just grep-count `PROVEN`).
3. Confirm `/privacy/` still has no invented date, retention period, officer
   name, or `privacy@`-style address.
4. Adversarially test the claim scanner in `validate-site.mjs` check `09:*`
   — it is intentionally polarity-blind (flags a prohibited phrase whether
   asserted or denied) and is an accepted design decision, not something to
   "fix." Try to find a phrasing that states a prohibited claim without
   tripping it.
5. Confirm the Commercial Lock is unchanged: Primary CTA exactly
   `조직 AI 적용 상담 요청`, secondary exactly `대표 수행 방식 보기`, `4–8주`,
   `₩5,000,000부터`, `₩1,500,000` all present and unaltered from before this
   remediation cycle.
6. Confirm no forms, no `fetch`/`XMLHttpRequest`, no `localStorage`/
   `sessionStorage`, no analytics/tracking script, anywhere in the 7 HTML
   files or `assets/js/site.js`.

## 8. PASS / FAIL rubric

| Verdict | Criteria |
| --- | --- |
| **REVIEW PASS** | All three independent command re-runs match documented counts; F-001/F-002/F-003 independently reproduced as fixed using the methods in §3-5 (not just by re-running the Writer's own scripts); zero external font requests confirmed; claim ledger and commercial lock unchanged; no new defect introduced |
| **REVIEW PASS WITH NOTES** | Above, plus minor cosmetic issues that don't affect claim safety, the commercial lock, accessibility, or performance |
| **REVIEW FAIL** | Any independent re-run produces a different result than documented, any of F-001/F-002/F-003 still reproduces under an independent test, external font requests reappear, or any claim/commercial/privacy regression is found |

## 9. What you are not asked to do

- Do not push, open a PR, merge, or deploy — regardless of verdict.
- Do not resolve the open `OWNER_DECISION` items in `07_FINAL_HANDOFF.md`
  §12 — Jerry's decisions, not review blockers.
- Do not "improve" the claim scanner's negation-handling or restore the
  Google Fonts typography — both are explicit, accepted Owner/Writer
  decisions documented in `01_COMMERCIAL_LOCK.md` and this remediation.
- Do not modify product code. If you believe a fix is wrong, report why —
  do not silently correct it.
