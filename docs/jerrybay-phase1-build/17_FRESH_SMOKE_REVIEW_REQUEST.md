# Fresh Smoke Review Request

**Mode:** One Writer → Changed-Surface Smoke QA → Fresh Smoke Review → Owner Deploy

This is a **changed-surface** review request, not a full re-audit. The prior
Private Build + QA Integrity PASS (`cbf6dd8185a718876ec638237baa6ab49a16d2d8`)
is not reopened. Please scope the review to the three items below and the
files listed in `16_FAST_TRACK_INTEGRATION_EVIDENCE.md`.

## What changed

1. Every Primary CTA (`조직 AI 적용 상담 요청`) across all 7 routes now links
   to the canonical Tally URL `https://tally.so/r/Y5bypd`
   (`target="_blank" rel="noopener noreferrer"`), replacing the prior
   `/contact/` (or, on Contact itself, `mailto:`) targets.
2. `/contact/`'s two Primary CTAs now open the same Tally URL. Two adjacent
   copy lines that described the old mailto behavior and the "tool decision
   pending" state were corrected to match (see evidence doc §1 for the exact
   before/after). The `/privacy/` footer link is unchanged.
3. `/privacy/` was replaced end-to-end with the approved G3C Privacy/Data
   canonical copy (previously a "미확정" legal placeholder page).

Two QA scripts (`scripts/qa/validate-site.mjs` check 13,
`scripts/qa/browser-qa.mjs` CTA assertion) were updated to assert the new,
intentional behavior instead of the old placeholder/mailto behavior — this is
a test-contract update tracking a deliberate content change, not a loosened
guard. Diff is in evidence doc §"Why the two QA scripts changed."

## What did NOT change

Prices (₩1,500,000 / ₩5,000,000부터), offer names (Primary Program / Paid
Diagnostic / Founding Sprint), all other copy, layout, design tokens, routes
(still exactly 7), Ideas Lab (still absent), analytics/tracking (still
absent), in-page form/fetch/XHR collection (still absent), and the Tally form
(still linked out, never embedded). The registered business address is not
exposed anywhere on the site (unchanged by this build) — no street address of
any kind (registered or Public Office) appeared on the site before this
build, and none was added by it.

## Deterministic QA results (reference: `16_FAST_TRACK_INTEGRATION_EVIDENCE.md`)

| Check | Result |
| --- | --- |
| `node scripts/qa/validate-site.mjs` | **97/97 PASS**, exit 0 |
| `node scripts/qa/browser-qa.mjs` (Chrome/CDP, 7 routes × 2 viewports) | **119/119 PASS**, exit 0 |
| `npx html-validate` (7 pages) | **0 problems**, exit 0 |
| Registered-address leak scan | 0 matches |
| In-page form/action/fetch/XHR collection scan | 0 matches |
| Analytics/tracking scan | 0 matches |
| Tally embedded-in-page scan | 0 matches (outbound link only) |
| Route count | 7/7 unchanged |

## Explicitly out of scope for this review (do not open)

- Lighthouse 3-run performance audit
- F-001 (touch targets), F-002 (scroll lock), F-003 (external fonts), F-006
  (external stylesheet/font mechanism guard) full re-audits — these guards
  (`validate-site.mjs` checks 11b/16/17, `browser-qa.mjs` touch/scrolllock
  assertions) all re-ran clean above with no code path touched by this build;
  reopen only if a regression is actually observed, per the Fast-Track
  instruction.
- Design, copy, pricing, or route review outside `/contact/` and `/privacy/`

## Tally live-form verification performed by the Writer (boundary-compliant)

Per the Fast-Track's Tally Smoke Test Boundary, the Writer does not have
Tally admin access and cannot delete a live submission, so the following was
verified without a real submission:

- `https://tally.so/r/Y5bypd` returns HTTP 200 (canonical URL is live).
- The rendered page title is "JERRYBAY 상담 요청" — the form exists and
  renders for this canonical URL (not a 404/deleted-form page).
- Every on-site Primary CTA's `href` attribute was verified by both the
  static validator and the live-Chrome browser QA to equal
  `https://tally.so/r/Y5bypd` exactly, across all 12 CTA instances on all 7
  routes and both viewports — i.e., clicking any Primary CTA navigates to
  this exact, confirmed-live URL.

**Outstanding (Owner-only, per Tally Smoke Test Boundary):** a real
required-only test submission through the live Tally form, followed by
delete / Trash-empty inside the Tally admin UI, with evidence captured by the
Owner. This was not attempted by the Writer and should not block this
review — it is explicitly Owner-scope per the Fast-Track brief.

## Reviewer checklist

- [ ] Confirm `git diff cbf6dd8185a718876ec638237baa6ab49a16d2d8..<new SHA>`
      touches only the 9 files listed in the evidence doc.
- [ ] Spot-check 2–3 CTA hrefs directly in the diff.
- [ ] Read `/privacy/index.html` diff for the 10 mandated disclosures.
- [ ] Confirm no registered business address string appears anywhere in the
      diff.
- [ ] Re-run the two QA scripts if desired (both are deterministic,
      dependency-free, and take under a minute combined).
