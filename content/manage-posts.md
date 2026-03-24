---
name: inblog-manage-posts
description: "Post management: edit, publish, unpublish, schedule, delete. Triggers: '글 수정', '발행해줘', '비공개로', '글 삭제', 'edit post', 'publish', 'unpublish'"
---

# Post Management Workflow

## Prerequisites

- Verify auth/blog with `inblog auth status`
- If not authenticated: `inblog auth login --blog <id or subdomain>`
- Multiple blogs: `inblog blogs list --json` → `inblog blogs switch <id or subdomain>`
- Requires Team plan or higher

## Listing Posts

```bash
# All posts
inblog posts list

# Published only
inblog posts list --published

# Drafts only
inblog posts list --draft

# Filter by tag
inblog posts list --tag-id 123

# Post details
inblog posts get <id>
inblog posts get <id> --json
```

## Editing Posts

```bash
# Update title
inblog posts update <id> --title "New Title"

# Update meta info
inblog posts update <id> \
  --meta-title "SEO Title" \
  --meta-description "SEO Description"

# Update slug
inblog posts update <id> --slug "new-slug"

# Update content (local images/base64 auto-uploaded to CDN)
inblog posts update <id> --content-file ./updated-content.html

# Set cover image (local file or URL)
inblog posts update <id> --image ./cover.jpg
inblog posts update <id> --image https://source.inblog.dev/...
```

## Publish/Unpublish/Schedule

```bash
# Publish immediately
inblog posts publish <id>

# Unpublish (set to draft)
inblog posts unpublish <id>

# Schedule publication
inblog posts schedule <id> --at "2026-03-10T09:00:00Z"
```

## Tag/Author Management

```bash
# List tags on post
inblog posts tags <id>

# Add tags
inblog posts add-tags <id> --tag-ids 1,2,3

# Remove tag
inblog posts remove-tag <postId> <tagId>

# List authors on post
inblog posts authors <id>

# Add authors
inblog posts add-authors <id> --author-ids uuid1,uuid2

# Remove author
inblog posts remove-author <postId> <authorId>
```

## Deleting Posts

```bash
inblog posts delete <id>
```

Warning: Deletion is irreversible. Always confirm with the user before deleting.

## Providing Links

After completing operations, provide relevant links:

- **Editor:** `https://inblog.ai/dashboard/{subdomain}/{postId}`
- **Public URL:** `https://{subdomain}.inblog.io/{slug}`
- With custom domain: `https://{custom_domain}/{slug}`

## Error Handling

| Error Code | Resolution |
|-----------|-----------|
| POST_NOT_FOUND | Check post ID (`inblog posts list`) |
| SLUG_CONFLICT | Use a different slug |
| INVALID_TAG_IDS | Verify with `inblog tags list` |
| INVALID_AUTHOR_IDS | Verify with `inblog authors list` |
| PAST_SCHEDULED_DATE | Use a future date |
| SUBSCRIPTION_REQUIRED | Upgrade to Team plan |
