# Fresh Codex Review Request

> **SUPERSEDED.** This request was acted on: an independent review of the
> resulting commit `e4fe3b8` returned **FAIL** (F-001, F-002, F-003 —
> see `10_REMEDIATION_EVIDENCE.md`). Use
> `11_FRESH_REVIEW_REQUEST_AFTER_REMEDIATION.md` instead. Kept for history.
> Note: this document's QA commands already used the correct
> `scripts/qa/validate-site.mjs` / `scripts/qa/browser-qa.mjs` paths — the
> `tools/` path mismatch noted by the independent review (F-005) was in that
> review's own supplied instruction template, not in this document.

**You must have no prior involvement in this build.** If you have any memory of writing this
site, this commercial lock, or these QA scripts, you are not the intended reviewer — hand this
back and ask for a genuinely independent reviewer instead.

**Do not modify product code.** Your job is verification, not fixing. If you find a real defect,
report it in your review output; do not patch it and re-approve your own patch.

## 1. Provenance to verify first

| Field | Expected value |
| --- | --- |
| Base branch | `audit/jerrybay-manyfast-reconciliation-v1` |
| Base SHA | `b51033ac7541dbd8cfb728cb040e68e5cf32e06c` |
| Writer branch | `build/jerrybay-phase1-commercial-v1` |
| Exact Final Fixed SHA | **the branch tip after the `test: close phase1 private build QA evidence` commit — confirm with `git rev-parse HEAD`, do not trust any number written in prose** |
| Worktree | `C:\Users\82103\jerrybay-site-worktrees\phase1-commercial-v1` |

Run before anything else:
```bash
cd C:\Users\82103\jerrybay-site-worktrees\phase1-commercial-v1
git status -sb                       # expect: clean, on build/jerrybay-phase1-commercial-v1
git log --oneline --decorate -6
git diff --name-status b51033ac7541dbd8cfb728cb040e68e5cf32e06c..HEAD
```

## 2. Changed files, at a glance

7 routes (`/`, `/capabilities/`, `/work/`, `/collaborate/`, `/about/`, `/contact/`,
`/privacy/`), `assets/css/site.css`, `assets/js/site.js`, `robots.txt`, `vercel.json`,
`scripts/qa/*.mjs`, `docs/jerrybay-phase1-build/*`, and one deletion: `code.html` (a stale
duplicate export that was publicly indexable and carried unverified customer names — verify
it is actually gone and was not needed elsewhere).

## 3. Commercial Lock — verify against rendered pages, not against this document

Read `01_COMMERCIAL_LOCK.md` for the intended state, then check the **rendered HTML**, not the
markdown, for:

- Primary CTA text is **exactly** `조직 AI 적용 상담 요청` everywhere it appears, and it is the
  only button using the gradient fill.
- Secondary CTA `대표 수행 방식 보기` is visually subordinate (no fill, thin outline).
- Price anchors `₩5,000,000부터`, `₩1,500,000`, `4–8주` appear where the lock specifies.
- Hero H1 is `AI 교육으로 끝나지 않게 만듭니다.` and buyer/problem/outcome are visible above
  the fold, before any brand-breadth content.

## 4. Independent commands to re-run — do not trust this document's numbers

```bash
node scripts/qa/validate-site.mjs
# expect: 81/81 checks passed, exit 0

npx --yes html-validate index.html capabilities/index.html work/index.html \
  collaborate/index.html about/index.html contact/index.html privacy/index.html
# expect: 0 problems, exit 0

python -m http.server 4173   # from repo root, separate terminal

# then, from a second terminal, with a headless Chrome already running with CDP:
#   chrome --headless=new --remote-debugging-port=9222 --user-data-dir=<tmp> about:blank
node scripts/qa/browser-qa.mjs http://127.0.0.1:9222 http://127.0.0.1:4173 <scratch-dir>
# expect: 111/111 checks passed, exit 0
```

If any of these three do not match the numbers in `04_QA_CONTRACT.md` / `08_P2_QA_EVIDENCE.md`,
**that is a review finding**, not something to silently reconcile.

## 5. Claim Ledger audit — do this by hand, not by trusting the CSV

Open `02_CONTENT_AND_CLAIM_LEDGER.csv` (42 rows) side-by-side with the 7 rendered pages.
Specifically:

1. Find any visible claim-bearing text (a number, a status word, a promise, an entity name)
   that has **no** corresponding row in the ledger. Report it.
2. For every row marked `QUARANTINED` or `NOT MIGRATED`, confirm the claim is genuinely absent
   from rendered output — grep is not enough, since a claim can be rephrased around a keyword
   filter. Read the actual sentence.
3. Confirm zero instances of `PROVEN` as a status label anywhere in `/work/`.
4. Confirm `/privacy/` contains no invented date, retention period, officer name, or
   `privacy@`-style address.

## 6. Adversarial cases to try against the claim scanner

`scripts/qa/validate-site.mjs` check `09:*` is **polarity-blind by design** — it flags a
prohibited phrase whether it's asserted or denied, and this is an intentional, accepted
decision (see `01_COMMERCIAL_LOCK.md`, not to be "improved" by adding negation-awareness).
Try to find a way to state a prohibited claim (a headcount, an org count, "운영 완료", a
testimonial) that the scanner does **not** catch — for example, using synonyms, spacing tricks,
or splitting a phrase across HTML tags. Report anything that gets through; do not fix the
scanner yourself.

## 7. Browser adversarial cases

- Resize below 900px and confirm the mobile menu is reachable by keyboard alone (Tab to the
  toggle button, Enter to open, Tab through links, Escape to close, focus lands back on the
  toggle).
- Load each page with JavaScript disabled and confirm it is still fully readable and navigable
  (the site is documented as progressive-enhancement-only; verify that claim).
- Try `prefers-reduced-motion: reduce` and confirm transitions are suppressed.
- Check that no page has a horizontal scrollbar at 320px width (narrower than the 390px this
  build's own suite tests).

## 8. Lighthouse — re-run at least Home Mobile, treat the score as informational

Home Mobile Performance is documented as **CONDITIONAL PASS — EXTERNAL DEPENDENCY** in
`08_P2_QA_EVIDENCE.md`, attributed to the external Google Fonts CDN and the number of CJK font
subsets, not to this build's local code. Re-run it yourself:

```bash
npx --yes lighthouse http://127.0.0.1:4173/ --output=json \
  --chrome-flags="--headless=new --no-sandbox --disable-gpu" \
  --only-categories=performance,accessibility,best-practices --quiet
```

Confirm Accessibility and Best Practices both score 100 (not just Home — spot-check at least
two other routes). If Performance scores meaningfully differently than the 63–72 range recorded
here, or if you find a genuine local cause the Writer missed, that is a review finding — do not
assume the Writer's "external dependency" classification is correct without checking it
yourself.

## 9. PASS / FAIL rubric

| Verdict | Criteria |
| --- | --- |
| **REVIEW PASS** | All three independent command re-runs match; no unlisted claim found; no scanner bypass found; commercial lock matches rendered pages; browser adversarial cases behave correctly; Lighthouse Accessibility/Best Practices confirmed at 100 on spot-checked routes |
| **REVIEW PASS WITH NOTES** | Above, plus minor cosmetic or documentation issues that don't affect claim safety, the commercial lock, or the QA suites |
| **REVIEW FAIL** | Any independent re-run produces a different result than documented, any claim-bearing text has no ledger row, any prohibited claim gets through the scanner or appears in rendered copy, or the commercial lock is not actually reflected in the rendered pages |

## 10. What you are not asked to do

- Do not push, open a PR, merge, or deploy anything — this remains local and private regardless
  of your verdict.
- Do not resolve the open `OWNER_DECISION` items in `07_FINAL_HANDOFF.md` §12 — those are
  Jerry's decisions, not review blockers for this cycle.
- Do not add features, redesign the UI, or "improve" the claim scanner's negation-handling —
  that is explicitly the Owner-accepted design in `01_COMMERCIAL_LOCK.md` §1.
