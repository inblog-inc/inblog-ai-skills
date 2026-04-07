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
| Text-heavy design (Korean) | Method 4: Design Studio | Card news, infographic, comparison |
| Custom illustration/diagram | Method 1: Gemini generation | Concept diagram, process flow |
| Data visualization (charts) | Method 4: Design Studio + D3 | Bar, donut, line, area charts |
| Stat cards / dashboards | Method 4: Design Studio | KPI cards, metric overviews |
| Card news series | Method 4: Design Studio | Multi-slide carousel |
| Collage hero / OG image | Method 4: Design Studio | Image + SVG + text layered |
| Timeline / roadmap | Method 4: Design Studio | Project phases, history |

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

## Method 4: Design Studio (Gemini + Playwright)

**Gemini generates HTML/CSS design code, Playwright renders it, Claude verifies.** Claude does NOT write design code — it only handles planning and verification.

### Architecture

```
Claude (plan)  →  Gemini API (HTML gen)  →  Playwright (render)  →  Claude (verify)
     ↑                                                                    |
     └──────────────── feedback (screenshot + fix instructions) ──────────┘
```

- **Claude**: Creative brief, brand check, verification, feedback loop
- **Gemini 3.1 Pro Preview**: HTML/CSS design code generation (Gemini owns the design taste)
- **Playwright**: HTML → PNG screenshot rendering

### Prerequisites

- `GEMINI_API_KEY` env var or `.inblog/config.json` → `gemini.apiKey`
- Playwright (`npx playwright install chromium`)

**Fallback (no Gemini API key):** If Gemini is unavailable, Claude generates HTML directly at Step 2. The same workflow applies (Steps 1→3→4→5→6). When writing HTML directly:
- Follow the Gemini System Prompt below as self-constraints (HARD RULES, ANTI-PATTERNS, QUALITY BAR)
- Follow the HTML Structure Rules below strictly — incorrect structure causes blank renders
- Run the Verify loop honestly — Claude tends to be lenient on its own output. Be harsh.

### Gemini System Prompt

System instruction sent to Gemini. **Use this prompt verbatim.**

```
You are a top-tier editorial designer. You create blog OG images and infographics as HTML/CSS that look like they belong on Linear.app, Vercel, Toss Tech Blog, or a premium design magazine.

HARD RULES (never break):
- Output ONLY complete HTML. No markdown, no explanation, no code fences.
- Canvas size will be specified per request. Include Tailwind CDN + Pretendard font CDN.
- Title must be 64px+ and dominate the image. Max 2 lines.
- Total text on OG images: title + 1 small label. That's it.
- Padding: 32-48px. This is an image, not a website.
- Pretendard CDN: https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css
- Tailwind CDN: https://cdn.tailwindcss.com

HTML STRUCTURE (critical — incorrect structure causes blank renders):
- body must have margin:0; padding:0; and NO height:100vh, NO display:flex centering.
- The design container div must be a DIRECT child of body, with explicit width and height.
- NO wrapper divs for centering. NO box-shadow on the canvas. The div IS the viewport.
- Correct structure:
  <body style="margin:0;padding:0">
    <div style="width:1200px;height:630px;position:relative;overflow:hidden;...">
      <!-- design content -->
    </div>
  </body>

ANTI-PATTERNS (avoid — they make designs look cheap):
- Industry clichés as the primary design direction (finance=navy+gold, beauty=pink, tech=dark+purple). You may use these colors if they genuinely serve the design, but don't default to them.
- Centered PowerPoint layouts. Prefer asymmetric, editorial compositions.
- Flat single-color backgrounds with no depth or texture.
- More than 3 colors.
- Decorative elements without structural purpose (dots, rings, glows, random shapes).
- Text shadows, outlines, emboss effects.
- Generic unprocessed stock photos.
- Tiny text. Nothing below 40px on a 1200x630 canvas.

QUALITY BAR:
- Every image should feel like a different designer made it, but all at the same professional level.
- The design should match the industry's audience expectations while feeling modern and fresh.
- Use the photo if provided — crop it intentionally with clip-path or object-position. Adjust brightness/saturation with CSS filters.
- Typography is the hero. Make it bold, make it big, make it considered.
```

---

### Workflow

#### Step 1: CREATIVE BRIEF (Claude)

Plan before generating code.

**1-A. Brand check (once per session)**

```bash
inblog blogs me --json
# → Get subdomain, custom_domain, logo_url
# → Visit actual blog URL to check tone, colors, existing image styles
```

**1-B. Per-image concept**

Compose the user prompt to send to Gemini. Include:

- Blog industry/context (one line)
- Post title
- Canvas size (1200x630, 1080x1080, etc.)
- Photo URL if applicable (sourced via Method 2 or 3)
- Blog brand tone if known ("light and warm", "modern dark", etc.)
- **Do NOT include implementation details (colors, layout specifics)** — Gemini decides

**Good user prompt examples:**
```
Korean fintech blog, modern and trustworthy tone.
Title: "2026 하반기 투자 전략 리포트"
Canvas: 1200x630px
No photo needed — typography-focused.
```

```
Korean beauty blog, warm and editorial feel.
Title: "여름 선크림 TOP 5 비교"
Canvas: 1200x630px
Photo (use on one side): https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=630&fit=crop
```

**Bad user prompt (don't do this):**
```
Navy background with gold accent, left-aligned title 72px, right side photo with circular clip-path...
```
↑ Dictating implementation makes the result look tacky. Give Gemini creative freedom.

#### Step 2: GENERATE (Gemini API)

```bash
curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key=$GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "system_instruction": {"parts": [{"text": "SYSTEM_PROMPT_HERE"}]},
    "contents": [{"parts": [{"text": "USER_PROMPT_HERE"}]}],
    "generationConfig": {"temperature": 1.0, "maxOutputTokens": 8192}
  }'
# → Extract HTML → save to /tmp/design-{name}.html
```

Or via Python:
```python
import urllib.request, json, re, os
api_key = os.environ["GEMINI_API_KEY"]
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-pro-preview:generateContent?key={api_key}"
body = json.dumps({
    "system_instruction": {"parts": [{"text": system_prompt}]},
    "contents": [{"parts": [{"text": user_prompt}]}],
    "generationConfig": {"temperature": 1.0, "maxOutputTokens": 8192}
}).encode()
req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"})
resp = json.loads(urllib.request.urlopen(req).read())
html = resp["candidates"][0]["content"]["parts"][0]["text"]
html = re.sub(r'^```(?:html)?\n?', '', html.strip())
html = re.sub(r'\n?```$', '', html.strip())
```

#### Step 3: RENDER (Playwright)

```bash
npx playwright screenshot --viewport-size="1200,630" --wait-for-timeout=3000 \
  file:///tmp/design-{name}.html /tmp/design-{name}.png
```

#### Step 4: VERIFY (Claude)

Read the screenshot and check against this list. **Any failure → go to Step 5.**

| # | Check | Criteria |
|---|-------|----------|
| 1 | **Title size** | Readable when shrunk to mobile? Occupies 40%+ of canvas? |
| 2 | **Fill ratio** | Content fills 75%+ of canvas? |
| 3 | **Colors** | Vibrant and modern? Not dull or cliché? |
| 4 | **Text contrast** | Text clearly distinguishable from background? |
| 5 | **Industry fit** | Would the target audience feel trust/relevance? |
| 6 | **Decoration** | No unnecessary decorative elements? |
| 7 | **Photo** | (if used) Intentionally cropped/treated? Contextually relevant? |
| 8 | **Pro standard** | Would you publish this on a professional blog? Not "it's fine" — "I want to use this"? |

#### Step 5: REFINE (Gemini API — screenshot feedback)

Send failed items with the **rendered screenshot image** back to Gemini:

```python
import base64
with open("/tmp/design-{name}.png", "rb") as f:
    img_b64 = base64.b64encode(f.read()).decode()

body = json.dumps({
    "contents": [{"parts": [
        {"inline_data": {"mime_type": "image/png", "data": img_b64}},
        {"text": "This is the rendered result. Problems:\n1. [specific issue]\n2. [specific issue]\n\nFix these issues. Output ONLY the complete fixed HTML."}
    ]}],
    "generationConfig": {"temperature": 0.8, "maxOutputTokens": 8192}
}).encode()
```

After fix, repeat Step 3 → Step 4. **Max 3 iterations.** If still failing after 3, go back to Step 1 and re-plan the concept.

#### Step 6: DELIVER

```bash
inblog images upload /tmp/design-{name}.png --json
# → Returns CDN URL

# Insert into post:
# OG/cover: inblog posts create --image /tmp/design-{name}.png ...
# Inline: <img data-type="imageBlock" src="CDN_URL" alt="..." width="800">
# Series: <div data-type="imageCarousel" data-images='[...]'></div>
```

---

### Image Sourcing (when photos are needed)

Source photo URLs before sending to Gemini. **Don't grab random stock photos.**

**Unsplash search strategy:**
- Use specific keywords ("saas dashboard on macbook") not abstract ("business")
- Search 3-4 different keyword variations to find the best match
- Consider composition: pick photos with empty space where text will go
- Use crop params: `?w=600&h=630&fit=crop&crop=right`

**Direct screenshots:**
- If the post discusses a specific tool/service → capture its actual UI via Method 3
- Real product screenshots have better contextual relevance than stock photos

**When no photo is better:**
- If you can't find a fitting photo, don't force one
- Strong typography alone > mediocre stock photo
- Law, finance, consulting often work better with type-only designs

### Multi-Slide (card news series)

1. **Lock design tokens**: Record colors/fonts Gemini used on the first slide
2. **Subsequent slides**: Tell Gemini "maintain the same design system as the previous slide"
3. **Run Verify loop per slide** — also check cross-slide consistency
4. **Batch upload**: `inblog images upload /tmp/slide-*.png`
5. **Insert**: Use `imageCarousel` in post content

---

## Auto Alt Text Generation

When uploading or inserting images into posts, automatically generate SEO-optimized alt text using Gemini vision.

### Workflow

1. **After image upload, before inserting into content_html**, send the image to Gemini for alt text generation:
   ```python
   import base64, json, urllib.request, os

   api_key = os.environ["GEMINI_API_KEY"]
   with open("/tmp/image.png", "rb") as f:
       img_b64 = base64.b64encode(f.read()).decode()

   body = json.dumps({
       "contents": [{"parts": [
           {"inline_data": {"mime_type": "image/png", "data": img_b64}},
           {"text": "Generate SEO-optimized alt text for this image. Target keyword for the post: \"{target_keyword}\". Rules: 1) Describe what the image shows. 2) Naturally include the target keyword if relevant — do not force it. 3) Add context about how it relates to the post topic. 4) Maximum 125 characters. 5) Do not start with 'Image of' or 'Photo of'. Output ONLY the alt text, nothing else."}
       ]}],
       "generationConfig": {"temperature": 0.3, "maxOutputTokens": 256}
   }).encode()

   url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
   req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"})
   resp = json.loads(urllib.request.urlopen(req).read())
   alt_text = resp["candidates"][0]["content"]["parts"][0]["text"].strip()
   ```

2. **Alt text quality rules:**
   - Descriptive: what the image actually shows (not generic)
   - Contextual: how it relates to the post's topic
   - Keyword-aware: naturally include the post's target keyword when relevant — do not force it
   - Maximum 125 characters
   - Do not start with "Image of" or "Photo of"

3. **Integration into image insertion:**
   - After uploading via `inblog images upload`, generate alt text before building the HTML tag
   - Use the generated alt text in the `alt` attribute:
     ```html
     <img data-type="imageBlock" src="CDN_URL" alt="{generated_alt_text}" width="800">
     ```
   - For cover/OG images: store the alt text for use in social sharing metadata

4. **Fallback (no Gemini API key):**
   - Write alt text manually based on the image context and target keyword
   - Format: `{what the image shows} — {post topic context}`
   - Example: `"Google Search Console performance dashboard showing keyword rankings"`

---

## Cross-References

- `inblog-content-html` → `imageBlock` / `imageGrid` syntax
- `inblog-content-quality-checklist` → 3+ images requirement
- `inblog-write-seo-post` → references this skill during image sourcing phase
