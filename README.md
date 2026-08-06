# JerryBay Personal Website

> **배제협 · JerryBay** — IT전략 · AI교육 · 정부지원 컨설턴트

📁 **Repo:** [github.com/jerrybay889/jerrybay-site](https://github.com/jerrybay889/jerrybay-site)

---

## ⚠️ This branch is a PRIVATE PREVIEW

`build/jerrybay-phase1-commercial-v1` replaces the single-page site with the
**Phase 1 Commercial private build**: 7 static routes, `noindex,nofollow` on every
page, and `robots.txt` disallowing everything. It has not been pushed, deployed,
or reviewed, and it must not be published as-is.

The live single-page site at [www.jerrybay.kr](https://www.jerrybay.kr) is served
from `main` and is untouched by this branch.

Start with [docs/jerrybay-phase1-build/00_START_HERE.md](docs/jerrybay-phase1-build/00_START_HERE.md).

### Run locally

```bash
python -m http.server 4173      # from the repo root — root-absolute paths need this
# http://127.0.0.1:4173/
```

### Verify

```bash
node scripts/qa/validate-site.mjs        # 81 static contract checks

# browser QA needs a headless Chrome with CDP enabled:
chrome --headless=new --remote-debugging-port=9222 --user-data-dir=<tmp> about:blank
node scripts/qa/browser-qa.mjs http://127.0.0.1:9222 http://127.0.0.1:4173 \
  docs/jerrybay-phase1-build/evidence/screenshots
```

Both must exit 0. Last run on this branch: **81/81** static, **111/111** browser.

---

## Tech Stack

- **Static HTML** — Single-page, zero build step required
- **Tailwind CSS** (CDN) — Utility-first styling
- **Google Fonts** — Space Grotesk, Inter, Noto Sans KR
- **Material Symbols** — Icon system
- **Vercel** — Hosting & deployment

## Design System

"The Kinetic Archive" — Deep Space theme. See [DESIGN.md](./DESIGN.md) for full specifications.

Key palette: `#131318` (Surface) · `#C0C1FF` (Primary) · `#4CD7F6` (Secondary) · `#6366F1→#06B6D4` (Gradient)

## Project Structure

```
jerrybay-site/
├── index.html       ← Main site (single page)
├── assets/
│   └── favicon.svg  ← SVG favicon (JB gradient)
├── DESIGN.md        ← Design system documentation
├── README.md        ← This file
└── .gitignore
```

## Deployment

This site auto-deploys to Vercel on every push to `main`.

- **Framework:** Static HTML (no build command)
- **Root Directory:** `/`
- **Branch:** `main` → production

## Contact

- 📧 [jerrybay889@gmail.com](mailto:jerrybay889@gmail.com)
- 📱 카카오톡: jerrybay
- 🌐 [www.jerrybay.kr](https://www.jerrybay.kr)
