---
name: inblog-content-plan
description: "Strategic content editorial planning. Triggers: '콘텐츠 플랜', '에디토리얼 캘린더', '뭐 쓸지 정해줘', '블로그 계획', 'content plan', 'editorial calendar', 'what should I write'"
---

# Content Plan & Editorial Calendar

Create a strategic content editorial plan like a senior content marketer: topic clusters, funnel mapping, content gaps, competitive differentiation, publication cadence.

**User-invocable:** `/content-plan`, `/content-plan next month`, `/content-plan 5 posts`

## Prerequisites

```bash
inblog auth whoami --json
```

## Blog Resolution

```bash
# 1. Detect active blog
inblog blogs me --json
# → Extract "subdomain" field

# 2. blogDir = .inblog/{subdomain}/
# 3. If blogDir doesn't exist, create it + plans/ subdirectory
```

## Data Cache

All collected data is cached in `.inblog/{subdomain}/cache/` to avoid redundant API calls.

**Cache files:**

| File | Contents | TTL |
|------|----------|-----|
| `posts.json` | Published posts with tags | 7 days |
| `analytics.json` | Post traffic data | 7 days |
| `gsc-keywords.json` | Search Console keywords | 7 days |
| `d4s-keywords.json` | DataForSEO keyword research | 14 days |
| `d4s-competitors.json` | DataForSEO competitor analysis | 14 days |

**Cache format:**
```json
{
  "fetched_at": "2026-03-21T09:00:00Z",
  "ttl_days": 7,
  "data": { ... }
}
```

**Cache rules:**
1. Before any API call, check if `.inblog/{subdomain}/cache/{file}` exists
2. If exists, parse `fetched_at` + `ttl_days` → if not expired, use cached data
3. If expired or missing, fetch fresh data and write to cache
4. User can force refresh: `/content-plan --refresh` or "데이터 새로 수집해줘"
5. After fetching, always save to cache before proceeding to analysis

## Multi-Turn Workflow

### Phase 1 — Context Gathering

**1. Read strategy**
```bash
# Read .inblog/{subdomain}/strategy.md
# If missing → suggest: "Run /blog-strategy first to define your blog's purpose"
```

**2. Check shared assets**
```bash
# Read .inblog/assets/ for brand guidelines or reference materials
```

**3. Audit existing content** (cached: `cache/posts.json`, TTL 7 days)
```bash
# Only fetch if cache expired or missing.
# Fetch ALL published posts by paginating:
inblog posts list --published --limit 100 --page 1 --include tags --json
# → If meta.hasNext is true, continue with --page 2, 3, ... until exhausted
# → Merge all pages into single array

inblog tags list --json

# → Save merged result to .inblog/{subdomain}/cache/posts.json
```
Fetching all posts (not just top N) enables accurate pillar coverage mapping and content gap analysis.

**4. Pull performance data** (cached: `cache/analytics.json` + `cache/gsc-keywords.json`, TTL 7 days)
```bash
# Only fetch if cache expired or missing:
inblog analytics posts --sort visits --limit 20 --include title --json
# → Save to .inblog/{subdomain}/cache/analytics.json

inblog search-console keywords --sort impressions --limit 30 --json
# → Save to .inblog/{subdomain}/cache/gsc-keywords.json
```

**5. DataForSEO research** (cached: `cache/d4s-keywords.json` + `cache/d4s-competitors.json`, TTL 14 days)

Read `.inblog/config.json` → check `dataforseo.login` and `dataforseo.password`.
If D4S credentials are available and cache expired or missing:

- **Keyword research**: For each content pillar, get search volume, keyword difficulty, CPC, and related keywords
  - Endpoint: `POST https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live`
  - Use pillar topics + seed keywords from strategy as input
  - → Save to `cache/d4s-keywords.json`
- **SERP analysis**: For target keywords, check what currently ranks
  - Endpoint: `POST https://api.dataforseo.com/v3/serp/google/organic/live/advanced`
  - Identifies content format that Google prefers (listicle, how-to, etc.)
- **Competitor domain analysis**: For competitor domains listed in strategy.md
  - Endpoint: `POST https://api.dataforseo.com/v3/dataforseo_labs/google/domain_rank_overview/live`
  - Endpoint: `POST https://api.dataforseo.com/v3/dataforseo_labs/google/ranked_keywords/live`
  - Shows which keywords competitors rank for that we don't
  - → Save to `cache/d4s-competitors.json`
- **Content gap**: Compare our domain vs competitor domains
  - Endpoint: `POST https://api.dataforseo.com/v3/dataforseo_labs/google/competitors_domain/live`

Authentication: HTTP Basic Auth with `login:password` from config.

If D4S is not configured, fall back to GSC data only. If neither is available, plan based on existing post audit + strategy pillars + user input.

**6. Ask user**
- Planning horizon? (next month / next quarter)
- Target post count? (e.g., 4-8 posts/month)
- Any must-cover topics or upcoming launches?
- Any seasonal events or deadlines?

### Phase 2 — Analysis

Perform the following analysis using gathered data:

**Refresh candidates** (Freshness-First)
- Cross-reference published posts with analytics data:
  - Posts with 90+ day traffic decline (28d traffic < 70% of previous 28d)
  - Posts with GSC position drop of 3+ positions
  - Posts not updated in 180+ days
  - Posts with date-specific claims ("2024년", "올해") that are outdated
- Include top refresh candidates in the editorial calendar as refresh tasks
- Target **80/20 split**: 80% consistent velocity (new + refresh), 20% special authority pieces
- For detailed refresh execution, reference `inblog-content-refresh` skill

**Pillar gap analysis**
- Map existing posts to content pillars from strategy
- Identify pillars with few or no posts

**Funnel gap analysis**
- Categorize existing posts by funnel stage:
  - **TOFU** (Top of Funnel): Awareness, educational, high-volume keywords
  - **MOFU** (Middle of Funnel): Comparison, how-to, consideration content
  - **BOFU** (Bottom of Funnel): Case studies, demos, purchase-intent content
  - **PARALLEL** (Parallel Tofu): Adjacent topics that attract ICP but aren't product-focused
- Flag imbalances (e.g., all TOFU, no MOFU/BOFU, no PARALLEL)

**Customer language integration**
- Read `strategy.md → Voice of Customer` section if available
- Use VoC phrases as seed keywords for keyword research
- VoC pain point language → potential TOFU/MOFU topic angles
- VoC questions → potential FAQ or problem-solving posts

**Keyword opportunities**
- From GSC: High impressions + low position (ranks 8-20) = quick wins
- From D4S: High-volume keywords with low difficulty in our pillar areas
- Cross-reference: keywords we're already ranking for (GSC) vs market demand (D4S)
- Missing keyword clusters = net-new opportunities

**Competitor content gap** (D4S-powered when available)
- Keywords competitors rank for in top 20 that we have no content for
- Content formats competitors use for high-performing keywords
- Estimate traffic value of gap keywords to prioritize

**Topic cluster gaps**
- Identify standalone posts not linked to a pillar page
- Suggest cluster hub + spoke structure

**Seasonality & timeliness**
- Consider the planning period (month/quarter)
- Industry events, product launches, seasonal trends

**Parallel Tofu discovery**

Read the Audience Interest Map from strategy.md → `parallel_interests` per persona. Then:

1. **Keyword exploration on parallel interests:**
   - For each parallel interest area, run keyword research (D4S or manual brainstorm)
   - Look for: high search volume + low competition + matches blog tone
   - Example: blog about SEO tools → parallel interest "AI 업무 자동화" → keywords: "ChatGPT 업무 활용법", "AI 회의록 자동화"

2. **GSC outlier scan:**
   - Check keywords bringing traffic that don't match any pillar
   - These are organic signals that the audience associates the blog with adjacent topics
   - If a keyword already ranks 10-30, a dedicated post could capture it

3. **Tone fit filter:**
   - For each candidate topic, check against strategy.md voice/brand:
     - Can we write this in our normal tone without it feeling forced?
     - Does it sit naturally next to our pillar content?
     - Can we credibly cover this (even if we're not experts, is our perspective valuable)?
   - Reject topics that fail tone fit — even if search volume is high

4. **Soft CTA mapping:**
   - Parallel posts use softer conversion: newsletter signup, brand recall, social sharing
   - NOT hard product CTAs (the reader came for a non-product topic)
   - Exception: if the topic naturally connects to a product feature, a subtle mention is fine
   - Read business.md to check if any product feature tangentially relates

5. **Content mix target:**
   - Recommend **15-25%** of monthly posts as Parallel Tofu
   - For a 8-post/month plan: 1-2 Parallel posts
   - Don't let Parallel exceed 30% — the blog should still be anchored to its pillars

**Parallel Tofu scoring:**

| Signal | Score |
|--------|-------|
| High search volume (>1k/mo) in parallel interest area | +3 |
| Low keyword difficulty (<30) | +2 |
| GSC already shows impressions for related terms | +3 |
| Competitors don't cover this (content gap) | +2 |
| Naturally connects to a product feature | +1 |
| Strong tone fit | Required (no score — must pass) |
| Trending / timely | +2 |

Rank Parallel candidates by score. Include top 1-2 in the plan.

### Phase 2.5 — Enrichment Interview (human-in-the-loop)

After analysis, before generating the plan. Present findings and ask **targeted questions based on what the data revealed** — not generic questions.

**1. Present analysis summary first:**
```
Here's what I found:
- Pillar gaps: [X] has only 2 posts, [Y] has none
- Keyword opportunity: "CI/CD cost reduction" (vol: 2.4k, KD: 28) — competitors only write generic content
- Funnel gap: No BOFU content at all
- Top performer: "Kubernetes monitoring guide" drives 40% of traffic
```

**2. Ask for internal knowledge the AI cannot access:**

For each gap/opportunity, ask specifically:

| What the data shows | What to ask the user |
|---------------------|---------------------|
| Pillar gap in [topic] | "Does your team have case studies, internal data, or direct experience in [topic]?" |
| High-volume keyword with weak competition | "Do you have a unique angle — proprietary data, contrarian take, or customer story for this?" |
| No BOFU content | "What are the top 3 objections your sales team hears? Any customer success stories with metrics?" |
| Competitor covers X, we don't | "Is this relevant to your product? Do you have a differentiated perspective?" |
| Parallel Tofu opportunity in [topic] | "[topic]에 대해 글을 쓰면 타겟 고객이 관심을 가질 것 같은데, 이 주제로 우리 블로그에 글이 올라와도 괜찮을까요? 혹시 이 분야에 대한 팀의 경험이나 의견이 있나요?" |
| GSC outlier keyword outside pillars | "이 키워드로 이미 유입이 오고 있는데, 의도적인 건가요? 이 방향으로 더 써볼까요?" |

**3. Read business.md for product-topic mapping:**
```bash
# Read .inblog/{subdomain}/business.md
# Check: which product features relate to the identified keyword opportunities?
# This enables natural product mentions in planned posts
```

For example, if "slug optimization" is a keyword opportunity and business.md lists "auto slug generation" as a feature → the planned post should note this as a native CTA angle.

**4. Attach enrichment notes to plan items:**

User's answers become `enrichment` fields in the plan:
```markdown
#### 1. CI/CD Cost Reduction Guide
- **Keyword:** ci/cd cost reduction (vol: 2.4k, KD: 28)
- **Enrichment:** Team reduced deploy costs by 60% migrating to GitHub Actions.
  CEO can provide exact before/after numbers. Sales says "cost" is #1 objection.
  Product feature: built-in CI/CD integration → natural CTA.
```

These enrichment notes carry forward to `inblog-write-seo-post`, giving the writer concrete material that makes the post unique.

### Phase 3 — Plan Generation

For each planned post, include:

| Field | Description |
|-------|-------------|
| Priority | P1 (must publish) / P2 (should publish) / P3 (nice to have) |
| Title idea | Working title (SEO-optimized) |
| Target keyword | Primary SEO keyword (with volume/difficulty from D4S if available) |
| Keyword Score | Composite score: Difficulty 40% + Volume 30% + Business Relevance 30% (see formula below) |
| Business Potential | 0-3 score: 3=product is core solution, 2=useful, 1=indirect mention, 0=no connection |
| Pillar | Which content pillar from strategy — or **PARALLEL** for adjacent topics |
| Funnel stage | TOFU / MOFU / BOFU / **PARALLEL** |
| Format | Tutorial / Listicle / Case study / Comparison (→ `inblog-comparison-content`) / How-to / Opinion |
| CTA approach | Standard (product CTA) / **Soft** (newsletter, brand only) — Parallel posts default to Soft |
| Social repurpose | Yes / No — whether to generate social content after publishing (default: Yes for P1/P2) |
| Rationale | Why this post now (gap, opportunity, seasonal, request) |
| Internal links | Which existing posts to link to/from |
| Enrichment | Internal data, case studies, product features, user-provided insights |
| Estimated effort | Quick (1h) / Standard (2-3h) / Deep (4h+) |

**Keyword Priority Scoring Formula:**

For each planned post with keyword data, calculate a composite score:

```
Keyword Score = (100 - Difficulty) × 0.4 + Volume_normalized × 0.3 + BP_normalized × 0.3
```

Where:
- `Difficulty`: Keyword difficulty 0-100 (from D4S). Higher difficulty → lower score.
- `Volume_normalized`: Monthly search volume normalized to 0-100 scale (e.g., 10k+ = 100, 1k = 50, 100 = 10)
- `BP_normalized`: Business Potential Score (0-3) normalized to 0-100 (0→0, 1→33, 2→67, 3→100)

Display this score for each planned post. If D4S data is unavailable, estimate based on available data.

**Buyer Journey Stage Mix Validation:**

After generating the plan, classify each post by funnel stage and validate against benchmarks:

| Stage | Recommended % | Description |
|-------|--------------|-------------|
| TOFU | ~40% | Awareness, educational, high-volume keywords |
| MOFU | ~30% | Comparison, how-to, consideration content |
| BOFU | ~15% | Case studies, demos, purchase-intent content |
| PARALLEL | ~15% | Adjacent topics for audience growth |

If the plan deviates significantly (>15pp) from these ratios, show a warning and suggest adjustments.

**Ordering rules:**
1. P1 items first, then P2, then P3
2. Within same priority, sort by Keyword Score (descending)
3. Within same priority, balance across pillars
4. Alternate funnel stages for variety — intersperse Parallel posts rather than clustering them
5. Front-load quick wins for early momentum
6. Parallel Tofu posts should be 15-25% of total (e.g., 1-2 out of 8)
7. Include refresh tasks from decay analysis interspersed with new content

### Phase 4 — Save & Present

**Save plan file:**
```bash
# Save to .inblog/{subdomain}/plans/YYYY-MM.md
# Use current month or specified planning period
# e.g., .inblog/my-blog/plans/2026-03.md
```

**Plan file format:**
```markdown
# Content Plan — YYYY-MM

> Generated from strategy: .inblog/{subdomain}/strategy.md
> Planning period: [month/quarter]
> Target: [N] posts

## Summary
- Posts planned: N
- Pillar coverage: [list]
- Funnel mix: X TOFU / Y MOFU / Z BOFU / W PARALLEL

## Posts

### P1 — Must Publish

#### 1. [Working Title]
- **Keyword:** [target keyword]
- **Pillar:** [pillar name]
- **Funnel:** [TOFU/MOFU/BOFU]
- **Format:** [format]
- **Rationale:** [why now]
- **Links:** [existing posts to cross-link]
- **Effort:** [Quick/Standard/Deep]

[...repeat for each post...]

### P2 — Should Publish
[...]

### P3 — Nice to Have
[...]

### Parallel Tofu
> Adjacent topics for audience growth. Soft CTA only.

#### N. [Working Title]
- **Keyword:** [target keyword]
- **Parallel interest:** [which interest area from Audience Interest Map]
- **Tone fit:** [why this works on our blog]
- **CTA approach:** Soft (newsletter / brand awareness)
- **Format:** [format]
- **Rationale:** [why this topic, what data supports it]
- **Effort:** [Quick/Standard/Deep]
```

**Present to user as a prioritized table:**

| # | Priority | Title | Keyword | Score | Pillar | Funnel | CTA | Format | Effort |
|---|----------|-------|---------|-------|--------|--------|-----|--------|--------|
| 1 | P1 | ... | ... | 82 | ... | TOFU | Standard | Tutorial | Standard |
| 2 | P1 | ... | ... | 75 | ... | MOFU | Standard | Comparison | Deep |
| 3 | P2 | ... | ... | 68 | PARALLEL | PARALLEL | Soft | Listicle | Quick |

**Offer next action for each item:**
```
Ready to start writing? Pick a topic number and I'll draft it using the publish workflow.
```
→ Launches `inblog-write-seo-post` skill with topic/keyword pre-filled from the plan.

## Output File

`.inblog/{subdomain}/plans/YYYY-MM.md`

## Data Sources (priority order)

| Source | What it provides | Required? |
|--------|-----------------|-----------|
| `.inblog/{subdomain}/strategy.md` | Pillars, personas, competitors, goals | Yes (run `/blog-strategy` first) |
| DataForSEO (`.inblog/config.json`) | Keyword volume/difficulty, SERP analysis, competitor keywords, content gaps | No — best results when available |
| GSC (`inblog search-console`) | Own keyword performance (impressions, clicks, position) | No — supplements D4S |
| Analytics (`inblog analytics`) | Own post traffic, top performers | No — useful for doubling down |
| Existing posts (`inblog posts list`) | Content audit, tag coverage | Always available |

## Integration Points

- **blog-strategy** → reads strategy.md for pillars, personas, voice, competitor domains, **and Audience Interest Map for Parallel Tofu discovery**
- **DataForSEO** → keyword research, competitor analysis, content gap identification, **parallel interest keyword validation**
- **inblog-write-seo-post** → plan items become pre-filled topics for writing; **Parallel posts get soft CTA treatment**
- **analytics** → performance data informs gap analysis and prioritization
- **search-console** → own keyword data supplements D4S market data; **outlier keywords signal parallel interest opportunities**
- **content-refresh** → refresh candidates identified in Phase 2 are executed via this skill
- **comparison-content** → comparison format posts use specialized comparison workflow
- **social-repurpose** → posts with `social repurpose: Yes` get social content generated after publishing
- **copy-editor** → can be applied to planned posts for quality improvement
