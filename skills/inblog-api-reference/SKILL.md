---
name: inblog-api-reference
description: "inblog API 완벽 레퍼런스. 엔드포인트, 필드, 필터, 에러 코드 상세."
---

# inblog API 레퍼런스

이 스킬은 inblog CLI/API의 레퍼런스입니다. 엔드포인트, 필드, 에러 코드 확인 시 참조합니다.

## 빠른 참조

### 인증
```bash
inblog auth login          # Google OAuth 로그인
inblog auth status --json  # 인증 상태 확인
inblog auth logout         # 세션 제거
```

### 글로벌 옵션
- `--json` — JSON 출력 (stdout으로 데이터, stderr로 에러)
- `--no-input` — 대화형 프롬프트 비활성화
- `--base-url <url>` — API 기본 URL 변경

### 주요 리소스
| 리소스 | 주요 커맨드 | ID 타입 |
|--------|------------|---------|
| Posts | `posts list/get/create/update/delete/publish/unpublish/schedule` | 정수 |
| Tags | `tags list/get/create/update/delete` | 정수 |
| Authors | `authors list/get/update` (create 미지원) | UUID |
| Blogs | `blogs me/list/switch/update` | 정수 |
| Redirects | `redirects list/get/create/update/delete` | UUID |
| Forms | `forms list/get` (읽기 전용) | 정수 |
| Analytics | `analytics traffic/posts/sources/post` | — |
| Search Console | `search-console connect/status/keywords/pages` | — |
| Images | `images upload` | — |

### 종료 코드
| 코드 | 의미 |
|------|------|
| 0 | 성공 |
| 1 | 사용자 에러 (인증 실패, 잘못된 입력 등) |
| 2 | API 에러 (서버 반환 에러) |

### 흔한 에러 코드
| HTTP | 코드 | 대응 |
|------|------|------|
| 400 | `SLUG_CONFLICT` | 다른 slug 사용 |
| 400 | `INVALID_TAG_IDS` | `inblog tags list`로 확인 |
| 401 | `UNAUTHORIZED` | `inblog auth login` |
| 403 | `SUBSCRIPTION_REQUIRED` | Team 플랜 업그레이드 |
| 404 | `POST_NOT_FOUND` | ID 확인 |

## 상세 레퍼런스

엔드포인트별 필드, 필터, 에러 코드 전체는 `reference/endpoints.md`를 참조하세요.
