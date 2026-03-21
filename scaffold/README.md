# .inblog/ Workspace

This directory is managed by @inblog/ai-skills. It stores persistent context that AI skills use to produce better content.

## Structure

```
.inblog/
├── README.md              # This file
├── .gitignore             # Protects config.json from being committed
├── config.json            # API keys for external services (DataForSEO, Gemini, etc.)
├── assets/                # Shared resources (brand kit, style guides, logos)
│   └── .gitkeep
├── {subdomain}/           # Blog-scoped directory (auto-created per active blog)
│   ├── strategy.md        # Blog strategy (pillars, voice, CTA, competitors)
│   ├── business.md        # Business/product profile (features, pricing, USPs)
│   ├── authors/           # Author writing profiles
│   │   └── {author-id}.md # Per-author expertise, experience, style
│   ├── plans/             # Content plans & editorial calendars
│   │   ├── 2026-03.md
│   │   └── 2026-04.md
│   └── cache/             # Cached API data (auto-managed, TTL-based)
│       ├── posts.json     # All published posts metadata (TTL 7d)
│       ├── analytics.json # Post traffic data (TTL 7d)
│       ├── gsc-keywords.json    # Search Console keywords (TTL 7d)
│       ├── d4s-keywords.json    # DataForSEO keywords (TTL 14d)
│       └── d4s-competitors.json # DataForSEO competitors (TTL 14d)
└── {another-subdomain}/   # Another blog
    ├── strategy.md
    └── plans/
```

## config.json

Store API keys for external services used by AI skills:

```json
{
  "dataforseo": { "login": "your-login", "password": "your-password" },
  "gemini": { "apiKey": "your-api-key" }
}
```

- **DataForSEO** — keyword research, SERP analysis, competitor domain analysis
- **Gemini** — AI-powered image generation

> `config.json` is git-ignored by `.inblog/.gitignore`. Never commit API keys.

## How it works

- **Blog directories** are named by subdomain (e.g., `my-tech-blog/`, `company-news/`)
- **strategy.md** — blog direction, brand voice, target personas, content pillars
- **business.md** — product/service profile, features, pricing, CTA mapping
- **authors/{id}.md** — per-author expertise, experience, writing style
- **plans/** — monthly editorial calendars with enrichment notes
- **assets/** — shared brand guidelines, logos, and reference materials
- **cache/** — API response snapshots with TTL. Force refresh with `--refresh` flag or "데이터 새로 수집해줘"
