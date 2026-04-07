---
name: inblog-write-seo-post
description: "Write and publish SEO blog posts. Triggers: '블로그 글 써줘', '포스트 작성', '글 발행', 'write post', 'publish post'"
---

# SEO Blog Post Writing Workflow

## Prerequisites

- Verify auth/blog with `inblog auth status`
- If not authenticated: `inblog auth login --blog <id or subdomain>` (avoids interactive prompt)
- Multiple blogs: `inblog blogs list --json` → `inblog blogs switch <id or subdomain>`
- Requires Team plan or higher (free plan → guide to upgrade)

## Workflow

### Phase 1: Information Gathering (multi-turn)

This phase is **adaptive** — skip any step the user has already provided.
If the user says "write a post about X", go straight to outline with X as the topic.

Confirm with user in order:

1. **Topic** — what to write about (skip if user already specified)
2. **Purpose** — what conversion is desired (signup, demo, newsletter, purchase, contact)
3. **Target audience** — who will read this (skip if obvious from context)
4. **Post type** — tutorial/guide, listicle, problem-solving, case study
5. **Keyword** — SEO target keyword (if user doesn't know, extract from topic)

### Optional: Context Layers

Silently read and apply whatever exists — don't ask about things these files already define.

```bash
# Only if needed:
inblog blogs me --json  # → subdomain

# Layer 1 — Blog strategy (voice, persona, CTA style)
# Read .inblog/{subdomain}/strategy.md

# Layer 2 — Business profile (product features, CTA mapping)
# Read .inblog/{subdomain}/business.md
# → When writing about a topic, check if a product feature is relevant
# → If yes, weave in naturally (not forced) with appropriate CTA

# Layer 3 — Author profile (expertise, experience, style)
# Read .inblog/{subdomain}/authors/{author-id}.md
# → Use author's real experiences for first-person references
# → Match writing style to author's preferences

# Layer 4 — Content plan + enrichment notes
# Read .inblog/{subdomain}/plans/*.md (latest)
# → If user hasn't specified a topic, offer planned topics
# → If writing a planned topic, use its enrichment notes (internal data, case studies)
```

**Key principle:** All layers are *defaults that auto-apply*, not *gates that block*. The user can always override with their own topic, voice, or audience. Skills degrade gracefully when files are missing.

### Phase 1-A: Analytics-Driven Mode (optional)

When user requests "write about a high-performing topic" or "data-driven":

```bash
# Top posts analysis
inblog analytics posts --sort visits --limit 5 --include title --json

# Traffic keywords (requires Search Console)
inblog search-console keywords --sort clicks --limit 10 --json
```

- Suggest topics/keywords based on existing performance data
- After user selects, continue to Phase 2

### Phase 1.5: SERP Intent Analysis (optional)

Before writing, analyze what Google currently rewards for the target keyword:

```bash
# If DataForSEO configured (.inblog/config.json → dataforseo):
POST https://api.dataforseo.com/v3/serp/google/organic/live/advanced
# Body: { "keyword": "<target keyword>", "language_code": "ko", "location_code": 2410, "depth": 10 }
```

**Extract the Three Cs from top 10 results:**

| Dimension | What to look for | Example |
|-----------|-----------------|---------|
| **Content type** | Blog post, landing page, tool, video | "Top 8 results are blog posts" |
| **Content format** | How-to, listicle, guide, comparison, opinion | "7/10 are listicles" |
| **Content angle** | Fresh, beginner, comprehensive, data-driven | "Most target beginners" |

**Auto-adjust post format** to match the dominant pattern. If 7/10 results are listicles, write a listicle. If most are guides, write a guide.

If DataForSEO is not configured, skip this phase gracefully. Proceed with user-specified or default format.

### Phase 2: Outline & Content Generation

1. Write SEO-optimized outline (H2/H3 structure)
2. Confirm with user, then generate HTML content
3. **Must follow `inblog-content-html` skill rules**

#### GEO Content Structure Rules

**All content must follow these GEO-friendly structure rules** (increases AI citation probability by 2.3x):

1. **Answer-first paragraphs:** Every H2 section must START with a 50-150 word self-contained answer paragraph. This paragraph should make sense when extracted independently by an AI system.
2. **Self-contained chunks:** Each paragraph = one idea. No topic mixing. Each paragraph should be independently extractable and meaningful.
3. **Comparison = table:** Any comparison content MUST include a `<table>` element (not just prose). Tables have 2.8x higher AI citation rate.
4. **Front-load data:** Place citable statistics, numbers, and definitions in the top 30% of the post. 44.2% of ChatGPT citations come from the top 30% of a page.
5. **Definition patterns:** Use explicit definition patterns — "X is [definition]" / "X refers to [explanation]" — these are highly extractable by AI.
6. **Short, direct opening:** No filler intros ("In today's rapidly changing world..."). Lead with substance.

#### SEO Optimization Guide

| Element | Rules |
|---------|-------|
| title | Under 60 chars, keyword near front |
| meta_description | 150-160 chars, include keyword, call to action |
| slug | Lowercase English, hyphen-separated, include keyword |
| H2/H3 | Include keywords naturally |
| Body | 1500+ chars minimum, keyword density 1-2% |
| CTA | Intensity based on Business Potential Score (see below); set via `--cta-text`/`--cta-link` |
| JSON-LD | Generate Article schema with Person sameAs; save to file, pass via `--json-ld-file` |

#### Business Potential Score → CTA Intensity

If the post is from a content plan, use the Business Potential (BP) Score to calibrate CTA aggressiveness:

| BP Score | Meaning | CTA Approach |
|----------|---------|-------------|
| 3 | Product is the core solution | Aggressive: mid-body callout + conclusion CTA + post-level CTA |
| 2 | Product is useful but not unique | Moderate: conclusion CTA + post-level CTA |
| 1 | Product can be mentioned indirectly | Soft: one native mention + newsletter CTA |
| 0 | No product connection | Brand only: newsletter signup or social CTA |

If BP Score is not specified in the plan, infer from topic-product relevance using `business.md`.

#### JSON-LD Schema Generation

Generate an Article JSON-LD schema for each post. Save to a temp file and pass via `--json-ld-file`:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Post Title",
  "description": "Meta description",
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "sameAs": [
      "https://linkedin.com/in/author",
      "https://twitter.com/author"
    ]
  },
  "datePublished": "2026-03-30T09:00:00+09:00",
  "dateModified": "2026-03-30T09:00:00+09:00",
  "publisher": {
    "@type": "Organization",
    "name": "Blog Name",
    "logo": {
      "@type": "ImageObject",
      "url": "https://source.inblog.dev/logo.png"
    }
  },
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://blog.example.com/slug" }
}
```

**Author sameAs links:** Read from `.inblog/{subdomain}/authors/{author-id}.md` → if author has LinkedIn, Twitter, GitHub, etc., include them in the `sameAs` array. This strengthens E-E-A-T signals.

**Publisher logo:** Read from `inblog blogs me --json` → `logo_url` field.

For other post types, use appropriate schemas: `HowTo`, `FAQPage`, `Product`, etc. See `inblog-schema-manager` skill for automatic schema type detection.

#### Parallel Tofu Post Guidelines

When writing a post marked as `PARALLEL` in the content plan:

1. **CTA approach: Soft only**
   - Do NOT use hard product CTAs ("Try [Product] free", "Sign up now")
   - Acceptable: newsletter signup, "더 많은 인사이트 받기", social sharing prompt
   - Exception: if the topic naturally connects to a product feature, ONE subtle mention is okay (e.g., "참고로 이 프로세스를 자동화하는 도구도 있습니다" with a link)
   - Post-level CTA (`--cta-text`): use for newsletter/blog subscription, not product

2. **Voice consistency**
   - Write in the same brand voice as pillar content — the post should feel native
   - The reader shouldn't sense that this is "off-topic filler"
   - Reference the blog's domain expertise where natural ("우리 팀도 이 방식을 내부에서 활용하고 있는데...")

3. **Bridge back to pillars**
   - Include 1-2 internal links to related pillar posts
   - End with a "관련 글" section linking to your core content
   - This turns Parallel traffic into pillar readers

#### Content Structure Templates

**Tutorial/Guide:**
- Introduction (problem statement) → Step-by-step → Tips/caveats → CTA

**Listicle:**
- Introduction → N items (each with H2) → Summary → CTA

**Problem-Solving:**
- Problem scenario → Root cause → Solutions → CTA

**Case Study:**
- Background → Challenge → Process → Results/metrics → CTA

**Comparison/Alternative:**
- Use `inblog-comparison-content` skill — specialized workflow with 4 formats, required comparison tables, and honesty-first positioning

#### Content Uniqueness Check

Before finalizing the post, check for potential duplication with existing content:

```bash
# Fetch published posts (use cache if fresh)
# Read .inblog/{subdomain}/cache/posts.json or:
inblog posts list --published --limit 100 --include tags --json
```

**Check for:**
- **Similar titles:** >60% word overlap with existing post title → warn
- **Overlapping H2s:** 3+ identical or near-identical H2 headings → warn
- **Same target keyword:** Another post already targets this exact keyword → warn (cannibalization risk)

**If duplication detected:**
- Alert the user with the conflicting post(s)
- Suggest: differentiate (change angle/depth) OR consolidate (update existing post instead)
- Reference `inblog-content-cannibalization` skill for resolution

### Phase 3: API Calls

```bash
# 1. Check/create tags
inblog tags list
inblog tags create --name "keyword" --slug "keyword"

# 2. Check authors
inblog authors list

# 3. Create post (--image for cover image, local files auto-upload)
inblog posts create \
  --title "SEO Optimized Title" \
  --slug "seo-optimized-slug" \
  --description "150-160 char meta description" \
  --meta-title "Under 60 char meta title" \
  --meta-description "150-160 char meta description" \
  --image ./cover.jpg \
  --content-file ./content.html \
  --cta-text "Get started free" \
  --cta-link "https://example.com/signup" \
  --cta-color "#3B82F6" \
  --cta-text-color "#FFFFFF" \
  --json-ld-file ./article-schema.json \
  --json

# 4. Connect tags/authors
inblog posts add-tags <post-id> --tag-ids <id1>,<id2>
inblog posts add-authors <post-id> --author-ids <id1>

# 5. Publish (based on user choice)
inblog posts publish <post-id>                              # Immediate
inblog posts schedule <post-id> --at "2026-03-10T09:00:00Z" # Scheduled
# Or keep as draft (do nothing)
```

### Phase 3.5: Preview Verification

Before publishing, verify the post visually:

1. The `posts create` output includes a preview link (`Preview: https://inblog.io/p/...`)
2. Open the preview URL using `claude-in-chrome` tools:
   - Navigate to the preview URL
   - Take a screenshot of the full page
3. Check the following:
   - **Readability:** Title, body text, paragraph spacing are clear
   - **Images:** All images load correctly, no broken images
   - **Layout:** No layout issues, proper content flow
   - **Missing elements:** Cover image present, tags displayed, author shown
4. If issues found:
   - Fix content with `inblog posts update <id> --content-file ./fixed.html`
   - New preview link is generated automatically — verify again
5. If everything looks good, proceed to publish

### Phase 3.7: Copy Editing (optional)

If the user requests higher quality or the content feels AI-generic:
- Run `inblog-copy-editor` Seven Sweeps on the generated content
- Particularly useful sweeps: Clarity (1), Voice (2), Specificity (5)
- Apply changes before publishing

### Phase 4: Completion

After publishing, provide links:

- **Editor:** `https://inblog.ai/dashboard/{subdomain}/{postId}`
- **Public URL:** `https://{subdomain}.inblog.io/{slug}`
- With custom domain: `https://{custom_domain}/{slug}`

**Offer social repurposing:**
```
Post published! Want to create social content from this post?
→ Run /social-repurpose {post-id} to generate LinkedIn, Twitter/X, and Instagram content
```

## Image Handling

Refer to `inblog-image-sourcing` skill for image sourcing approach.

```bash
# Cover image (local file or URL)
inblog posts create --title "Title" --image ./cover.jpg --content-file ./content.html
inblog posts update <id> --image https://source.inblog.dev/...

# Upload local images first
inblog images upload ./photo1.jpg ./photo2.jpg
# → Returns CDN URLs for use in content_html

# Local paths/base64 in content_html are auto-uploaded to CDN
# (handled automatically with --content-file, prevents 413 errors)
```

**Warning:** Embedding base64 directly in content_html causes 413 errors. Always use local file paths or upload via `inblog images upload` first.

## Error Handling

| Error Code | Resolution |
|-----------|-----------|
| SLUG_CONFLICT | Change the slug |
| SUBSCRIPTION_REQUIRED | Upgrade to Team plan |
| VALIDATION_ERROR | Check required fields |
| INVALID_TAG_IDS | Verify with `inblog tags list` |
