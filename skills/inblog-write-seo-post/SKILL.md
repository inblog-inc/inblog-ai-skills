---
name: inblog-write-seo-post
description: "SEO 블로그 포스트 작성 & 발행. 트리거: '블로그 글 써줘', '포스트 작성', '글 발행', 'SEO 포스트', '블로그 포스트 만들어', '글 쓰기', 'write blog post', 'publish post'"
---

# SEO 블로그 포스트 작성 워크플로우

## 전제 조건

- `inblog auth status`로 인증/블로그 확인
- 여러 블로그 보유 시: `inblog blogs list` → `inblog blogs switch <id 또는 subdomain>`
- Team 플랜 이상 필요 (무료 플랜 시 업그레이드 안내)

## 인자 처리

`$ARGUMENTS`가 제공된 경우 (예: `/write-seo-post AI 마케팅 가이드`), 주제를 Phase 1의 1단계에서 바로 사용하여 "주제가 무엇인가요?" 질문을 건너뜁니다.

## 워크플로우

### Phase 1: 정보 수집 (멀티턴)

유저에게 순서대로 확인 (`$ARGUMENTS`로 주제가 제공되면 1번 건너뛰기):

1. **주제** — 무엇에 대해 쓸 것인가
2. **목적** — 어떤 전환을 원하는가 (signup, demo, newsletter, purchase, contact)
3. **타겟 독자** — 누구를 위한 글인가
4. **글 유형** — 튜토리얼/가이드, 리스트형, 문제해결, 케이스스터디
5. **키워드** — SEO 목표 키워드 (유저가 모르면 주제에서 추출)

### Phase 1-A: 애널리틱스 연동 모드 (선택)

유저가 "성과 좋은 주제로 글 써줘", "트래픽 기반으로" 같은 요청 시:

```bash
# 상위 포스트 분석
inblog analytics posts --sort visits --limit 5 --include title --json

# 트래픽 키워드 분석 (서치콘솔 연결 필요)
inblog search-console keywords --sort clicks --limit 10 --json
```

- 기존 성과 데이터 기반 주제/키워드 제안
- 유저 선택 후 일반 Phase 2로 진행

### Phase 2: 아웃라인 & 콘텐츠 생성

1. SEO 최적화 아웃라인 작성 (H2/H3 구조)
2. 유저 확인 후 HTML 콘텐츠 생성
3. **반드시 `inblog-content-html` 스킬의 규칙을 따를 것**

#### SEO 최적화 가이드

| 요소 | 규칙 |
|------|------|
| title | 60자 이내, 키워드 앞쪽 배치 |
| meta_description | 150-160자, 키워드 포함, 행동 유도 |
| slug | 영문 소문자, 하이픈 구분, 키워드 포함 |
| H2/H3 | 키워드 자연스럽게 포함 |
| 본문 | 1500자 이상, 키워드 밀도 1-2% |
| CTA | 글 중간과 끝에 배치 |

#### 콘텐츠 구조 템플릿

**튜토리얼/가이드:**
- 도입 (문제 제기) → 단계별 설명 → 팁/주의사항 → CTA

**리스트형:**
- 도입 → N개 항목 (각각 H2) → 요약 → CTA

**문제해결:**
- 문제 상황 → 원인 분석 → 해결 방법 → CTA

**케이스스터디:**
- 배경 → 과제 → 해결 과정 → 결과/수치 → CTA

### Phase 3: API 호출

```bash
# 1. 태그 확인/생성
inblog tags list
inblog tags create --name "키워드" --slug "keyword"

# 2. 저자 확인
inblog authors list

# 3. 포스트 생성 (--image로 커버 이미지 설정, 로컬 파일 자동 업로드)
inblog posts create \
  --title "SEO 최적화된 제목" \
  --slug "seo-optimized-slug" \
  --description "150-160자 메타 설명" \
  --meta-title "60자 이내 메타 타이틀" \
  --meta-description "150-160자 메타 설명" \
  --image ./cover.jpg \
  --content-file ./content.html \
  --json

# 4. 태그/저자 연결
inblog posts add-tags <post-id> --tag-ids <id1>,<id2>
inblog posts add-authors <post-id> --author-ids <id1>

# 5. 발행 (유저 선택에 따라)
inblog posts publish <post-id>                    # 즉시 발행
inblog posts schedule <post-id> --at "2026-03-10T09:00:00Z"    # 예약
# 또는 드래프트 유지 (아무것도 하지 않음)
```

### Phase 4: 품질 체크 & 완료 확인

**발행 전 반드시 `inblog-content-quality-checklist` 스킬의 체크리스트를 확인하세요.**

발행 후 링크 제공:

- **에디터:** `https://inblog.ai/dashboard/{subdomain}/{postId}`
- **공개 URL:** `https://{subdomain}.inblog.io/{slug}`
- 커스텀 도메인이 있으면: `https://{custom_domain}/{slug}`

## 이미지 처리

이미지 확보 시 `inblog-image-sourcing` 스킬을 참조하여 상황에 맞는 방법 선택.

```bash
# 커버 이미지 설정 (로컬 파일 또는 URL)
inblog posts create --title "제목" --image ./cover.jpg --content-file ./content.html
inblog posts update <id> --image https://source.inblog.dev/...

# 로컬 이미지 먼저 업로드
inblog images upload ./photo1.jpg ./photo2.jpg
# → CDN URL 반환, content_html에 사용

# content_html 내 로컬 경로/base64 이미지는 자동 CDN 업로드
# (--content-file 제출 시 자동 처리, 413 에러 방지)
```

**주의:** content_html에 base64 이미지를 직접 넣으면 413 에러. 반드시 로컬 파일 경로를 사용하거나 `inblog images upload`로 먼저 CDN URL을 확보할 것.

## 에러 처리

| 에러 코드 | 해결 |
|-----------|------|
| SLUG_CONFLICT | 슬러그 변경 |
| SUBSCRIPTION_REQUIRED | Team 플랜 업그레이드 |
| VALIDATION_ERROR | 필수 필드 확인 |
| INVALID_TAG_IDS | `inblog tags list`로 ID 확인 |
