---
name: inblog-internal-linking
description: "Internal link discovery, suggestion, and audit. Triggers: '내부 링크', '인터널 링킹', '고아 페이지', 'internal linking', 'orphan pages', 'link audit'"
---

# Internal Linking Workflow

Discover, suggest, and insert internal links across blog posts. Internal linking is the foundation of topic cluster architecture (hub + spoke) and is identified as a high-value automation target.

**User-invocable:** `/internal-linking <post-id>`, `/internal-linking audit`

## Prerequisites

```bash
inblog auth whoami --json
inblog blogs me --json  # → subdomain
```

## Workflow Modes

### Mode 1: Single Post Optimization

Suggest and insert internal links for a specific post.

#### Step 1: Build Topic Map

```bash
# Fetch all published posts (use cache: .inblog/{subdomain}/cache/posts.json, TTL 7d)
inblog posts list --published --limit 100 --page 1 --include tags --json
# → Paginate until all fetched
```

For each post, extract:
- ID, title, slug, tags, target keyword (from content plan if available)
- Key topics/themes (from H2 headings in content_html)

#### Step 2: Analyze Target Post

```bash
inblog posts get <post-id> --include tags,authors --json
```

Parse `content_html` to extract:
- H2/H3 headings (topic sections)
- Existing internal links (avoid duplicates)
- Natural anchor text candidates (relevant phrases, keyword mentions)

#### Step 3: Find Related Posts

Score relevance between the target post and all other posts:

| Signal | Score |
|--------|-------|
| Shared tags | +3 per shared tag |
| Title keyword overlap | +2 per overlapping keyword |
| Same content pillar (from strategy) | +3 |
| H2 topic overlap | +2 per matching topic |
| Already links to target (reverse link) | +1 (reciprocal link opportunity) |

Rank by relevance score. Top 5-10 posts are link candidates.

#### Step 4: Generate Suggestions

For each candidate, suggest:

```
Suggested Internal Links for "{target post title}":

1. → "Kubernetes 모니터링 가이드" (/kubernetes-monitoring-guide)
   Anchor text: "쿠버네티스 모니터링 도구"
   Insert after: H2 "인프라 모니터링" section
   Relevance: shared tag "DevOps", topic overlap

2. → "CI/CD 파이프라인 구축 방법" (/cicd-pipeline-setup)
   Anchor text: "CI/CD 파이프라인 구축 가이드"
   Insert after: paragraph mentioning deployment
   Relevance: same pillar "DevOps Best Practices"

3. ← FROM "Docker 컨테이너 가이드" (/docker-container-guide) → this post
   Anchor text: "{target post keyword}"
   Note: That post mentions our topic but doesn't link here (inbound opportunity)

Add these links? (y/n/select specific ones)
```

#### Step 5: Insert Links (with confirmation)

```bash
# Read current content
inblog posts get <post-id> --json
# → Parse content_html

# Insert links at suggested positions
# → Build updated content_html with <a href="/{slug}">anchor text</a>

# Update post
inblog posts update <post-id> --content-file ./updated-content.html --skip-preview
```

### Mode 2: Full Site Audit

Scan all posts for linking opportunities and health issues.

```bash
# Invoke with: /internal-linking audit
```

#### Step 1: Build Link Graph

For all published posts, parse `content_html` and extract:
- All internal `<a href>` links (target slug/URL)
- Build a directed graph: post A → post B

#### Step 2: Detect Issues

| Issue | Detection | Severity |
|-------|-----------|----------|
| **Orphan pages** | Posts with 0 inbound internal links | High |
| **Dead ends** | Posts with 0 outbound internal links | Medium |
| **Broken links** | Internal links pointing to non-existent slugs | High |
| **Cluster gaps** | Posts in same pillar/tag not linked to each other | Medium |
| **Over-linked** | Posts with 10+ internal links (dilution risk) | Low |

#### Step 3: Generate Audit Report

```
🔗 Internal Linking Audit: {subdomain}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total posts: 47
Average internal links per post: 2.3

Issues Found:
  🔴 Orphan pages (0 inbound links): 5
     - "API 문서 작성법" (ID: 15)
     - "Redis 캐싱 전략" (ID: 22)
     - "팀 온보딩 가이드" (ID: 33)
     - "로그 모니터링 베스트 프랙티스" (ID: 38)
     - "마이크로서비스 통신 패턴" (ID: 41)

  🟡 Dead-end pages (0 outbound links): 3
     - "회사 소개" (ID: 1)
     - "서비스 약관" (ID: 2)
     - "최신 릴리즈 노트" (ID: 45)

  🔴 Broken internal links: 1
     - Post ID 12 links to "/old-slug" (404)

  🟡 Cluster gaps: 2 pillar groups
     - "DevOps" pillar: 8 posts, only 3 cross-linked
     - "AI/ML" pillar: 5 posts, only 1 cross-linked

Fix orphan pages first? (highest SEO impact)
```

#### Step 4: Batch Fix Suggestions

For each orphan page, auto-suggest which existing posts should link TO it:
- Find posts with related topics/tags
- Suggest anchor text + insertion point
- Offer batch application with confirmation

## Link Quality Rules

- **Anchor text:** Use natural, descriptive text (not "click here" or bare URLs)
- **Variety:** Vary anchor text across different linking posts (avoid exact-match repetition)
- **Relevance:** Only link when genuinely relevant to the reader at that point
- **Position:** Prefer links in body paragraphs over navigation sections
- **Max links per post:** 5-8 internal links recommended (avoid over-linking)
- **Reciprocal:** For high-value posts, create bidirectional links when natural
- **No self-links:** Never link a post to itself

## Integration Points

- **write-seo-post** → Phase 2 "internal links" field in content plan provides link targets
- **autopilot** → triggers audit mode at P12.9 when orphan pages detected
- **content-refresh** → check/update internal links during refresh
- **content-cannibalization** → after merging posts, update all internal links pointing to the removed post
- **content-plan** → "Internal links" field in plan items pre-identifies cross-link targets

## Guardrails

- **Never modify published content without confirmation**
- **Show before/after diff** when inserting links
- **Don't break existing links** — only add new ones
- **Respect content_html structure** — insert `<a>` tags only inside `<p>` elements, not in headings or custom blocks
