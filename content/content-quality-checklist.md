---
name: inblog-content-quality-checklist
description: "Automated content quality scanner with GEO Citability Score. Triggers: '품질 체크', '발행 전 검토', '체크리스트', 'quality check', 'pre-publish review', 'GEO score'"
---

# Content Quality Scanner

Automated quality assessment for posts before publishing. Accepts a post ID, runs all checks programmatically, and outputs a pass/fail report with specific fix actions.

**User-invocable:** `/quality-check <post-id>`, `/quality-check` (latest draft)

## Prerequisites

```bash
inblog auth status
inblog blogs me --json  # → subdomain
```

## Automated Scanner Workflow

### Step 1: Fetch Post Data

```bash
inblog posts get <post-id> --include tags,authors --json
```

Extract: `content_html`, `title`, `meta_title`, `meta_description`, `slug`, `image`, `tags`, `authors`, `cta_text`, `cta_link`, `custom_scripts.json_ld_script`, `published_at`.

### Step 2: Run All Checks

Analyze the fetched data against each check category. Score each check as ✅ Pass or ❌ Fail.

---

## Check Categories

### 1. Indexing Requirements (missing any = indexing risk)

| Check | How to verify | Criteria |
|-------|--------------|----------|
| Content length | Count characters in `content_html` (strip tags) | 3,000+ chars |
| Image count | Count `<img` and `data-type="imageBlock"` tags | 3+ images |
| Alt text | Check each `<img>` has non-empty `alt` attribute | 100% have alt |
| Internal links | Count `<a href>` pointing to same domain | 2+ internal links |
| meta_description | Check field length | 150-160 chars, non-empty |
| Cover image | Check `image` field exists | Must be set |

### 2. Ranking Competitiveness

| Check | How to verify | Criteria |
|-------|--------------|----------|
| Competitive content length | Strip tags, count chars | 5,000+ chars for competitive keywords |
| meta_title | Check field exists and differs from title | Set, under 60 chars |
| Author connected | Check `authors` array | 1+ author (E-E-A-T signal) |
| JSON-LD | Check `custom_scripts.json_ld_script` | Must be present |
| Content block types | Count distinct block types (p, list, code, table, callout, etc.) | 4+ types |
| External links | Count `<a href>` to external domains | 2+ authoritative links |
| Heading hierarchy | Parse headings: h2 → h3 → h4 only | No hierarchy violations |

### 3. AI Citability

| Check | How to verify | Criteria |
|-------|--------------|----------|
| Answer-first structure | First `<p>` after each `<h2>` must be 50-150 words | 80%+ sections comply |
| Definition patterns | Look for "X is [definition]" patterns | 1+ definition present |
| Specific numbers | Count concrete numbers/statistics | 3+ data points |
| Paragraph structure | Each `<p>` is 2-4 sentences, one idea | 80%+ paragraphs comply |
| Comparison tables | If comparison content exists, check for `<table>` | All comparisons use tables |
| Key claims position | Check if stats/data appear in top 30% of content | At least 2 in top 30% |

### 4. E-E-A-T Signals

| Check | How to verify | Criteria |
|-------|--------------|----------|
| First-person experience | Scan for "우리", "저희", "직접", "our", "we tested" | Present |
| Specific case data | Look for metrics, percentages, named examples | Present |
| Author profile | Check `.inblog/{subdomain}/authors/{id}.md` exists | Has expertise info |
| External citations | Count references to official docs, research, reports | 2+ citations |
| Trade-offs acknowledged | Scan for balanced language ("however", "하지만", "단점") | Present |

### 5. AI Content Quality Signals

| Check | How to verify | Criteria |
|-------|--------------|----------|
| No AI-style openings | First `<p>` doesn't start with clichés | No "In today's rapidly changing..." |
| No filler transitions | Scan for "It's worth noting", "Interestingly", "It depends on various factors" | None found |
| Original data | Content contains unique insights/data | Present (manual assessment) |
| Actionable advice | Specific actions, not vague guidance | Present (manual assessment) |

### 6. Content Freshness

| Check | How to verify | Criteria |
|-------|--------------|----------|
| published_at set | Check field | Must be specific date |
| Date-specific info | Scan for year references ("2024", "올해") | Matches current year |
| No vague timing | Scan for "latest", "current", "최근" without dates | None found |

### 7. Post Metadata Final Check

| Check | How to verify | Criteria |
|-------|--------------|----------|
| title | Check length, keyword presence | Under 60 chars, keyword near front |
| meta_title | Check differs from title | SERP-optimized version |
| meta_description | Check length and content | 150-160 chars, keyword + value prop |
| slug | Check format | Lowercase + hyphens, includes keyword |
| Cover image | Check `image` field | Set (1200x630px recommended) |
| Tags | Check `tags` array | 3-5 tags connected |
| CTA | Check `cta_text` + `cta_link` | Customized to post topic |

### 8. Visual Preview (manual step)

After automated checks pass, verify visually:
- Open preview URL with `claude-in-chrome` and screenshot
- All images load, code blocks render, tables display correctly
- No layout overflow or misalignment

### 9. Series Post Repetition Prevention

For posts in the same series/campaign:
- No identical template structure repeated 3+ times
- CTA copy customized per post
- Sentence structure variation

---

## Step 3: GEO Citability Score (0-100)

Calculate a composite score measuring how likely AI systems are to cite this content:

| Component | Weight | Scoring |
|-----------|--------|---------|
| **Paragraph chunk size** | 20 pts | % of paragraphs that are 50-150 words × 20 |
| **Answer-first structure** | 20 pts | % of H2 sections with answer-first opening × 20 |
| **Comparison table usage** | 15 pts | If comparison content exists: table present = 15, no table = 0. If no comparison content: 15 (not applicable) |
| **Definition patterns** | 15 pts | 0 definitions = 0, 1 = 5, 2 = 10, 3+ = 15 |
| **Numeric/data density** | 15 pts | 0-1 data points = 0, 2-3 = 5, 4-6 = 10, 7+ = 15 |
| **Key claims front-loaded** | 15 pts | % of stats/numbers in top 30% of content × 15 |

**Score interpretation:**

| Range | Rating | Action |
|-------|--------|--------|
| 80-100 | Excellent | Ready for GEO |
| 60-79 | Good | Minor improvements recommended |
| 40-59 | Needs work | Review GEO Content Structure Rules |
| 0-39 | Poor | Significant restructuring needed |

---

## Step 4: Output Report

Present results as a structured report:

```
📋 Quality Report: "{post title}" (ID: {id})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Indexing Requirements    ✅ 5/5 passed
Ranking Competitiveness  ⚠️ 5/6 passed (missing: JSON-LD)
AI Citability           ✅ 6/6 passed
E-E-A-T Signals         ⚠️ 4/5 passed (missing: external citations)
AI Content Quality      ✅ 4/4 passed
Content Freshness       ✅ 3/3 passed
Metadata               ✅ 7/7 passed

GEO Citability Score: 78/100 (Good)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Fix Required:
1. ❌ JSON-LD structured data missing
   → Generate Article schema with `inblog-schema-manager` skill
2. ⚠️ Only 1 external citation found (need 2+)
   → Add authoritative source links
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Offer next actions:**
- Fix specific issues → apply via `inblog posts update`
- Run `inblog-geo-optimizer` for GEO score < 60
- Run `inblog-copy-editor` for AI Content Quality failures (Seven Sweeps method)
- Proceed to visual preview if all critical checks pass

## Integration Points

- **write-seo-post** → runs this checklist after Phase 2 content generation
- **autopilot** → triggers this for draft posts pending review (P8)
- **geo-optimizer** → called when GEO Citability Score < 60
- **copy-editor** → called when AI Content Quality checks fail (Seven Sweeps for prose improvement)
- **schema-manager** → called when JSON-LD check fails
- **manage-posts** → applies fixes via post update
