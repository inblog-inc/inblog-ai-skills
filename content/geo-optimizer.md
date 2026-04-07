---
name: inblog-geo-optimizer
description: "GEO (Generative Engine Optimization) analysis and optimization. Triggers: 'GEO 최적화', 'AI 검색 최적화', 'AI 인용', 'GEO optimize', 'AI citability', 'generative engine'"
---

# GEO Optimizer

Analyze and optimize content for Generative Engine Optimization (GEO). GEO delivers 4.4x higher conversion rate vs traditional SEO. AI Overviews reduce clicks by 58% — content must be structured for AI citation to maintain visibility.

**User-invocable:** `/geo-optimize <post-id>`, `/geo-optimize` (latest post)

## Prerequisites

```bash
inblog auth whoami --json
inblog blogs me --json  # → subdomain
```

## Key Research Findings

| Finding | Source | Impact |
|---------|--------|--------|
| 44.2% of ChatGPT citations from top 30% of page | Discovered Labs | Front-load key data |
| 50-150 word self-contained chunks → 2.3x more citations | Discovered Labs | Paragraph structure critical |
| Comparison tables → 2.8x citation rate | Surfer SEO | Tables over prose |
| Schema markup → 2.8x AI citation rate | Schema App | JSON-LD essential |
| 76.4% of top-cited pages updated within 30 days | GEO research | Freshness matters |

## Workflow

### Step 1: Fetch and Parse Content

```bash
inblog posts get <post-id> --include tags,authors --json
```

Parse `content_html` into structured sections:
- Extract all H2/H3 headings and their content blocks
- Identify paragraph boundaries
- Count words per paragraph/section
- Locate tables, lists, code blocks, callouts
- Map position of each element (top/middle/bottom third)

### Step 2: GEO Analysis

Run each check and score:

#### 2.1 Paragraph Structure Analysis

For each `<p>` element:
- Count words
- Check if 50-150 words (self-contained chunk target)
- Check if it expresses one complete idea

**Scoring:**
- 90%+ paragraphs in range → Excellent
- 70-89% → Good
- 50-69% → Needs improvement
- <50% → Poor

#### 2.2 Answer-First Structure

For each H2 section:
- Is the first paragraph a self-contained answer?
- Does it make sense when extracted independently?
- Is it 50-150 words?

**Test:** Could an AI system use just this first paragraph as a complete answer to "What is [H2 topic]?" If yes → pass.

#### 2.3 Key Claims Front-Loading

Analyze the top 30% of the post's content:
- Count concrete statistics and numbers
- Count data points with sources
- Count definition patterns ("X is [definition]")

**Target:** At least 3 data points and 1 definition in the top 30%.

#### 2.4 Comparison Content

If the post contains comparison elements (multiple items/options/tools being contrasted):
- Is there a `<table>` element? → Required
- Does the table have clear headers? → Required
- Are all compared dimensions covered? → Recommended

**Rule:** Any comparison MUST have a table version. Prose-only comparisons have 64% lower citation rate.

#### 2.5 Definition Patterns

Count explicit definition patterns:
- "X is [definition]" / "X refers to [explanation]"
- "X란 [정의]" / "X는 [설명]을 의미한다"

**Target:** At least 1-2 definition patterns per post.

#### 2.6 Extractability Test

For each major section, test: Can this section's key claim be extracted as a standalone statement?

Good: "Keyword cannibalization occurs when multiple pages compete for the same query, reducing rankings by 10-50%."
Bad: "As we discussed earlier, this phenomenon, which many experts have written about, can sometimes cause issues."

### Step 3: GEO Citability Score (0-100)

Calculate composite score:

| Component | Weight | Calculation |
|-----------|--------|-------------|
| Paragraph chunk size | 20 pts | % of paragraphs 50-150 words × 20 |
| Answer-first structure | 20 pts | % of H2 sections with answer-first opening × 20 |
| Comparison tables | 15 pts | If comparison exists: has table = 15, no table = 0. No comparison: 15 |
| Definition patterns | 15 pts | 0 defs = 0, 1 = 5, 2 = 10, 3+ = 15 |
| Numeric/data density | 15 pts | 0-1 = 0, 2-3 = 5, 4-6 = 10, 7+ = 15 |
| Key claims front-loaded | 15 pts | % of stats in top 30% × 15 |

### Step 4: Generate Optimization Report

```
🤖 GEO Analysis: "{post title}" (ID: {id})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

GEO Citability Score: 52/100 (Needs Work)

Paragraph Structure:    14/20  (72% in range — 3 paragraphs too long)
Answer-First:           10/20  (50% sections — 3 H2s missing answer-first)
Comparison Tables:       0/15  (comparison content without table!)
Definition Patterns:    10/15  (2 definitions found)
Data Density:           10/15  (5 data points)
Front-Loading:           8/15  (53% of data in top 30%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Recommended Fixes (priority order):

1. 🔴 Add comparison table
   Section "Tool A vs Tool B" (H2 at line ~45) has prose comparison only.
   → Convert to <table> with feature/pricing/rating columns.

2. 🟡 Fix answer-first structure
   These H2 sections don't start with self-contained answers:
   - "Advanced Configuration" — starts with "In this section, we'll..."
   - "Troubleshooting" — starts with "If you're having issues..."
   - "Performance Tips" — starts with "Let's explore some ways..."
   → Rewrite each first paragraph as 50-150 word standalone answer.

3. 🟡 Break up long paragraphs
   - Paragraph at line ~28: 210 words → split into 2 chunks
   - Paragraph at line ~67: 180 words → split into 2 chunks
   - Paragraph at line ~89: 195 words → split into 2 chunks

4. 🟢 Move data points forward
   3 statistics currently in bottom 50% could be referenced earlier.

Apply fixes? (all / select / skip)
```

### Step 5: Auto-Optimize (with confirmation)

If user approves, apply fixes to the content:

1. **Table conversion:** Convert prose comparisons to `<table>` elements
2. **Answer-first rewrite:** Rewrite opening paragraphs of flagged H2 sections
3. **Paragraph splitting:** Break long paragraphs at natural idea boundaries
4. **Front-loading:** Add summary/data references in early sections
5. **Definition insertion:** Add explicit definition patterns where missing

```bash
# Apply optimized content
inblog posts update <post-id> --content-file ./geo-optimized-content.html --skip-preview
```

**Always show diff before applying.** User confirms each change category.

## GEO Content Structure Rules (Reference)

These rules apply to ALL content creation and optimization:

1. **Each H2 section starts with 50-150 word self-contained answer paragraph**
2. **All comparison content MUST have table format** (2.8x citation rate)
3. **Top 30% of post has concrete numbers/data** (44.2% of citations come from here)
4. **One paragraph = one idea**, independently extractable
5. **Definition patterns** ("X is [definition]") for key terms
6. **No filler intros** — lead with substance, not preamble
7. **Short, direct opening sentences** — the first sentence of each paragraph is most likely to be cited

## Integration Points

- **write-seo-post** → GEO structure rules embedded in Phase 2
- **content-quality-checklist** → GEO Citability Score as a check
- **content-refresh** → run GEO optimizer during refresh
- **content-html** → GEO-native structure templates
- **schema-manager** → schema markup enhances GEO (2.8x citation rate)

## Guardrails

- **Don't sacrifice readability for GEO** — content must be good for humans first
- **Show diffs** — never silently modify content
- **Preserve voice** — restructuring shouldn't change the author's voice or expertise signals
- **Don't over-optimize** — forcing every paragraph to exactly 50-150 words creates unnatural rhythm
