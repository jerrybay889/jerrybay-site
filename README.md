# JERRYBAY Personal Website

JERRYBAY v4 restores the original long-form personal portfolio on top of the current static production source.

## Current Gate

`V4-G1 — Original Baseline Reconstruction`

The canonical product/content source is the Notion page `JERRYBAY — Original-First Personal Revenue Portfolio · Master SSOT v4.0`. Repository state, exact SHAs, executable checks, and rendered output are implementation truth.

Start with [`docs/jerrybay-v4/00_GOAL.md`](docs/jerrybay-v4/00_GOAL.md) and [`docs/jerrybay-v4/04_STATE.md`](docs/jerrybay-v4/04_STATE.md).

## Architecture

- Static HTML, CSS, and progressive JavaScript; no build step
- `/` is the canonical Korean-first long-form portfolio
- Six supporting routes plus `/privacy/` are preserved during V4-G1
- Local system fonts only; no remote stylesheet, font, or icon-font dependency
- Approved Tally intake remains an outbound link; no in-page collection or tracking

## Run locally

```bash
python -m http.server 4173
```

Open `http://127.0.0.1:4173/`.

## Verify

```bash
node scripts/qa/validate-site.mjs
node scripts/qa/test-external-style-font-policy.mjs
npx --yes html-validate index.html capabilities/index.html work/index.html collaborate/index.html about/index.html contact/index.html privacy/index.html
```

Browser QA uses Node 22 or later and an already-running Chromium browser with CDP enabled:

```bash
node scripts/qa/browser-qa.mjs http://127.0.0.1:9222 http://127.0.0.1:4173 docs/jerrybay-v4/evidence/screenshots
```

## Release boundary

V4-G1 is local-only. Push, PR, deploy, production, domain, analytics, payments, database, auth, and RLS changes require separate approval.
