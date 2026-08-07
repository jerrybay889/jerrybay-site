# G2-B-R4 — Reference Category Expansion Verification

- Implementation SHA: `39b9b89d98e4f55d7f16b1bc70e31ce2b75838ba`
- Branch: `build/jerrybay-v4-original-first`
- Review deployment: `dpl_86uDZzutXuAJ1RmW2dCq52vPwUWW`
- Review URL: `https://jerrybay-v4-g2a-review-4aqtzbha4-jerrybay889s-projects.vercel.app`
- Deployment state: `READY`

## Public-scope decision

The Reference archive now makes four categories available through query-compatible filters: project, lecture, planning, and government. Lecture and government records were restored from the verified v4 source and the prior-home inventory. The planning category derives only category-level public framing from the Notion collection; it deliberately excludes raw idea titles, notes, scores, database/source links, and any claim that the material was commissioned by an outside client.

## Record counts

- Projects: 6
- Lectures: 8
- Planning records: 8
- Government-project records: 6

## Commands and outcomes

1. `node scripts/qa/validate-site.mjs` — `206/206 PASS` across 13 routes.
2. `node scripts/qa/test-external-style-font-policy.mjs` — `29/29 PASS`.
3. `npx --yes html-validate` across the 13 route entry files — `0 problems`.
4. `node scripts/qa/browser-qa.mjs http://127.0.0.1:9222 http://127.0.0.1:4173 docs/jerrybay-v4/evidence/screenshots-g2b-r4-reference-expansion` — `233/233 PASS`.
5. `git diff --check` — PASS.

## Link and browser evidence

- The existing DIToday, Korea University News, Pentapost, Fashion Insight, K-MOOC, and Korea Economic TV references returned HTTP `200` in a redirect-following check.
- The AIKUS domain timed out in that link-health command. It remains the Owner-designated external homepage link, and the page makes no availability, release, or operating-state claim from the link.
- Desktop `1440×900` and mobile `390×844` checks cover all 13 routes. The Reference query filters for project, lecture, planning, and government each select only their expected card type and count.
- `references-desktop.png` was visually inspected; the four filter categories fit the desktop header area without overlap. Mobile menu, focus, touch target, overflow, and console checks pass.

## Release boundary

This deployment belongs to the separate protected review project `jerrybay-v4-g2a-review` (`prj_yoWFPmidQa0rGubXIpjKeONWXD2P`). It does not change the existing `jerrybay-site` project, `main`, domains, or production deployment. Vercel Authentication remains enabled and no temporary authentication-bypass URL is stored.
