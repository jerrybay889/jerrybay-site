# Remediation Evidence — F-001 / F-002 / F-003 Closure

> **Writer verdict: WRITER REMEDIATION COMPLETE — FRESH RE-REVIEW READY**
> Writer self-verification only. This is not an independent Review PASS.
> An earlier writer self-verification was superseded by an independent
> Fresh-Context review that returned **FAIL** — see § Provenance. This
> document supersedes the "CONDITIONAL PASS — EXTERNAL DEPENDENCY"
> classification for Mobile Performance recorded in `08_P2_QA_EVIDENCE.md`;
> that classification was independently reproduced and rejected by the
> Fresh Reviewer (F-003), and is withdrawn — see § F-003.

## Provenance

| Field | Value |
| --- | --- |
| Failed Review SHA | `e4fe3b8cf353b1f210ee5b9916d6145b8ed2d72e` |
| Independent review evidence | `C:\Users\82103\jerrybay-review-evidence\e4fe3b8\` |
| Review verdict | **FAIL** (`REVIEW_REPORT.md`) |
| Manifest integrity | All 6 SHA-256 checksums in `EVIDENCE_MANIFEST.sha256` independently recomputed and matched before acting on any finding |
| Reproduced findings | F-001 Critical, F-002 Major, F-003 Critical, F-004 Minor, F-005 Minor |
| This branch | `build/jerrybay-phase1-commercial-v1` |
| Parent commit (this remediation) | `e4fe3b8cf353b1f210ee5b9916d6145b8ed2d72e` (not amended) |

Per the remediation work order, F-001/F-002/F-003 were treated as established
defects, not re-litigated. Before acting on any of them, their exact numbers
were independently reconfirmed from the review pack's raw JSON (not just its
prose) — see the commit message for the reproduction commands and output.

## F-001 — Critical — 44×44 interactive target

**Before:** `scripts/qa/browser-qa.mjs` audited only `a.btn, button, .nav a,
.site-footer nav a` and checked only `height < 44`. Real failures existed on
every route: nav `홈` was 41×44 (width fails), footer `Work`/`About` were
37×69/42×69 (width fails), and in-content links — `/capabilities/` (12
desktop + 12 mobile, including 19px-high inline links), `/work/` (6 desktop +
5 mobile, 18px-high), `/contact/` (5 desktop + 4 mobile, including the
18px-high direct email link and `범위 경계 보기`) — were not covered by any
selector at all.

**Root cause:** `assets/css/site.css` gave navigation a height floor but no
width floor, and gave in-content `<a>` elements (inside `<p>`, `<dd>`, `<li>`)
no target-size treatment whatsoever — they were unstyled default inline text.

**Fix** (`assets/css/site.css`):
- `.nav a` and `.site-footer nav a`: added `min-width: 44px` and
  `justify-content: center` alongside the existing `min-height: 44px`.
- New rule `main a:not(.btn)`: `display: inline-flex; align-items: center;
  justify-content: center; min-height: 44px; min-width: 44px; vertical-align:
  middle;` — scoped to `<main>` so it only reaches in-content links, never
  the nav/footer/brand/skip-link (which live outside `<main>` and are already
  governed by their own rules). No visible padding or background is added —
  short link text (e.g. "AIKUS") gains a taller, centered *invisible* hit
  area, not a visible pill/button shape. Verified visually — see
  § Screenshot Evidence.

**Test strengthened** (`scripts/qa/browser-qa.mjs`): the `touch` check now
queries every `a[href], button, [role='button']` (not a 4-selector allowlist)
and asserts both `width >= 44` and `height >= 44`. "Visible" is a genuine
viewport-intersection test (non-zero box, on-screen, not `display:none`/
`visibility:hidden`) rather than a hardcoded class exclusion — this is what
correctly excludes the skip-link's off-screen idle state (`top: -100px`)
without special-casing it by name, exactly as the work order required.

**After — independently re-measured**, not just re-run through the same
script: a standalone CDP script queried every `a[href]`'s
`getBoundingClientRect()` on `/`, `/capabilities/`, `/work/`, `/contact/` at
both viewports. Every previously-cited failure is now fixed:

| Element | Before | After |
| --- | --- | --- |
| Nav `홈` (desktop) | 41×44 | **44×44** |
| Footer `Work` | 37×69 | **44×94** (desktop) / **44×44** (mobile) |
| Footer `About` | 42×69 | **44×94** (desktop) / **44×44** (mobile) |
| Capabilities `AIKUS` (inline) | ~19px tall | **44×44** |
| Capabilities `Sprint` (inline) | ~19px tall | **44×44** |
| Work page inline links | ~18px tall | **44×44** |
| Contact `범위 경계 보기` | ~18px tall | **100×44** |
| Contact direct email link | ~18px tall | **162×44** |

Zero elements under 44px in either dimension across all 7 routes × 2
viewports in the strengthened `browser-qa.mjs` run — see § Test Counts.

## F-002 — Major — mobile menu background scroll lock

**Before:** `assets/js/site.js` toggled `data-open`/`aria-expanded` only.
Computed `body` overflow stayed `hidden auto` whether the menu was open or
closed — no state change occurred at all, so background scrolling was never
blocked.

**Root cause:** no body/document state was ever applied on open, so there was
nothing for CSS to lock against.

**Fix:**
- `assets/js/site.js`: `open()` adds `document.body.classList.add("nav-open")`,
  `close()` removes it. Both functions are the single funnel already used by
  every trigger (toggle click, Escape, nav-link click, and the
  desktop-breakpoint `matchMedia` listener) — hooking the class there means
  every existing close path inherits the fix for free, with no new branches.
- `assets/css/site.css`: `body.nav-open { overflow: hidden; }` plus
  `.nav[data-open="true"] { overscroll-behavior: contain; }` as a defensive
  guard against scroll-chaining from the panel's own content. Plain
  `overflow: hidden` was used (not `position: fixed`) specifically because
  the browser then preserves the underlying scroll offset natively — no
  manual `scrollTop` save/restore was needed to satisfy "close 후 원래 scroll
  position... 보존."

**Test added** (`scripts/qa/browser-qa.mjs`, `testScrollLock()`): for every
route at 390×844 — scroll to a non-zero position, open the menu, attempt a
**real** scroll via CDP `Input.dispatchMouseEvent(type: "mouseWheel")` (not a
page-script-dispatched `WheelEvent`, which never triggers the browser's
native scroll response since only trusted/OS-level input does — a
script-only test would have passed regardless of whether the CSS fix
worked), confirm position is unchanged, close via Escape, confirm the
original scroll position is preserved and focus returns to the toggle,
then confirm a real wheel scroll works again post-close. A separate test
confirms resizing past the desktop breakpoint while open also releases the
lock.

One test-script bug was found and fixed during this cycle, not a product
defect: the initial `window.scrollTo(0, 200)` calls were being animated by
the site's own `html { scroll-behavior: smooth }`, so reads immediately
after landed mid-animation and produced unstable baselines (`beforeOpen`
values of 50, 14, 3 instead of a stable 200). Fixed by passing
`{ top: 200, left: 0, behavior: "instant" }`, which overrides the page's CSS
smooth-scroll for that call per spec. After the fix, every route reports a
stable, reproducible `beforeOpen: 200`.

**After:** 7/7 routes PASS — `lockedOnOpen`, `scrollBlocked`,
`lockReleased`, `positionPreserved`, `focusReturned`, and
`scrollWorksAfterClose` all true on every route, plus the desktop-resize
release test. Full raw detail in `evidence/browser-qa-output.txt`.

## F-003 — Critical — Home mobile Lighthouse Performance

**The Writer's prior "CONDITIONAL PASS — EXTERNAL DEPENDENCY" classification
(`08_P2_QA_EVIDENCE.md`) is withdrawn.** The Fresh Reviewer independently
reproduced 61 and 60 under `--throttling-method=devtools` and identified the
three-family Google Fonts strategy as locally actionable, not a required
external dependency. That finding is correct and is treated as established.

**Before (independently reproduced from the review pack's own JSON, not just
its prose):**

| Metric | Value |
| --- | --- |
| Home Desktop | Performance 97 |
| Home Mobile, simulated | Performance 94 |
| Home Mobile, DevTools run 1 | **Performance 61** |
| Home Mobile, DevTools run 2 | **Performance 60** |
| Network requests | 23 total, 18-19 font requests |
| Font bytes | 361,645-432,549 |
| Style & Layout | ~3,318 ms |
| Long tasks | up to ~1.37 s |

**Root cause:** all 7 pages loaded three Google Fonts families (Inter, Noto
Sans KR, Space Grotesk) across multiple weights from `fonts.googleapis.com` /
`fonts.gstatic.com`. Even with the async `media=print` loading pattern from
the prior remediation cycle, the ~19 separately-arriving font subset files
each triggered their own `font-display: swap` layout pass, and the live
external CDN round-trips dominated FCP/LCP under real network throttling.

**Fix — the primary remediation target, exactly as specified:** removed
every Google Fonts `<link>` (preconnect ×2, preload, stylesheet, noscript —
4-5 tags × 7 pages) and replaced `--font-head`/`--font-body` in
`assets/css/site.css` with the system-font stack specified in the work
order: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Apple SD
Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif`. Editorial
hierarchy between heading and body is preserved through the existing
weight/letter-spacing/size rules (h1-h4 already use `font-weight: 700`,
`letter-spacing: -0.025em`, and a `clamp()` size scale) rather than a
second display typeface, per the work order's explicit priority: "Design
System의 typography 브랜드보다 현재 Critical Performance Gate가 우선한다."

A full repo grep confirmed no Material Symbols/icon-font or other remote
font dependency existed anywhere else — this was the only external font
footprint.

**Test added** (`scripts/qa/validate-site.mjs`, check `16`): asserts zero
occurrences of `fonts.googleapis.com`, `fonts.gstatic.com`, remote `@import`
font rules, Material Symbols/Icons, or other external font CDNs across all 7
HTML files and `site.css`. This guards the fix against regression on any
future edit.

**After — network footprint, independently measured from the DevTools run 1
report:**

| Metric | Before | After |
| --- | --- | --- |
| Total requests | 23 | **4** |
| Font requests | 18-19 | **0** |
| Total transfer bytes | ~432,549 (fonts alone) | **30,080** (entire page) |
| External origins | 2 (fonts.googleapis.com, fonts.gstatic.com) | **0** |

### Lighthouse hard gate — after

| Run | Performance | Accessibility | Best Practices | FCP | LCP | TBT | CLS |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Home Desktop | **100** | 100 | 100 | — | — | — | — |
| Home Mobile, simulated (reference) | **100** | 100 | 100 | — | — | — | — |
| **Home Mobile, DevTools run 1** | **91** | 100 | 100 | 2.7s | 2.7s | 130ms | 0 |
| **Home Mobile, DevTools run 2** | **94** | 100 | 100 | 2.4s | 2.4s | 110ms | 0 |
| **Home Mobile, DevTools run 3** | **94** | 100 | 100 | 2.4s | 2.4s | 120ms | 0 |

**All three cold, independent DevTools-throttled runs clear the ≥75
threshold** — no averaging, no hiding a failing run, all three shown as run.
Home Desktop Performance ≥85: **100** (target 85). Accessibility ≥95: **100**
on Home and all 6 other routes (target 95). Best Practices ≥90: **100** on
Home and all 6 other routes (target 90).

| Route (mobile, simulated) | Performance | Accessibility | Best Practices |
| --- | --- | --- | --- |
| Capabilities | 100 | 100 | 100 |
| Work | 100 | 100 | 100 |
| Collaborate | 100 | 100 | 100 |
| About | 100 | 100 | 100 |
| Contact | 100 | 100 | 100 |
| Privacy | 100 | 100 | 100 |

Raw JSON/HTML for every run: `evidence/remediation/lighthouse-*`.

## F-004 — Minor — Writer evidence whitespace

**Scope, exactly as specified:** `docs/jerrybay-phase1-build/evidence/p2/lighthouse-home-mobile.report.html`,
lines 495 and 2848 only. Trailing whitespace removed via a surgical
line-targeted `sed` edit (`495s/[ \t]*$//; 2848s/[ \t]*$//`), not a blanket
strip and not a regeneration. No substantive report content changed —
verified by `git diff --stat` showing exactly 2 lines changed in that file.
`git diff --check HEAD` on this file is clean (exit 0) after the edit.

## F-005 — Minor — QA command/path mismatch

The mismatch was in the *external reviewer's own supplied instruction
template* (`node tools/validate-site.mjs` / `node tools/browser-qa.mjs`,
paths that don't exist), not in any document this Writer authored — both
`09_FRESH_CODEX_REVIEW_REQUEST.md` and `07_FINAL_HANDOFF.md` already used
the correct `scripts/qa/validate-site.mjs` / `scripts/qa/browser-qa.mjs`
paths before this remediation cycle began. Per the review pack's own
guidance ("Correct the next handoff/runbook packet rather than adding
duplicate scripts"), no duplicate `tools/` scripts were created; the new
`11_FRESH_REVIEW_REQUEST_AFTER_REMEDIATION.md` continues to use only the
real, working `scripts/qa/` paths throughout.

## Test Counts

| Suite | Before this cycle | After this cycle |
| --- | --- | --- |
| `validate-site.mjs` | 81 | **89** (+8: check 16, one per route + site.css) |
| `browser-qa.mjs` | 111 | **119** (+8: 7× `scrolllock` per route, +1 resize-to-desktop; `touch` check strengthened in place — same count, now comprehensive selector + width) |
| `html-validate` | 0 problems | 0 problems (unchanged, re-confirmed) |

No existing check was deleted, skipped, or weakened. `touch` in
`browser-qa.mjs` keeps its check ID but now audits every visible
`a[href]/button/[role=button]` for both width and height, rather than a
4-selector, height-only subset.

## HTML Validation

`html-validate` 11.6.2, all 7 pages: **0 problems, exit 0** (re-confirmed
after the F-001/F-002/F-003 fixes; unchanged from the prior cycle's closure).

## Static / Browser / HTML Results Summary

| Validator | Result |
| --- | --- |
| `node scripts/qa/validate-site.mjs` | **89/89 PASS**, exit 0 |
| `node scripts/qa/browser-qa.mjs` | **119/119 PASS**, exit 0 |
| `npx html-validate` (7 pages) | **0 problems**, exit 0 |

## Screenshot Evidence

All 15 screenshots regenerated (HTML/CSS/JS changed). Manually reviewed:
`home-desktop.png`, `home-mobile.png`, `home-mobile-menu-open.png`,
`collaborate-mobile.png`, `contact-mobile.png`, `capabilities-mobile.png`,
plus one purpose-built scrolled capture,
`evidence/remediation/capabilities-inline-links.png`, targeting the
highest-risk area for F-001 (the "Related Work" and "Offer Connection"
inline links inside a running sentence).

Confirmed by inspection:
- CTA hierarchy unchanged — single gradient primary button style, ghost
  outline secondary, identical to before.
- No line-wrap breakage or visual corruption from the system-font swap —
  headings render bold and large via `Segoe UI`/`system-ui` on this test
  machine; body copy unaffected.
- The 44×44 in-content link fix does **not** create visible button/pill
  shapes or excessive whitespace — inline links like "AIKUS" and "Sprint"
  read naturally within their sentences with only a taller invisible hit
  area, exactly as the work order required ("본문 리듬이 깨지지 않도록").
- Mobile menu open state shows evenly-sized, centered nav links (previously
  narrower) with no layout regression.
- Preview banner and status chips render identically on every page checked.

## Regression — full checklist (work order §8)

| Check | Result |
| --- | --- |
| Static Site Validation | 89/89 PASS |
| Browser QA | 119/119 PASS |
| HTML Validation | 0 problems |
| Lighthouse Desktop Home | 100/100/100 |
| Lighthouse Mobile DevTools Home ×3 | 91/94/94, all ≥75 |
| Lighthouse Accessibility/Best Practices, all 7 routes | 100/100 everywhere |
| Named clients | 0 |
| Unsupported result claims | 0 |
| `PROVEN` without Evidence | 0 (one explanatory sentence stating PROVEN is unused, per existing check `10b`) |
| Form/action/fetch/XHR/storage/analytics | 0 (grepped directly, see commit message) |
| Seven routes exactly | confirmed |
| `code.html` / `/ideas-lab/` absent | confirmed |
| Commercial Lock strings (CTA pair, 4-8주, price anchors) | present, unchanged |
| Privacy boundary (`noindex,nofollow`, `robots.txt`, placeholder, no endpoint) | unchanged |
| Mobile: 44×44 targets, menu scroll lock, ESC, focus return, overflow 0, console errors 0 | all PASS |

## Remaining Limitations

- Chrome only. Firefox, Safari, and real-device testing were not performed.
- No deployment; `vercel.json`'s `X-Robots-Tag` header remains unverified
  against a real hosted response.
- All 7 owner decisions and blockers listed in `07_FINAL_HANDOFF.md` §12–13
  remain open; none were in scope for this remediation cycle.
- The independent Fresh Reviewer's own Lighthouse artifacts
  (`jerrybay-review-evidence/e4fe3b8/lighthouse/`) were read and their
  numbers reconfirmed from raw JSON, but that evidence pack itself was not
  modified, re-run, or regenerated by this Writer — only this repository's
  code and this repository's own evidence were changed.

## Writer Verdict

**WRITER REMEDIATION COMPLETE — FRESH RE-REVIEW READY.** All three
Fresh-Reviewer-reproduced defects (F-001, F-002, F-003) are fixed and
independently re-verified beyond simply re-running the same scripts:
F-001 via a standalone CDP measurement script against the exact elements
the reviewer named; F-002 via real (CDP-trusted-input) wheel-scroll testing,
not a script-dispatched event that would pass regardless of the fix; F-003
via three cold, independent Lighthouse runs plus a direct before/after
network-request comparison. Both minor findings (F-004, F-005) are closed
within their specified scope. This is Writer self-verification; final
release authorization remains with an independent Fresh-Context reviewer —
see `11_FRESH_REVIEW_REQUEST_AFTER_REMEDIATION.md`.
