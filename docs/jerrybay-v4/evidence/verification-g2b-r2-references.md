# V4-G2-B-R2 Reference IA remediation evidence

- Implementation: `57b0ae9b0cf4f83aec0079567dbd1ace57eb2b73` on `build/jerrybay-v4-original-first`.
- Scope: remove the dedicated privacy route/menu; replace the public Content/Projects hub with Reference/Projects at `/references/` and six `/references/projects/...` detail pages.
- `node scripts/qa/validate-site.mjs`: `201/201 PASS` across 13 public routes, including zero privacy-route/menu and zero legacy `/content/` links.
- `node scripts/qa/test-external-style-font-policy.mjs`: `29/29 PASS`.
- HTML validation across all 13 routes: `0 problems`; `git diff --check`: PASS.
- Chrome/CDP at 1440×900 and 390×844: `230/230 PASS`, including no overflow/console errors, target sizes, keyboard/mobile-menu behavior, approved CTA, and `/references/?type=project` filter.
- Rendered artifacts: `28 PNG` files in `docs/jerrybay-v4/evidence/screenshots-g2b-r2-references/`.
- Isolated protected review deployment: `dpl_AJP2wgdQt9JjnejAbTsTmpHPkXYP`, `READY`, `https://jerrybay-v4-g2a-review-qaf855qex-jerrybay889s-projects.vercel.app`.

The existing `jerrybay-site`, domains, `main`, and production were not changed. This remains an Owner-review checkpoint, not a release approval.
