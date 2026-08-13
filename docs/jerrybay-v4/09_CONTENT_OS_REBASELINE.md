# JERRYBAY Content OS Rebaseline — C3 Source Contract

## Authority
- Notion Content OS: https://app.notion.com/p/3bbeb5becb8f8118a1f2f9acfea31c4e
- Notion Admin CMS PRD: https://app.notion.com/p/3bbeb5becb8f818a887dfb4653ec4d76
- GitHub Issue #9 is the executable C3 source Gate.

This contract extends the closed B2 seed-article contract. B2 remains historical PASS evidence; C3 does not reopen it.

## Hubs
### `/insights/`
Must provide Featured + search + taxonomy/filter + author/date/reading-time + image-led editorial list. Each item resolves to a crawlable independent detail route.

### `/references/`
Preserve all 28 canonical items and project/lecture/planning/government truth. Add Featured Work, search, secondary topic taxonomy, image-led project cards and explicit Evidence availability. Items without sufficient detail evidence may stay list-only.

## Insight detail
Required shape:
`Answer First → Problem → Cause/Context → Point of View → Method → Visual Evidence → Example/Evidence → Checklist → FAQ → Sources → Related → CTA → Topics`.

## Reference detail
Required shape:
`Hero visual → Problem/Context → Role/Scope → Approach → Visual/Process → Key Decisions → Evidence/Claim Boundary → Current State → Lessons → Related → CTA → Topics`.

## Visual rules
- Real screenshot/prototype/sample first.
- Existing JERRYBAY QA/evidence screenshots may be used when their meaning is captioned truthfully.
- A portfolio-page screenshot is not customer/product proof and must not be described as such.
- Generated illustration may only be used when explicitly labeled Concept / Prototype / Illustration.
- Descriptive `alt` plus caption/source where context needs disambiguation.

## SEO / GEO
- unique title/description/canonical;
- semantic H1/H2/H3;
- visible author/date/updated/reading time for articles;
- truthful JSON-LD only;
- 3–8 meaningful internal links where context supports them;
- Sources/Evidence and related-content sections;
- Topics/Hashtags 10–18, relevant and consolidated; keyword stuffing prohibited.

## Public claim boundary
Never fabricate customer outcomes, testimonials, user counts, revenue, conversion, exclusive contribution, completion state or project internals not supported by public-safe evidence. OMYQT actual sensitive/user/family/account/payment data is prohibited.

## Release
Source/Draft PR/Preview/review may proceed under Issue #9. Current Vercel behavior makes `main` Merge production-impacting; Merge remains Owner-retained.
