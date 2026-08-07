# V4-G2-B-R1 capability and stack remediation evidence

## Scope

- Implementation branch: `build/jerrybay-v4-original-first`
- Implementation SHA: `610b69d9a360db97fbc942f166f83758938297b7`
- Change: expand the post-Hero home capability section into a Korean-first execution system; preserve the reduced Hero, existing Content/Projects archive, privacy/claim boundaries, and isolated-review-only release boundary.

## Local verification

| Command | Result |
| --- | --- |
| `node scripts/qa/validate-site.mjs` | `214/214 PASS` across 14 public routes; check `18i` verifies 3 pillars and 5 stack groups |
| `node scripts/qa/test-external-style-font-policy.mjs` | `29/29 PASS` |
| `npx --yes html-validate …14 route files…` | `0 problems` |
| `git diff --check` | PASS |
| `node scripts/qa/browser-qa.mjs http://127.0.0.1:9222 http://127.0.0.1:4173 docs/jerrybay-v4/evidence/screenshots-g2b-r1-capabilities` | `245/245 PASS` |

Browser coverage includes both 1440×900 and 390×844 across all public routes: overflow, console, body/headline scale, CTA/approved intake link, 44px targets, mobile menu/ESC/focus/scroll lock, skip link, project filter, profile load, and Featured Build non-overlap.

## Rendered artifacts

- `33 PNG` files: `docs/jerrybay-v4/evidence/screenshots-g2b-r1-capabilities/`
- `expertise-desktop.png` SHA-256 `CD9D2D336EA09B661DFFCCCCC1A3F554A39D13152C47BE3BC9209DF851A2E232`
- `expertise-mobile.png` SHA-256 `2CF5C1A7F312FC611F527ABD31BF554730FB47FE8759191D9B9A6ABB5103763A`
- `home-desktop.png` SHA-256 `3E6C87406AEDC8C97570A25F9A35F76C79CD6C8FCC7A4E177787F6CB3AF37E84`
- `home-mobile.png` SHA-256 `7229F98DA291C554125D756A6169952E69B6FA4262D2C43B32B1ACD72F15F841`

Manual rendered check: the new desktop and mobile capability frames have no text/card overlap or horizontal clipping. The capture also confirms dense stacking at mobile width.

## Review deployment

- Separate protected Vercel review project: `prj_yoWFPmidQa0rGubXIpjKeONWXD2P` (`jerrybay-v4-g2a-review`)
- Deployment: `dpl_4f9VWdUE3g3sDTNzzbVwA4VJXifr`
- State: `READY`
- Review URL: `https://jerrybay-v4-g2a-review-gwagmjmqt-jerrybay889s-projects.vercel.app`
- Vercel Authentication remains enabled. No temporary access-bypass URL is committed.

The existing `jerrybay-site` project, its domains, its production deployment, and `main` are outside this deployment and were not modified.

## Gate outcome

`V4-G2 / G2-B-R1 — READY FOR OWNER REVIEW`

This is not a production release, `main` merge, or final G2 freeze. The next action is Owner visual/story UAT on the isolated review URL.
