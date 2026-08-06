# JERRYBAY v2 Build Harness

## Purpose

This repository is the implementation home for the JERRYBAY v2 renewal. The
site is built from an approved Notion Build Pack, not from inferred copy or
unverified claims. The current v1 static site remains the production baseline
until the v2 release candidate passes review.

## Authority Order

1. `JERRYBAY 2.2 - Capability-Led Website Project SSOT v1.0`
2. `JERRYBAY Capability-Led Website - Master PRD v1.0`
3. `JERRYBAY AI No-Code Harness OS - Capability-Led Commercial Loop v2.2`
4. Current owner decisions recorded in the SSOT update log
5. Audit and legacy documents, which may identify risks but cannot override a
   newer SSOT decision by themselves

The source map in `v2/content-source-map.json` records every current document
reviewed for this baseline. Because Notion is still being upgraded, every
source marked `refreshBeforeBuild` must be reread before the one-pass build.

## Current State

- Branch: `feat/jerrybay-v2-harness`
- Production baseline: current root `index.html` on `main`
- V2 build state: `SETUP_READY`
- Deployment state: no V2 production deployment has been requested or made
- Build source: final owner-approved Notion content pack

## One-Pass Build Loop

1. Refresh every source in `v2/content-source-map.json`.
2. Normalize approved material into `v2/build-pack.template.json` (copied to
   `v2/build-pack.json` for a real run).
3. Run `node scripts/validate-v2-harness.mjs --build-pack v2/build-pack.json`.
4. Implement the approved routes, interactions, metadata, and responsive UI.
5. Run local browser, keyboard, mobile, link, and metadata QA.
6. Commit the release candidate and publish a branch preview only.
7. Promote to `main` only after owner approval of the preview and public
   claims.

## Required Route Contract

- `/`
- `/capabilities`
- `/ideas-lab`
- `/work`
- `/collaborate`
- `/about`
- `/contact`
- `/privacy` (only active when a data collection tool is selected)

## Content Safety Contract

- Use a visible status label: `Proven`, `Built`, `Designed`, `Exploring`, or
  `Paused`.
- Do not invent customer logos, testimonials, outcomes, contract values,
  dates, or completion status.
- Do not publish a client or organization name without an approved attribution
  and permission state.
- Do not add a hosted intake form, newsletter, checkout, analytics identifier,
  or tracker before its data controller and privacy operation are approved.
- Keep concept, prototype, proposal, and operating work visibly distinct.

## Build Pack Minimum

The final pack must include five capability definitions, at least four
approved capability stories, at least five ideas, at least five work items,
collaboration paths, the owner-approved contact route, and final metadata.
The harness validator rejects a Build Pack that has missing routes, invalid
status labels, or release-sensitive claims without a claim boundary.

## Deliberately Deferred

- Payment, pricing, and checkout
- Hosted inquiry storage and newsletters
- Customer logos and named case studies without permission
- Content automation and CMS
- English site expansion
