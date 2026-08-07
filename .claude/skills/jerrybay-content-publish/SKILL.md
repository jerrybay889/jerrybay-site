---
name: jerrybay-content-publish
description: Create or update one JERRYBAY content-board post (content/posts/*.md) from a title/body or a source URL, regenerate /insights/, and run content QA. Never publishes, merges, or deploys — reports the changed files and generated URL for the user to push/commit themselves.
---

# JERRYBAY content publish

Turns "write a content-board post about X" (or "turn this URL/lecture/press
mention into a post") into one Markdown file plus a regenerated `/insights/`
board — without a CMS, backend, or manual HTML editing.

## When to use this skill

The user asks to add/update a `/insights/` (콘텐츠) entry: a build note, a
lecture/press mention, a reflection on something shipped. Not for editing
any other route (`/`, `/resume/`, `/work/`, `/lab/`, `/books/`, `/contact/`,
`/privacy/`) — those are hand-authored pages, out of scope here.

## Inputs

One of:
- A title + body text to write up as a first-person build note.
- A source URL (lecture page, press article, K-MOOC/Tally-style listing)
  to publish as an external-only card — no body required, just frontmatter.

Always ask for (or infer from context) the **category** — must be one of
the six canonical values in `scripts/content/build-content.mjs`
(`CATEGORIES`): `AI 활용`, `업무 자동화`, `노코드 제작`, `사업·기획`,
`강의·자료`, `빌드 노트`. Do not invent a seventh category.

## Procedure

1. **Enforce Korean editorial tone** (see
   `docs/jerrybay-v3/01_EDITORIAL_VISUAL_REMEDIATION_CONTRACT.md` §2.3):
   first-person, concrete, short sentences, no PM/audit jargon ("Evidence",
   "Public Claim Boundary", "Status Contract", buyer-problem framing), no
   English labels where Korean reads more naturally, no invented KPIs or
   testimonials. Never use `채용` in public copy.

2. **Create or update exactly one file** at `content/posts/<slug>.md`
   (kebab-case slug, no spaces). Frontmatter fields:
   ```
   ---
   title: "..."
   date: "YYYY-MM-DD"
   category: "<one of the six canonical categories>"
   summary: "one-line summary, shown on the board card"
   external_url: "https://..."   # optional — omit for a body-only post
   featured: true                 # optional
   ---
   body text (optional — omit entirely for an external-only card)
   ```
   Body supports only: blank-line-separated paragraphs, `**bold**`, and
   `[text](url)`. No raw HTML — the generator escapes it.
   A post needs a body, an `external_url`, or both; never neither.

3. **Run the generator**:
   ```
   node scripts/content/build-content.mjs
   ```
   This regenerates `insights/index.html` and, for any post with body
   content, `insights/<slug>/index.html`. It also removes stale generated
   detail pages for posts that were deleted or renamed.

4. **Run content/link QA** before reporting done:
   ```
   node scripts/qa/validate-site.mjs
   ```
   Fix anything it flags (dead links, missing alt text, banned terms) by
   editing the source Markdown and rerunning step 3 — never by hand-editing
   the generated HTML directly.

5. **Report**: the generated URL (`/insights/<slug>/` or, for
   external-only posts, the external URL it links to) and the list of
   changed files (the new/edited `content/posts/*.md` plus every
   regenerated `insights/**/index.html`).

6. **Never publish automatically.** Do not `git add`, commit, push, open a
   PR, merge, or deploy. Leave the changes staged in the working tree for
   the user (or the calling session) to review and push.

## Non-goals

- No database, no admin UI, no scheduling/queueing of posts.
- No image upload pipeline — if a post needs an image, the user supplies
  an already-placed asset path and this skill does not fetch or generate one.
- No cross-posting to other routes or to external platforms.
