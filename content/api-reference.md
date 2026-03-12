---
name: inblog-api-reference
description: "inblog API 완벽 레퍼런스. 엔드포인트, 필드, 필터, 에러 코드 상세."
---

# inblog API 레퍼런스

Base URL: `https://inblog.ai/api/v1`

## 인증

모든 요청에 `Authorization: Bearer <API_KEY>` 헤더 필요.
- GET 요청: `Accept: application/vnd.api+json`만 전송
- POST/PATCH 요청: `Content-Type: application/json` + `Accept: application/vnd.api+json`
- 유료 플랜 블로그만 API 접근 가능

### CLI 사용
```bash
inblog auth login          # API 키 입력 → 검증 → 저장
inblog auth whoami --json  # 현재 인증 상태 확인
inblog auth logout         # API 키 제거
```

### 키 우선순위
1. `--api-key` 플래그
2. `INBLOG_API_KEY` 환경변수
3. `.inblogrc.json` (프로젝트 로컬)
4. `~/.config/inblog/config.json` (글로벌)

## 권한 범위 (Scopes)

| Scope | 설명 |
|-------|------|
| `posts:read` | 포스트 조회 |
| `posts:write` | 포스트 생성/수정/발행 |
| `posts:delete` | 포스트 삭제 |
| `tags:read` | 태그 조회 |
| `tags:write` | 태그 생성/수정 |
| `tags:delete` | 태그 삭제 |
| `authors:read` | 저자 조회 |
| `authors:write` | 저자 수정 |
| `blogs:read` | 블로그 정보 조회 |
| `blogs:write` | 블로그 설정 수정 |
| `redirects:read` | 리다이렉트 조회 |
| `redirects:write` | 리다이렉트 생성/수정/삭제 |
| `forms:read` | 폼 조회 |
| `form_responses:read` | 폼 응답 조회 |

---

## 엔드포인트 상세

### 포스트

```bash
# 목록 (페이지네이션 + 필터 + 정렬)
inblog posts list --page 1 --limit 10 --sort published_at --order desc --include tags,authors --json
inblog posts list --published --tag-id 5 --json
inblog posts list --draft --author-id "uuid" --json

# 조회
inblog posts get <id> --include tags,authors --json

# 생성 (--image로 커버 이미지 설정, 로컬 파일 자동 업로드)
inblog posts create --title "제목" --slug "slug" --image ./cover.jpg --content-file /tmp/content.html --json

# 수정
inblog posts update <id> --title "새 제목" --image ./new-cover.jpg --json

# 삭제
inblog posts delete <id> --json

# 발행/취소/예약
inblog posts publish <id> --json
inblog posts unpublish <id> --json
inblog posts schedule <id> --at "2025-03-15T09:00:00+09:00" --json
```

**목록 필터 파라미터:**

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `--page` | number | 페이지 번호 (기본: 1) |
| `--limit` | number | 페이지당 항목 (기본: 10, 최대: 100) |
| `--sort` | string | 정렬 필드: `published_at`, `created_at`, `updated_at`, `title` |
| `--order` | string | `asc` 또는 `desc` (기본: desc) |
| `--published` | flag | 발행된 포스트만 |
| `--draft` | flag | 초안만 |
| `--tag-id` | number | 특정 태그 ID로 필터 |
| `--author-id` | string | 특정 저자 ID(UUID)로 필터 |
| `--include` | string | 관계 포함: `tags`, `authors`, `tags,authors` |

**포스트 필드:**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `title` | string | ✓ | 포스트 제목 (60자 이내 권장) |
| `slug` | string | ✓ | URL 슬러그 (소문자, 숫자, 하이픈만) |
| `description` | string | | 포스트 요약 |
| `content_html` | string | | 본문 HTML (inblog-content-html 참조) |
| `content_type` | string | | `"tiptap"` (기본) 또는 `"notion"` |
| `published` | boolean | | 발행 상태 |
| `published_at` | ISO 8601 | | 발행 시간 |
| `image` | object | | `{ url, blurhash?, created_at? }` |
| `canonical_url` | string | | 정규 URL (다른 곳에 원본 있을 때) |
| `notion_url` | string | | Notion 페이지 URL |
| `meta_title` | string | | SEO 제목 (og:title 용) |
| `meta_description` | string | | SEO 설명 (150-160자 권장) |
| `cta_text` | string | | CTA 버튼 텍스트 |
| `cta_link` | string | | CTA 클릭 시 URL |
| `cta_color` | string | | CTA 버튼 색상 (hex) |
| `cta_text_color` | string | | CTA 텍스트 색상 (hex) |
| `custom_scripts` | object | | `{ head_start_script, head_end_script, body_start_script, body_end_script, json_ld_script }` |
| `tag_ids` | number[] | | 생성 시 태그 연결 |
| `author_ids` | string[] | | 생성 시 저자 연결 |

**ID 타입**: 포스트 ID는 정수 (string으로 반환)

### 포스트-태그 관계

```bash
inblog posts tags <postId> --json          # 포스트의 태그 목록
inblog posts add-tags <postId> --tag-ids 1,2,3 --json  # 태그 추가
inblog posts remove-tag <postId> <tagId> --json        # 태그 제거
```

### 포스트-저자 관계

```bash
inblog posts authors <postId> --json       # 포스트의 저자 목록
inblog posts add-authors <postId> --author-ids uuid1,uuid2 --json  # 저자 추가
inblog posts remove-author <postId> <authorId> --json              # 저자 제거
```

### 태그

```bash
inblog tags list --json       # 전체 (페이지네이션 없음, priority 순)
inblog tags get <id> --json
inblog tags create --name "태그명" --slug "tag-slug" --priority 0 --json
inblog tags update <id> --name "새이름" --json
inblog tags delete <id> --json
```

**태그 필드:**

| 필드 | DB 필드 | 설명 |
|------|--------|------|
| `name` | `title` | 태그 이름 (API에서 name으로 노출) |
| `slug` | `slug` | URL 슬러그 |
| `priority` | `priority` | 정렬 우선순위 (낮을수록 먼저) |

**ID 타입**: 정수 (string으로 반환)

### 저자

```bash
inblog authors list --page 1 --limit 10 --json
inblog authors get <id> --json
inblog authors update <id> --name "새 이름" --avatar-url "https://..." --json
```

**주의사항:**
- `create` 미구현 (서버에서 `NOT_IMPLEMENTED` 반환)
- 블로그에 포스트가 있는 프로필만 반환
- 시스템 저자(HelloInblogID)는 자동 필터링
- **ID 타입**: UUID

### 블로그

```bash
inblog blogs me --json         # 내 블로그 정보
inblog blogs list              # 접근 가능한 블로그 목록 (OAuth)
inblog blogs switch [id]       # 블로그 전환 (ID 또는 subdomain, 생략 시 대화형)
inblog blogs update --title "새 블로그명" --language "ko" --json
inblog blogs update --logo ./logo.png --favicon ./favicon.ico --og-image ./og.jpg --json
inblog blogs update --ga-id <id> --json
```

**블로그 필드:**

| 필드 | 설명 |
|------|------|
| `id` | 블로그 ID (정수) |
| `title` | 블로그 이름 |
| `subdomain` | 서브도메인 (ID로도 사용) |
| `description` | 블로그 설명 |
| `custom_domain` | 커스텀 도메인 |
| `custom_domain_verified` | 도메인 검증 상태 |
| `blog_language` | 블로그 언어 (ko, en 등) |
| `timezone_diff` | 타임존 오프셋 (시간) |
| `plan` | 요금제 |
| `logo_url` | 로고 URL |
| `favicon` | 파비콘 URL |
| `og_image` | 기본 OG 이미지 URL |
| `ga_measurement_id` | Google Analytics 측정 ID |
| `is_search_console_connected` | 서치콘솔 연결 상태 |
| `search_console_url` | 서치콘솔 사이트 URL |

### 커스텀 도메인

```bash
inblog blogs domain connect <domain>   # 도메인 연결 + DNS 레코드 안내
inblog blogs domain status             # 도메인 검증 상태 확인
inblog blogs domain disconnect         # 도메인 연결 해제
```

### 배너

```bash
inblog blogs banner get                # 현재 배너 설정 확인
inblog blogs banner set --image ./banner.png --title <text> --subtext <text> --title-color <hex> --bg-color <hex>
inblog blogs banner remove             # 배너 제거
```

### 서치콘솔

```bash
inblog search-console connect          # Google Search Console OAuth 연결
inblog search-console status           # 연결 상태 확인
inblog search-console disconnect       # 연결 해제
inblog search-console keywords --start-date 2026-02-01 --end-date 2026-03-01 --sort clicks --limit 20 --json
inblog search-console pages --start-date 2026-02-01 --end-date 2026-03-01 --sort clicks --limit 20 --json
```

**키워드/페이지 정렬:** `clicks`, `impressions`, `ctr`, `position`

### 트래픽 분석

```bash
# 블로그 전체 트래픽
inblog analytics traffic --interval day --type all --json

# 포스트별 성과
inblog analytics posts --sort visits --order desc --limit 20 --include title --json

# 유입 소스
inblog analytics sources --limit 20 --json

# 개별 포스트 트래픽
inblog analytics post <id> --interval day --json

# 개별 포스트 유입 소스
inblog analytics post <id> --sources --json
```

**날짜 기본값:** `--start-date` 28일 전, `--end-date` 오늘
**트래픽 정렬:** `visits`, `clicks`, `organic`, `cvr`
**인터벌:** `day` (기본), `hour`
**타입 필터:** `all`, `home`, `post`, `category`, `author`

### 리다이렉트

```bash
inblog redirects list --page 1 --limit 50 --json
inblog redirects get <id> --json
inblog redirects create --from "/old-path" --to "/new-path" --type 308 --json
inblog redirects update <id> --to "/newer-path" --json
inblog redirects delete <id> --json
```

- `redirect_type`: `307` (임시) 또는 `308` (영구, 기본값)
- 경로는 자동 정규화 (앞에 `/` 추가 등)
- `from_path` 중복 시 `REDIRECT_PATH_CONFLICT` (409)
- **ID 타입**: UUID

### 폼

```bash
inblog forms list --page 1 --limit 10 --json
inblog forms get <id> --json
```

### 폼 응답

```bash
inblog form-responses list --form-id <id> --page 1 --limit 10 --json
inblog form-responses get <id> --json
```

---

## 응답 형식 (JSON:API)

### 단일 리소스
```json
{
  "jsonapi": { "version": "1.0" },
  "data": {
    "type": "posts",
    "id": "123",
    "attributes": { "title": "..." },
    "relationships": { "tags": { "data": [{ "type": "tags", "id": "1" }] } },
    "links": { "self": "/v1/posts/123" }
  },
  "included": [{ "type": "tags", "id": "1", "attributes": { "name": "..." } }]
}
```

### 컬렉션
```json
{
  "jsonapi": { "version": "1.0" },
  "data": [{ ... }],
  "included": [{ ... }],
  "meta": { "total": 150, "page": 1, "limit": 10, "totalPages": 15 }
}
```

### CLI `--json` 출력
CLI는 JSON:API를 flat object로 변환하여 출력합니다:
```json
{
  "data": [
    { "id": "123", "title": "...", "slug": "...", "tags": [{ "id": "1", "name": "..." }] }
  ],
  "meta": { "total": 150, "page": 1, "limit": 10, "hasNext": true }
}
```

---

## 이미지 처리

### CLI 이미지 업로드

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

**주의:** `content_html`에 base64 data URI를 직접 넣으면 413 에러 발생.
- `--content-file` 사용 시: 로컬 경로/base64 → 자동 CDN 업로드 처리
- 수동 HTML 작성 시: `inblog images upload`로 먼저 URL 확보 후 사용

### API 이미지 처리 규칙

1. **외부 URL** → 기본적으로 inblog R2 스토리지에 자동 업로드
2. **Base64** (`data:image/...;base64,...`) → 항상 R2에 업로드 (최대 10MB)
3. **inblog CDN** (`source.inblog.dev`, `image.inblog.dev`) → 그대로 유지
4. `preserve_external_images=true` → 외부 URL 원본 유지

`content_html` 내 이미지도 동일 규칙 적용 (JSDOM으로 파싱 후 처리).

---

## 에러 코드 전체

| HTTP | 코드 | 의미 | 대응 |
|------|------|------|------|
| 400 | `VALIDATION_ERROR` | 필수 필드 누락/형식 오류 | 요청 확인 |
| 400 | `INVALID_SLUG` | slug 형식 오류 | 소문자+숫자+하이픈만 |
| 400 | `INVALID_DATE` | ISO 8601 날짜 형식 오류 | 날짜 형식 수정 |
| 400 | `PAST_SCHEDULED_DATE` | 예약 날짜가 과거 | 미래 날짜 사용 |
| 400 | `INVALID_TAG_IDS` | 존재하지 않는 태그 ID | 태그 목록 확인 |
| 400 | `INVALID_AUTHOR_IDS` | 블로그 멤버 아닌 저자 | 저자 목록 확인 |
| 400 | `INVALID_NOTION_URL` | Notion URL 형식 오류 | notion.so 도메인 확인 |
| 401 | `UNAUTHORIZED` | 인증 헤더 누락/잘못됨 | API 키 확인 |
| 401 | `INVALID_TOKEN` | API 키 유효하지 않음 | 새 키 발급 |
| 403 | `SUBSCRIPTION_REQUIRED` | 무료 플랜 블로그 | 유료 플랜 업그레이드 |
| 403 | `BLOG_MISMATCH` | 다른 블로그의 리소스 접근 | 본인 블로그 리소스만 |
| 404 | `POST_NOT_FOUND` | 포스트 없음 | ID 확인 |
| 404 | `TAG_NOT_FOUND` | 태그 없음 | ID 확인 |
| 404 | `NOTION_PAGE_NOT_FOUND` | Notion 페이지 접근 불가 | 페이지 공유 설정 확인 |
| 405 | `METHOD_NOT_ALLOWED` | HTTP 메서드 미지원 | 엔드포인트 확인 |
| 409 | `SLUG_CONFLICT` | slug 중복 | 다른 slug 사용 |
| 409 | `TAG_NAME_CONFLICT` | 태그 이름 중복 | 다른 이름 사용 |
| 409 | `REDIRECT_PATH_CONFLICT` | 리다이렉트 경로 중복 | 다른 경로 사용 |
| 500 | `INTERNAL_ERROR` | 서버 에러 | 재시도 |
| 501 | `NOT_IMPLEMENTED` | 미구현 기능 | 다른 방법 사용 |
| 502 | `NOTION_FETCH_FAILED` | Notion 서비스 장애 | 재시도 |

## 종료 코드 (CLI)

| 코드 | 의미 |
|------|------|
| 0 | 성공 |
| 1 | 사용자 에러 (인증 실패, 잘못된 입력 등) |
| 2 | API 에러 (서버 반환 에러) |
