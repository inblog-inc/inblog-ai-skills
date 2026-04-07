---
name: inblog-check-analytics
description: "Traffic, keyword, and SEO analysis with performance insights. Triggers: '트래픽 확인', '키워드 분석', '성과 확인', 'SEO 분석', 'check analytics', 'keyword analysis'"
---

# Traffic & SEO Analysis Workflow

## Prerequisites

- Verify auth/blog with `inblog auth status`
- If not authenticated: `inblog auth login --blog <id or subdomain>`
- Multiple blogs: `inblog blogs list --json` → `inblog blogs switch <id or subdomain>`
- Requires Team plan or higher
- Keyword analysis: Google Search Console connection required (`inblog search-console status`)

## Workflows by User Intent

### "Check overall traffic"

```bash
# Daily traffic trends
inblog analytics traffic --interval day --json

# Referrer source analysis
inblog analytics sources --json
```

Analysis points:
- Daily trends (increase/decrease, peak dates)
- Visits, clicks, organic ratio
- Top referrer sources (direct, search, social, referral)

### "Analyze top-performing posts"

```bash
# Top posts by visits
inblog analytics posts --sort visits --limit 10 --include title --json
```

Analysis points:
- Top posts table (title, visits, clicks, CVR)
- Low CVR posts → suggest adding/improving CTA
- Low visits-to-clicks ratio → suggest improving meta_description

Deep-dive on individual posts:
```bash
# Time-series traffic for specific post
inblog analytics post <id> --interval day --json

# Referrer sources for specific post
inblog analytics post <id> --sources --json
```

### "Keyword analysis" (requires Search Console)

```bash
# Check Search Console connection
inblog search-console status

# If not connected
inblog search-console connect

# Keyword performance
inblog search-console keywords --sort clicks --json

# Page performance
inblog search-console pages --sort clicks --json
```

Analysis points:
- Keyword table: clicks, impressions, CTR, position
- **Opportunity keywords:** High impressions + position > 10 → suggest new post topics
- **Improvement targets:** Low CTR + position < 10 → improve existing meta_description
- **Winning keywords:** Position 1-3, high CTR → expand with additional content

### "Specific post performance"

```bash
# Post time-series traffic
inblog analytics post <id> --json

# Post referrer sources
inblog analytics post <id> --sources --json
```

Analysis points:
- Hourly/daily traffic patterns
- Referrer source distribution
- Improvement suggestions

## Analytics → Action Connections

Naturally connect analysis results to next actions:

| Insight | Suggested Action | Connected Skill |
|---------|-----------------|----------------|
| Opportunity keyword found | "Write a new post targeting this keyword?" | `inblog-write-seo-post` |
| Low CTR post | "Improve the meta_description?" | `inblog-manage-posts` |
| Low CVR post | "Add a CTA?" | `inblog-manage-posts` |
| High-performing topic | "Write a follow-up on this topic?" | `inblog-write-seo-post` |
| Content gaps identified | "Update your content plan?" | `inblog-content-plan` |
| Search Console not connected | "Connect Search Console?" | `inblog-setup-blog` |

### "Content decay detection" (new)

Identifies posts losing traffic or search position — candidates for refresh.

```bash
# Current period (last 28 days)
inblog analytics posts --sort visits --limit 100 --include title --json

# Compare with previous period
inblog analytics compare --json

# GSC keyword/page data for position tracking
inblog search-console keywords --sort impressions --limit 100 --json
inblog search-console pages --sort clicks --limit 100 --json

# All published posts (for update date check)
inblog posts list --published --limit 100 --json
```

**Decay detection criteria:**

| Signal | Threshold | Severity |
|--------|-----------|----------|
| 28d traffic < 70% of previous 28d | >30% decline | High |
| GSC average position dropped 3+ | Position regression | High |
| Not updated in 180+ days | Stale content | Medium |
| High impressions + declining CTR | Losing snippet appeal | Medium |
| Date-specific claims with old year ("2024년") | Outdated | Medium |

**Output: Prioritized decay report**

```
📉 Content Decay Report
━━━━━━━━━━━━━━━━━━━━━━━

High Priority:
1. "Kubernetes 모니터링 가이드" (ID: 42)
   Traffic: 2,100 → 890 (-58%)  |  Position: 5.2 → 9.8  |  Last updated: 180 days ago
   → Action: Refresh (update stats, add new tools section)

2. "GraphQL vs REST 비교" (ID: 31)
   Traffic: 1,500 → 980 (-35%)  |  Position: 3.1 → 6.4  |  Last updated: 210 days ago
   → Action: Refresh (update comparison table, add 2026 benchmarks)

Medium Priority:
3. "CI/CD 파이프라인 구축" (ID: 28)
   Traffic: stable  |  Position: stable  |  Last updated: 240 days ago
   → Action: Preventive refresh (content aging risk)
```

**Next action:** Offer to run `inblog-content-refresh` skill on the top candidates.

## Analytics → Action Connections (updated)

| Insight | Suggested Action | Connected Skill |
|---------|-----------------|----------------|
| Opportunity keyword found | "Write a new post targeting this keyword?" | `inblog-write-seo-post` |
| Low CTR post | "Improve the meta_description?" | `inblog-manage-posts` |
| Low CVR post | "Add a CTA?" | `inblog-manage-posts` |
| High-performing topic | "Write a follow-up on this topic?" | `inblog-write-seo-post` |
| Content decay detected | "Refresh this declining post?" | `inblog-content-refresh` |
| Keyword cannibalization | "Multiple posts competing for same keyword" | `inblog-content-cannibalization` |
| Content gaps identified | "Update your content plan?" | `inblog-content-plan` |
| Search Console not connected | "Connect Search Console?" | `inblog-setup-blog` |

## Date Ranges

- Default: last 28 days
- Custom: `--start-date YYYY-MM-DD --end-date YYYY-MM-DD`
- Search Console data may have 2-3 day delay

## Sorting/Filtering

- Traffic: `--interval day|hour`, `--type all|home|post|category|author`
- Posts: `--sort visits|clicks|organic|cvr`, `--order asc|desc`
- Keywords: `--sort clicks|impressions|ctr|position`
- Common: `--limit N` (default 20)
