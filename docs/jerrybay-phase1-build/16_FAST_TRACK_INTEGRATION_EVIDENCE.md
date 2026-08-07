# Fast-Track Integration Evidence

**Scope:** Connect the canonical Tally intake URL to the live site and replace
the Privacy placeholder with the approved G3C Privacy/Data copy. No other
design, copy, price, route, or feature was touched.

## Lineage

| Field | Value |
| --- | --- |
| Parent SHA (Base PASS) | `cbf6dd8185a718876ec638237baa6ab49a16d2d8` |
| Branch | `build/jerrybay-phase1-commercial-v1` |
| Worktree | `C:/Users/82103/jerrybay-site-worktrees/phase1-commercial-v1` |
| Preflight | HEAD matched Base PASS SHA exactly, worktree clean, no foreign changes |
| New commit | recorded below after commit (see `git log -1`) |

## Changed files (exact)

```
 about/index.html             |  2 +-
 capabilities/index.html      |  8 ++---
 collaborate/index.html       |  4 +--
 contact/index.html           |  8 ++---
 index.html                   |  4 +--
 privacy/index.html           | 71 +++++++++++++++++++++++++-------------------
 scripts/qa/browser-qa.mjs    |  3 +-
 scripts/qa/validate-site.mjs | 17 +++++++----
 work/index.html              |  2 +-
 9 files changed, 69 insertions(+), 50 deletions(-)
```

No other file was created, deleted, or modified. Route count is unchanged
(7 routes: `/`, `/capabilities/`, `/work/`, `/collaborate/`, `/about/`,
`/contact/`, `/privacy/`).

### Why the two QA scripts changed

`scripts/qa/validate-site.mjs` check 13 previously required the literal
placeholder sentence ("운영 주체·외부 Form·...가 확정되기 전에는 본 페이지를
공개용 개인정보처리방침으로 사용할 수 없습니다. OWNER/EXPERT REVIEW
REQUIRED."). That sentence is factually obsolete once the approved Privacy
copy replaces the placeholder — the check now asserts the presence of the six
mandated disclosures instead (개인정보처리자, 필수 수집 항목, 보유기간,
Tally, Belgium, 권리행사 연락처).

`scripts/qa/browser-qa.mjs`'s CTA assertion previously required
`href === "/contact/" || href.startsWith("mailto:")`. Since every Primary CTA
now points to the canonical Tally URL by design, the assertion was updated to
require `href === "https://tally.so/r/Y5bypd"` exactly.

Both edits are contract updates that track the intentional behavior change;
no unrelated check was loosened or removed.

## 1. CTA integration result

Every `.btn--primary` element carrying the exact text `조직 AI 적용 상담 요청`
now points to the canonical Tally URL with `target="_blank"
rel="noopener noreferrer"` (external-link security attributes, since the site
had no pre-existing external-link convention to match — this is the standard
safe default).

**Exact href count check** (`grep -c 'href="https://tally.so/r/Y5bypd"'`):

| File | Count |
| --- | --- |
| `index.html` | 2 (Hero, Final CTA) |
| `capabilities/index.html` | 4 |
| `work/index.html` | 1 |
| `collaborate/index.html` | 2 |
| `about/index.html` | 1 |
| `contact/index.html` | 2 |
| **Total** | **12** |

A scan for any remaining `.btn--primary` link NOT pointing at the canonical
URL returned zero matches across all 7 pages.

`/contact/`'s two Primary CTAs (hero + final) previously opened a `mailto:`
link; both now open the canonical Tally URL. The `/contact/` page's caption
text ("메일 앱이 열립니다…") and the connectivity notice block, which
literally stated "OWNER DECISION 외부 문의 접수 도구 선택 대기" (external
intake tool decision still pending), were updated in the same edit because
they directly described the pre-Tally CTA behavior this change replaces —
leaving them would have put stale, contradictory copy next to the new button.
No other Contact copy, layout, or structure changed. The mailto fallback line
("메일 앱을 사용할 수 없다면 jerrybay889@gmail.com…") was left in place as a
still-valid alternate contact path.

The `/privacy/` footer-nav link is unchanged and present on all 7 pages,
satisfying "keep the `/privacy/` link."

## 2. Privacy integration result

`/privacy/` was rewritten from a legal placeholder ("미확정" / Data Inventory
Checklist with all rows "NOT VERIFIED"/"OWNER DECISION") to the approved G3C
canonical content:

| Required disclosure | Present |
| --- | --- |
| 개인정보처리자: ㈜글로보더 | ✅ |
| 목적: 상담·협업 문의 접수, 연락·회신, Fit Call 및 제안 준비 | ✅ |
| 필수 항목: 이름, 전화번호 | ✅ |
| 선택 항목: 회사/기관명, 직책/역할, 업무 이메일, 문의 유형, 해결하고 싶은 문제, 희망 시작 시기, 예상 예산 범위, 추가 설명/요청사항 | ✅ |
| 미계약 문의 보유기간: 접수일로부터 90일 | ✅ |
| 외부 Form Processor: Tally BV, Belgium | ✅ |
| 국외 처리/보관 사실 명시 | ✅ |
| 권리행사 Contact: jerrybay889@gmail.com | ✅ |
| 민감정보·파일 첨부·Tracking 비수집 명시 | ✅ |
| 시행일: no fabricated placeholder date — "공개 승인 시 확정" | ✅ |

The copy is deliberately short (7 short sections, no statute citations, no
invented dates/officer names) per the "과도한 법률 설명·장문 조문 인용 금지"
instruction. The `PRIVATE PREVIEW` banner and `noindex,nofollow` meta were
left untouched — this build stays pre-deploy; the Owner Deploy step is
separate and out of scope here. Page title/description were updated from
"법률 Placeholder" wording to reflect the page is no longer a placeholder.

**Registered business address:** not present anywhere in the new Privacy
copy or on any other changed page (confirmed by leak scan below). Only the
entity name (㈜글로보더) and the approved contact email were used.

## 3. Static QA — `node scripts/qa/validate-site.mjs`

**97/97 checks passed**, exit code 0. Full output captured; check 13 (now
re-scoped to the new Privacy disclosures) and all CTA checks (03:*) pass.

## 4. Browser QA — `node scripts/qa/browser-qa.mjs`

Real Chrome (151.0.7922.76, headless, CDP), Node v24.13.0, static server via
`python -m http.server 4173 --bind 127.0.0.1`, same invocation pattern as the
Base PASS build.

**119/119 checks passed**, exit code 0, across all 7 routes × 2 viewports
(desktop 1440×900, mobile 390×844). Every `cta *` assertion confirms
`href:"https://tally.so/r/Y5bypd"` on all non-Privacy routes. No console
errors, no failed network requests, no horizontal overflow, mobile menu /
scroll-lock / skip-link behavior unchanged from the Base PASS build.

## 5. HTML validation

`npx --yes html-validate index.html capabilities/index.html work/index.html
collaborate/index.html about/index.html contact/index.html privacy/index.html`

**0 problems**, exit code 0.

## 6. Leak / data-collection / tracking checks

| Check | Command class | Result |
| --- | --- | --- |
| Registered business address leak | grep for street address / building name across all 7 pages | **0 matches** |
| In-page form/action/fetch/XHR collection | grep for `<form`, `XMLHttpRequest`, `fetch(` across all 7 pages + `site.js` | **0 matches** |
| Analytics/tracking | grep for gtag/GA/GTM/Hotjar/Clarity/Segment/Mixpanel/Amplitude/FB pixel across all 7 pages + `site.js` | **0 matches** |
| Tally embedded in-page (iframe) | grep for `<iframe` and any `tally` reference inside `site.js` | **0 matches** — Tally is reached only via outbound `href`, never embedded |
| Route count | 7 route directories/files present, none added/removed | **7/7**, unchanged |

## 7. Product scope unchanged statement

No price, offer name, route, design, or feature changed. `validate-site.mjs`
checks 09 (unverified claim patterns), 10 (Work card status/claim
boundaries), and 15a/15b (no Phase 1.5+ routes, no Ideas Lab links) all still
pass unmodified, confirming the commercial surface (₩1,500,000,
₩5,000,000부터, Primary Program / Paid Diagnostic / Founding Sprint naming,
4–8주 duration) is byte-identical to the Base PASS build outside the two
in-scope pages.

## 8. No push / PR / merge / deploy

This evidence covers local, uncommitted-at-time-of-writing verification only.
No `git push`, no PR, no merge, no deploy was performed or requested.
