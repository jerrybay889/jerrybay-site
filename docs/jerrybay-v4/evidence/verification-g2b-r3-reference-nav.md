# G2-B-R3 — Reference Navigation Consolidation Verification

- Implementation SHA: `0790583b2a9ef9b05e135431252e3634289a72f5`
- Branch: `build/jerrybay-v4-original-first`
- Review deployment: `dpl_BQuGt4nVDkYkSZyk368UiMhf5PDH`
- Review URL: `https://jerrybay-v4-g2a-review-a18wq4bux-jerrybay889s-projects.vercel.app`
- Deployment state: `READY`

## Intent and scope

The Owner identified a duplicate global concept: `프로젝트` and `레퍼런스` appeared as parallel top-level menu items. This remediation makes `레퍼런스` the sole global archive destination. `프로젝트` remains only as an archive-internal filter, breadcrumb/content type, and project-specific CTA term.

## Commands and outcomes

1. `node scripts/qa/validate-site.mjs` — `202/202 PASS` across 13 routes. New check `19i` enforces that neither the home global menu nor any Reference/detail global menu exposes `/references/?type=project` as a parallel project item.
2. `node scripts/qa/test-external-style-font-policy.mjs` — `29/29 PASS`.
3. `npx --yes html-validate` across the 13 route entry files — `0 problems`.
4. `node scripts/qa/browser-qa.mjs http://127.0.0.1:9222 http://127.0.0.1:4173 docs/jerrybay-v4/evidence/screenshots-g2b-r3-reference-nav` — `230/230 PASS`.
5. `git diff --check` — PASS.

## Browser and rendered evidence

- Desktop `1440×900` and mobile `390×844` ran for every route.
- Browser checks include horizontal overflow, console errors, target size, primary CTA, mobile menu keyboard/Escape/focus return, scroll lock, section anchor/Reference filter behavior, local asset loading, and header link-count contracts.
- Home mobile menu: 8 links. Reference hub and six detail menus: 5 links. Six preserved support-route menus: 7 links.
- `home-desktop.png` and `references-desktop.png` in `screenshots-g2b-r3-reference-nav/` were visually inspected: both headers present a single unambiguous `레퍼런스` archive path; the project filter is confined to the Reference content section.

## Release boundary

This deployment belongs to the separate protected review project `jerrybay-v4-g2a-review` (`prj_yoWFPmidQa0rGubXIpjKeONWXD2P`). It does not change the existing `jerrybay-site` project, `main`, domains, or production deployment. Vercel Authentication remains enabled and no temporary authentication-bypass URL is stored.
