---
name: inblog-setup-blog
description: "Blog setup and configuration health check. Triggers: '인블로그 셋업', '블로그 시작', '블로그 설정', 'blog setup', 'setup blog'"
---

# Smart Blog Setup Workflow

## Prerequisites

This workflow performs initial setup or configuration health check for an inblog blog.

## Workflow

### Step 1: CLI Installation Check

```bash
# Check CLI installation
inblog --version

# If not installed
npm install -g @inblog/cli
```

### Step 2: Authentication

```bash
# Check auth status
inblog auth status

# If not authenticated — auto-selects if only one blog
inblog auth login

# Multiple blogs — use --blog to avoid interactive prompt
inblog auth login --blog <id or subdomain>
```

> **AI agent note**: `inblog auth login` includes an interactive blog selection prompt.
> In AI environments, always use `--blog` option, or after login use `inblog blogs switch <id>`.

### Step 2-A: Blog Switching (multiple blogs)

```bash
# List owned blogs
inblog blogs list

# Switch blog (ID or subdomain) — non-interactive
inblog blogs switch 123
inblog blogs switch my-subdomain
```

### Step 3: Blog Status Parsing

```bash
inblog blogs me --json
```

Parse response to output health check:

```
Blog configuration status:
✅ Title: "My Blog"
✅ Description: Set
❌ Logo: Not set
❌ Favicon: Not set
✅ Language: ko
✅ Timezone: +9
❌ OG Image: Not set
❌ GA: Not connected
❌ Custom domain: Not set
❌ Search Console: Not connected
❌ Banner: Not set
```

Additional checks:
```bash
inblog tags list     # Tag count
inblog authors list  # Author count
```

### Step 4: Configuration

"Which settings would you like to configure?" → Based on user choice:

#### Logo/Favicon/OG Image
```bash
# Local file support (auto CDN upload)
inblog blogs update --logo ./logo.png
inblog blogs update --favicon ./favicon.ico
inblog blogs update --og-image ./og.jpg

# URL also works
inblog blogs update --logo https://example.com/logo.png
```

#### Google Analytics
Request GA4 measurement ID (G-XXXXXXXXXX) from user:
```bash
inblog blogs update --ga-id G-XXXXXXXXXX
```

#### Search Console
```bash
inblog search-console connect
```

#### Custom Domain
```bash
inblog blogs domain connect blog.example.com
# Outputs DNS record instructions
inblog blogs domain status  # Check DNS propagation
```

#### Banner
```bash
# Local file support (auto CDN upload)
inblog blogs banner set --image ./banner.png --title "Blog Title" --subtext "Description"
```

#### Tags
```bash
inblog tags create --name "TagName" --slug "tag-slug"
```

### Step 5: Dashboard-Only Settings

Provide dashboard links for settings not available via CLI:

| Setting | URL |
|---------|-----|
| Custom UI details | `https://inblog.ai/dashboard/{subdomain}/custom-ui` |
| Team members | `https://inblog.ai/dashboard/{subdomain}/settings/staff` |
| Form management | `https://inblog.ai/dashboard/{subdomain}/forms` |
| Billing/plan | `https://inblog.ai/dashboard/{subdomain}/settings/billing` |

### Step 6: Blog Strategy

After setup is complete, suggest:
```
Blog setup complete! Next recommended step:
→ Run /blog-strategy to define your content strategy, target personas, and brand voice.
```

### Step 7: Completion

Run final health check again to show improvement status.

## Notes

- Team plan or higher required for CLI usage
- Images accept local file paths or external URLs (auto CDN upload)
- Search Console connection requires Google account OAuth
