---
name: inblog-content-refresh
description: "Content decay detection and refresh workflow. Triggers: '콘텐츠 리프레시', '쇠퇴 감지', '오래된 글 업데이트', 'content refresh', 'refresh old posts', 'content decay'"
---

# Content Refresh Workflow

Detect decaying content and systematically refresh it. Existing content optimization has higher ROI than new content creation. ChatGPT's top 1000 cited pages: 76.4% were updated within 30 days.

**User-invocable:** `/content-refresh`, `/content-refresh <post-id>`

## Prerequisites

```bash
inblog auth whoami --json
inblog blogs me --json  # → subdomain
```

## Workflow

### Phase 1 — Data Collection

Collect all published posts with performance data:

```bash
# 1. All published posts (use cache if fresh: .inblog/{subdomain}/cache/posts.json, TTL 7d)
inblog posts list --published --limit 100 --page 1 --include tags,authors --json
# → Paginate until all fetched

# 2. Post-level analytics (current 28 days)
inblog analytics posts --sort visits --limit 100 --include title --json

# 3. Previous period analytics (for comparison)
inblog analytics compare --json

# 4. GSC keyword data (position tracking)
inblog search-console keywords --sort impressions --limit 200 --json

# 5. GSC page data
inblog search-console pages --sort clicks --limit 100 --json
```

### Phase 2 — Decay Matrix Scoring

Score each published post on the following decay signals:

| Signal | Detection Method | Score |
|--------|-----------------|-------|
| **Traffic decline** | 28d visits < 70% of previous 28d | +3 |
| **Position drop** | GSC average position dropped 3+ vs previous period | +3 |
| **Stale content** | Not updated in 180+ days (check `published_at` / `updated_at`) | +2 |
| **Outdated claims** | Content contains date-specific claims: "2024년", "올해", old year references | +2 |
| **CTR decline** | High impressions but CTR dropped vs previous period | +2 |
| **High business value** | Business Potential Score > 2 (from content plan) | +1 |

**Total decay score** = sum of applicable signals (max 13).

### Phase 3 — Prioritize Refresh Candidates

Sort all posts by decay score (descending). Present top candidates:

```
📉 Content Decay Analysis: {subdomain}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Found {N} posts showing decay signals.

| # | Decay Score | Post | Traffic Δ | Position Δ | Days Since Update |
|---|------------|------|-----------|-----------|------------------|
| 1 | 10 | "K8s 모니터링 가이드" (ID: 42) | -58% | +4.6 | 180 |
| 2 | 8 | "GraphQL vs REST 비교" (ID: 31) | -35% | +3.3 | 210 |
| 3 | 5 | "CI/CD 파이프라인 구축" (ID: 28) | -10% | stable | 240 |

Which post would you like to refresh? (or 'all' for batch instructions)
```

### Phase 4 — Generate Refresh Instructions

For each selected candidate, analyze the specific content and generate targeted refresh instructions:

**4.1 Content audit:**
```bash
inblog posts get <post-id> --include tags,authors --json
# → Read content_html, meta fields, schema
```

**4.2 Generate specific instructions based on decay signals:**

| Decay Type | Refresh Action |
|-----------|---------------|
| Outdated statistics | Find current data, replace old numbers with citations |
| Old year references | Update "2024년" → "2025년", verify claims still accurate |
| Missing sections | Identify new subtopics competitors cover that we don't |
| Thin content | Expand sections with more depth, examples, data |
| Stale examples | Replace with current examples, tools, or case studies |
| Poor structure | Restructure for GEO (answer-first paragraphs, tables for comparisons) |
| Missing schema | Generate appropriate JSON-LD schema |
| Weak CTA | Update CTA based on Business Potential Score |

**4.3 Competitor comparison (optional, if D4S configured):**
```bash
# Check what currently ranks for this post's target keyword
POST https://api.dataforseo.com/v3/serp/google/organic/live/advanced
# → Identify content gaps vs current top 10
```

### Phase 5 — Execute Refresh

With user confirmation, apply the refresh:

```bash
# 1. Update content
inblog posts update <post-id> --content-file ./refreshed-content.html

# 2. Update metadata if needed
inblog posts update <post-id> \
  --meta-description "Updated description" \
  --json-ld-file ./updated-schema.json

# 3. Verify via preview
# Preview link auto-generated on update
```

**Post-refresh checks:**
- Run `inblog-content-quality-checklist` on the refreshed post
- Verify GEO Citability Score ≥ 60
- Check internal links are still valid
- Ensure `published_at` reflects the refresh date if substantially updated

### Single Post Mode

When invoked with a specific post ID (`/content-refresh 42`):
1. Skip Phase 2/3 (scoring/prioritization)
2. Go directly to Phase 4 (audit + instructions) for that post
3. Generate refresh recommendations
4. Execute with confirmation

## Integration Points

- **content-plan** → includes refresh candidates in editorial calendar (80/20 new vs refresh)
- **autopilot** → triggers this skill at P12.5 when decay detected
- **check-analytics** → content decay report identifies candidates for this workflow
- **content-quality-checklist** → validates refreshed content quality
- **schema-manager** → generates/updates schema during refresh
- **internal-linking** → check/update internal links after refresh

## Guardrails

- **Never auto-update** without user confirmation
- **Preserve URL/slug** — don't change the slug on refresh (breaks existing links/rankings)
- **Track changes** — show diff of what will change before applying
- **One at a time** — refresh one post completely before moving to the next
