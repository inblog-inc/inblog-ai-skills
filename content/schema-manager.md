---
name: inblog-schema-manager
description: "Rich schema markup automation. Auto-detect content type and generate JSON-LD. Triggers: '스키마', 'JSON-LD', '구조화 데이터', 'schema markup', 'structured data', 'rich snippet'"
---

# Schema Manager

Auto-detect content type and generate appropriate JSON-LD structured data. Schema markup increases AI citation rate by 2.8x (Schema App research).

**User-invocable:** `/schema <post-id>`, `/schema generate`

## Prerequisites

```bash
inblog auth whoami --json
inblog blogs me --json  # → subdomain, logo_url, custom_domain
inblog authors list --json  # → author details
```

## Workflow

### Step 1: Analyze Content

```bash
inblog posts get <post-id> --include tags,authors --json
```

Parse `content_html` to detect content type signals:

### Step 2: Content Type Detection

| Content Signal | Schema Type | Detection Rule |
|---------------|-------------|---------------|
| Numbered procedure H2s ("Step 1:", "단계 1:") | `HowTo` | 3+ H2s with step/number patterns |
| Question-format H2s ("Q:", "?") + answer paragraphs | `FAQPage` | 3+ H2/H3s ending with "?" or starting with "Q:" |
| Comparison tables with product/tool names | `Product` + `ItemList` | `<table>` with product names in headers |
| Code examples with language classes | `SoftwareSourceCode` | 3+ `<pre><code class="language-*">` blocks |
| Default (none of above) | `BlogPosting` | Fallback |

**Multiple schemas can coexist.** A post can be both `BlogPosting` + `HowTo` + `FAQPage`.

### Step 3: Generate JSON-LD

#### Base Schema (always included)

Every post gets a `BlogPosting` (or `Article`) base schema:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BlogPosting",
      "headline": "{title}",
      "description": "{meta_description}",
      "datePublished": "{published_at}",
      "dateModified": "{updated_at or published_at}",
      "author": {
        "@type": "Person",
        "name": "{author_name}",
        "sameAs": ["{linkedin_url}", "{twitter_url}", "{github_url}"]
      },
      "publisher": {
        "@type": "Organization",
        "name": "{blog_title}",
        "logo": {
          "@type": "ImageObject",
          "url": "{logo_url}"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "{post_url}"
      },
      "image": "{cover_image_url}"
    },
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Blog", "item": "{blog_url}" },
        { "@type": "ListItem", "position": 2, "name": "{tag_name}", "item": "{tag_url}" },
        { "@type": "ListItem", "position": 3, "name": "{title}", "item": "{post_url}" }
      ]
    }
  ]
}
```

#### HowTo Schema (procedural content)

When 3+ step-pattern H2s detected:

```json
{
  "@type": "HowTo",
  "name": "{title}",
  "description": "{meta_description}",
  "step": [
    {
      "@type": "HowToStep",
      "name": "{H2 title}",
      "text": "{first paragraph of section}",
      "position": 1
    }
  ]
}
```

**Extraction rules:**
- Each step H2 → `HowToStep`
- Step `text` = first paragraph (the answer-first paragraph)
- If section has an image → include `image` field

#### FAQPage Schema (Q&A content)

When 3+ question-format headings detected:

```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "{question heading}",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "{answer paragraph(s)}"
      }
    }
  ]
}
```

**Extraction rules:**
- Each question H2/H3 → `Question`
- Answer = all content until next heading (first 300 chars recommended)
- Strip HTML tags from answer text

#### Product/ItemList Schema (comparison content)

When comparison table with product names detected:

```json
{
  "@type": "ItemList",
  "name": "Best {category} Tools",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "item": {
        "@type": "Product",
        "name": "{product_name}",
        "description": "{brief description}"
      }
    }
  ]
}
```

#### SoftwareSourceCode Schema (code-heavy content)

When 3+ code blocks detected:

```json
{
  "@type": "SoftwareSourceCode",
  "name": "{title}",
  "programmingLanguage": "{detected language}",
  "codeRepository": "{if github link found}",
  "description": "{meta_description}"
}
```

### Step 4: Author sameAs Links

Read author profile for sameAs links:

```bash
# Read .inblog/{subdomain}/authors/{author-id}.md
# Extract social/professional profile URLs
```

**sameAs sources (in order of priority):**
1. LinkedIn profile URL
2. Twitter/X profile URL
3. GitHub profile URL
4. Personal website URL
5. Other professional profiles

If author profile doesn't exist or lacks URLs, omit `sameAs` field (don't include empty array).

### Step 5: Apply Schema

```bash
# Save generated JSON-LD to temp file
# /tmp/schema-{post-id}.json

# Apply to post
inblog posts update <post-id> --json-ld-file /tmp/schema-{post-id}.json
```

### Step 6: Validate

After applying, verify:
1. JSON-LD is valid JSON
2. No required fields are empty
3. URLs are well-formed
4. Dates are ISO 8601 format
5. Multiple `@type`s are in `@graph` array (not nested)

## Batch Mode

Process all published posts that lack schema:

```bash
# Fetch all posts
inblog posts list --published --limit 100 --json
# → Filter: posts where custom_scripts.json_ld_script is null/empty

# For each:
# 1. Detect content type
# 2. Generate schema
# 3. Preview before applying
# 4. Apply with confirmation
```

```
📋 Schema Audit: {subdomain}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total published posts: 47
Posts with schema: 12 (26%)
Posts missing schema: 35 (74%)

Schema type distribution:
  BlogPosting: 12
  HowTo: 0
  FAQPage: 0
  Product/ItemList: 0

Recommendations:
  8 posts qualify for HowTo schema
  3 posts qualify for FAQPage schema
  5 posts qualify for Product/ItemList schema

Generate schemas? (all / select / skip)
```

## Integration Points

- **write-seo-post** → generates Article schema during Phase 3; this skill handles advanced types
- **content-quality-checklist** → JSON-LD check references this skill when schema is missing
- **content-refresh** → update schema during content refresh
- **geo-optimizer** → schema markup is a GEO optimization lever (2.8x citation rate)

## Guardrails

- **Valid JSON** — always validate before applying
- **No fake data** — only include data actually present in the post
- **Google guidelines** — follow Google's structured data guidelines (no misleading markup)
- **Show before applying** — display the generated JSON-LD for user review
- **Don't overwrite** — if post already has custom JSON-LD, show diff and confirm before replacing
