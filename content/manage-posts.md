---
name: inblog-manage-posts
description: "포스트 관리. 수정, 발행, 비공개, 예약, 삭제. 트리거: '글 수정', '발행해줘', '비공개로', '글 삭제'"
---

# 포스트 관리 워크플로우

## 전제 조건

- `inblog auth status`로 인증/블로그 확인
- 미인증 시: `inblog auth login --blog <id 또는 subdomain>` (대화형 프롬프트 회피)
- 여러 블로그 보유 시: `inblog blogs list --json` → `inblog blogs switch <id 또는 subdomain>`
- Team 플랜 이상 필요

## 포스트 조회

```bash
# 전체 목록
inblog posts list

# 발행된 글만
inblog posts list --published

# 드래프트만
inblog posts list --draft

# 특정 태그 필터
inblog posts list --tag-id 123

# 포스트 상세
inblog posts get <id>
inblog posts get <id> --json
```

## 포스트 수정

```bash
# 제목 수정
inblog posts update <id> --title "새 제목"

# 메타 정보 수정
inblog posts update <id> \
  --meta-title "SEO 타이틀" \
  --meta-description "SEO 설명"

# 슬러그 수정
inblog posts update <id> --slug "new-slug"

# 콘텐츠 수정 (content 내 로컬 이미지/base64 자동 CDN 업로드)
inblog posts update <id> --content-file ./updated-content.html

# 커버 이미지 설정 (로컬 파일 또는 URL)
inblog posts update <id> --image ./cover.jpg
inblog posts update <id> --image https://source.inblog.dev/...
```

## 발행/비공개/예약

```bash
# 즉시 발행
inblog posts publish <id>

# 비공개로 전환
inblog posts unpublish <id>

# 예약 발행
inblog posts schedule <id> --at "2026-03-10T09:00:00Z"
```

## 태그/저자 관리

```bash
# 태그 목록
inblog posts tags <id>

# 태그 추가
inblog posts add-tags <id> --tag-ids 1,2,3

# 태그 제거
inblog posts remove-tag <postId> <tagId>

# 저자 목록
inblog posts authors <id>

# 저자 추가
inblog posts add-authors <id> --author-ids uuid1,uuid2

# 저자 제거
inblog posts remove-author <postId> <authorId>
```

## 포스트 삭제

```bash
inblog posts delete <id>
```

⚠️ 삭제는 되돌릴 수 없습니다. 삭제 전 유저에게 확인을 받으세요.

## 링크 제공

작업 완료 후 관련 링크 제공:

- **에디터:** `https://inblog.ai/dashboard/{subdomain}/{postId}`
- **공개 URL:** `https://{subdomain}.inblog.io/{slug}`
- 커스텀 도메인이 있으면: `https://{custom_domain}/{slug}`

## 에러 처리

| 에러 코드 | 해결 |
|-----------|------|
| POST_NOT_FOUND | 포스트 ID 확인 (`inblog posts list`) |
| SLUG_CONFLICT | 다른 슬러그 사용 |
| INVALID_TAG_IDS | `inblog tags list`로 유효한 ID 확인 |
| INVALID_AUTHOR_IDS | `inblog authors list`로 유효한 ID 확인 |
| PAST_SCHEDULED_DATE | 미래 날짜 사용 |
| SUBSCRIPTION_REQUIRED | Team 플랜 업그레이드 |
