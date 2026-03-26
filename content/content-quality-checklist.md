---
name: inblog-content-quality-checklist
description: "Content quality checklist. Must check before publishing. Triggers: '품질 체크', '발행 전 검토', '체크리스트', 'quality check', 'pre-publish review'"
---

# Content Quality Checklist

Run this checklist after writing a post, before publishing.

---

## 1. Indexing Requirements (missing any = indexing risk)

- [ ] Content length 3,000+ characters (Korean standard)
- [ ] 3+ images (all with alt text)
- [ ] 2+ internal links (anchor text includes target keyword)
- [ ] meta_description set (150-160 chars, keyword + value proposition)
- [ ] Cover image (image field) set (1200x630px recommended)

## 2. Ranking Competitiveness (for top positions)

- [ ] Competitive keywords: 5,000+ chars content
- [ ] meta_title set (different from title, SERP-optimized version, under 60 chars)
- [ ] author_ids connected (E-E-A-T: expertise signal)
- [ ] JSON-LD structured data (Article or HowTo schema)
- [ ] 4+ content block types used (p, list, code, table, callout, etc.)
- [ ] 2+ external authoritative links (citing sources)
- [ ] H2→H3→H4 hierarchy (no H3-only usage, question-format headings recommended)

## 3. AI Citability

For AI search platforms (ChatGPT, Perplexity, Gemini, etc.) to cite your content, it needs extractable structure.

### Answer-First Structure
- [ ] First 1-2 sentences of each H2 section = core answer (explanation follows)
- [ ] Definition pattern used: "X is [definition]" / "X refers to [explanation]"
- [ ] Specific numbers/data included ("50% average improvement", "3 methods", etc.)

### Paragraph Structure
- [ ] 2-4 sentences per paragraph (1 sentence = weak, 5+ = hard to extract)
- [ ] One paragraph = one idea (no topic mixing)
- [ ] Each paragraph makes sense when extracted independently
- [ ] Key claims placed in first sentence of paragraph

### Comparison/List Structure
- [ ] Comparison content: organized in table format (AI cites tables well)
- [ ] Procedural content: numbered ordered lists

## 4. E-E-A-T Signals (content trustworthiness)

### Experience
- [ ] First-person experience mentioned ("After testing this directly...", "In our team's case...")
- [ ] Specific case results/metrics included (real data, not abstract advice)
- [ ] Screenshots, charts, or other evidence of direct experience

### Expertise
- [ ] Appropriate technical depth for the topic (avoid superficial explanations)
- [ ] Data-backed claims (statistics, research citations)
- [ ] Accurate use of terminology (define on first use)

### Authoritativeness
- [ ] Author profile connected (author_ids)
- [ ] External authoritative sources cited (official docs, research papers, industry reports)

### Trustworthiness
- [ ] Sources cited for claims (links or references)
- [ ] Trade-offs acknowledged ("This method works well for X, but Z is better for Y")
- [ ] Time-specific info has clear dates (published_at set)

## 5. AI Content Quality

### High-Quality Signals (should be present)
- [ ] Original data/insights: information not available elsewhere
- [ ] Specific examples: cases with names, numbers, dates (not abstract)
- [ ] Expert judgment: opinions/recommendations, not just fact listing
- [ ] Actionable advice: specific actions, not vague guidance

### Low-Quality Signals (should NOT be present)
- [ ] No "In today's rapidly changing world..." type AI-style openings
- [ ] No "It's worth noting that...", "Interestingly..." meaningless transitions
- [ ] No identical ending pattern across all sections
- [ ] No "It depends on various factors" vague hedging
- [ ] No filler paragraphs that add no information when removed

## 6. Derivative Content Additional Checks

For content based on external sources:

- [ ] 50%+ original content vs. source
- [ ] canonical_url decision made (skip if sufficiently original)
- [ ] Different heading structure from source
- [ ] Local market data/cases or independent analysis included
- [ ] Source cited via callout + bookmark link

## 7. Content Freshness

- [ ] published_at set (specific date, no vague "recently" expressions)
- [ ] Time-dependent info includes year/date ("as of 2026", "March 2026")
- [ ] Use specific dates instead of "latest", "current", "this year"

## 8. Post Metadata Final Check

- [ ] title (under 60 chars, primary keyword near front)
- [ ] meta_title (SERP-optimized version, different from title)
- [ ] meta_description (150-160 chars, keyword + value prop + call to action)
- [ ] slug (lowercase+hyphens, no stop words, includes keyword)
- [ ] image field (cover/OG image, 1200x630px)
- [ ] author_ids connected
- [ ] tag_ids connected (3-5 tags)
- [ ] cta_text + cta_link (customized to post topic)

## 9. Visual Preview Verification

Use the preview link from `inblog posts preview <id>` or the auto-generated link from create/update.

- [ ] Open preview URL with `claude-in-chrome` and screenshot
- [ ] All images load (no broken image icons)
- [ ] Cover image displays correctly
- [ ] Code blocks and tables render properly
- [ ] Callout blocks and special elements display correctly
- [ ] Text is readable (font size, line spacing, contrast)
- [ ] No layout overflow or misalignment

## 10. Series Post Repetition Prevention

For posts in the same series/campaign:

- [ ] No identical template structure repeated 3+ times
- [ ] Fixed section names (e.g., "Team Commentary") varied per post
- [ ] CTA copy customized per post (no same CTA for 5+ posts)
- [ ] Sentence structure variation (not all declarative sentences)
