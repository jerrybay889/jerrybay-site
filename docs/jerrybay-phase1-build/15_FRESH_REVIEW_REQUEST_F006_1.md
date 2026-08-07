# Fresh Review Request — F-006.1 Normalization Micro-Remediation

**You must have no prior involvement in this build, the F-006 finding, or
the F-006.1 bypass itself.** If you have any memory of writing the `trim()`
fix or this document, you are not the intended reviewer.

**Use a detached exact-SHA worktree. Product code is read-only.** Verify,
don't fix.

## 0. Why this document exists

An independent review of `20098410fd5a91239c9a707e6ad3a726d137dbea` found
the product itself clean (F-001/F-002/F-003 all PASS, zero remote
stylesheet/font dependency) but reported one bypass in the F-006 guard
itself: `as="  style  "` (whitespace-padded) evaded classification because
the `as` attribute was compared with exact string equality after
`.toLowerCase()` but no `.trim()`. Evidence:
`C:\Users\82103\jerrybay-review-evidence\2009841\REMEDIATION_WORK_ORDER.md`.
This Writer applied a narrow `trim()` fix without touching any product-facing
file. Full detail: `14_F006_1_NORMALIZATION_REMEDIATION.md`. **Do not trust
that document's numbers without independently re-running everything below.**

## 1. Provenance to verify first

| Field | Expected value |
| --- | --- |
| Parent SHA | `20098410fd5a91239c9a707e6ad3a726d137dbea` |
| New Fixed SHA | **confirm with `git rev-parse HEAD` — do not trust any SHA written in prose** |

```bash
git worktree add C:\Users\82103\jerrybay-site-worktrees\review-phase1-<new-sha-prefix> <new-sha>
cd C:\Users\82103\jerrybay-site-worktrees\review-phase1-<new-sha-prefix>
git status -sb                       # expect: clean, detached at <new-sha>
git log --oneline --decorate -3
git diff --name-status 20098410fd5a91239c9a707e6ad3a726d137dbea..HEAD
```

## 2. Verify product-facing diff is zero — the primary gate for this cycle

```bash
git diff --stat 20098410fd5a91239c9a707e6ad3a726d137dbea..HEAD
```

Expected: only `scripts/qa/external-style-font-policy.mjs` (modified),
`scripts/qa/test-external-style-font-policy.mjs` (modified), plus
documentation. **No route HTML, no `assets/css/site.css`, no
`assets/js/site.js`, no `robots.txt`.** Any product-facing file in this diff
is a review finding — this cycle's entire authorization was QA-only.

## 3. Independent code inspection of the trim() fix

Read the diff to `scripts/qa/external-style-font-policy.mjs` yourself.
Confirm:

1. Both `rel` and `as` are normalized through the same explicit
   `trim().toLowerCase()` step before any comparison.
2. The `rel` token list is filtered to drop empty strings from
   leading/trailing whitespace splits.
3. No new allowlist entry, vendor name, or domain was added anywhere in the
   file.
4. The fix is general (normalizes the value) rather than special-cased to
   the exact reported string (e.g. not `if (as.includes("style")) ...` or a
   check keyed to `"alternate-cdn.invalid"`).

## 4. Create your own whitespace/case preload variants

Do not just re-run the Writer's fixture file — author at least 3 of your
own, different from what's in `scripts/qa/test-external-style-font-policy.mjs`
and from the reviewer's own prior fixture file. Suggestions:

- Tab or newline characters (not just space) around `as` or `rel` values.
- `as` value with internal casing like `"StYlE"` with no surrounding
  whitespace at all (confirm case-only variation still works, independent
  of whitespace).
- A remote preload where `rel` has extra tokens, e.g.
  `rel="preload dns-prefetch"`, with whitespace/case variation.
- Unquoted attribute values with whitespace where HTML parsing would permit
  it (e.g. `as=&#32;style&#32;` is likely out of scope — a good candidate
  for a case the guard might legitimately not need to handle; use judgment
  on whether an unhandled edge case here is a real finding or over-scope).

For each, call `findExternalStyleFontViolations()` directly (or run
`node scripts/qa/test-external-style-font-policy.mjs` after temporarily
adding your fixture to a **local, uncommitted** copy — never edit the
committed product) and confirm remote cases are caught and allowed cases
stay clean.

## 5. Independent commands to re-run — do not trust this document's numbers

```bash
node scripts/qa/test-external-style-font-policy.mjs
# expect: 29/29 fixtures behaved correctly, exit 0

node scripts/qa/validate-site.mjs
# expect: 97/97 checks passed, exit 0

npx --yes html-validate index.html capabilities/index.html work/index.html \
  collaborate/index.html about/index.html contact/index.html privacy/index.html
# expect: 0 problems, exit 0

node scripts/qa/browser-qa.mjs http://127.0.0.1:9222 http://127.0.0.1:4173 <scratch-dir>
# expect: 119/119 checks passed, exit 0
```

If any of these produce different numbers than documented, that is a review
finding, not something to silently reconcile.

## 6. PASS / FAIL rubric

| Verdict | Criteria |
| --- | --- |
| **REVIEW PASS** | All commands in §5 match documented counts; independent code inspection (§3) confirms the fix is general, not special-cased; at least 3 independently-authored whitespace/case variants (§4) are all correctly classified; product-facing diff is zero (§2) |
| **REVIEW PASS WITH NOTES** | Above, plus minor documentation issues that don't affect the guard's correctness |
| **REVIEW FAIL** | Any command produces a different result than documented, any independently-authored variant bypasses the guard, or any product-facing file changed |

## 7. What you are not asked to do

- Do not push, open a PR, merge, or deploy — regardless of verdict.
- Do not resolve the open `OWNER_DECISION` items in `07_FINAL_HANDOFF.md`
  §12 — Jerry's decisions, not review blockers.
- Do not modify product code or the QA guard itself. If you find a real
  remaining gap, report exactly how — do not silently patch it and
  re-approve your own patch.
- Do not re-litigate F-001/F-002/F-003 or the general F-006 mechanism
  coverage — those were independently confirmed closed at the parent SHA;
  this cycle's scope is the single normalization bypass only.
