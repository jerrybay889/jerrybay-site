# Browser QA — Actually Executed

**BROWSER QA EXECUTED.** Real Chrome, real rendering, real measurements.
Raw output: `evidence/browser-qa-output.txt`. Screenshots: `evidence/screenshots/`.

## Environment

| Field | Value |
| --- | --- |
| Browser | Chrome 151.0.7922.76 (HeadlessChrome/151.0.0.0), already installed |
| Driver | `scripts/qa/browser-qa.mjs` over CDP, Node v24.13.0, no dependencies |
| Server | `python -m http.server 4173 --bind 127.0.0.1` from the repo root |
| Viewports | Desktop 1440×900, Mobile 390×844 (`Emulation.setDeviceMetricsOverride`, `mobile: true`) |
| Result | **111/111 PASS**, exit code 0 |

No browser binary was downloaded; the installed Chrome was reused.

## Coverage

| Priority | Route | Desktop | Mobile | Result |
| --- | --- | --- | --- | --- |
| P0 | `/` | ✅ | ✅ | PASS |
| P0 | `/contact/` | ✅ | ✅ | PASS |
| P1 | `/capabilities/` | ✅ | ✅ | PASS |
| P1 | `/work/` | ✅ | ✅ | PASS |
| P1 | `/collaborate/` | ✅ | ✅ | PASS |
| P2 | `/about/` | ✅ | ✅ | PASS |
| P2 | `/privacy/` | ✅ | ✅ | PASS |

## Measured results

**Horizontal overflow** — zero on all 14 route×viewport combinations.
`documentElement.scrollWidth` equals `window.innerWidth`: 1440/1440 desktop,
390/390 mobile.

**Console** — no errors and no failed network requests on any page. Google Fonts
requests are excluded from the assertion (deliberate external dependency; see
`04_QA_CONTRACT.md` § caveats).

**Typography** — computed `body` font-size 16px everywhere. H1 renders at 64px
desktop (contract 48–64) and 36px mobile (contract 36–44).

**Primary CTA** — every `.btn--primary` on every page has the exact text
`조직 AI 적용 상담 요청`, a height of 53px (≥44 required), and a target of
`/contact/` — or, on `/contact/` itself, the `mailto:` link with pre-filled
subject. `/privacy/` asserted to carry none, and carries none.

**Touch targets** — no interactive element (buttons, `.btn` links, nav links,
footer nav links) renders below 44px tall at either viewport.

**Mobile menu** — on all 7 routes: the toggle is inside the viewport; clicking
opens the panel with all 6 links and `aria-expanded="true"`; pressing Escape
closes it, sets `aria-expanded="false"`, `display: none`, and returns focus to
the trigger button. Verified programmatically, not by eye.

**Skip link** — receives focus and moves from `top: -100px` to `top: 12px`,
i.e. visibly on screen, with `href="#main"`.

## Screenshots

15 PNGs in `evidence/screenshots/`, captured via `Page.captureScreenshot` before
any interaction so each shows the page's default state:

```
home-desktop.png            home-mobile.png            home-mobile-menu-open.png
capabilities-desktop.png    capabilities-mobile.png
work-desktop.png            work-mobile.png
collaborate-desktop.png     collaborate-mobile.png
about-desktop.png           about-mobile.png
contact-desktop.png         contact-mobile.png
privacy-desktop.png         privacy-mobile.png
```

`home-mobile-menu-open.png` covers the required "mobile navigation open" page
state. Screenshots are viewport-height captures, not full-page.

## Corrections made during browser QA

An initial screenshot pass used `chrome --headless=new --window-size=390,844
--screenshot`. Output showed the nav toggle pushed off-screen and text clipped
at the right edge, which read as horizontal overflow. Re-measuring through CDP
device emulation showed `scrollWidth === innerWidth === 390` — the clipping was
a `--window-size` artifact, not a layout defect. The CDP-captured screenshots in
`evidence/screenshots/` replaced the misleading ones.

## Not verified

- Firefox, Safari, and any non-Chromium engine
- Real iOS or Android hardware and real touch input
- Screen readers (NVDA, JAWS, VoiceOver)
- Actual `prefers-reduced-motion` and forced-colors rendering (CSS is present,
  behaviour was not exercised under those media conditions)
- Lighthouse scores and Core Web Vitals
- Any hosted or deployed URL
