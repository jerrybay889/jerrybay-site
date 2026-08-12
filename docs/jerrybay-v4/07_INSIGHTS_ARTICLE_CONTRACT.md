# Insights Article Contract

## Public route

Every authority article is a static, crawlable HTML document at `/insights/{slug}/`. `/insights/` is the only B2 content hub; type is metadata and visible copy, not a separate route.

## Required source packet

1. Public-safe first-party evidence or an Owner-approved factual source.
2. One buyer stage: `Awareness`, `Consideration`, or `Proof`.
3. Korean-first title, answer-first summary, permitted claim boundary, slug, description, author, and truthful publication date.
4. One relevant evidence link, `/business/`, and the exact existing `프로젝트·컨설팅 문의` CTA where context fits.

If the source or claim boundary is missing, do not publish.

## Reusable page shape

- Unique title, description, canonical URL, Open Graph fields, site name, and locale.
- One H1 and an answer-first lead visible without interaction.
- Visible type/buyer-stage label, publication date, and author.
- Article body with semantic H2 hierarchy and resolved internal links.
- `Article` JSON-LD only when its headline, description, author, dates, language, canonical URL, and visible copy agree.
- One relevant evidence path, one `/business/` path, and the canonical Tally CTA.
- Link back to `/insights/`; no JavaScript is required to read the article.

## Safety boundary

Do not publish internal PM or repository details, OMYQT sensitive data, secrets, PII, unsupported outcomes, fabricated citations, customer attribution without evidence, or unverified ratings/reviews. No daily, topic, or video route is created by this contract.

## B2 canonical seed set

Exactly three articles are public in B2:

1. `B2B Insight / Awareness` — `/insights/ai-pilot-to-operating-system/`
2. `Public-safe Case / Proof` — `/insights/aikus-learning-to-work-execution/`
3. `Build / How-to / Consideration` — `/insights/static-first-search-foundation/`

## Publication gate

Static route/link/metadata/search checks, HTML validation, desktop/mobile browser QA, exact-Head Preview, and fresh separate fixed-SHA review must pass. Merge remains a separate production-impacting Owner decision.
