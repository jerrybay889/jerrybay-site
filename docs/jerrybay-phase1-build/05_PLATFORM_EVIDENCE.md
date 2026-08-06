# Platform Evidence

**No deployment was performed.** Nothing here was validated against a live
Vercel project, preview URL, or production domain. Classifications describe what
the *repository artifact* supports and what remains unverified.

Vocabulary: **Supported** (verified locally in this build) · **External**
(requires a third-party tool not yet selected) · **Workaround** (achievable but
not the native path) · **NOT VERIFIED** (no evidence gathered).

| Capability | Classification | Evidence / Note |
| --- | --- | --- |
| Static multi-page support | **Supported** | 7 static routes served over `python -m http.server 4173`; all returned HTTP 200 and rendered in Chrome. No build step. |
| Clean URLs | **Supported** (local) / **NOT VERIFIED** (hosted) | Directory-index layout (`capabilities/index.html`) gives `/capabilities/` on any static server. `vercel.json` sets `cleanUrls: true` and `trailingSlash: true` but was never deployed, so hosted behaviour is unverified. |
| Owner copy edit | **Workaround** | Copy is inline in HTML. An owner can edit text in GitHub's web editor, but must avoid markup. There is no CMS and none is in Phase 1 scope. Risk: an owner edit can break a validator contract (e.g. CTA wording); `validate-site.mjs` is the guard, but nothing runs it automatically. |
| Owner image replace | **Workaround** | The build ships no `<img>`. `assets/` accepts file replacement by path, but there is no upload UI. |
| Contact handoff | **External** | `mailto:` only. No form, no endpoint, no stored data. An external intake tool has not been selected — see `C-033`. |
| Analytics | **NOT VERIFIED** | None installed. No account created, no script embedded, per hard prohibition. |
| SEO metadata | **Supported**, deliberately suppressive | Every page has `<title>`, `<meta name="description">`, and `noindex,nofollow`. No canonical, Open Graph, or Twitter tags — they would be misleading on an unreleased private preview and are Phase 1.5 work. |
| Version recovery | **Supported** | Git history on `build/jerrybay-phase1-commercial-v1`, branched from a fixed base SHA in an isolated worktree. |
| Rollback | **Supported** (git) / **NOT VERIFIED** (hosted) | Reverting is a git operation. Platform-level instant rollback was not exercised. |
| Custom domain | **NOT VERIFIED** | No DNS, no domain binding, no certificate issuance attempted. `www.jerrybay.kr` currently serves the previous single-page site from `main` and is untouched by this branch. |

## Robots and indexing posture

Three independent layers, all local-verified:

1. `<meta name="robots" content="noindex,nofollow">` on all 7 pages (check `02:*`)
2. `robots.txt` — `User-agent: *` / `Disallow: /`, no `Allow:` line (check `14`)
3. `vercel.json` sets an `X-Robots-Tag: noindex, nofollow` response header on
   `/(.*)` — **NOT VERIFIED**, since no deployment occurred

Layer 3 must be confirmed against a real response if this is ever hosted.

## Explicitly not claimed

- No Vercel project was created, linked, or configured.
- No preview or production deployment exists.
- No live URL was fetched or screenshotted.
- No performance, uptime, or Core Web Vitals measurement was taken.
