# JERRYBAY v3 — Integrated Visual / Editorial Remediation #1

Status: CANONICAL REMEDIATION CONTRACT
Date: 2026-08-07 KST
Gate: V3 PRIVATE CANDIDATE VISUAL / STORY UAT → REMEDIATE
Branch: `build/jerrybay-personal-revenue-v3`
Candidate base: `76b75e00f602519206457fbce6fcf023b9574017`

## 1. Outcome

Keep the v3 personal-portfolio architecture, but correct the public-facing language, Korean typography, Hero proportions, and content publishing surface so the site reads like a credible Korean personal homepage — not an internal PM artifact, audit report, or foreign SaaS landing page.

This is one integrated remediation. Do not create a new branch, PR, gate, or micro-remediation sequence.

## 2. Public-language lock

### 2.1 Remove recruiting wording

The public site must contain **zero occurrences of `채용`**.

Preferred public CTA hierarchy:
- Primary: `프로젝트·협업 제안하기`
- Secondary: `주요 프로젝트 보기`
- Resume/Profile text link: `경력 자세히 보기`

Contact may still accept employment/fractional opportunities implicitly, but never foreground `채용` in public copy.

### 2.2 Remove internal planning / evidence vocabulary from visitor-facing UI

Do not expose PM/audit vocabulary such as:
- `PUBLIC VERIFIED`
- `PUBLIC VERIFIED PROJECT`
- `SELF-BUILT`
- `LIVE PUBLIC`
- `Evidence`
- `Proof`
- `How Companies Can Use Me`
- `Featured Commercial Work`
- `Career Arc`
- `Now Building`
- `Public Evidence Wall`
- `Build Notes`
- sentences explaining why the website was designed a certain way
- sentences explaining what claims were intentionally excluded

These concepts may remain in source comments, QA, or SSOT, but not as visible visitor copy.

Visitor-facing replacements should sound natural in Korean:
- `Proof` → `대표 프로젝트`
- `Featured Commercial Work` → `주요 프로젝트`
- `Career Arc` → `경력`
- `How Companies Can Use Me` → `함께할 수 있는 일`
- `Now Building` → `요즘 만드는 것들`
- `Lectures / Media Evidence` → `강의와 외부 활동`
- `Insights / Books` → `콘텐츠와 전자책`
- status chip `PUBLIC VERIFIED PROJECT` → `기업 프로젝트`
- `SELF-BUILT / LIVE PUBLIC` → `직접 개발 · 운영 중`
- `SELF-BUILT / IN BUILD` → `직접 개발 · 개발 중`
- `NOW BUILDING` → `기획·개발 중`

### 2.3 Korean voice

Public Korean copy should be:
- first-person and concrete
- confident without self-congratulation
- short sentences
- action/result oriented
- no PM jargon, audit jargon, "buyer problem", "offer connection", "status contract", or English labels when Korean is clearer
- avoid literal translation phrasing
- avoid repeated `~합니다` chains when a shorter noun/verb phrase works
- avoid abstract slogans unless followed by concrete proof

## 3. Home copy lock

### Hero
Eyebrow:
`배제협 · JerryBay`

H1:
`25년 동안 사업을 기획하고 실행해왔습니다. 지금은 AI로 새로운 일과 제품을 만듭니다.`

Lead:
`1999년 이커머스 창업을 시작으로 디지털 마케팅, Web3, 생성형 AI까지 여러 전환기를 현장에서 경험했습니다. 지금은 기업의 AI 사업·교육·프로젝트를 기획하고, 필요한 제품과 자동화 도구를 직접 만듭니다.`

CTA:
- `프로젝트·협업 제안하기`
- `주요 프로젝트 보기`
- `경력 자세히 보기`

### Representative projects intro
Heading:
`직접 기획하고 실행한 프로젝트`

Lead:
`브랜드 캠페인부터 산업 현장의 AI 서비스까지, 실제 프로젝트에서 기획과 실행을 맡아왔습니다.`

Do not say `근거가 확인되는 프로젝트만 표기합니다` in visible copy. Link the source naturally using `관련 기사`, `프로젝트 소개`, `외부 자료`.

### Career
Heading:
`1999년부터 지금까지`
Lead:
`이커머스, 디지털 마케팅, Web3, 생성형 AI까지 기술과 시장이 바뀌는 시기마다 새로운 사업을 만들고 운영했습니다.`

### Capabilities
Section label/title:
`함께할 수 있는 일`

Use Korean-first card titles:
- `AI 사업·제품 기획`
- `기업 AI 전환·컨설팅`
- `AI 교육·워크숍`
- `노코드 AI 프로토타입·자동화`
- `정부지원사업·프로젝트 PM`
English may appear only as small secondary metadata if useful.

### Lab
Section label/title:
`요즘 만드는 것들`
Lead:
`아이디어를 문서에만 두지 않고 직접 프로토타입과 서비스로 만들어 확인합니다.`

### Lectures / media
Title:
`강의와 외부 활동`
Lead:
`기업·기관 교육, 강연, 인터뷰와 프로젝트 기록을 모았습니다.`

### Final CTA
Heading:
`새로운 프로젝트를 함께 논의하고 싶다면`
Lead:
`AI 사업기획, 교육, 프로토타입, 자동화, 공동 프로젝트까지. 필요한 일을 간단히 알려주시면 가능한 방식부터 말씀드리겠습니다.`
Primary: `프로젝트·협업 제안하기`

## 4. Navigation lock

Public navigation must be Korean-first:
- `소개·이력` → `/resume/`
- `프로젝트` → `/work/`
- `직접 만든 것` → `/lab/`
- `콘텐츠` → `/insights/`
- `전자책` → `/books/`
- `문의` → `/contact/`

Brand/logo returns Home. Do not show `Resume / Work / Lab / Insights / Books / Contact` as primary nav labels.

## 5. Hero / portrait visual correction

User preference: closer to the pre-v3 personal homepage — smaller portrait, restrained, grayscale, not a giant editorial poster.

Desktop target:
- Hero top/bottom padding: ~56–72px, not 128px
- portrait visual width: ~260–320px max
- copy column larger than portrait column
- portrait aspect ratio may remain 4:5 but must not dominate more than ~35% of desktop Hero width
- grayscale 100% default; optional subtle color reveal on hover only
- remove dramatic oversized shadow; use restrained shadow/border

Mobile target:
- portrait max width ~160–190px
- portrait should not consume the first full screen
- name/H1/primary CTA must remain visible within the first ~2 screenfuls

## 6. Korean typography contract

Current 64px desktop H1 is too large for this personal resume/portfolio context.

Target scale:
- H1: `clamp(2rem, 4.2vw, 3.25rem)` ≈ 32–52px
- H2: `clamp(1.5rem, 2.8vw, 2.125rem)` ≈ 24–34px
- H3: `clamp(1.125rem, 1.7vw, 1.375rem)` ≈ 18–22px
- Body: 16px base; keep current readable size
- Lead: 17–19px, not >21px

Korean spacing / line rules:
- `word-break: keep-all`
- `overflow-wrap: break-word`
- `line-break: strict` where supported
- headings: `text-wrap: balance` where supported
- body letter-spacing: around `-0.005em` to `0`
- Korean headings: avoid tighter than roughly `-0.015em`
- H1 line-height: ~1.22
- H2 line-height: ~1.3
- body line-height: 1.7–1.8
- remove excessive uppercase tracking from section labels; Korean labels should use normal case and ~0–0.04em tracking
- do not manually insert `<br>` merely to imitate an English design; if a controlled line break is needed, break by semantic phrase
- avoid a particle (`은/는/이/가/을/를/의/와/과`) visually stranded at line start where a small copy edit can prevent it

## 7. Content board — daily publishing surface

Keep `/insights/` URL for compatibility but redesign the public menu label and page as **`콘텐츠`**.

### Public page purpose
A continuously updated archive of Jerry's practical AI notes and public materials — useful content first, self-promotion second.

Hero:
- Eyebrow: `콘텐츠`
- H1: `AI를 쓰고, 만들고, 가르치며 기록합니다.`
- Lead: `새로운 도구 소식보다 실제 업무와 사업에 적용해본 방법을 중심으로 정리합니다.`

### Categories
Initial taxonomy:
- `AI 활용`
- `업무 자동화`
- `노코드 제작`
- `사업·기획`
- `강의·자료`
- `빌드 노트`

### MVP content architecture
No CMS/backend in this remediation.
Implement a deterministic static publishing workflow:
- source posts: `content/posts/*.md`
- lightweight frontmatter: `title`, `date`, `category`, `summary`, optional `tags`, optional `external_url`, optional `featured`
- generator: `scripts/content/build-content.mjs`
- output detail pages: `/insights/<slug>/index.html`
- index page groups/sorts newest first and supports simple category filtering without a framework
- external-only entries may link out instead of generating a detail page
- seed only with truthful existing/public material; do not fabricate articles

Create a project-local repeatable skill:
`.claude/skills/jerrybay-content-publish/SKILL.md`

Skill job:
1. accept title/body/category or a source URL
2. enforce Korean editorial tone
3. create/update one Markdown post
4. run the content generator
5. run internal-link/content QA
6. report generated URL and changed files
7. never publish/merge/deploy automatically

This makes daily updates a one-command/one-request workflow without building a CMS.

## 8. Skill-assisted design workflow

Use the following skill ideas as review layers, not as excuses to add dependencies or redesign the entire site.

### A. Anthropic `frontend-design`
Apply its principle: commit to a site-specific visual direction and avoid generic AI-card/SaaS aesthetics. The chosen direction remains:
`Korean Personal Editorial Resume + Builder Portfolio`.

### B. Impeccable-style focused passes
If Impeccable is already available in the Claude Code environment, use focused equivalents of:
- `typeset` — typography
- `arrange` — spacing/layout
- `critique` — final visual review
- `polish` — cleanup
Do not install a large dependency into the product repository merely to satisfy this contract. If unavailable, apply the same review dimensions manually and report `SKILL UNAVAILABLE`.

### C. Vercel Web Interface Guidelines
Run or emulate `/web-interface-guidelines` on the changed surface. Preserve keyboard/focus/touch-target/accessibility behavior.

### D. UI/UX Pro Max
Benchmark only. Do not install/use as a production dependency in this commercial project without a separate license check because the project distribution has carried a non-commercial license notice.

## 9. Files / scope

Same branch only. Likely changed surface:
- `index.html`
- `resume/index.html`
- `work/index.html`
- `lab/index.html`
- `insights/index.html`
- `books/index.html`
- `contact/index.html`
- `privacy/index.html` only if shared nav/footer requires it; privacy substance must not change
- `assets/css/site.css`
- `assets/js/site.js` if category filtering is needed
- `vercel.json` only if content detail routing/redirects require it
- `content/posts/*.md`
- `scripts/content/build-content.mjs`
- `.claude/skills/jerrybay-content-publish/SKILL.md`
- existing QA scripts as required

No backend, CMS, analytics, payment, database, or production deploy.

## 10. Deterministic acceptance

1. Public HTML contains zero `채용`.
2. Visible public HTML contains zero internal labels: `PUBLIC VERIFIED`, `SELF-BUILT`, `Evidence`, `Public Evidence Wall`, `How Companies Can Use Me`, `Featured Commercial Work`, `Career Arc`, `Now Building`, `Build Notes`.
3. Navigation is Korean-first on all public pages.
4. H1 max CSS size <= 52px; H2 max <= 34px.
5. Home portrait desktop max width <= 320px; mobile <= 190px; grayscale default.
6. Korean headings use `keep-all`; no broken/overflowing heading at 390px and 1440px.
7. Home desktop/mobile Browser QA confirms reduced Hero height and no overflow/clipping.
8. `/insights/` functions as a category-based content board.
9. At least 3 truthful seed entries exist from currently public material.
10. `jerrybay-content-publish` skill exists and its procedure does not publish automatically.
11. Tally URL unchanged.
12. Privacy substance unchanged.
13. robots/indexing unchanged.
14. Internal links 0 dead.
15. HTML validation 0.
16. Writer provides screenshots/evidence paths for Home desktop/mobile and Content desktop/mobile if available in existing QA harness.

## 11. Writer report

Return:
- Writer Agent / Model / Session if exposed
- Execution Environment / Worktree
- Parent SHA / New SHA
- Changed files
- exact public-copy grep results (`채용`, internal labels)
- typography computed/style checks
- portrait dimension/style checks
- content generator test + seed entries
- Static / Browser / HTML / link QA
- Tally / Privacy / robots regression
- Skill use: frontend-design / Impeccable available? / web-interface-guidelines
- worktree clean
- remote exact head

Do not open PR, merge, or deploy.
