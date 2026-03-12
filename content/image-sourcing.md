---
name: inblog-image-sourcing
description: "블로그 이미지 확보. Gemini 생성, Unsplash, 스크린샷, HTML 디자인. 트리거: '이미지 추가', '커버 이미지', '카드뉴스', '인포그래픽'"
---

# 이미지 소싱 워크플로우

## 이미지 스펙 퀵 레퍼런스

- **본문 이미지 HTML:** `<img data-type="imageBlock" src="URL" alt="설명" width="800">`
- **커버/OG:** `image` 필드, 1200×630px 권장
- **CDN:** `source.inblog.dev` / `image.inblog.dev` (외부 URL은 자동 R2 업로드)

## CLI 이미지 업로드

```bash
# 이미지 파일을 CDN에 업로드 → URL 반환
inblog images upload ./photo1.jpg ./photo2.png
inblog images upload ./cover.jpg -b featured_image --json

# 포스트 생성/수정 시 로컬 파일 직접 지정 (자동 업로드)
inblog posts create --title "제목" --image ./cover.jpg --content-file ./content.html
inblog posts update <id> --image ./new-cover.jpg

# 블로그 로고/파비콘/OG도 로컬 파일 지원
inblog blogs update --logo ./logo.png --favicon ./favicon.ico --og-image ./og.jpg
inblog blogs banner set --image ./banner.png --title "제목"
```

**주의:** content_html에 base64 data URI를 직접 넣으면 413 에러 발생.
- `--content-file` 사용 시: 로컬 경로/base64 → 자동 CDN 업로드 처리
- 수동 HTML 작성 시: `inblog images upload`로 먼저 URL 확보 후 사용

## 의사결정 테이블

| 상황 | 방법 | 예시 |
|------|------|------|
| 도구/서비스 UI 보여주기 | Method 3: 스크린샷 | Google Search Console 화면 |
| 분위기/컨셉 이미지 | Method 2: Unsplash | 히어로 이미지, 배경 |
| 한국어 텍스트 포함 디자인 | Method 4: HTML→Screenshot | 카드뉴스, 인포그래픽, 비교표 |
| 고유한 일러스트/다이어그램 | Method 1: Gemini 생성 | 개념도, 프로세스 플로우 |
| 데이터 시각화 | Method 4: HTML→Screenshot | 차트, 통계 카드 |

---

## Method 1: Gemini 이미지 생성

### 전제 조건

- `GEMINI_API_KEY` 환경변수 설정 (유료 플랜)
- MCP 서버: `guinacio/claude-image-gen` (stdio transport)

### 설치

```bash
claude mcp add --transport stdio image-gen -- npx -y @anthropic-ai/claude-image-gen --provider gemini
```

환경변수 `GEMINI_API_KEY` 필요.

### 프롬프트 가이드

- **블로그 일러스트:** "A clean, modern illustration of [주제], flat design style, pastel colors, white background"
- **개념도:** "A simple diagram showing [관계], minimal style, labeled in English"
- **아이콘/심볼:** "A single icon representing [개념], flat design, [색상] on white background"

### 한계

- 한국어 텍스트 정확도 ~75-80% → 텍스트가 중요하면 **Method 4** 사용
- aspect ratio 지정 가능: `1:1`, `16:9`, `4:3` 등

---

## Method 2: Unsplash 스톡 이미지

### URL 패턴

```
https://images.unsplash.com/photo-{ID}?w=1200&h=630&fit=crop
```

### 키워드 매핑

| 주제 | Unsplash 검색 키워드 |
|------|---------------------|
| SEO/마케팅 | marketing, analytics, data, growth |
| AI/기술 | technology, artificial intelligence, robot |
| 블로그/글쓰기 | writing, laptop, workspace, creative |
| 비즈니스 | business, meeting, office, strategy |
| 스타트업 | startup, team, innovation, launch |

### 사용법

1. `https://unsplash.com/s/photos/{keyword}` 에서 검색
2. 이미지 선택 후 URL 복사
3. `?w=1200&h=630&fit=crop` 파라미터 추가

### 주의사항

- `alt` 텍스트에 SEO 키워드 포함 필수
- 사용 시점: 히어로/커버, 분위기 전달, 빠르게 필요할 때

---

## Method 3: 브라우저 스크린샷

browsermcp 사용 (이미 설정됨).

### 워크플로우

1. `browser_navigate` → 대상 페이지로 이동
2. `browser_screenshot` → 스크린샷 캡처
3. 필요 시 `browser_screenshot`의 zoom 기능으로 특정 영역 크롭
4. inblog 포스트에 이미지 URL 삽입

### 주의사항

- 로그인 필요한 페이지는 사전 확인 필요
- 민감한 정보(개인정보, 비밀번호 등)가 노출되지 않도록 확인
- 스크린샷 전 불필요한 팝업/배너 닫기

---

## Method 4: HTML→Screenshot 디자인 (Claude 디자인)

### 용도

카드뉴스, 인포그래픽, 비교 카드, 인용 카드, 통계 카드, 데이터 시각화

### 워크플로우

1. HTML/CSS 파일 생성 (`/tmp/design.html`)
2. browsermcp로 로컬 파일 열기: `file:///tmp/design.html`
3. 스크린샷 캡처
4. inblog 포스트에 이미지 삽입

### HTML 보일러플레이트

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
  <!-- 콘텐츠 -->
</body>
</html>
```

### 템플릿

#### 카드뉴스 (1080×1080)

```html
<div class="w-[1080px] h-[1080px] bg-gradient-to-br from-blue-600 to-purple-700 flex flex-col items-center justify-center p-16 text-white text-center">
  <div class="text-[120px] font-black mb-8">01</div>
  <h2 class="text-5xl font-bold mb-6 leading-tight">핵심 문구를 여기에</h2>
  <p class="text-2xl opacity-80 max-w-[800px]">부가 설명 텍스트</p>
</div>
```

#### 비교 카드 (1200×630)

```html
<div class="w-[1200px] h-[630px] bg-white flex">
  <div class="flex-1 bg-red-50 p-12 flex flex-col justify-center">
    <div class="text-red-500 text-xl font-bold mb-4">BEFORE</div>
    <h3 class="text-3xl font-bold text-gray-900 mb-4">이전 방식</h3>
    <ul class="text-xl text-gray-600 space-y-3">
      <li>항목 1</li>
      <li>항목 2</li>
      <li>항목 3</li>
    </ul>
  </div>
  <div class="w-px bg-gray-200"></div>
  <div class="flex-1 bg-green-50 p-12 flex flex-col justify-center">
    <div class="text-green-500 text-xl font-bold mb-4">AFTER</div>
    <h3 class="text-3xl font-bold text-gray-900 mb-4">개선된 방식</h3>
    <ul class="text-xl text-gray-600 space-y-3">
      <li>항목 1</li>
      <li>항목 2</li>
      <li>항목 3</li>
    </ul>
  </div>
</div>
```

#### 프로세스 다이어그램 (1200×400)

```html
<div class="w-[1200px] h-[400px] bg-white flex items-center justify-center gap-4 p-12">
  <div class="flex-1 bg-blue-50 rounded-2xl p-8 text-center">
    <div class="text-blue-600 text-lg font-bold mb-2">STEP 1</div>
    <div class="text-xl font-bold text-gray-900">단계 설명</div>
  </div>
  <div class="text-3xl text-gray-300">→</div>
  <div class="flex-1 bg-blue-50 rounded-2xl p-8 text-center">
    <div class="text-blue-600 text-lg font-bold mb-2">STEP 2</div>
    <div class="text-xl font-bold text-gray-900">단계 설명</div>
  </div>
  <div class="text-3xl text-gray-300">→</div>
  <div class="flex-1 bg-blue-50 rounded-2xl p-8 text-center">
    <div class="text-blue-600 text-lg font-bold mb-2">STEP 3</div>
    <div class="text-xl font-bold text-gray-900">단계 설명</div>
  </div>
  <div class="text-3xl text-gray-300">→</div>
  <div class="flex-1 bg-blue-600 rounded-2xl p-8 text-center">
    <div class="text-blue-200 text-lg font-bold mb-2">RESULT</div>
    <div class="text-xl font-bold text-white">최종 결과</div>
  </div>
</div>
```

#### 인용/통계 카드 (1200×630)

```html
<div class="w-[1200px] h-[630px] bg-gray-900 flex flex-col items-center justify-center p-16 text-center">
  <div class="text-8xl font-black text-blue-400 mb-6">73%</div>
  <h3 class="text-3xl font-bold text-white mb-4 max-w-[900px] leading-relaxed">핵심 통계에 대한 설명 문구</h3>
  <p class="text-xl text-gray-400">— 출처: 리서치 기관, 2026</p>
</div>
```

---

## 스킬 상호참조

- `inblog-content-html` → `imageBlock` / `imageGrid` 문법
- `inblog-content-quality-checklist` → 이미지 3장+ 기준
- `inblog-write-seo-post` → 이미지 소싱 단계에서 이 스킬 참조
