# JERRYBAY Personal Website

JERRYBAY v4 restores the original long-form personal portfolio on top of the current static production source.

## Current Gate

`V4-G5 — Owner-authorized Production Publish / LIVE`

The canonical product/content source is the Notion page `JERRYBAY — Original-First Personal Revenue Portfolio · Master SSOT v4.0`. Repository state, exact SHAs, executable checks, and rendered output are implementation truth.

Start with [`docs/jerrybay-v4/00_GOAL.md`](docs/jerrybay-v4/00_GOAL.md) and [`docs/jerrybay-v4/04_STATE.md`](docs/jerrybay-v4/04_STATE.md).

## Architecture

- Static HTML, CSS, and progressive JavaScript; no build step
- `/` is the canonical Korean-first long-form portfolio
- Public inquiry uses one button-triggered Tally modal; no standalone `/contact/` or `/privacy/` route is exposed
- `/references/` and six project-detail routes provide the Reference/Projects archive
- Local system fonts only; no remote stylesheet, font, or icon-font dependency
- Approved Tally intake uses the shared popup helper with public-safe source-page, CTA, and UTM attribution; no in-page form collection or analytics tracking

## Run locally

```bash
python -m http.server 4173
```

Open `http://127.0.0.1:4173/`.

## Verify

```bash
node scripts/qa/validate-site.mjs
node scripts/qa/test-external-style-font-policy.mjs
npx --yes html-validate index.html capabilities/index.html work/index.html collaborate/index.html about/index.html business/index.html insights/index.html insights/ai-pilot-to-operating-system/index.html insights/aikus-learning-to-work-execution/index.html insights/static-first-search-foundation/index.html references/index.html references/projects/aikus/index.html references/projects/omyqt/index.html references/projects/invit/index.html references/projects/casper-electric-ai-drawing/index.html references/projects/renault-sm6-ai-drawing/index.html references/projects/fashion-ai-generator/index.html
```

Browser QA uses Node 22 or later and an already-running Chromium browser with CDP enabled:

```bash
node scripts/qa/browser-qa.mjs http://127.0.0.1:9222 http://127.0.0.1:4173 docs/jerrybay-v4/evidence/screenshots
```

## Release boundary

Production, domain, analytics, payments, database, auth, and RLS changes require separate approval. The Owner authorized this branch's non-production GitHub publication and record work on 2026-08-08; no `main` merge or production release is implied.
