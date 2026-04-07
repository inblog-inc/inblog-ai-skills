---
name: inblog-comparison-content
description: "Comparison and alternative content specialized workflow. Triggers: '비교 포스트', '대안 글', 'vs 글', '경쟁사 비교', 'comparison post', 'alternative', 'vs post', 'competitor comparison'"
---

# Comparison & Alternative Content Workflow

Specialized workflow for creating comparison and alternative content — the highest-converting BOFU content type. Extends `inblog-write-seo-post` with comparison-specific structure, research, and positioning strategy.

**User-invocable:** `/comparison <our product> vs <competitor>`, `/alternatives <competitor>`

## Prerequisites

```bash
inblog auth status
inblog blogs me --json  # → subdomain
```

## When to Use

- Content plan includes a "Comparison" format post
- User requests: "A vs B 비교 글 써줘", "A 대안 글", "competitor alternatives"
- `inblog-write-seo-post` Phase 1 identifies post type as comparison

## Core Principle

**Honesty builds trust.** Comparison content that only praises your product and bashes competitors loses credibility. The goal is to help the reader make the right decision — even if that means acknowledging where competitors are better.

## Four Comparison Formats

### Format 1: Single Alternative ("X 대안" / "X alternative")

**Target keyword pattern:** `[competitor] alternative`, `[competitor] 대안`, `[competitor] 대체`

**When to use:** Reader is unhappy with a specific competitor and seeking options.

**Structure:**

```
H1: [Competitor] 대안 — [Our Product] 비교 및 전환 가이드

## [Competitor]에서 전환을 고려하는 이유
→ Address common pain points (from customer research / reviews)
→ Be specific: "가격 인상", "기능 제한", "고객 지원 불만" — not generic complaints

## [Our Product] vs [Competitor] — 핵심 비교
→ Comparison table (REQUIRED — see table template below)
→ Feature-by-feature breakdown with honest assessment

## [Our Product]이 더 나은 경우
→ Specific scenarios with concrete examples
→ Customer quote or case study if available

## [Competitor]가 더 나은 경우
→ Acknowledge honestly — builds massive trust
→ "대규모 엔터프라이즈 팀이라면 [Competitor]의 X 기능이 더 적합할 수 있습니다"

## 전환 방법
→ Step-by-step migration guide
→ Reduce switching friction (data export, import tool, support)

## FAQ
→ Address common questions about switching
```

### Format 2: Multiple Alternatives ("X 대안 N가지" / "Top N X alternatives")

**Target keyword pattern:** `[competitor] alternatives`, `[competitor] 대안 추천`, `best [category] tools`

**When to use:** Reader wants to explore the market broadly.

**Structure:**

```
H1: [Competitor] 대안 — 2026년 추천 [N]가지

## [Competitor]의 한계
→ Why people look for alternatives (specific, not generic)

## [Competitor] 대안 비교표
→ Master comparison table with ALL alternatives (REQUIRED)
→ Include: pricing, key features, best for, limitations

## 1. [Our Product] — [One-line positioning]
→ Key strengths (honest)
→ Limitations (honest)
→ Best for: [specific use case]
→ Pricing: [transparent]

## 2. [Alternative B] — [One-line positioning]
→ Same structure — fair, balanced review

## 3-N. [More alternatives...]

## 어떤 도구를 선택해야 할까?
→ Decision framework based on use case, team size, budget
→ NOT "just use us" — genuinely help the reader decide
```

**Positioning rules for multi-alternative posts:**
- List our product in position 1-3 (not always #1 — that looks biased)
- Give genuine pros and cons for every option including ours
- The reader should feel informed, not sold to

### Format 3: Head-to-Head ("A vs B")

**Target keyword pattern:** `[A] vs [B]`, `[A] [B] 비교`, `[A] or [B]`

**When to use:** Reader is deciding between two specific options.

**Structure:**

```
H1: [A] vs [B] — 2026년 상세 비교

## 한눈에 비교
→ Summary comparison table (REQUIRED)

## [Comparison dimension 1]: [A] vs [B]
→ Deep dive on one dimension (e.g., pricing, performance, UX)
→ Clear winner statement with evidence

## [Comparison dimension 2]: [A] vs [B]
→ Repeat for 4-6 key dimensions

## 누가 [A]를 선택해야 하나?
→ Specific personas/scenarios

## 누가 [B]를 선택해야 하나?
→ Specific personas/scenarios

## 결론
→ Summarize in one table or decision tree
```

### Format 4: Third-Party Comparison ("A vs B" — neither is us)

**Target keyword pattern:** `[CompetitorA] vs [CompetitorB]`

**When to use:** Capture search traffic for competitor-vs-competitor queries. Position our brand as the knowledgeable authority.

**Structure:**
- Same as Format 3 but written from a neutral third-party perspective
- Mention our product only in a brief "Also consider" section at the end
- CTA is softer: "We also solve this problem — here's how" with a link

**Why this works:** Ranks for competitor brand keywords, positions us as the trusted advisor, reader discovers our product naturally.

---

## Comparison Table Template

Every comparison post MUST include at least one comparison table. Tables have 2.8x higher AI citation rate.

**Standard comparison table:**

```html
<table>
  <thead>
    <tr>
      <th>Feature</th>
      <th>[Product A]</th>
      <th>[Product B]</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Pricing (starting)</td>
      <td>$X/month</td>
      <td>$Y/month</td>
    </tr>
    <tr>
      <td>Free tier</td>
      <td>Yes / No</td>
      <td>Yes / No</td>
    </tr>
    <!-- 6-10 rows covering key comparison dimensions -->
  </tbody>
</table>
```

**Required columns vary by format:**
- Format 1 (Single alt): 2 columns (Us vs Them)
- Format 2 (Multiple alts): 3-6 columns (all alternatives)
- Format 3 (Head-to-head): 2 columns
- Format 4 (Third-party): 2 columns + optional "Our product" column

## Research Phase

Before writing, gather comparison data:

### From DataForSEO (if configured)

```
# Competitor domain analysis
POST https://api.dataforseo.com/v3/dataforseo_labs/google/domain_rank_overview/live
→ Competitor's traffic, authority, top keywords

# SERP analysis for comparison keyword
POST https://api.dataforseo.com/v3/serp/google/organic/live/advanced
→ What currently ranks for "[A] vs [B]" — match the winning format
```

### From Public Sources

- **Pricing pages**: Current pricing tiers and features
- **G2/Capterra reviews**: Common pros/cons in customer language
- **Product changelogs**: Recent feature additions or removals
- **Help docs**: Feature availability and limitations

### From Internal Data

```bash
# Read business.md for our product features
# .inblog/{subdomain}/business.md

# Read strategy.md for competitive landscape
# .inblog/{subdomain}/strategy.md → competitors section

# Read customer language
# .inblog/{subdomain}/strategy.md → voice_of_customer section
```

## Honesty Guidelines

| Do | Don't |
|----|-------|
| Acknowledge competitor strengths | Dismiss competitors as inferior |
| Use specific, verifiable claims | Make vague negative claims |
| Show pricing transparently | Hide or obfuscate pricing |
| Say "as of [date]" for changing info | Present outdated info as current |
| Link to competitor's site for verification | Prevent reader from checking |
| Use customer language from reviews | Use marketing jargon |
| Show genuine limitations of our product | Pretend we have no weaknesses |

## SEO Optimization for Comparison Content

| Element | Best Practice |
|---------|-------------|
| Title | Include both brand names: "[A] vs [B] — 2026년 비교" |
| meta_title | Keep under 60 chars, both names present |
| slug | `a-vs-b-comparison` or `a-alternative` |
| H2s | Include brand names in headings |
| Schema | Use `Article` with `about` referencing both products |
| Internal links | Link to related product pages, feature guides |

## JSON-LD for Comparison Posts

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "A vs B — Detailed Comparison",
  "about": [
    { "@type": "SoftwareApplication", "name": "Product A" },
    { "@type": "SoftwareApplication", "name": "Product B" }
  ]
}
```

## Integration with write-seo-post

This skill extends `inblog-write-seo-post`. When activated:

1. **Phase 1** of write-seo-post identifies post type as "comparison"
2. This skill takes over for **Phase 2** (outline + content generation):
   - Determine which of the 4 formats applies
   - Run the Research Phase above
   - Generate comparison-specific structure with required tables
3. **Phase 3-4** of write-seo-post handles API calls and publishing as normal

## Integration Points

- **write-seo-post** → activated when post type is "comparison" or user requests comparison content
- **content-plan** → comparison posts in the plan reference this skill for execution
- **blog-strategy** → competitor landscape informs which comparisons to write
- **content-html** → tables must follow `inblog-content-html` formatting rules
- **schema-manager** → comparison-specific Article schema generation
