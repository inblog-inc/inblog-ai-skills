---
name: inblog-content-pruning
description: "Content audit and cleanup workflow. Identifies thin, dead, or low-value content for removal or consolidation. Triggers: '콘텐츠 정리', '콘텐츠 프루닝', '죽은 콘텐츠', 'content pruning', 'content audit', 'cleanup'"
---

# Content Pruning Workflow

Systematic content audit to identify and handle thin, dead, or low-value content. Pruning improves site health more than most teams expect — it focuses crawl budget, strengthens topical authority, and removes signals that dilute domain quality.

**User-invocable:** `/content-pruning`, `/content-pruning audit`

## Prerequisites

```bash
inblog auth whoami --json
inblog blogs me --json  # → subdomain
```

## Workflow

### Phase 1 — Full Content Audit

Collect all published posts with performance and structural data:

```bash
# 1. All published posts
inblog posts list --published --limit 100 --page 1 --include tags,authors --json
# → Paginate until all fetched

# 2. Analytics data (90+ days for reliable signals)
inblog analytics posts --sort visits --limit 200 --include title --json
# Consider: --start-date 90 days ago

# 3. GSC impressions
inblog search-console pages --sort impressions --limit 200 --json

# 4. Strategy for pillar mapping
# Read .inblog/{subdomain}/strategy.md
```

### Phase 2 — Pruning Candidacy Scoring

Score each post on pruning signals:

| Signal | Detection | Flag Weight |
|--------|-----------|-------------|
| **Zero traffic** | 0 visits in last 90 days (from analytics) | +3 |
| **Zero impressions** | 0 GSC impressions in last 90 days | +3 |
| **Thin content** | Content length < 1,500 characters (strip HTML tags) | +2 |
| **Orphan page** | 0 inbound internal links (requires link audit) | +2 |
| **No pillar match** | Cannot map to any content pillar from strategy.md | +1 |
| **No tags** | 0 tags connected | +1 |
| **No author** | No author_ids connected | +1 |

**Prune score** = sum of applicable flags (max 13).

**Threshold:**
- Score 7+ → Strong prune candidate
- Score 4-6 → Review candidate
- Score 0-3 → Keep (not a pruning candidate)

### Phase 3 — Categorize Candidates

For each candidate above threshold, recommend an action:

| Category | Criteria | Action |
|----------|----------|--------|
| **DELETE** | Zero traffic + zero impressions + thin + no backlinks | Remove entirely |
| **CONSOLIDATE** | Has some content value but overlaps with a stronger post | Merge into stronger post + redirect |
| **REFRESH** | Has potential (some impressions, decent topic) but needs updating | Hand off to `inblog-content-refresh` |
| **NOINDEX** | Useful for users (e.g., internal docs) but shouldn't be in search index | Add noindex meta tag |

**Decision logic:**

```
IF zero traffic AND zero impressions AND thin content:
  → Check for external backlinks (manual check)
  → IF no backlinks → DELETE
  → IF has backlinks → CONSOLIDATE (preserve link equity via redirect)

IF some impressions but low/zero clicks:
  → REFRESH (improve content quality and meta_description)

IF decent content but overlaps with stronger post:
  → CONSOLIDATE

IF useful for users but not search-worthy:
  → NOINDEX
```

### Phase 4 — Present Recommendations

```
🧹 Content Pruning Audit: {subdomain}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total published posts: 47
Pruning candidates: 8

DELETE (3 posts):
  1. "테스트 포스트" (ID: 5) — Score: 10
     0 traffic, 0 impressions, 450 chars, no tags
  2. "임시 공지사항" (ID: 8) — Score: 9
     0 traffic, 0 impressions, 800 chars, orphan
  3. "이전 이벤트 안내" (ID: 14) — Score: 8
     0 traffic, 0 impressions, 1200 chars, no pillar

CONSOLIDATE (2 posts):
  4. "Git 기초 가이드" (ID: 19) — Score: 6
     → Merge into "Git 완벽 가이드" (ID: 34) which covers same topic better
     → Redirect /git-basics → /complete-git-guide
  5. "Docker 소개" (ID: 21) — Score: 5
     → Merge into "Docker 컨테이너 완벽 가이드" (ID: 37)

REFRESH (2 posts):
  6. "AWS Lambda 가이드" (ID: 25) — Score: 4
     → 200 impressions but 0 clicks (poor meta_description)
     → Hand off to content-refresh
  7. "API 설계 원칙" (ID: 29) — Score: 4
     → Some traffic but thin (1,400 chars)

NOINDEX (1 post):
  8. "팀 내부 프로세스" (ID: 40) — Score: 5
     → Internal docs, not search-worthy

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Proceed? (all / select / skip)
```

### Phase 5 — Execute (with confirmation per action)

#### DELETE:
```bash
# Confirm with user first
inblog posts delete <post-id>
```

#### CONSOLIDATE:
```bash
# 1. Read both posts
inblog posts get <weaker-id> --json
inblog posts get <stronger-id> --json

# 2. Extract unique content from weaker post
# 3. Merge into stronger post
inblog posts update <stronger-id> --content-file ./merged-content.html

# 4. Create redirect
inblog redirects create --from "/<weaker-slug>" --to "/<stronger-slug>" --type 308

# 5. Update internal links (via internal-linking skill)
# 6. Delete weaker post
inblog posts delete <weaker-id>
```

#### REFRESH:
```bash
# Hand off to content-refresh skill
# → /content-refresh <post-id>
```

#### NOINDEX:
```bash
# Add noindex via custom scripts
inblog posts update <post-id> --custom-scripts-file ./noindex-scripts.json
# Where noindex-scripts.json contains:
# { "head_start": "<meta name=\"robots\" content=\"noindex, follow\">" }
```

## Safety Checks Before Pruning

Before deleting or consolidating any post:

1. **Check for external backlinks** — if the post has backlinks from other sites, use redirect instead of delete
2. **Check for internal links** — update any internal links pointing to this post
3. **Check content plan** — ensure the post isn't planned for refresh
4. **Check historical value** — a post with zero recent traffic may have seasonal patterns (check 12-month view if available)
5. **User confirmation** — always confirm each delete/merge action individually

## Integration Points

- **autopilot** → can trigger this as part of periodic health maintenance
- **content-refresh** → refresh candidates are handed off to this skill
- **internal-linking** → audit mode detects orphan pages that may be pruning candidates
- **content-cannibalization** → consolidation actions overlap; coordinate to avoid duplicate work

## Guardrails

- **Never auto-delete** — always require explicit user confirmation per post
- **Preserve redirects** — when deleting posts that had any traffic historically, create redirects
- **Batch limit** — process max 5 deletions per session to avoid mistakes
- **Undo window** — warn user that deletion is permanent (unpublish first if uncertain)
- **Report results** — after pruning, show summary of actions taken
