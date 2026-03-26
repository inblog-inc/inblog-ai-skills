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

### Phase 2: Outline & Content Generation

1. Write SEO-optimized outline (H2/H3 structure)
2. Confirm with user, then generate HTML content
3. **Must follow `inblog-content-html` skill rules**

#### SEO Optimization Guide

| Element | Rules |
|---------|-------|
| title | Under 60 chars, keyword near front |
| meta_description | 150-160 chars, include keyword, call to action |
| slug | Lowercase English, hyphen-separated, include keyword |
| H2/H3 | Include keywords naturally |
| Body | 1500+ chars minimum, keyword density 1-2% |
| CTA | Place mid-body and at end |

#### Content Structure Templates

**Tutorial/Guide:**
- Introduction (problem statement) → Step-by-step → Tips/caveats → CTA

**Listicle:**
- Introduction → N items (each with H2) → Summary → CTA

**Problem-Solving:**
- Problem scenario → Root cause → Solutions → CTA

**Case Study:**
- Background → Challenge → Process → Results/metrics → CTA

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

### Phase 4: Completion

After publishing, provide links:

- **Editor:** `https://inblog.ai/dashboard/{subdomain}/{postId}`
- **Public URL:** `https://{subdomain}.inblog.io/{slug}`
- With custom domain: `https://{custom_domain}/{slug}`

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
