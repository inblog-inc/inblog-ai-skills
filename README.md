# @inblog/ai-skills

AI coding assistant skills for [inblog.ai](https://inblog.ai) blog management. Works with Claude Code, Cursor, GitHub Copilot, Codex, and Gemini.

## What It Does

Installs prompt-based skills into your AI coding tool so it can manage your inblog blog: write SEO posts, manage content, analyze traffic, upload images, and configure blog settings -- all through natural language.

## Installation

### Via skills.sh (recommended)

```bash
npx skills add inblog-inc/inblog-ai-skills
```

Supports 37+ AI coding tools including Claude Code, Cursor, Copilot, Windsurf, Cline, Codex, Gemini CLI, and more. See [skills.sh](https://skills.sh) for the full list.

> **Note:** After installing skills, you also need the CLI: `npm install -g @inblog/cli`

### Via npm

```bash
npx @inblog/ai-skills
```

Interactive setup that detects your installed AI tools and installs skills for each one. Also installs [`@inblog/cli`](https://www.npmjs.com/package/@inblog/cli) automatically.

```bash
npx @inblog/ai-skills --all                    # Install for all tools
npx @inblog/ai-skills --tools claude,cursor     # Install for specific tools
```

## Included Skills

### `write-seo-post`
Write and publish SEO-optimized blog posts. Guides through topic selection, outline, content generation, image sourcing, visual preview verification, and publishing via CLI.

### `manage-posts`
Edit, publish, unpublish, schedule, and delete posts. Update titles, slugs, meta descriptions, tags, authors, and cover images. Generate preview links to visually verify posts before publishing.

### `image-sourcing`
4 methods for sourcing blog images:
1. **Gemini generation** -- AI-generated illustrations (requires `GEMINI_API_KEY`)
2. **Unsplash** -- Stock photos for hero/cover images
3. **Browser screenshots** -- Capture tool UIs and web pages
4. **HTML to screenshot** -- Design infographics, comparison cards, and data visualizations with Tailwind CSS

### `content-html`
Complete reference for inblog's TipTap-based HTML format. Covers allowed tags, custom blocks (callouts, image grids, link buttons, YouTube embeds), and best practices.

### `setup-blog`
Blog setup and health check. Scans current config and guides through missing settings: logo, favicon, OG image, Google Analytics, Search Console, custom domain, banner.

### `check-analytics`
Traffic and SEO analysis workflows. Analyze top posts, keywords, traffic sources, and generate data-driven content suggestions.

### `api-reference`
Complete CLI and API reference. All endpoints, fields, filters, error codes, and response formats.

### `content-quality-checklist`
Pre-publish quality checklist: content length, image count, internal links, meta descriptions, SEO competitiveness criteria, and visual preview verification.

### `content-plan`
Strategic content editorial planning: topic clusters, funnel mapping, content gaps, competitive differentiation, and publication cadence.

### `blog-strategy`
Blog strategy definition: business purpose, target personas, content pillars, brand voice, and conversion goals.

### `autopilot`
Autonomous blog growth agent. Assesses blog state, prioritizes highest-impact action (from setup to content creation to performance review), and executes one atomic action per invocation.

## Workspace Structure

Skills use a `.inblog/` workspace directory in your project to persist context across conversations. Created automatically when you first use a skill.

```
.inblog/
├── config.json              # External service credentials (DataForSEO, Gemini)
├── {subdomain}/
│   ├── strategy.md          # Blog strategy (mission, personas, pillars, voice)
│   ├── business.md          # Business profile (features, pricing, USPs, CTA mapping)
│   ├── authors/
│   │   └── {author-id}.md   # Author profiles (expertise, writing style)
│   ├── plans/
│   │   └── 2026-03.md       # Monthly editorial calendars
│   └── cache/
│       ├── posts.json       # Published posts cache (TTL 7d)
│       ├── analytics.json   # Traffic data cache (TTL 7d)
│       └── gsc-keywords.json # Search Console keywords (TTL 7d)
```

- **Strategy & Business** -- Filled out via `blog-strategy` skill. Skills auto-read these to match your brand voice, target audience, and CTAs.
- **Author profiles** -- Writing style and expertise per author. Skills adapt tone and claim appropriate authority.
- **Content plans** -- Monthly editorial calendars from `content-plan`. Posts link back to planned topics.
- **Cache** -- API response snapshots with TTL-based expiration. Avoids redundant API calls. Force refresh with `--refresh`.

## Prerequisites

- [inblog.ai](https://inblog.ai) account with **Team plan** or higher
- API key from dashboard > Settings > API Keys
- Node.js 18+

## How It Works

1. `npx @inblog/ai-skills` copies markdown skill files to your AI tool's config directory
2. Your AI tool picks up the skills as available commands/rules
3. Ask your AI assistant to write posts, check analytics, set up your blog, etc.
4. The AI uses `@inblog/cli` commands under the hood

## Related

- [`@inblog/cli`](https://www.npmjs.com/package/@inblog/cli) -- CLI tool for inblog.ai
- [inblog.ai](https://inblog.ai) -- SEO-optimized blog platform

## License

MIT
