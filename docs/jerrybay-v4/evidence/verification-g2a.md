# V4-G2-A Review Checkpoint Verification

## Source tree before Preview

- Branch: `build/jerrybay-v4-original-first`
- Baseline parent: `2c0a28dfe31f52390f70dfb5a73426576ebb4e64`
- Scope: expanded AIKUS, OMYQT, INVIT, and Systems/IP content; review checkpoint only
- No `main`, PR, production, domain, tracking, payment, database, auth, RLS, secret, or destructive Git mutation performed.

## Local validation

| Check | Actual result |
| --- | --- |
| `node scripts/qa/validate-site.mjs` | `114/114 PASS` |
| `node scripts/qa/test-external-style-font-policy.mjs` | `29/29 PASS` |
| `npx --yes html-validate` over 7 routes | `0 problems` |
| Chrome/CDP browser QA | `123/123 PASS` |
| Agent-browser check | Home loaded; interactive snapshot populated; console errors `0`; no framework overlay; card `scrollHeight === clientHeight` |
| Public-file categorical scan | internal/sensitive `0`; tracking `0`; in-page collection `0` |

## Rendered artifacts

- Artifact directory: `docs/jerrybay-v4/evidence/screenshots-g2a/`
- Count: `18 PNG`
- `home-desktop.png` SHA-256: `a5684a48bc6cb577d2a8bc423549f413d714b43dff5a0cb0ed8ee363e25ff1f5`
- `home-mobile.png` SHA-256: `eec8ebba61874dd44f42fbe8629813297ada06f90dccd126cee5e515034df6d9`
- `home-mobile-menu-open.png` SHA-256: `9684781520ef795155aba5303550c3cf0323e320876f9570b0ebfb131326a532`
- `review-projects-desktop.png` SHA-256: `c27c28b80a63cbb33ea24f61b5911a7325bbdd653713c6e6700028529a348ddd`
- `review-systems-desktop.png` SHA-256: `d648b7f8fbc64c962424ab04ff2cca080fe1735332690290f15d42f5bf2cd211`

## Pending only

- Commit the checkpoint source tree.
- Deploy and verify one review-only non-production Preview.
- Send Jerry the Preview URL and wait for review before G2-B.
