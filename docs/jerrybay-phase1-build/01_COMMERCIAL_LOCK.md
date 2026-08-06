# Commercial Lock — As Applied

Source of authority: `10 — Phase 1 Commercial Decision Lock · OWNER APPROVED v1.0`.
This file records what the lock says and exactly where each element landed in the
build, so a reviewer can diff intent against implementation without reading HTML.

## Primary Commercial Wedge

**조직 AI 교육·업무 적용 프로그램**

| Element | Locked value | Where it appears |
| --- | --- | --- |
| Buyer | 기업·대학·기관의 HR/L&D·혁신·사업 책임자 | `/` hero lead, `/collaborate/` Primary Program `<dt>Buyer</dt>` |
| Problem | AI 교육을 했지만 실제 업무 변화·적용 과제·내재화로 이어지지 않음 | `/` hero + `/capabilities/` Capability 01 Buyer Problem |
| Process | 진단 → 맞춤 교육 → 실습 → 적용 과제 → 결과 Review | `/` Working Method (5 steps), `/capabilities/` 01, `/collaborate/` |
| Duration | 4–8주 | `/` hero lead, `/collaborate/` Primary Program |
| Price Anchor | ₩5,000,000부터 | `/` Offer Hierarchy, `/collaborate/` Primary Program |

## Paid Entry

**AI 업무 적용 우선순위 진단** — 반나절 Workshop, 핵심 업무·병목·AI 적용 후보 도출,
우선순위 Brief. **Founding Price ₩1,500,000.**

Appears in `/` Offer Hierarchy (rank 2) and `/collaborate/` (rank 2, labelled
`Paid Diagnostic`).

## Expansion

**AI Work Transformation Sprint** — 교육 또는 진단 이후. 업무 흐름·승인 구조·Pilot
범위 설계. **₩5,000,000부터**, marked `Founding Offer`.

Appears in `/` Offer Hierarchy (rank 3) and `/collaborate/` (rank 3, labelled
`Founding Sprint`, with an explicit `Precondition` of 교육 또는 진단 완료).

## CTA contract

| Role | Text | Treatment |
| --- | --- | --- |
| Primary | `조직 AI 적용 상담 요청` | `.btn--primary` — the only gradient-filled button style in the stylesheet |
| Secondary | `대표 수행 방식 보기` | `.btn--secondary` — no fill, ghost outline, `font-weight: 500` |

Enforced by automated checks `03:*` (exact string on every commercial page) and
`04` (exactly one gradient button rule exists in CSS). `/privacy/` deliberately
carries no commercial CTA and is asserted to have none.

On `/contact/` the primary CTA is a `mailto:` link with a pre-filled subject —
no form, no endpoint, no stored data.

## Hero

- **H1:** `AI 교육으로 끝나지 않게 만듭니다.`
- **Supporting:** `조직의 업무를 진단하고, 맞춤 교육·실습·적용 과제·결과 Review까지
  연결합니다.` extended with the buyer and duration so the hero states buyer,
  problem, outcome, and CTA above the fold.

Brand breadth is deliberately **not** in the hero. It appears lower in the
Capabilities section on `/` and in full on `/capabilities/`, where Content & IP
and Partnership are demoted to a Secondary section.

## Deviations from source documents, and why

1. **CTA gradient tokens changed.** `DESIGN.md` specifies `#6366F1 → #06B6D4`
   with `#07006C` label text. Measured contrast is **3.93:1** — below WCAG AA for
   the button's 16px bold label. The build uses `#8083FF → #4CD7F6` (both already
   in the existing palette: `primary-container` and `secondary-fixed-dim`),
   giving **5.51:1** at the darkest stop. Accessibility outranked the token note;
   the palette was not extended.
2. **`code.html` deleted on this branch.** It was a stale duplicate design export
   at the repo root, publicly reachable as an eighth route and carrying the old
   public claims (`현대차·르노코리아·대한상공회의소·명지전문대`, `index, follow`).
   It violates both the 7-route contract and the claim rules. Removal is scoped to
   this Writer branch only.
3. **Existing `index.html` fully replaced.** Per the truth rules, named customers
   and counts from the live site were not migrated. Nothing was carried over.

## Not implemented, by contract

`/ideas-lab` (Phase 1.5), search, CMS, analytics dashboard, SEO admin UI,
dynamic story routes, work filters, work detail routes, books, newsletter,
community, payment.
