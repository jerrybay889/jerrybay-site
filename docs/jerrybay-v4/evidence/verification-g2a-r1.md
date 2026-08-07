# V4-G2-A-R1 Visual Remediation + Content Archive Verification

## Source tree

- Branch: `build/jerrybay-v4-original-first`
- Verified implementation SHA: `98a03c96d3e0ce23fba68a2a6993384f2a84e9d9`
- Scope: Owner-requested Hero/type/spacing remediation, Featured Build overlap fix, Content navigation, six project detail pages, and an approval-gated future publishing shape.
- Boundary: no existing-site production publish, `main` mutation, PR, domain, tracking, payment, database, auth, RLS, secret, or destructive Git change.

## Local validation

| Check | Actual result |
| --- | --- |
| `node scripts/qa/validate-site.mjs` | `212/212 PASS` over all 14 public routes |
| `node scripts/qa/test-external-style-font-policy.mjs` | `29/29 PASS` |
| `npx --yes html-validate` over all 14 routes | `0 problems` |
| Chrome/CDP browser QA | `245/245 PASS` at 1440×900 and 390×844 |
| Home Featured Build overlap assertion | all title/status pairs clear at both viewports |
| Content project filter assertion | `/content/?type=project` exposes six project cards and the active filter state |
| Public-file categorical scan | internal/sensitive `0`, secret-like `0`, tracking `0` |
| `git diff --check` | PASS before the source commit |

The optional `agent-browser` CLI was not installed in this environment. The repository's Chrome/CDP harness performed the route, console, target-size, menu, focus, scroll-lock, overflow, profile-image, project-filter, and layout-overlap checks instead.

## Rendered artifacts

- Artifact directory: `docs/jerrybay-v4/evidence/screenshots-g2a-r1/`
- Count: `33 PNG`
- `home-desktop-final-nav.png` SHA-256: `202f9363c32c29ef318ecebfba60eb1d4fe1a5e8e990693365e8de2e62a70704`
- `home-mobile.png` SHA-256: `dbbca3afd7444f8d5a68b5e74a970a51b62c84dce2b2520c33d31e4d6d2aedd4`
- `home-projects-desktop-r1.png` SHA-256: `6ec6b2a821a9e2bb83b39960112684be6d7e6b23b5a76a3fdaa8bad100f5a2bd`
- `content-desktop.png` SHA-256: `85a89b09c0d5f9d8a69717a0f32801ec0c212eb14809dbda153757b3a058c5c5`
- `content-project-filter-desktop.png` SHA-256: `37d59eca65579d25b72cc3d16f0cc6d34d79e004cf8bbaec89beda79b9f97997`
- `contentprojectsaikus-mobile.png` SHA-256: `9d89ec8a930e4a3395cc7c381bb1d83cf52a2abc919803ba76ce98ace63b2910`

## Review deployment next

Deploy this exact implementation SHA only to the existing isolated, protected review project. Record the deployment ID, canonical review URL, READY state, and isolation evidence after that action. Do not treat the isolated project's platform target label as a release of the existing JERRYBAY production site.

## Isolated protected review deployment

- Created: 2026-08-07 (Asia/Seoul)
- Deployment ID: `dpl_J7YzNzZwS1xJtDsM1hZ1skjgwbXF`
- Deployment URL: `https://jerrybay-v4-g2a-review-j32tifa96-jerrybay889s-projects.vercel.app`
- Deployment state: `READY`
- Deployment project: `prj_yoWFPmidQa0rGubXIpjKeONWXD2P` (`jerrybay-v4-g2a-review`)
- Requested target: `preview`; returned deployment target: `null`.
- Source metadata SHA: `4e2759a0d82be0fbeeb99664d806c5ab4d9bc7f7`; verified implementation SHA remains `98a03c96d3e0ce23fba68a2a6993384f2a84e9d9`.
- Isolation verification: existing `jerrybay-site` remains at deployment `dpl_5uHsafs8LFiyKRLLs2Y4bXwBwGgW`; no existing-site domain, production deployment, `main`, push, or PR was changed.
- Review access: Vercel Authentication remains enabled. No temporary access token or share URL is stored in this evidence file.

The Vercel connector confirmed the new deployment metadata as `READY`. Its protected nested-route fetches redirect to Vercel Authentication in this environment, so the full route and interaction evidence for this candidate remains the recorded local Chrome/CDP `245/245 PASS` run above; owner review is performed in an authenticated Vercel session.
