---
name: inblog-content-cannibalization
description: "Keyword cannibalization detection and resolution. Triggers: '키워드 카니발라이제이션', '키워드 충돌', '중복 키워드', 'keyword cannibalization', 'keyword conflict'"
---

# Content Cannibalization Detection & Resolution

Detect when multiple posts compete for the same keywords, causing both to rank lower. Resolve through consolidation, differentiation, or canonical signals.

**User-invocable:** `/content-cannibalization`, `/content-cannibalization <keyword>`

## Prerequisites

```bash
inblog auth whoami --json
inblog blogs me --json  # → subdomain
# Requires Google Search Console connected:
inblog search-console status
```

## Workflow

### Phase 1 — Data Collection

```bash
# 1. GSC keyword data with page-level detail
inblog search-console keywords --sort impressions --limit 500 --json
# → For each keyword, we need to know WHICH pages rank

# 2. GSC page data
inblog search-console pages --sort clicks --limit 200 --json

# 3. All published posts
inblog posts list --published --limit 100 --include tags --json
# → Paginate until all fetched
```

**Cross-dimension analysis:**
For each keyword from GSC, check if multiple pages from our domain appear in results. This requires cross-referencing keyword and page data:

1. For each top keyword, use `--page-filter` to check which pages rank for it:
   ```bash
   inblog search-console keywords --keyword-filter "target keyword" --limit 50 --json
   ```
2. For each page, check which keywords it ranks for:
   ```bash
   inblog search-console keywords --page-filter "/specific-slug*" --limit 50 --json
   ```
3. Compare: if the same keyword appears in results for 2+ different page filters → cannibalization detected.

**Note:** The GSC API may not directly expose keyword×page matrix. The above cross-referencing approximates it. For more precise detection, also check for similar titles and target keywords across published posts.

### Phase 2 — Cannibalization Detection

Identify keyword clusters where 2+ pages compete:

**Detection signals:**

| Signal | How to detect | Severity |
|--------|--------------|----------|
| Same keyword, multiple pages | 2+ pages in GSC data for same keyword | High |
| Position fluctuation | Same keyword, position varies >5 between periods | High |
| Similar titles | 2+ posts with >60% title word overlap | Medium |
| Same target keyword | 2+ posts in content plan targeting identical keyword | Medium |
| Overlapping H2 headings | 3+ identical H2s across posts | Low |

**Scoring:**
```
Cannibalization Score = (Position variance × 2) + (Number of competing pages × 3) + (Impressions × 0.01)
```

Higher score = more urgent to resolve (more traffic at stake).

### Phase 3 — Conflict Analysis

For each detected conflict, determine which page is stronger:

| Factor | How to measure | Weight |
|--------|---------------|--------|
| Average position | Lower (better) position = stronger | 30% |
| Total clicks | More clicks = stronger | 25% |
| Total impressions | More impressions = stronger | 15% |
| Content depth | Longer, more comprehensive content = stronger | 15% |
| Freshness | More recently updated = stronger | 10% |
| Inbound internal links | More internal links = stronger | 5% |

### Phase 4 — Resolution Recommendations

Present findings and recommend action for each conflict:

```
🔀 Cannibalization Report: {subdomain}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Found {N} keyword conflicts.

Conflict 1: "kubernetes monitoring" (1,200 impressions/month)
  Page A: "K8s 모니터링 완벽 가이드" (ID: 42) — Pos: 8.2, Clicks: 45
  Page B: "쿠버네티스 모니터링 도구 비교" (ID: 56) — Pos: 12.1, Clicks: 12

  ✅ Recommendation: DIFFERENTIATE
  - Page A is stronger (better position, more clicks)
  - Page B has a different sub-intent (tool comparison vs general guide)
  → Refocus Page B on "kubernetes monitoring tools comparison" (different keyword)
  → Add internal link from Page B → Page A

Conflict 2: "ci/cd best practices" (800 impressions/month)
  Page A: "CI/CD 베스트 프랙티스 2024" (ID: 28) — Pos: 15.3, Clicks: 8
  Page B: "CI/CD 파이프라인 모범 사례" (ID: 35) — Pos: 18.7, Clicks: 3

  ✅ Recommendation: CONSOLIDATE
  - Both pages are weak individually
  - Similar content angle, no distinct sub-intent
  → Merge Page B content into Page A (the stronger one)
  → Create redirect: Page B slug → Page A slug
  → Update all internal links pointing to Page B

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Resolution Actions

#### Action 1: CONSOLIDATE (merge weaker into stronger)

When two posts cover the same topic with the same intent:

1. Identify the stronger page (keep this one)
2. Extract unique content from the weaker page
3. Merge unique sections into the stronger page
4. Update the stronger page:
   ```bash
   inblog posts update <stronger-id> --content-file ./merged-content.html
   ```
5. Create redirect from weaker to stronger:
   ```bash
   inblog redirects create --from "/<weaker-slug>" --to "/<stronger-slug>" --type 308
   ```
6. Update internal links (use `inblog-internal-linking` skill):
   - Find all posts linking to the weaker page
   - Update links to point to the stronger page
7. Delete or unpublish the weaker page:
   ```bash
   inblog posts unpublish <weaker-id>
   ```

#### Action 2: DIFFERENTIATE (refocus each on sub-intent)

When two posts have different angles but target the same keyword:

1. Identify distinct sub-intents for each post
2. Reassign target keywords:
   - Post A keeps the broader keyword
   - Post B targets a more specific long-tail variant
3. Update Post B's content to sharpen its unique angle:
   ```bash
   inblog posts update <post-b-id> --content-file ./differentiated-content.html
   inblog posts update <post-b-id> --meta-title "More specific title" --meta-description "Focused description"
   ```
4. Add internal link from Post B → Post A (supports the stronger page)

#### Action 3: CANONICAL (set canonical URL)

When content must stay separate (e.g., different formats for different audiences):

1. Choose the primary page
2. Set canonical on the secondary page:
   ```bash
   inblog posts update <secondary-id> --canonical-url "https://blog.example.com/<primary-slug>"
   ```

## Decision Matrix

| Situation | Action |
|-----------|--------|
| Same intent, one clearly stronger | CONSOLIDATE |
| Same intent, both weak | CONSOLIDATE (into whichever is more comprehensive) |
| Different sub-intents, overlapping keyword | DIFFERENTIATE |
| Syndicated/translated versions | CANONICAL |
| One is a landing page, one is a blog post | DIFFERENTIATE (different format serves different SERP intent) |

## Integration Points

- **autopilot** → triggers this at P12.7 when keyword conflicts detected
- **content-plan** → pre-check: verify planned keywords don't conflict with existing posts
- **write-seo-post** → content uniqueness check references this skill
- **internal-linking** → update links after consolidation
- **content-refresh** → check for cannibalization during refresh

## Guardrails

- **Always confirm before merging/redirecting** — these are hard to reverse
- **Preserve valuable content** — when merging, don't lose unique insights from either page
- **Check backlinks** — if the weaker page has external backlinks, use 308 redirect to preserve link equity
- **Monitor after resolution** — check GSC data 2-4 weeks later to verify improvement
