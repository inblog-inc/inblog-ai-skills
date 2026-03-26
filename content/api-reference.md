---
name: inblog-api-reference
description: "Complete inblog API reference. Endpoints, fields, filters, error codes. Triggers: 'API 레퍼런스', 'API reference'"
---

# inblog API Reference

Base URL: `https://inblog.ai/api/v1`

## Authentication

All requests require `Authorization: Bearer <API_KEY>` header.
- GET requests: Send only `Accept: application/vnd.api+json`
- POST/PATCH requests: `Content-Type: application/json` + `Accept: application/vnd.api+json`
- Paid plan blogs only have API access

### CLI Usage
```bash
inblog auth login                      # OAuth login (interactive blog selection)
inblog auth login --blog my-subdomain  # OAuth login + specify blog (non-interactive)
inblog auth status --json              # Check current auth status
inblog auth logout                     # Remove session
```

### Key Priority
1. `--api-key` flag
2. `INBLOG_API_KEY` environment variable
3. `.inblogrc.json` (project-local)
4. `~/.config/inblog/config.json` (global)

## Permission Scopes

| Scope | Description |
|-------|-------------|
| `posts:read` | Read posts |
| `posts:write` | Create/update/publish posts |
| `posts:delete` | Delete posts |
| `tags:read` | Read tags |
| `tags:write` | Create/update tags |
| `tags:delete` | Delete tags |
| `authors:read` | Read authors |
| `authors:write` | Update authors |
| `blogs:read` | Read blog info |
| `blogs:write` | Update blog settings |
| `redirects:read` | Read redirects |
| `redirects:write` | Create/update/delete redirects |
| `forms:read` | Read forms |
| `form_responses:read` | Read form responses |

---

## Endpoint Details

### Posts

```bash
# List (pagination + filter + sort)
inblog posts list --page 1 --limit 10 --sort published_at --order desc --include tags,authors --json
inblog posts list --published --tag-id 5 --json
inblog posts list --draft --author-id "uuid" --json

# Get single
inblog posts get <id> --include tags,authors --json

# Create (--image for cover image, local files auto-upload)
inblog posts create --title "Title" --slug "slug" --image ./cover.jpg --content-file /tmp/content.html --json

# Update
inblog posts update <id> --title "New Title" --image ./new-cover.jpg --json

# Delete
inblog posts delete <id> --json

# Publish/Unpublish/Schedule
inblog posts publish <id> --json
inblog posts unpublish <id> --json
inblog posts schedule <id> --at "2025-03-15T09:00:00+09:00" --json

# Preview
inblog posts preview <id> --json                              # Generate preview link
inblog posts preview <id> --ttl 72 --json                     # Custom TTL (hours)
inblog posts preview <id> --one-time --json                   # One-time use link
inblog posts preview <id> --name "for-review" --json          # Named link
inblog posts preview list <id> --json                         # List active tokens
inblog posts preview revoke <token> --json                    # Revoke token
```

**List Filter Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `--page` | number | Page number (default: 1) |
| `--limit` | number | Items per page (default: 10, max: 100) |
| `--sort` | string | Sort field: `published_at`, `created_at`, `updated_at`, `title` |
| `--order` | string | `asc` or `desc` (default: desc) |
| `--published` | flag | Published posts only |
| `--draft` | flag | Drafts only |
| `--tag-id` | number | Filter by specific tag ID |
| `--author-id` | string | Filter by specific author ID (UUID) |
| `--include` | string | Include relationships: `tags`, `authors`, `tags,authors` |

**Post Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Post title (under 60 chars recommended) |
| `slug` | string | Yes | URL slug (lowercase, numbers, hyphens only) |
| `description` | string | | Post summary |
| `content_html` | string | | Body HTML (see inblog-content-html) |
| `content_type` | string | | `"tiptap"` (default) or `"notion"` |
| `published` | boolean | | Publication status |
| `published_at` | ISO 8601 | | Publication time |
| `image` | object | | `{ url, blurhash?, created_at? }` |
| `canonical_url` | string | | Canonical URL (when original exists elsewhere) |
| `notion_url` | string | | Notion page URL |
| `meta_title` | string | | SEO title (for og:title) |
| `meta_description` | string | | SEO description (150-160 chars recommended) |
| `cta_text` | string | | CTA button text |
| `cta_link` | string | | CTA click URL |
| `cta_color` | string | | CTA button color (hex) |
| `cta_text_color` | string | | CTA text color (hex) |
| `custom_scripts` | object | | `{ head_start_script, head_end_script, body_start_script, body_end_script, json_ld_script }` |
| `tag_ids` | number[] | | Connect tags on creation |
| `author_ids` | string[] | | Connect authors on creation |

**ID Type**: Post ID is integer (returned as string)

### Post-Tag Relationships

```bash
inblog posts tags <postId> --json                        # List post's tags
inblog posts add-tags <postId> --tag-ids 1,2,3 --json    # Add tags
inblog posts remove-tag <postId> <tagId> --json          # Remove tag
```

### Post-Author Relationships

```bash
inblog posts authors <postId> --json                              # List post's authors
inblog posts add-authors <postId> --author-ids uuid1,uuid2 --json # Add authors
inblog posts remove-author <postId> <authorId> --json             # Remove author
```

### Tags

```bash
inblog tags list --json       # All tags (no pagination, sorted by priority)
inblog tags get <id> --json
inblog tags create --name "Tag Name" --slug "tag-slug" --priority 0 --json
inblog tags update <id> --name "New Name" --json
inblog tags delete <id> --json
```

**Tag Fields:**

| Field | DB Field | Description |
|-------|----------|-------------|
| `name` | `title` | Tag name (exposed as name in API) |
| `slug` | `slug` | URL slug |
| `priority` | `priority` | Sort priority (lower = first) |

**ID Type**: Integer (returned as string)

### Authors

```bash
inblog authors list --page 1 --limit 10 --json
inblog authors get <id> --json
inblog authors update <id> --name "New Name" --avatar-url "https://..." --json
```

**Notes:**
- `create` not implemented (server returns `NOT_IMPLEMENTED`)
- Only returns profiles that have posts in the blog
- System authors (HelloInblogID) are auto-filtered
- **ID Type**: UUID

### Blogs

```bash
inblog blogs me --json         # My blog info
inblog blogs list              # List accessible blogs (OAuth)
inblog blogs switch [id]       # Switch blog (ID or subdomain, interactive if omitted)
inblog blogs update --title "New Blog Name" --language "ko" --json
inblog blogs update --logo ./logo.png --favicon ./favicon.ico --og-image ./og.jpg --json
inblog blogs update --ga-id <id> --json
```

**Blog Fields:**

| Field | Description |
|-------|-------------|
| `id` | Blog ID (integer) |
| `title` | Blog name |
| `subdomain` | Subdomain (also used as ID) |
| `description` | Blog description |
| `custom_domain` | Custom domain |
| `custom_domain_verified` | Domain verification status |
| `blog_language` | Blog language (ko, en, etc.) |
| `timezone_diff` | Timezone offset (hours) |
| `plan` | Pricing plan |
| `logo_url` | Logo URL |
| `favicon` | Favicon URL |
| `og_image` | Default OG image URL |
| `ga_measurement_id` | Google Analytics measurement ID |
| `is_search_console_connected` | Search Console connection status |
| `search_console_url` | Search Console site URL |

### Custom Domain

```bash
inblog blogs domain connect <domain>   # Connect domain + DNS record guide
inblog blogs domain status             # Check domain verification status
inblog blogs domain disconnect         # Disconnect domain
```

### Banner

```bash
inblog blogs banner get                # Check current banner settings
inblog blogs banner set --image ./banner.png --title <text> --subtext <text> --title-color <hex> --bg-color <hex>
inblog blogs banner remove             # Remove banner
```

### Search Console

```bash
inblog search-console connect          # Google Search Console OAuth connection
inblog search-console status           # Check connection status
inblog search-console disconnect       # Disconnect
inblog search-console keywords --start-date 2026-02-01 --end-date 2026-03-01 --sort clicks --limit 20 --json
inblog search-console pages --start-date 2026-02-01 --end-date 2026-03-01 --sort clicks --limit 20 --json
```

**Keyword/Page Sort:** `clicks`, `impressions`, `ctr`, `position`

### Traffic Analytics

```bash
# Blog overall traffic
inblog analytics traffic --interval day --type all --json

# Post-level performance
inblog analytics posts --sort visits --order desc --limit 20 --include title --json

# Referrer sources
inblog analytics sources --limit 20 --json

# Individual post traffic
inblog analytics post <id> --interval day --json

# Individual post referrer sources
inblog analytics post <id> --sources --json
```

**Date defaults:** `--start-date` 28 days ago, `--end-date` today
**Traffic sort:** `visits`, `clicks`, `organic`, `cvr`
**Interval:** `day` (default), `hour`
**Type filter:** `all`, `home`, `post`, `category`, `author`

### Redirects

```bash
inblog redirects list --page 1 --limit 50 --json
inblog redirects get <id> --json
inblog redirects create --from "/old-path" --to "/new-path" --type 308 --json
inblog redirects update <id> --to "/newer-path" --json
inblog redirects delete <id> --json
```

- `redirect_type`: `307` (temporary) or `308` (permanent, default)
- Paths are auto-normalized (leading `/` added, etc.)
- Duplicate `from_path` returns `REDIRECT_PATH_CONFLICT` (409)
- **ID Type**: UUID

### Forms

```bash
inblog forms list --page 1 --limit 10 --json
inblog forms get <id> --json
```

### Form Responses

```bash
inblog form-responses list --form-id <id> --page 1 --limit 10 --json
inblog form-responses get <id> --json
```

---

## Response Format (JSON:API)

### Single Resource
```json
{
  "jsonapi": { "version": "1.0" },
  "data": {
    "type": "posts",
    "id": "123",
    "attributes": { "title": "..." },
    "relationships": { "tags": { "data": [{ "type": "tags", "id": "1" }] } },
    "links": { "self": "/v1/posts/123" }
  },
  "included": [{ "type": "tags", "id": "1", "attributes": { "name": "..." } }]
}
```

### Collection
```json
{
  "jsonapi": { "version": "1.0" },
  "data": [{ ... }],
  "included": [{ ... }],
  "meta": { "total": 150, "page": 1, "limit": 10, "totalPages": 15 }
}
```

### CLI `--json` Output
CLI converts JSON:API to flat objects:
```json
{
  "data": [
    { "id": "123", "title": "...", "slug": "...", "tags": [{ "id": "1", "name": "..." }] }
  ],
  "meta": { "total": 150, "page": 1, "limit": 10, "hasNext": true }
}
```

---

## Image Handling

### CLI Image Upload

```bash
# Upload image files to CDN → returns URL
inblog images upload ./photo1.jpg ./photo2.png
inblog images upload ./cover.jpg -b featured_image --json

# Direct local file in post create/update (auto-upload)
inblog posts create --title "Title" --image ./cover.jpg --content-file ./content.html
inblog posts update <id> --image ./new-cover.jpg

# Blog logo/favicon/OG also support local files
inblog blogs update --logo ./logo.png --favicon ./favicon.ico --og-image ./og.jpg
inblog blogs banner set --image ./banner.png --title "Title"
```

**Warning:** Embedding base64 data URIs directly in `content_html` causes 413 errors.
- With `--content-file`: local paths/base64 → auto CDN upload
- Manual HTML: upload via `inblog images upload` first, then use returned URL

### API Image Processing Rules

1. **External URL** → auto-uploaded to inblog R2 storage by default
2. **Base64** (`data:image/...;base64,...`) → always uploaded to R2 (max 10MB)
3. **inblog CDN** (`source.inblog.dev`, `image.inblog.dev`) → kept as-is
4. `preserve_external_images=true` → keep original external URLs

Images within `content_html` follow the same rules (parsed via JSDOM).

---

## Error Codes

| HTTP | Code | Meaning | Resolution |
|------|------|---------|-----------|
| 400 | `VALIDATION_ERROR` | Missing required fields / format error | Check request |
| 400 | `INVALID_SLUG` | Invalid slug format | Use lowercase + numbers + hyphens only |
| 400 | `INVALID_DATE` | ISO 8601 date format error | Fix date format |
| 400 | `PAST_SCHEDULED_DATE` | Schedule date is in the past | Use a future date |
| 400 | `INVALID_TAG_IDS` | Non-existent tag IDs | Check tag list |
| 400 | `INVALID_AUTHOR_IDS` | Author not a blog member | Check author list |
| 400 | `INVALID_NOTION_URL` | Invalid Notion URL format | Must be notion.so domain |
| 401 | `UNAUTHORIZED` | Missing/invalid auth header | Check API key |
| 401 | `INVALID_TOKEN` | API key is invalid | Issue new key |
| 403 | `SUBSCRIPTION_REQUIRED` | Free plan blog | Upgrade to paid plan |
| 403 | `BLOG_MISMATCH` | Accessing another blog's resource | Use own blog resources only |
| 404 | `POST_NOT_FOUND` | Post not found | Check ID |
| 404 | `TAG_NOT_FOUND` | Tag not found | Check ID |
| 404 | `NOTION_PAGE_NOT_FOUND` | Cannot access Notion page | Check page sharing settings |
| 405 | `METHOD_NOT_ALLOWED` | HTTP method not supported | Check endpoint |
| 409 | `SLUG_CONFLICT` | Duplicate slug | Use a different slug |
| 409 | `TAG_NAME_CONFLICT` | Duplicate tag name | Use a different name |
| 409 | `REDIRECT_PATH_CONFLICT` | Duplicate redirect path | Use a different path |
| 500 | `INTERNAL_ERROR` | Server error | Retry |
| 501 | `NOT_IMPLEMENTED` | Unimplemented feature | Use alternative method |
| 502 | `NOTION_FETCH_FAILED` | Notion service issue | Retry |

## CLI Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | User error (auth failure, invalid input, etc.) |
| 2 | API error (server-returned error) |
