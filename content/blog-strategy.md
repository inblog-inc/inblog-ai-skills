---
name: inblog-blog-strategy
description: "Blog strategy definition and persona mapping. Triggers: '블로그 전략', '콘텐츠 전략', '블로그 목적', '타겟 독자 설정', 'blog strategy', 'content strategy'"
---

# Blog Strategy Definition

Define the blog's business purpose, target personas, content pillars, brand voice, and conversion goals. Produces `.inblog/{subdomain}/strategy.md` that all other skills reference.

**User-invocable:** `/blog-strategy` or `/blog-strategy refresh`

## Prerequisites

```bash
# Verify authentication
inblog auth whoami --json
```

## Blog Resolution

```bash
# 1. Detect active blog
inblog blogs me --json
# → Extract "subdomain" field from response

# 2. Blog directory
# blogDir = .inblog/{subdomain}/
# If it doesn't exist, create it + plans/ subdirectory

# 3. Read/write files relative to blogDir
```

## Multi-Turn Workflow

### Phase 1 — Discovery

First, determine which track to follow by scanning existing content.

Check cache first: `.inblog/{subdomain}/cache/posts.json` (TTL 7 days).
If cache is valid, use it. Otherwise fetch and cache:

```bash
# Fetch ALL published posts (paginate until exhausted)
# Page 1:
inblog posts list --published --limit 100 --page 1 --include tags --json
# → If meta.hasNext is true, continue:
inblog posts list --published --limit 100 --page 2 --include tags --json
# → Repeat until hasNext is false
# → Merge all pages, save to .inblog/{subdomain}/cache/posts.json
```

**Brand Search Volume Baseline**

Measure current brand search volume as a baseline metric:

1. If DataForSEO is configured (`.inblog/config.json` → `dataforseo`):
   ```
   POST https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live
   → Query: brand name, brand name + product, common brand misspellings
   → Record: monthly search volume, trend direction
   ```
2. Save baseline in strategy.md under a `## Brand Search Volume` section:
   ```markdown
   ## Brand Search Volume
   - Brand keyword: "{brand name}" — {volume}/month (as of {date})
   - Trend: {increasing/stable/decreasing}
   ```
3. **Why this matters:** Brand search volume is the strongest predictor of LLM citation (0.334 correlation). Tracking it over time shows whether content efforts are building brand awareness.
4. If DataForSEO is not configured, note the gap in strategy.md:
   ```markdown
   ## Brand Search Volume
   - ⚠️ DataForSEO not configured — unable to measure automatically
   - Manual lookup recommended: search Google Keyword Planner or Ahrefs for "{brand name}"
   ```

---

**Track A: Scan-first (5+ published posts exist)**

When there is enough existing content to infer strategy from:

1. Scan published posts — titles, tags, topics, writing style, tone
2. If analytics available, pull performance data:
   ```bash
   inblog analytics posts --sort visits --limit 20 --include title --json
   ```
3. If DataForSEO configured (`.inblog/config.json`), pull our domain's SEO profile:
   ```
   POST https://api.dataforseo.com/v3/dataforseo_labs/google/domain_rank_overview/live
   → Our organic traffic estimate, keyword count, domain strength
   ```
4. Check `.inblog/assets/` for brand guidelines or reference docs
5. **Draft a strategy based on what you observe:**
   - Infer content pillars from tag clusters and topic patterns
   - Infer target persona from the topics and depth level
   - Infer brand voice from writing style (formal/casual, technical depth, etc.)
   - Infer blog goal from CTA patterns, post types, funnel coverage
6. **Infer parallel interests:**
   - Check GSC for outlier keywords that don't match any pillar — these are signals
   - Look at the audience profile: what else do people in this role search for?
   - Draft 3-5 parallel interest areas with tone fit assessment
7. Present the inferred strategy to the user for review
8. Ask focused follow-up questions only for what can't be inferred:
   - "I see your posts focus on X and Y — are these your main content pillars, or are there areas you want to expand into?"
   - "Your tone reads as [professional/casual] — is that intentional?"
   - "What's the primary conversion goal? I see [newsletter CTAs / demo links / ...]"
   - "Who are 2-3 content competitors you're aware of?"
   - "제품 밖에서 타겟 고객이 관심 가질 만한 주제 — 예를 들어 [inferred parallel topics] — 이런 걸 블로그에 다루면 어떨까요?"

---

**Track B: Interview (fewer than 5 posts or new blog)**

Gather through natural conversation. Ask 2-3 questions at a time, not all at once.

**1. Business basics**
- What does the company/product do?
- Who are the customers?

**2. Blog goal** (pick primary + secondary)
| Goal | Description |
|------|-------------|
| Lead generation | Drive signups, demo requests |
| Brand awareness | Establish thought leadership |
| Product education | Help users succeed with product |
| Thought leadership | Share unique industry perspectives |
| SEO traffic | Capture search demand |

**3. Target personas** (define 2-3)
For each persona:
| Field | Example |
|-------|---------|
| Role | "Engineering manager at Series B startup" |
| Pain points | "Hiring is slow, CI/CD is broken, team morale is low" |
| Search behavior | "Googles specific error messages, reads HN, follows tech blogs" |
| What convinces them | "Real-world case studies, benchmarks, code examples" |
| **Parallel interests** | Topics they care about *beyond* our product domain (see below) |

**3-A. Audience Interest Map (Parallel Tofu)**

For each persona, map interests that are **not directly about the product** but:
- The target audience actively searches for them
- Publishing on our blog wouldn't feel off-brand
- Brings in readers who match our ICP but aren't product-aware yet

| Field | Description | Example |
|-------|-------------|---------|
| Parallel interests | 3-5 adjacent topic areas | AI 업무 자동화, 리모트 팀 생산성, 데이터 리터러시 |
| Watering holes | Where they consume content | GeekNews, 뉴닉, Twitter/X, Substack newsletters |
| Trending concerns | Current hot topics in their world | AI replacing jobs, 경기 침체 대응, 시리즈 A 혹한기 |
| Tone fit test | Would this topic feel natural on our blog? | "AI 생산성 팁" → fits / "육아 꿀팁" → doesn't fit |

**How to discover parallel interests:**
- Ask: "제품 외에 타겟 고객이 요즘 가장 많이 검색하거나 관심 갖는 주제가 뭐가 있을까요?"
- Ask: "고객과 대화할 때 제품 얘기 말고 자주 나오는 화제가 있나요?"
- If D4S configured: check what other topics the persona's "watering holes" rank for
- If GSC available: look for outlier keywords that bring traffic but don't match any pillar — these hint at parallel interests the audience already associates with the blog

**Tone fit filter** — a parallel topic passes if:
1. Our blog voice (professional/casual/technical) can cover it naturally
2. A reader wouldn't be confused seeing it alongside our pillar content
3. It doesn't require expertise we can't credibly claim

**3-B. Voice of Customer (VoC) Collection**

Collect the actual language your target customers use — not polished marketing terms, but the raw words they type into search bars, write in reviews, and say in conversations.

**Why this matters:** Content that mirrors customer language ranks better (keyword match), converts better (reader feels understood), and gets cited more by AI systems (natural phrasing).

**Sources to mine:**

| Source | What to extract | How to access |
|--------|----------------|---------------|
| G2/Capterra reviews | Pain point descriptions, feature language, complaints | Browse competitor product reviews |
| Reddit/community | Questions, frustrations, terminology | Search relevant subreddits |
| Support tickets | Common problem descriptions | Ask user: "고객이 문의할 때 자주 쓰는 표현이 뭐가 있나요?" |
| Sales call notes | Objections, decision criteria, how they describe the problem | Ask user: "세일즈 콜에서 고객이 자주 하는 말이 있나요?" |
| Search Console | Actual search queries that bring traffic | `inblog search-console keywords --sort impressions --limit 30 --json` |
| Customer interviews | Goals, workflows, pain points in their own words | Ask user for key quotes or patterns |

**Collection process:**

1. **Ask the user** (most valuable):
   - "고객이 이 문제를 설명할 때 어떤 단어를 쓰나요? 마케팅 용어 말고 실제 표현으로요"
   - "고객 리뷰나 서포트 티켓에서 반복되는 표현이 있나요?"
   - "세일즈 미팅에서 고객이 자주 하는 질문 3가지가 뭔가요?"

2. **Mine digital sources** (if user can share or if public):
   - Search G2/Capterra for competitor reviews → extract recurring phrases
   - Check relevant Reddit communities → note how users describe problems
   - Review GSC queries → actual search terms people use to find the blog

3. **Organize into a language dictionary:**

```markdown
## Voice of Customer

### Pain Point Language
- "{exact customer phrase}" — context: {where this was found}
- "{exact customer phrase}" — context: {source}

### Goal Language (how they describe what they want)
- "{exact phrase}" — context: {source}

### Feature/Solution Language (words they use for our category)
- "{exact phrase}" instead of "{our marketing term}"

### Common Questions (verbatim)
- "{exact question}?"
- "{exact question}?"

### Emotional Triggers (what frustrates/excites them)
- Frustration: "{phrase}" — when {situation}
- Excitement: "{phrase}" — when {situation}
```

**How other skills use VoC:**
- `inblog-write-seo-post`: Use customer language in titles, H2s, and opening paragraphs
- `inblog-copy-editor`: Sweep 2 (Voice) references VoC for authentic tone
- `inblog-content-plan`: VoC phrases inform keyword research and topic ideation
- `inblog-social-repurpose`: Hooks use customer language for relatability

**4. Content pillars** (3-5 core topic areas)
These are the blog's expertise domains. Every post should map to a pillar.
Example: `[Engineering Culture, DevOps Best Practices, Product Updates, Industry Analysis]`

> **Note:** Parallel Tofu topics are NOT pillars. They live alongside pillars as opportunistic content. The content-plan skill uses the Audience Interest Map to generate Parallel topic suggestions separately.

**5. Brand voice**
| Attribute | Options |
|-----------|---------|
| Tone | Professional / Casual / Friendly / Authoritative |
| Formality | Formal / Semi-formal / Informal |
| Do's | "Use real examples", "Include code snippets" |
| Don'ts | "Don't use jargon without explanation", "No clickbait" |

**6. Conversion action**
Primary CTA: signup / demo / newsletter / contact / purchase
How aggressive: Soft mention / Dedicated CTA section / Multiple CTAs

**7. Competitive landscape**
- Who are 2-3 content competitors? (get their domain names)
- What do they do well?
- How will this blog differentiate?

If DataForSEO is configured (`.inblog/config.json` → `dataforseo`), enrich competitor analysis:
```
# For each competitor domain, pull data:
POST https://api.dataforseo.com/v3/dataforseo_labs/google/domain_rank_overview/live
→ Domain authority, organic traffic estimate, top keywords count

POST https://api.dataforseo.com/v3/dataforseo_labs/google/ranked_keywords/live
→ What keywords they rank for (top 50), their positions
```
This gives concrete data: "Competitor X gets ~50k organic visits/month, ranks for 1,200 keywords, strongest in [topic area]" — much better than guessing.

**8. Check for existing assets**
- Look in `.inblog/assets/` for brand guidelines, style guides, or reference docs
- If found, incorporate into strategy

---

### Phase 2 — Strategy Synthesis

Generate a structured strategy document with:
- Mission statement (1-2 sentences)
- Persona profiles (discovered or inferred)
- Audience Interest Map (parallel interests per persona, with tone fit)
- Content pillars with descriptions
- Brand voice guidelines
- Conversion funnel & CTA strategy
- Competitive differentiation angle

**E-E-A-T Gap Analysis**

Evaluate the blog's E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) signals and flag gaps:

| Signal | What to check | How to check |
|--------|--------------|-------------|
| **Experience** | First-person experience markers in posts | Scan existing posts for phrases like "we built", "in our experience", "when we tested" |
| **Expertise** | Author profiles with credentials | Check `.inblog/{subdomain}/authors/` — do profiles exist? Do they include role, background, qualifications? |
| **Authoritativeness** | sameAs links to external profiles | Check author profiles for LinkedIn, Twitter/X, GitHub, personal site links |
| **Trustworthiness** | External authority citations | Scan posts for outbound links to authoritative sources (research, official docs, industry reports) |

**Gap assessment output** (include in strategy.md):
```markdown
## E-E-A-T Assessment
- Experience: ✅ Posts include first-person case studies and real examples
- Expertise: ⚠️ Author profiles exist but lack credentials/bio
  → Recommendation: Add professional background, certifications, years of experience to author profiles
- Authoritativeness: ❌ No sameAs links found
  → Recommendation: Add LinkedIn and Twitter/X profile URLs to author profiles
- Trustworthiness: ⚠️ Only 30% of posts cite external sources
  → Recommendation: Include 2-3 authoritative external links per post (research, official docs, industry data)
```

**Track A:** Present the inferred draft → user confirms/corrects → finalize.
**Track B:** Synthesize from interview answers → present draft → user reviews.

In both cases, the user must review and approve before saving.

### Phase 2.5 — Business & Author Profiles

After strategy is drafted, collect business and author context:

**Business profile** (`.inblog/{subdomain}/business.md`):
1. Ask about the product/service:
   - "What does your product do? What are the core features?"
   - "How is pricing structured?"
   - "What's your main differentiator vs competitors?"
2. Build a feature → blog topic mapping:
   - "Which features are relevant to which content pillars?"
   - "What CTA angles work best for each topic area?"
3. Save to `.inblog/{subdomain}/business.md` using `scaffold/business-template.md` format

**Author profiles** (`.inblog/{subdomain}/authors/{author-id}.md`):
1. Get author list:
   ```bash
   inblog authors list --json
   ```
2. For each primary author, ask:
   - "What's your professional background and expertise?"
   - "Any specific experiences, projects, or stories you want to reference in posts?"
   - "Any strong opinions or contrarian takes in your domain?"
3. Save to `.inblog/{subdomain}/authors/{author-id}.md` using `scaffold/author-template.md` format

Both are optional — if user wants to skip, proceed without them. Skills degrade gracefully when these files don't exist.

### Phase 3 — Persist

```bash
# Detect active blog
inblog blogs me --json
# → subdomain

# Ensure directories exist
# mkdir -p .inblog/{subdomain}/plans/
# mkdir -p .inblog/{subdomain}/authors/
# mkdir -p .inblog/{subdomain}/cache/

# Save files:
# .inblog/{subdomain}/strategy.md
# .inblog/{subdomain}/business.md (if collected)
# .inblog/{subdomain}/authors/{id}.md (for each author, if collected)
```

Use template structures from `scaffold/` as the base format for each file.

### Phase 4 — Next Steps

Suggest to the user:
```
Strategy saved to .inblog/{subdomain}/strategy.md
Business profile saved to .inblog/{subdomain}/business.md
Author profiles saved to .inblog/{subdomain}/authors/

Recommended next step:
→ Run /content-plan to create your first editorial calendar
```

## Refresh Mode

When invoked with `/blog-strategy refresh`:
1. Read existing `.inblog/{subdomain}/strategy.md`
2. Present current strategy to user
3. Ask what has changed (new product, pivot, seasonal shift, etc.)
4. Update only the changed sections
5. Save updated file

## Output File

`.inblog/{subdomain}/strategy.md`

## Integration Points

- **content-plan** reads strategy.md to align editorial calendar with pillars and personas
- **content-plan** reads Voice of Customer from strategy.md to inform keyword research and topic angles
- **content-plan** reads Audience Interest Map from strategy.md to generate Parallel Tofu topics
- **content-plan** uses competitor domains from strategy for D4S content gap analysis
- **inblog-write-seo-post** reads strategy.md for voice, persona, and CTA style
- **inblog-write-seo-post** applies softer CTA approach for Parallel Tofu posts (brand awareness, not hard sell)
- **DataForSEO** enriches competitor landscape with real traffic/keyword data (when configured)
