---
name: inblog-image-sourcing
description: "Blog image sourcing: Gemini generation, Unsplash, screenshots, HTML designs. Triggers: '이미지 추가', '커버 이미지', '카드뉴스', '인포그래픽', 'add image', 'cover image'"
---

# Image Sourcing Workflow

## Image Spec Quick Reference

- **Body image HTML:** `<img data-type="imageBlock" src="URL" alt="description" width="800">`
- **Cover/OG:** `image` field, 1200x630px recommended
- **CDN:** `source.inblog.dev` / `image.inblog.dev` (external URLs auto-uploaded to R2)

## CLI Image Upload

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

**Warning:** Embedding base64 data URIs directly in content_html causes 413 errors.
- With `--content-file`: local paths/base64 → auto CDN upload
- Manual HTML: upload via `inblog images upload` first, then use returned URL

## Decision Table

| Situation | Method | Example |
|-----------|--------|---------|
| Tool/service UI showcase | Method 3: Screenshot | Google Search Console screen |
| Mood/concept imagery | Method 2: Unsplash | Hero image, background |
| Text-heavy design (Korean) | Method 4: HTML→Screenshot | Card news, infographic, comparison |
| Custom illustration/diagram | Method 1: Gemini generation | Concept diagram, process flow |
| Data visualization | Method 4: HTML→Screenshot | Charts, stat cards |

---

## Method 1: Gemini Image Generation

### Prerequisites

- `GEMINI_API_KEY` environment variable set (paid plan) — or configured in `.inblog/config.json` → `gemini.apiKey`
- MCP server: `guinacio/claude-image-gen` (stdio transport)

### Setup

```bash
claude mcp add --transport stdio image-gen -- npx -y @anthropic-ai/claude-image-gen --provider gemini
```

Requires `GEMINI_API_KEY` environment variable.

### Prompt Guide

- **Blog illustration:** "A clean, modern illustration of [topic], flat design style, pastel colors, white background"
- **Concept diagram:** "A simple diagram showing [relationships], minimal style, labeled in English"
- **Icon/symbol:** "A single icon representing [concept], flat design, [color] on white background"

### Limitations

- Korean text accuracy ~75-80% → use **Method 4** when text matters
- Aspect ratio options: `1:1`, `16:9`, `4:3`, etc.

---

## Method 2: Unsplash Stock Images

### URL Pattern

```
https://images.unsplash.com/photo-{ID}?w=1200&h=630&fit=crop
```

### Keyword Mapping

| Topic | Unsplash Search Keywords |
|-------|------------------------|
| SEO/Marketing | marketing, analytics, data, growth |
| AI/Technology | technology, artificial intelligence, robot |
| Blog/Writing | writing, laptop, workspace, creative |
| Business | business, meeting, office, strategy |
| Startup | startup, team, innovation, launch |

### Usage

1. Search at `https://unsplash.com/s/photos/{keyword}`
2. Select image, copy URL
3. Append `?w=1200&h=630&fit=crop` parameters

### Notes

- Always include SEO keywords in `alt` text
- Best for: hero/cover images, mood setting, quick needs

---

## Method 3: Browser Screenshots

Uses browsermcp (pre-configured).

### Workflow

1. `browser_navigate` → navigate to target page
2. `browser_screenshot` → capture screenshot
3. Zoom/crop specific areas as needed
4. Insert image URL into inblog post

### Notes

- Check if login is required for the page
- Verify no sensitive info (passwords, PII) is visible
- Close unnecessary popups/banners before capture

---

## Method 4: HTML→Screenshot Design (Claude-designed)

### Use Cases

Card news, infographics, comparison cards, quote cards, stat cards, data visualization

### Workflow

1. Create HTML/CSS file (`/tmp/design.html`)
2. Open via browsermcp: `file:///tmp/design.html`
3. Capture screenshot
4. Insert into inblog post

### HTML Boilerplate

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Noto Sans KR', sans-serif; margin: 0; padding: 0; }
  </style>
</head>
<body>
  <!-- Content -->
</body>
</html>
```

### Templates

#### Card News (1080x1080)

```html
<div class="w-[1080px] h-[1080px] bg-gradient-to-br from-blue-600 to-purple-700 flex flex-col items-center justify-center p-16 text-white text-center">
  <div class="text-[120px] font-black mb-8">01</div>
  <h2 class="text-5xl font-bold mb-6 leading-tight">Key Message Here</h2>
  <p class="text-2xl opacity-80 max-w-[800px]">Supporting description text</p>
</div>
```

#### Comparison Card (1200x630)

```html
<div class="w-[1200px] h-[630px] bg-white flex">
  <div class="flex-1 bg-red-50 p-12 flex flex-col justify-center">
    <div class="text-red-500 text-xl font-bold mb-4">BEFORE</div>
    <h3 class="text-3xl font-bold text-gray-900 mb-4">Previous Approach</h3>
    <ul class="text-xl text-gray-600 space-y-3">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  </div>
  <div class="w-px bg-gray-200"></div>
  <div class="flex-1 bg-green-50 p-12 flex flex-col justify-center">
    <div class="text-green-500 text-xl font-bold mb-4">AFTER</div>
    <h3 class="text-3xl font-bold text-gray-900 mb-4">Improved Approach</h3>
    <ul class="text-xl text-gray-600 space-y-3">
      <li>Item 1</li>
      <li>Item 2</li>
      <li>Item 3</li>
    </ul>
  </div>
</div>
```

#### Process Diagram (1200x400)

```html
<div class="w-[1200px] h-[400px] bg-white flex items-center justify-center gap-4 p-12">
  <div class="flex-1 bg-blue-50 rounded-2xl p-8 text-center">
    <div class="text-blue-600 text-lg font-bold mb-2">STEP 1</div>
    <div class="text-xl font-bold text-gray-900">Description</div>
  </div>
  <div class="text-3xl text-gray-300">→</div>
  <div class="flex-1 bg-blue-50 rounded-2xl p-8 text-center">
    <div class="text-blue-600 text-lg font-bold mb-2">STEP 2</div>
    <div class="text-xl font-bold text-gray-900">Description</div>
  </div>
  <div class="text-3xl text-gray-300">→</div>
  <div class="flex-1 bg-blue-50 rounded-2xl p-8 text-center">
    <div class="text-blue-600 text-lg font-bold mb-2">STEP 3</div>
    <div class="text-xl font-bold text-gray-900">Description</div>
  </div>
  <div class="text-3xl text-gray-300">→</div>
  <div class="flex-1 bg-blue-600 rounded-2xl p-8 text-center">
    <div class="text-blue-200 text-lg font-bold mb-2">RESULT</div>
    <div class="text-xl font-bold text-white">Final Outcome</div>
  </div>
</div>
```

#### Quote/Stat Card (1200x630)

```html
<div class="w-[1200px] h-[630px] bg-gray-900 flex flex-col items-center justify-center p-16 text-center">
  <div class="text-8xl font-black text-blue-400 mb-6">73%</div>
  <h3 class="text-3xl font-bold text-white mb-4 max-w-[900px] leading-relaxed">Description of the key statistic</h3>
  <p class="text-xl text-gray-400">— Source: Research Organization, 2026</p>
</div>
```

---

## Cross-References

- `inblog-content-html` → `imageBlock` / `imageGrid` syntax
- `inblog-content-quality-checklist` → 3+ images requirement
- `inblog-write-seo-post` → references this skill during image sourcing phase
