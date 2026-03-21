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

## Date Ranges

- Default: last 28 days
- Custom: `--start-date YYYY-MM-DD --end-date YYYY-MM-DD`
- Search Console data may have 2-3 day delay

## Sorting/Filtering

- Traffic: `--interval day|hour`, `--type all|home|post|category|author`
- Posts: `--sort visits|clicks|organic|cvr`, `--order asc|desc`
- Keywords: `--sort clicks|impressions|ctr|position`
- Common: `--limit N` (default 20)
