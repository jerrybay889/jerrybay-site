# QA Contract

Two deterministic validators. Both were executed on this branch; output is
recorded, not asserted.

| Validator | Command | Checks | Result |
| --- | --- | --- | --- |
| Static contract | `node scripts/qa/validate-site.mjs` | 81 | **81/81 PASS**, exit 0 |
| Browser (Chrome/CDP) | `node scripts/qa/browser-qa.mjs <cdp> <base> <out>` | 111 | **111/111 PASS**, exit 0 |

Neither validator has dependencies. `validate-site.mjs` reads files;
`browser-qa.mjs` drives an already-running headless Chrome over the DevTools
Protocol using Node's built-in `WebSocket` (Node ≥22).

## The 15 required checks

| # | Requirement | Check ID | Where |
| --- | --- | --- | --- |
| 1 | Exactly 7 route entry HTML files | `01a`, `01b` | static |
| 2 | Every page has title, description, viewport, noindex/nofollow | `02:*` | static |
| 3 | Primary CTA text is exactly `조직 AI 적용 상담 요청` | `03:*`, `cta *@*` | static + browser |
| 4 | No competing primary CTA | `04` | static (CSS parse) |
| 5 | Internal links resolve | `05:*` | static |
| 6 | Asset paths resolve | `05:*`, `console *@*` | static + browser |
| 7 | No `href="#"` | `05:*` | static |
| 8 | No invented privacy dates / retention / officer email | `08:*` | static |
| 9 | No prohibited fake claim patterns | `09:*` | static |
| 10 | Every Work card has status and claim boundary | `10`, `10b` | static |
| 11 | Body font-size floor | `11`, `11b:*`, `bodyfont *@*` | static + browser |
| 12 | Heading order and landmarks | `12:*`, `12b:*`, `12c:*`, `12d:*` | static |
| 13 | Privacy placeholder exists | `13` | static |
| 14 | `robots.txt` disallows all | `14` | static |
| 15 | Ideas Lab absent from Phase 1 | `15a`, `15b`, `15c` | static |

## Beyond the required list

The browser validator additionally asserts, per route × viewport:

- horizontal overflow is zero, naming the widest offending element on failure
- console errors and failed network requests are absent
- H1 renders inside 48–64px desktop / 36–44px mobile
- primary CTA height ≥44px and target is `/contact/` or `mailto:`
- every interactive target is ≥44px tall
- the mobile menu button is inside the viewport
- menu opens, ESC closes it, and focus returns to the trigger
- the skip link becomes visible when focused

## Claim scanning

`09:*` scans rendered text (scripts, styles, comments and tags stripped) for
prohibited patterns: headcount, organisation counts, session counts, completion,
verification, pilot success, revenue, percentage improvement, and testimonials.

Approved Commercial Lock values are exempted before scanning via a narrow
allowlist: `₩[\d,]+`, `\d+–\d+ (주|분)`, `Books 01`, `1999년`. The exemption is
literal and does not accept arbitrary numbers.

The scanner is **polarity-blind by design** — it flags a prohibited phrase whether
asserted or denied. Boundary copy is therefore phrased without restating the
banned wording ("결과가 입증됐다는 주장을 하지 않습니다" rather than "성과 검증을
주장하지 않습니다"). This keeps the scanner simple and impossible to defeat with a
negation.

## Defects the validators caught during this build

All were found and fixed before commit. Recorded because they demonstrate the
checks are load-bearing, not decorative.

| Check | Defect | Fix |
| --- | --- | --- |
| `11` | `.card dt` and `.offer__rank` set 13px, below the 14px floor | raised to 0.875rem |
| `12:/` | Home jumped `h1 → h3`; trust strip label was a `<p>` | promoted to `<h2 class="section__label">` |
| `09:/`, `09:/work/` | Boundary copy restated `성과 검증` | rephrased |
| `08:/privacy/` | Copy contained `운영팀`, a quarantined entity name | changed to `운영 조직` |

## Known harness caveats

1. **`--window-size` is not a viewport.** An initial screenshot pass using
   `chrome --headless=new --window-size=390,844 --screenshot` produced clipped
   pages that looked like horizontal overflow. It was a harness artifact:
   `--window-size` does not set the layout viewport. `browser-qa.mjs` uses
   `Emulation.setDeviceMetricsOverride`, which measures 390/390 with no overflow.
   Do not reintroduce the `--window-size` approach.
2. **Headless windows are never active**, so `:focus` and `:focus-visible` do not
   match and focus assertions fail for harness reasons. `browser-qa.mjs` calls
   `Emulation.setFocusEmulationEnabled` to make focus checks meaningful.
3. **Google Fonts errors are filtered** from the console assertion. The font link
   is a deliberate external dependency; an offline run is not a page defect. All
   other console errors and failed requests fail the check.

## Not run

- Lighthouse (P2, deprioritised in favour of evidence and handoff)
- W3C HTML validator (P2, requires network upload of page content)
- Real-device testing on iOS or Android
- Screen reader verification (NVDA/VoiceOver)
- Cross-browser: Firefox and Safari were **not** tested. Chrome only.
