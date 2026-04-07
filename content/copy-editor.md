---
name: inblog-copy-editor
description: "Seven Sweeps copy-editing method for systematic content improvement. Triggers: '카피 편집', '글 다듬어줘', '문장 개선', '리라이트', 'copy edit', 'seven sweeps', 'improve writing', 'rewrite'"
---

# Copy Editor — Seven Sweeps Method

Systematically improve existing content through 7 focused editing passes. Each pass targets one dimension only — no rewriting from scratch. Preserves the author's voice while elevating clarity, persuasiveness, and trust.

**User-invocable:** `/copy-edit <post-id>`, `/copy-edit` (latest draft)

## Prerequisites

```bash
inblog auth status
inblog blogs me --json  # → subdomain
```

## When to Use

- After `inblog-write-seo-post` Phase 2 (draft generated) — before publishing
- After `inblog-content-quality-checklist` flags "AI Content Quality" issues
- When refreshing content (`inblog-content-refresh`) — improve quality, not just update facts
- User requests: "글 좀 다듬어줘", "퀄리티 올려줘", "AI스러운 느낌 빼줘"

## Workflow

### Step 1: Fetch Content

```bash
inblog posts get <post-id> --include tags,authors --json
```

Extract `content_html`, `title`, `meta_title`, `meta_description`.

### Step 2: Load Context (silent)

```bash
# Read strategy for brand voice
# .inblog/{subdomain}/strategy.md → voice guidelines, tone, do's/don'ts

# Read author profile for personal style
# .inblog/{subdomain}/authors/{author-id}.md → writing preferences

# Read customer language if available
# .inblog/{subdomain}/strategy.md → voice_of_customer section
```

### Step 3: Run Seven Sweeps

Execute each sweep sequentially on the content. After all sweeps, present a consolidated diff.

---

#### Sweep 1: Clarity (명확성)

**Goal:** Every sentence says exactly one thing. A reader skimming at 2x speed still gets the point.

**Actions:**
- Split compound sentences (A, and B, and C → three sentences)
- Replace abstract nouns with concrete verbs ("implementation of" → "implement")
- Remove hedge words ("somewhat", "arguably", "it could be said that", "다소", "어느 정도", "~라고 할 수 있다")
- Kill "there is/are" constructions ("There are three ways to..." → "Three ways to...")
- One idea per paragraph — if a paragraph covers two topics, split it
- Replace passive voice with active when the agent matters ("was configured by the team" → "the team configured")

**Test:** Can you understand each sentence on first read without re-reading?

---

#### Sweep 2: Voice & Tone (목소리)

**Goal:** The content sounds like the brand/author, not like a generic AI.

**Actions:**
- Match tone to strategy.md voice guidelines (formal/casual/technical)
- Replace generic AI phrases with brand-appropriate language:
  | AI cliche | Replace with |
  |-----------|-------------|
  | "In today's rapidly evolving landscape" | Cut entirely or state the specific change |
  | "It's worth noting that" | Just state the thing |
  | "Leveraging cutting-edge technology" | Name the specific technology |
  | "Dive deep into" | "Examine", "Break down", or just start explaining |
  | "핵심적인 역할을 합니다" | State what it actually does |
  | "다양한 측면에서" | Name the specific aspects |
  | "중요하다고 할 수 있습니다" | "~입니다" (just assert it) |
- Add personality markers from author profile (humor style, signature phrases)
- Ensure Korean honorific level is consistent (해요체/합니다체 throughout)

**Test:** Read three random paragraphs — do they sound like they came from the same person?

---

#### Sweep 3: So What? (혜택)

**Goal:** Every section answers "why should I care?" from the reader's perspective.

**Actions:**
- For each H2 section, check: does it tell the reader what they gain?
- Convert feature statements to benefit statements:
  | Feature | Benefit |
  |---------|---------|
  | "This tool supports 15 languages" | "Reach customers in 15 languages without hiring translators" |
  | "자동 배포 기능이 있습니다" | "코드 푸시하면 자동으로 배포되니까 배포 날 야근할 일이 없습니다" |
- Add "so that..." mentally after each claim — if you can't finish it, the claim needs a benefit
- If a section is purely descriptive with no reader payoff, either add the payoff or cut the section

**Test:** After reading each section, can the reader answer "what do I do with this information?"

---

#### Sweep 4: Prove It (증거)

**Goal:** Claims have evidence. Opinions are labeled as opinions.

**Actions:**
- Find unsupported claims ("increases productivity", "생산성이 향상됩니다") → add specific data, source, or case
- Add concrete numbers where vague quantities exist:
  | Vague | Specific |
  |-------|---------|
  | "significantly faster" | "40% faster in our benchmarks" |
  | "많은 기업들이 사용" | "Fortune 500 중 120개 기업이 사용" |
  | "saves time" | "saves ~3 hours/week per developer" |
- Where exact data isn't available, use:
  - First-person experience: "우리 팀에서 테스트했을 때..."
  - Named examples: "Stripe의 경우..." instead of "한 기업의 경우..."
  - Qualified estimates: "업계 평균 기준 약 30% 절감" with source
- Label opinions explicitly: "우리 팀의 의견으로는..." or "We believe..."
- Check that statistics have sources or at minimum context

**Test:** Would a skeptical reader accept each claim, or would they think "prove it"?

---

#### Sweep 5: Specificity (구체성)

**Goal:** Replace every generic statement with a specific one.

**Actions:**
- Replace category nouns with named examples:
  | Generic | Specific |
  |---------|---------|
  | "popular frameworks" | "React, Vue, and Svelte" |
  | "major cloud providers" | "AWS, GCP, and Azure" |
  | "여러 도구들" | "Slack, Notion, 그리고 Linear" |
- Replace "etc.", "등" at the end of lists — either complete the list or cut it
- Convert "you can" instructions to step-by-step:
  | Vague | Specific |
  |-------|---------|
  | "You can configure the settings" | "Open `Settings > API > Tokens`, click 'Generate', and paste the token into your `.env` file" |
- Add time/effort estimates where relevant: "takes about 10 minutes", "약 5분이면 완료"
- Replace adjectives with measurements: "fast" → "responds in <100ms"

**Test:** Could someone follow your instructions without Googling anything?

---

#### Sweep 6: Heightened Emotion (감정 강화)

**Goal:** The content creates emotional resonance — not hype, but genuine connection to reader pain/joy.

**Actions:**
- Identify the reader's emotional state at each section:
  - Problem sections → frustration, confusion, urgency
  - Solution sections → relief, confidence, excitement
  - Result sections → satisfaction, aspiration
- Strengthen emotional language (sparingly, authentically):
  | Flat | Emotionally resonant |
  |------|---------------------|
  | "This is a common problem" | "If you've ever spent a Sunday night debugging this, you know the pain" |
  | "성능이 개선됩니다" | "배포 버튼 누르고 커피 마시러 갔다 오면 끝나 있습니다" |
- Use "you" / "여러분" to speak directly to the reader (not "users" / "사용자")
- Add one story or scenario per major section (keeps attention, builds empathy)
- Do NOT over-do it — one emotional beat per section, max. More feels manipulative.

**Test:** Does the content make the reader feel understood, or does it just inform them?

---

#### Sweep 7: Zero Risk (신뢰 & 리스크 제거)

**Goal:** Remove every reason the reader might hesitate to trust, act, or share.

**Actions:**
- Address implicit objections:
  | Reader thinks | Address with |
  |--------------|-------------|
  | "Is this outdated?" | Add dates, version numbers, "as of 2026" |
  | "Does this work for my case?" | Add conditions: "이 방법은 B2B SaaS에 가장 효과적이며, 이커머스에는 약간의 조정이 필요합니다" |
  | "Is this biased?" | Acknowledge limitations and alternatives honestly |
  | "Can I trust this source?" | Link to authoritative references |
- Add safety nets for instructions:
  - "If this doesn't work, check..." (troubleshooting)
  - "Before starting, back up your..." (reversibility)
  - "This is for [specific version] — if you're on [other version], see [link]"
- Acknowledge trade-offs honestly — "The downside is...", "단점은..." (builds trust)
- Check that CTAs feel low-risk: "Try free", "No credit card required", "5분 안에 확인 가능"

**Test:** Is there any sentence where a reader might think "hmm, I'm not sure about that" without resolution?

---

### Step 4: Present Results

Show changes as a sweep-by-sweep summary, then offer options:

```
Copy Edit Report: "{post title}" (ID: {id})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sweep 1 — Clarity:        12 changes (5 splits, 4 hedge removals, 3 passive→active)
Sweep 2 — Voice & Tone:    8 changes (3 AI cliches removed, 5 tone adjustments)
Sweep 3 — So What:         4 changes (2 benefit additions, 2 section cuts)
Sweep 4 — Prove It:        6 changes (3 data additions, 2 source citations, 1 opinion label)
Sweep 5 — Specificity:     9 changes (4 named examples, 3 step-by-steps, 2 measurements)
Sweep 6 — Emotion:         3 changes (2 scenarios added, 1 direct address)
Sweep 7 — Zero Risk:       5 changes (2 objection handlers, 2 safety nets, 1 trade-off)

Total: 47 improvements across 7 sweeps
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Options:
1. Apply all changes → update post
2. Review changes sweep-by-sweep → approve/reject each
3. Apply specific sweeps only (e.g., "1, 2, 5만 적용")
```

### Step 5: Apply Changes

```bash
# Save improved content to temp file
# Apply via:
inblog posts update <post-id> --content-file ./improved-content.html

# If title/meta also improved:
inblog posts update <post-id> --title "..." --meta-title "..." --meta-description "..."
```

## Sweep Selection Mode

Users can request specific sweeps only:

- "명확성만 체크해줘" → Sweep 1 only
- "AI 느낌 빼줘" → Sweep 2 (Voice) + Sweep 5 (Specificity)
- "증거 보강해줘" → Sweep 4 (Prove It) only
- "전환율 올려줘" → Sweep 3 (So What) + Sweep 6 (Emotion) + Sweep 7 (Zero Risk)

## Principles

1. **Edit, don't rewrite.** Preserve the author's structure and core ideas. Change words and sentences, not the architecture.
2. **One sweep, one lens.** Don't fix clarity issues during the emotion sweep. Discipline prevents overcorrection.
3. **Less is more.** If a sentence is already good, leave it alone. Not every paragraph needs all 7 sweeps.
4. **Korean-specific:** Respect the original honorific level (해요체/합니다체). Don't mix. Don't over-translate English idioms into awkward Korean.
5. **Voice of Customer:** If `.inblog/{subdomain}/strategy.md` has a `voice_of_customer` section, prefer customer language over marketing jargon in Sweeps 2, 3, and 5.

## Integration Points

- **write-seo-post** → optional step after Phase 2 content generation
- **content-quality-checklist** → when AI Content Quality check fails, suggest this skill
- **content-refresh** → run Seven Sweeps during content refresh for quality uplift
- **autopilot** → can trigger for posts flagged as "needs quality improvement"
- **geo-optimizer** → complementary: GEO optimizes structure, Seven Sweeps optimizes prose
