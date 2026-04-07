---
name: inblog-social-repurpose
description: "Convert blog posts into platform-specific social content. Triggers: '소셜 콘텐츠', '소셜 변환', 'LinkedIn 포스트', '트위터 스레드', 'social content', 'repurpose', 'social repurpose'"
---

# Social Content Repurposing

Extract "content atoms" from published blog posts and transform them into platform-specific social content. One blog post → 10+ social pieces.

**User-invocable:** `/social-repurpose <post-id>`, `/social-repurpose <post-url>`

## Prerequisites

```bash
inblog auth status
inblog blogs me --json  # → subdomain
```

## When to Use

- After publishing a blog post (end of `inblog-write-seo-post` Phase 4)
- When user wants to promote existing content: "이 글로 소셜 콘텐츠 만들어줘"
- Batch mode: "이번 달 발행한 글 전체 소셜 콘텐츠 뽑아줘"

## Workflow

### Phase 1: Content Extraction

```bash
inblog posts get <post-id> --include tags,authors --json
```

Extract from the post:
- `title`, `meta_description`, `slug`, `content_html`
- `tags` (for hashtags)
- Post URL: `https://{subdomain}.inblog.io/{slug}` (or custom domain)

### Phase 2: Atom Mining

Parse `content_html` and extract **content atoms** — self-contained pieces that work independently:

| Atom Type | What to Extract | Example |
|-----------|----------------|---------|
| **Statistic** | Numbers, percentages, metrics with context | "GEO 최적화 적용 후 AI 인용 확률이 2.3배 증가" |
| **Tip** | Actionable advice in 1-2 sentences | "메타 디스크립션은 150-160자로 쓰되, 키워드보다 클릭 유도 문구에 집중하세요" |
| **Quote** | Strong opinion or insight from the author | "콘텐츠 전략 없는 블로그는 지도 없는 여행과 같다" |
| **Framework** | Named process, acronym, or mental model | "Seven Sweeps: Clarity → Voice → Benefits → Evidence → Specificity → Emotion → Trust" |
| **Comparison** | Before/after, A vs B, with/without | "키워드 리서치 없이 쓴 글: 월 50뷰 → 키워드 기반으로 쓴 글: 월 3,000뷰" |
| **Story** | Anecdote or case study in miniature | "한 고객이 content-refresh를 적용했더니 3개월 만에 오가닉 트래픽이 80% 증가" |
| **List** | Numbered or bulleted items (3-7) | "SEO 포스트 필수 체크리스트 5가지" |
| **Controversy** | Contrarian take or surprising claim | "긴 글이 항상 좋은 건 아니다 — 검색 의도에 따라 1,000자가 5,000자를 이길 수 있다" |
| **How-to** | Step-by-step mini process | "3단계로 블로그 포스트 SEO 점수 올리는 법" |

**Mining rules:**
- Extract 8-15 atoms per post
- Each atom must make sense without reading the full post
- Preserve specific data (numbers, names, examples) — specificity is what makes social content shareable
- Tag each atom with its type for format matching

### Phase 3: Platform Transformation

Transform atoms into platform-specific formats. Generate all requested platforms (default: LinkedIn + Twitter/X).

---

#### LinkedIn Post

**Format rules:**
- Hook line (first sentence visible before "...더 보기") — must be compelling in 1-2 lines
- 150-300 words total
- Line breaks between ideas (LinkedIn rewards whitespace)
- End with a question or CTA to drive comments
- 3-5 relevant hashtags at the end
- No emojis in bullet points (looks spammy on LinkedIn)
- Include post link naturally, not as a bare URL dump

**Best atom types:** Framework, Story, Controversy, Comparison

**Template:**

```
[Hook — surprising stat, contrarian take, or relatable pain point]

[2-3 paragraphs expanding on the idea]

[Key takeaway or framework]

[Question to drive engagement OR soft CTA to the full post]

---
[Post link]

#hashtag1 #hashtag2 #hashtag3
```

**Example:**

```
SEO 포스트를 쓸 때 가장 큰 실수는 "검색량이 높은 키워드를 고르는 것"이다.

검색량만 보면 경쟁이 치열한 레드오션에 뛰어드는 거다.
실제로 중요한 건 "검색량 대비 난이도" 비율이다.

우리 팀에서 실험한 결과:
- 검색량 10,000 + 난이도 80 키워드 → 6개월 후 순위 42위
- 검색량 1,000 + 난이도 15 키워드 → 2주 만에 순위 5위

작은 연못의 큰 물고기 전략이 블로그에서도 통한다.

키워드 선정에 대해 더 자세히 정리했다 →
https://blog.example.com/keyword-strategy

여러분은 키워드를 어떤 기준으로 고르시나요?

#SEO #콘텐츠마케팅 #블로그 #키워드리서치
```

---

#### Twitter/X Thread

**Format rules:**
- 1/ Hook tweet — standalone value, makes people want the rest
- 3-7 tweets per thread (shorter > longer)
- Each tweet is self-contained and tweetable independently
- Use numbers, line breaks, and simple formatting
- Last tweet: summary + link to full post
- No hashtags mid-thread (put 1-2 in first or last tweet only)

**Best atom types:** List, Tip, Statistic, How-to

**Template:**

```
1/ [Hook — the single most interesting insight from the post]

2/ [Supporting point or first list item]

3/ [Supporting point or second list item]

4/ [The most specific/data-driven point]

5/ [Takeaway + link to full post]

Full breakdown here: [post URL]
```

---

#### Instagram Carousel (text content only)

**Format rules:**
- 7-10 slides worth of text content
- Slide 1: Title/hook (big, bold statement)
- Slides 2-8: One idea per slide, 15-30 words each
- Last slide: CTA (save, share, follow, link in bio)
- Include suggested visual direction for each slide

**Best atom types:** List, Framework, How-to, Comparison

**Template:**

```
Slide 1 — Title:
[Bold statement or question]

Slide 2:
[Problem or context — why this matters]

Slide 3-7:
[One point per slide from the list/framework]

Slide 8:
[Key takeaway]

Slide 9 — CTA:
"Save this for later"
"Full guide: link in bio"
```

---

### Phase 4: Output

Present all generated content organized by platform:

```
Social Content Pack: "{post title}"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Atoms extracted: 12
Content generated:

LinkedIn (3 posts):
  1. [Hook preview...] — Framework type
  2. [Hook preview...] — Controversy type
  3. [Hook preview...] — Story type

Twitter/X (2 threads):
  1. [Hook tweet...] — 5 tweets
  2. [Hook tweet...] — 4 tweets

Instagram Carousel (1):
  1. [Title...] — 8 slides

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**User options:**
1. Copy specific content (by number)
2. Regenerate with different angle
3. Add/remove platforms
4. Adjust tone (more casual / more professional)

## Batch Mode

When processing multiple posts:

```bash
# Get recent published posts
inblog posts list --published --limit 10 --sort created_at --json
```

For each post, generate a condensed social pack (1 LinkedIn + 1 Twitter thread).

## Context Integration

- **strategy.md** → brand voice applies to all social content
- **strategy.md → voice_of_customer** → use customer language in hooks and examples
- **business.md** → CTA in social content should align with product positioning
- **author profile** → if author has LinkedIn/Twitter, personalize for their voice

## Principles

1. **Standalone value.** Each social piece must deliver value without clicking the link. The link is a bonus, not a requirement.
2. **Platform-native.** LinkedIn posts don't look like tweets. Carousel text doesn't look like blog paragraphs. Respect each platform's culture.
3. **Hook first.** The first line/tweet decides everything. Spend 50% of effort on the hook.
4. **Specificity travels.** Vague advice gets scrolled past. Specific data, named examples, and concrete numbers get shared.
5. **One post, many angles.** A single blog post can fuel 3 LinkedIn posts from different atoms — don't just summarize the whole post each time.

## Integration Points

- **write-seo-post** → offer social repurposing after Phase 4 (publishing complete)
- **content-plan** → planned posts can include "social repurpose: yes" for automatic generation
- **autopilot** → can auto-generate social packs for newly published posts
- **content-refresh** → refreshed content gets new social content too
