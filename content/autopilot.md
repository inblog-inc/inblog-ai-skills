---
name: inblog-autopilot
description: "Autonomous blog growth agent. Assesses state, picks highest-impact action, executes. Triggers: '자율주행', '블로그 자동', '다음에 뭐 해야 해', 'autopilot', 'what should I do next', 'grow my blog'"
---

# Autopilot — Autonomous Blog Growth Agent

An orchestration skill that reads the full state of the blog workspace, determines the single highest-impact action, and executes it. Each invocation is **one atomic action** — run repeatedly for continuous progress.

**User-invocable:** `/autopilot`, `/autopilot status`

## Core Loop

```
Diagnose → Prioritize → Execute ONE action → Report → Stop
```

Do NOT chain multiple actions in a single invocation. One action, done well, then stop and let the user decide whether to continue.

## Phase 1 — Diagnose

Read all available state to build a complete picture:

```bash
# 1. Auth & blog
inblog auth whoami --json
inblog blogs me --json  # → subdomain

# 2. Workspace state (file existence checks)
# .inblog/{subdomain}/strategy.md         — exists?
# .inblog/{subdomain}/business.md         — exists?
# .inblog/{subdomain}/authors/            — any files?
# .inblog/{subdomain}/plans/              — any files? latest?
# .inblog/{subdomain}/cache/              — any files? freshness?
# .inblog/config.json                     — D4S/Gemini configured?

# 3. Blog content state (use cache if fresh)
# cache/posts.json                        — how many posts? last publish date?

# 4. Draft posts
inblog posts list --draft --limit 10 --json

# 5. Performance (use cache if fresh)
# cache/analytics.json                    — traffic trend?
# cache/gsc-keywords.json                 — keyword opportunities?
```

## Phase 2 — Prioritize

Evaluate conditions top-to-bottom. **Stop at the first match** — that's the action to take.

| Priority | Condition | Action | Skill |
|----------|-----------|--------|-------|
| P0 | Not authenticated | Guide auth setup | `inblog-setup-blog` |
| P1 | No `strategy.md` | Run blog strategy | `inblog-blog-strategy` |
| P2 | No `business.md` | Collect business profile | `inblog-blog-strategy` (Phase 2.5) |
| P3 | No author profiles | Collect author profiles | `inblog-blog-strategy` (Phase 2.5) |
| P4 | D4S not configured + user hasn't declined | Suggest D4S setup | Explain value, guide config |
| P5 | No content plan (or latest plan fully executed) | Create content plan | `inblog-content-plan` |
| P6 | Cache expired (posts, analytics, keywords) | Refresh data | Data collection |
| P7 | Plan has unwritten P1 posts | Write next P1 post | `inblog-write-seo-post` |
| P8 | Draft posts pending review | Quality check | `inblog-content-quality-checklist` |
| P9 | Reviewed drafts ready to publish | Publish | `inblog-manage-posts` |
| P10 | Plan has unwritten P2 posts | Write next P2 post | `inblog-write-seo-post` |
| P11 | All planned posts written + 7+ days since last analysis | Performance review | `inblog-check-analytics` |
| P12 | Analytics show issues (low CTR, low CVR) | Optimize existing posts | `inblog-manage-posts` |
| P13 | All caught up | Suggest next planning cycle | `inblog-content-plan` |

## Phase 3 — Execute

**Present the diagnosis first**, then act:

```
📊 Blog Status: {subdomain}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Strategy:     ✅ Defined (last updated: 2026-02-15)
Business:     ✅ Profiled (12 features mapped)
Authors:      ✅ 2 profiles
Content Plan: ✅ March 2026 (3/8 posts written)
Cache:        ✅ Fresh (updated 2 days ago)
Drafts:       1 pending review
Published:    47 posts (last: 3 days ago)
Traffic:      ↑ 12% vs last month
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 Recommended action: Write the next P1 post from your March plan.

Next post: "CI/CD 비용 절감 실전 가이드"
- Keyword: ci/cd cost reduction (vol: 2.4k, KD: 28)
- Enrichment: Team has 60% cost reduction case study
- Author: @kim (DevOps expertise)

Proceed?
```

Wait for user confirmation before executing. The user may:
- **Agree** → Execute the recommended action using the appropriate skill
- **Skip** → Move to next priority item
- **Override** → Do something else entirely
- **Ask "why?"** → Explain the reasoning behind the recommendation

## Status Mode

When invoked with `/autopilot status`, show the full diagnostic without executing any action:

```
📊 Blog Health Report: {subdomain}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Foundation
  Strategy:     ✅ (2026-02-15)
  Business:     ✅ (12 features)
  Authors:      ✅ (2 profiles)
  Config:       ⚠️ D4S not configured

Content Pipeline
  Plan:         March 2026 — 3/8 written
  Next P1:      "CI/CD 비용 절감 실전 가이드"
  Drafts:       1 pending review
  Stale drafts: 0

Performance (last 28 days)
  Published:    47 posts
  Traffic:      12,340 visits (↑ 12%)
  Top post:     "K8s Monitoring Guide" (2,100 visits)
  Opportunity:  "ci/cd cost" — impressions high, position 14

Cache Freshness
  Posts:        ✅ 2 days old (TTL: 7d)
  Analytics:    ✅ 2 days old (TTL: 7d)
  GSC:          ⚠️ 8 days old (expired)
  D4S:          ❌ Not configured

Recommended next actions (in order):
  1. Write P1: "CI/CD 비용 절감 실전 가이드"
  2. Review draft: "GraphQL vs REST 비교"
  3. Refresh GSC keyword data
```

## Decision Logic Details

### How "next post to write" is chosen:
1. Read latest plan from `.inblog/{subdomain}/plans/`
2. Cross-reference with published posts (from cache) by title/keyword matching
3. Find first unwritten P1, then P2, then P3
4. If the post has enrichment notes, include them in the writing brief

### How "optimization opportunities" are identified:
1. From analytics cache: posts with high traffic but low CVR → CTA improvement
2. From GSC cache: keywords with high impressions but position > 10 → content refresh
3. From GSC cache: pages with low CTR → meta_description improvement

### When to suggest a new planning cycle:
- All posts in current plan are written AND published
- OR current plan is > 30 days old
- OR significant new data (traffic spike, new keyword opportunities)

## Integration Points

This skill reads from and delegates to ALL other skills:

| Skill | Autopilot reads | Autopilot delegates |
|-------|----------------|-------------------|
| `blog-strategy` | strategy.md, business.md, authors/ | Foundation setup |
| `content-plan` | plans/*.md | Planning cycles |
| `write-seo-post` | — | Post writing (with enrichment) |
| `content-quality-checklist` | — | Draft review |
| `manage-posts` | — | Publishing, optimization |
| `check-analytics` | cache/analytics.json, cache/gsc-keywords.json | Performance review |
| `image-sourcing` | — | Via write-seo-post |
| `setup-blog` | — | Initial setup |

## Guardrails

- **Never auto-publish** — always require user confirmation for publishing
- **Never skip enrichment** — if a planned post has enrichment notes, present them before writing
- **Never override user** — recommendations are suggestions, not commands
- **One action per invocation** — resist the urge to chain actions
- **Show reasoning** — always explain WHY this is the recommended action
