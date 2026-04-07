---
name: inblog-content-html
description: "Complete inblog content_html reference. Must read before generating post HTML. Triggers: 'HTML 레퍼런스', 'content html', 'HTML reference'"
---

# inblog content_html Complete Guide

inblog uses a TipTap-based editor. The `content_html` field must follow the same HTML structure produced by `editor.getHTML()`.

## Allowed Tags & Rules

### Headings
- `<h2>`, `<h3>`, `<h4>` **only**
- **h1, h5, h6 are not supported** — h1 is handled by the post title
- Must maintain heading hierarchy: h2 → h3 → h4

### Text
```html
<p>Paragraph text</p>
<strong>Bold</strong>
<em>Italic</em>
<u>Underline</u>
<s>Strikethrough</s>
<code>Inline code</code>
<a href="https://...">Link</a>     <!-- NEVER add rel attribute -->
<br>                                 <!-- Line break -->
```

### Block Elements
```html
<blockquote><p>Quote text</p></blockquote>
<hr>
<ul><li>Unordered list</li></ul>
<ol><li>Ordered list</li></ol>
<!-- Nesting supported -->
<ul>
  <li>Item 1
    <ul><li>Sub-item</li></ul>
  </li>
</ul>
```

### Text Styling
```html
<!-- Highlight -->
<mark data-color="#FBBF24" style="background-color: #FBBF24;">Highlighted</mark>

<!-- Text color -->
<span style="color: #EF4444;">Red text</span>

<!-- Alignment -->
<p style="text-align: center;">Centered</p>
<p style="text-align: right;">Right-aligned</p>
```

## Code Blocks

```html
<pre><code class="language-typescript">const hello: string = 'world';
console.log(hello);</code></pre>
```

**Supported language classes**: `language-javascript`, `language-typescript`, `language-python`, `language-bash`, `language-html`, `language-css`, `language-json`, `language-sql`, `language-go`, `language-rust`, `language-java`, `language-cpp`, `language-ruby`, `language-php`, `language-swift`, `language-kotlin`, `language-yaml`, `language-plaintext`, etc.

**Important**: Content inside code tags must be HTML-entity escaped (`<` → `&lt;`, `>` → `&gt;`, `&` → `&amp;`)

## Tables

```html
<table>
  <thead>
    <tr><th>Header 1</th><th>Header 2</th><th>Header 3</th></tr>
  </thead>
  <tbody>
    <tr><td>Cell 1</td><td>Cell 2</td><td>Cell 3</td></tr>
    <tr><td>Cell 4</td><td>Cell 5</td><td>Cell 6</td></tr>
  </tbody>
</table>
```

Column widths can be set via colwidth attribute. Automatic horizontal scrolling supported.

## Custom Blocks (data-type attribute)

### Callout (highlight box)
```html
<div data-type="callOut" data-emoji="💡" data-color="#EFF6FF">
  <p>Informational message</p>
</div>
```

| data-color | Purpose |
|-----------|---------|
| `#EFF6FF` | Info (blue) |
| `#FEF3C7` | Warning (yellow) |
| `#FEE2E2` | Danger (red) |
| `#ECFDF5` | Success (green) |
| `#F3F4F6` | Note (gray) |

data-emoji can be any emoji: 💡, ⚠️, ❌, ✅, 📌, 🔥, 💬, etc.

### Image
```html
<img data-type="imageBlock" src="https://source.inblog.dev/..." alt="Description" width="800">
```

**Important**: Image src must use inblog CDN (`source.inblog.dev` or `image.inblog.dev`).
External URLs are auto-uploaded to R2 by the server. Use `preserve_external_images=true` to keep originals.

### Image Grid
```html
<div data-type="imageGrid" data-images='[{"src":"url1","alt":"desc1"},{"src":"url2","alt":"desc2"}]'></div>
```

### Image Carousel
```html
<div data-type="imageCarousel" data-images='[{"src":"url1","alt":""},{"src":"url2","alt":""}]'></div>
```

### Link Button (CTA)
```html
<div data-type="linkButton" data-url="https://example.com" data-text="Click here"></div>
```

### Bookmark (link preview)
```html
<div data-type="bookmark" data-url="https://example.com"></div>
```

### YouTube Embed
```html
<div data-type="youtube" data-youtube-video-id="dQw4w9WgXcQ"></div>
```

### Form Embeds
```html
<div data-type="googleForm" data-form-id="FORM_ID"></div>
<div data-type="hubspot" data-form-id="FORM_ID"></div>
<div data-type="tally" data-form-id="FORM_ID"></div>
<div data-type="typeform" data-form-id="FORM_ID"></div>
```

### Custom HTML
```html
<div data-type="htmlCodeBlock"><p>Arbitrary HTML content</p></div>
```

## Security Rules
- `<script>` tags are **automatically removed** (XSS prevention)
- `<iframe>` only allowed for approved embed services
- External stylesheets blocked
- `rel` attribute on `<a>` tags is forbidden (nofollow auto-removed)

## AI Content Generation Best Practices

### Structure
1. All text must be wrapped in `<p>` tags — no bare text
2. Use `<h2>` for main sections, `<h3>` for subsections
3. Code must use `<pre><code class="language-*">`
4. Block elements laid out flat — no nesting custom blocks inside custom blocks
5. Content is a sequence of block elements: `<h2>`, `<p>`, `<pre>`, `<ul>`, `<blockquote>`, `<div data-type="...">`, etc.

### GEO-Native Content Structure

Content must be structured for AI citation (GEO = Generative Engine Optimization). These rules increase AI citation probability by 2.3x:

**1. Answer-first paragraphs** — Each H2 section's first `<p>` must be a self-contained answer (50-150 words) that makes sense when extracted independently.

```html
<!-- ❌ BAD: Filler intro -->
<h2>What Is Keyword Cannibalization?</h2>
<p>In the world of SEO, there are many concepts that website owners need to understand. One of the most important yet overlooked concepts is something called keyword cannibalization. Let's explore what this means.</p>

<!-- ✅ GOOD: Answer-first, self-contained (English) -->
<h2>What Is Keyword Cannibalization?</h2>
<p>Keyword cannibalization occurs when multiple pages on the same website compete for the same search query, causing Google to split ranking signals between them. This typically results in both pages ranking lower than a single consolidated page would. Studies show cannibalization can reduce organic traffic by 10-50% for affected keywords.</p>

<!-- ✅ GOOD: Answer-first, self-contained (Korean) -->
<h2>내부 링크란 무엇인가?</h2>
<p>내부 링크는 같은 웹사이트 내 다른 페이지로 연결하는 하이퍼링크를 말합니다. 검색 엔진은 내부 링크를 통해 사이트 구조를 이해하고, 페이지 간 권위(authority)를 분배합니다. Ahrefs 연구에 따르면 내부 링크가 3개 이상인 페이지는 그렇지 않은 페이지 대비 평균 40% 높은 순위를 기록합니다.</p>
```

**2. Self-contained chunks** — Each paragraph = one idea, independently extractable. 2-4 sentences per paragraph.

**3. Comparison content = tables** — Any comparison MUST include a `<table>`. Tables have 2.8x higher AI citation rate than prose comparisons.

```html
<!-- ❌ BAD: Comparison as prose -->
<p>Tool A costs $29/month and supports 10 users, while Tool B costs $49/month and supports unlimited users...</p>

<!-- ✅ GOOD: Comparison as table -->
<table>
  <thead>
    <tr><th>Feature</th><th>Tool A</th><th>Tool B</th></tr>
  </thead>
  <tbody>
    <tr><td>Price</td><td>$29/month</td><td>$49/month</td></tr>
    <tr><td>Users</td><td>10</td><td>Unlimited</td></tr>
  </tbody>
</table>
```

**4. Front-load statistics** — Place concrete numbers, data, and definitions in the top 30% of the post. 44.2% of ChatGPT citations come from the top 30% of content.

**5. Definition patterns** — Use explicit "X is [definition]" patterns. These are the most extractable format for AI systems.

### SEO
- Include primary keywords in H2/H3
- Short paragraphs (2-4 sentences per paragraph, 50-150 words per chunk)
- Use lists/bullets generously
- Include internal links
- Always add alt text to images

### CTA Insertion Patterns

**Pattern 1: Conclusion only** (informational posts)
```html
<h2>Conclusion</h2>
<p>Summary content...</p>
<div data-type="callOut" data-emoji="🚀" data-color="#EFF6FF">
  <p>Automate this process with <strong>ProductName</strong>.</p>
</div>
<div data-type="linkButton" data-url="https://..." data-text="Get started free"></div>
```

**Pattern 2: Mid-body + conclusion** (promotional posts)
```html
<!-- Soft CTA after relevant section -->
<div data-type="callOut" data-emoji="💡" data-color="#ECFDF5">
  <p>💡 <strong>ProductName</strong> can automate this process.</p>
</div>

<!-- Strong CTA in conclusion -->
<div data-type="linkButton" data-url="https://..." data-text="Start 14-day free trial"></div>
```

**Pattern 3: Native CTA** (natural mention)
```html
<p>Our team built <a href="https://product.com">ProductName</a> to solve this exact problem.
  Brief product description here.</p>
```

## Complete Post HTML Example

```html
<h2>Introduction</h2>
<p>Learn how to build a REST API with <strong>Node.js</strong>.</p>

<h2>Environment Setup</h2>
<p>First, install dependencies:</p>
<pre><code class="language-bash">npm install express typescript</code></pre>

<h3>Project Structure</h3>
<ul>
  <li><code>src/index.ts</code> — Entry point</li>
  <li><code>src/routes/</code> — Route handlers</li>
  <li><code>src/middleware/</code> — Middleware</li>
</ul>

<div data-type="callOut" data-emoji="💡" data-color="#EFF6FF">
  <p>Requires Node.js 18 or higher. Check with <code>node -v</code>.</p>
</div>

<h2>Writing Endpoints</h2>
<pre><code class="language-typescript">import express from 'express';

const app = express();
app.use(express.json());

app.get('/api/users', async (req, res) =&gt; {
  const users = await db.users.findMany();
  res.json({ data: users });
});

app.listen(3000, () =&gt; {
  console.log('Server running on port 3000');
});</code></pre>

<h3>Error Handling</h3>
<p>A centralized error handler is essential in production:</p>

<table>
  <thead>
    <tr><th>Status Code</th><th>Meaning</th><th>Handling</th></tr>
  </thead>
  <tbody>
    <tr><td>400</td><td>Bad Request</td><td>Return input validation error</td></tr>
    <tr><td>401</td><td>Unauthorized</td><td>Guide token reissue</td></tr>
    <tr><td>500</td><td>Server Error</td><td>Log error, return generic message</td></tr>
  </tbody>
</table>

<blockquote><p>REST APIs should use a consistent error format.</p></blockquote>

<h2>Conclusion</h2>
<p>Now you have a basic REST API running. Check the Express <a href="https://expressjs.com">official docs</a> for more details.</p>

<div data-type="callOut" data-emoji="🚀" data-color="#EFF6FF">
  <p>Publish this post directly from the terminal with <strong>InblogCLI</strong>.</p>
</div>
```
