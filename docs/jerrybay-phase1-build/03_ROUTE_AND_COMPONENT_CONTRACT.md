# Route and Component Contract

## Routes — exactly 7, no more

| Route | File | Role |
| --- | --- | --- |
| `/` | `index.html` | Buyer problem → trust → capabilities → work → offer → method → CTA |
| `/capabilities/` | `capabilities/index.html` | Three commercial capabilities + demoted secondary pair |
| `/work/` | `work/index.html` | Three owner-owned assets with status and claim boundary |
| `/collaborate/` | `collaborate/index.html` | Offer hierarchy, boundaries, next step |
| `/about/` | `about/index.html` | Identity, focus, method, what is not claimed |
| `/contact/` | `contact/index.html` | Fit Call bridge, `mailto:` only |
| `/privacy/` | `privacy/index.html` | Legal placeholder + data inventory checklist |

Enforced by check `01b`: the repository contains **exactly seven** HTML files
outside `docs/`, and they are exactly these. A stray page fails the build.

## Supporting files

```
assets/css/site.css        design system, one stylesheet, no framework
assets/js/site.js          mobile menu only; progressive enhancement
assets/favicon.svg         carried from base commit
robots.txt                 User-agent: * / Disallow: /
vercel.json                cleanUrls + trailingSlash + X-Robots-Tag noindex
scripts/qa/validate-site.mjs   static contract validator (81 checks)
scripts/qa/browser-qa.mjs      CDP browser validator (111 checks)
```

No `site-content.json` data layer was introduced. With seven static pages and no
CMS in Phase 1 scope, a content file would add indirection without removing
duplication that matters. Copy lives in the markup it renders.

## Home section order — fixed

1. Preview banner
2. Hero — buyer, problem, outcome, primary CTA
3. Proof-safe trust strip — three operating principles, zero numbers, zero logos
4. Three commercial capabilities
5. Selected work — three cards
6. Offer hierarchy — Primary / Paid Entry / Expansion
7. Working method — five steps
8. Final CTA

## Shared components

Each page repeats the same static shell. There is no templating step, so the
shell is duplicated by design; the validator asserts consistency instead.

| Component | Markup | Contract |
| --- | --- | --- |
| Skip link | `a.skip-link[href="#main"]` | First focusable element; revealed on `:focus` |
| Preview banner | `.preview-banner[role="note"]` | Present on all 7 pages (check `12c`) |
| Header | `header.site-header` | Sticky, glass background, brand + nav |
| Nav | `nav#primary-nav.nav` | 6 links; `aria-current="page"` on self |
| Nav toggle | `button[data-nav-toggle]` | `aria-expanded` + `aria-controls`; ≤900px only |
| Main | `main#main` | Single `h1` per page |
| Footer | `footer.site-footer` | 6 links incl. `/privacy/`, preview meta line |

## Button hierarchy

Exactly one primary style exists in CSS. Check `04` parses the stylesheet and
fails if a second rule matching `.btn--*` contains a `linear-gradient`.

- `.btn--primary` — gradient fill, `font-weight: 700`, min-height 48px
- `.btn--secondary` — transparent, ghost outline, `font-weight: 500`

## Status chips

`.chip` renders a text label (`BUILT / PROTOTYPED`, `BUILT / DESIGNED`).
`.chip--flag` renders `OWNER REVIEW REQUIRED` / `OWNER DECISION`. Meaning is
always carried by the text, never by colour alone.

## Accessibility contract

| Requirement | Implementation | Verified by |
| --- | --- | --- |
| H1 48–64px desktop / 36–44px mobile | `clamp(2.25rem, 5.4vw, 4rem)` | `h1 *@*` (measured 64 / 36) |
| Body ≥16px | `body { font-size: 1rem }` | `11`, `bodyfont *@*` |
| No 11–12px secondary copy | Smallest rule is 0.875rem = 14px | `11` |
| Contrast AA | Text tokens computed against surfaces; see below | manual calculation |
| Skip link | Revealed on focus at `top: 12px` | `skiplink` |
| Landmarks + heading order | header/nav/main/footer, no level skips | `12` |
| Keyboard focus visible | `:focus-visible` 3px `--secondary` outline | `skiplink` + focus emulation |
| Mobile menu ESC/close/focus | `site.js` ESC handler returns focus to trigger | `menu *@mobile` |
| Touch targets ≥44px | `.btn` 48px, nav links 44/52px | `touch *@*` |
| `prefers-reduced-motion` | Transitions and smooth scroll disabled | manual |
| Alt text | No `<img>` in the build; rule still enforced | `12d` |
| No autoplay video | No media elements | by construction |
| External links marked | `.ext` adds `↗`; no external links currently in body copy | by construction |

### Measured contrast ratios

| Pair | Ratio | Use |
| --- | --- | --- |
| `#E4E1E9` on `#131318` | 15.9:1 | Body and headings |
| `#C7C4D7` on `#131318` | 11.0:1 | Secondary copy |
| `#A9A6BC` on `#131318` | 7.9:1 | Labels, smallest text (14px) |
| `#C0C1FF` on `#131318` | 10.9:1 | Links, secondary button |
| `#07006C` on `#8083FF` | 5.5:1 | Primary CTA label at gradient's darkest stop |

The `DESIGN.md` gradient (`#6366F1`) yields only 3.93:1 and was replaced. See
`01_COMMERCIAL_LOCK.md` § Deviations.

## Deliberately absent

Work filters, work detail routes, `/ideas-lab`, search, CMS, analytics, SEO
admin, forms, inputs, payment, newsletter. Checks `15a`/`15b`/`15c` fail the
build if any reappear.
