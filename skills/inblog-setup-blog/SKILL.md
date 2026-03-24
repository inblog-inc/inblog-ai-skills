---
name: inblog-setup-blog
description: "인블로그 셋업. 설정 상태 점검, 누락 보완. 트리거: '인블로그 셋업', '블로그 시작', '블로그 설정'"
---

# 스마트 블로그 셋업 워크플로우

## 전제 조건

이 워크플로우는 인블로그 블로그의 초기 설정 또는 설정 점검을 수행합니다.

## 워크플로우

### Step 1: CLI 설치 확인

```bash
# CLI 설치 확인
inblog --version

# 미설치 시
npm install -g @inblog/cli
```

### Step 2: 인증

```bash
# 미인증 시
inblog auth login

# 인증 상태 확인
inblog auth status
```

### Step 2-A: 블로그 전환 (여러 블로그 보유 시)

```bash
# 보유 블로그 목록 확인
inblog blogs list

# 블로그 전환 (ID 또는 subdomain)
inblog blogs switch 123
inblog blogs switch my-subdomain

# 대화형 선택
inblog blogs switch
```

### Step 3: 블로그 상태 파싱

```bash
inblog blogs me --json
```

응답에서 설정 상태를 파싱하여 헬스체크 출력:

```
블로그 설정 상태:
✅ 제목: "My Blog"
✅ 설명: 설정됨
❌ 로고: 미설정
❌ 파비콘: 미설정
✅ 언어: ko
✅ 타임존: +9
❌ OG 이미지: 미설정
❌ GA: 미연결
❌ 커스텀 도메인: 미설정
❌ 서치콘솔: 미연결
❌ 배너: 미설정
```

추가 확인:
```bash
inblog tags list     # 태그 수
inblog authors list  # 저자 수
```

### Step 4: 설정 진행

"어떤 설정을 진행할까요?" → 유저 선택에 따라:

#### 로고/파비콘/OG 이미지
```bash
# 로컬 파일 지원 (자동 CDN 업로드)
inblog blogs update --logo ./logo.png
inblog blogs update --favicon ./favicon.ico
inblog blogs update --og-image ./og.jpg

# URL도 가능
inblog blogs update --logo https://example.com/logo.png
```

#### Google Analytics
유저에게 GA4 측정 ID (G-XXXXXXXXXX) 요청 후:
```bash
inblog blogs update --ga-id G-XXXXXXXXXX
```

#### 서치콘솔
```bash
inblog search-console connect
```

#### 커스텀 도메인
```bash
inblog blogs domain connect blog.example.com
# DNS 레코드 안내 출력
inblog blogs domain status  # DNS 전파 확인
```

#### 배너
```bash
# 로컬 파일 지원 (자동 CDN 업로드)
inblog blogs banner set --image ./banner.png --title "블로그 제목" --subtext "설명 텍스트"
```

#### 태그 생성
```bash
inblog tags create --name "태그이름" --slug "tag-slug"
```

### Step 5: 대시보드 전용 설정 안내

CLI로 설정할 수 없는 항목은 대시보드 링크 제공:

| 설정 | URL |
|------|-----|
| 커스텀 UI 상세 | `https://inblog.ai/dashboard/{subdomain}/custom-ui` |
| 팀 멤버 | `https://inblog.ai/dashboard/{subdomain}/settings/staff` |
| 폼 관리 | `https://inblog.ai/dashboard/{subdomain}/forms` |
| 결제/플랜 | `https://inblog.ai/dashboard/{subdomain}/settings/billing` |

### Step 6: 완료

설정 완료 후 최종 헬스체크 다시 실행하여 개선 상태 확인.

## 에러 처리

| 에러 코드 | 해결 |
|-----------|------|
| SUBSCRIPTION_REQUIRED | Team 플랜 업그레이드 필요 |
| UNAUTHORIZED | `inblog auth login`으로 재인증 |
| VALIDATION_ERROR | 입력값 확인 (이미지 형식, GA ID 형식 등) |
| BLOG_MISMATCH | `inblog blogs switch`로 올바른 블로그 선택 |

## 참고

- Team 플랜 이상에서만 CLI 사용 가능
- 이미지는 로컬 파일 경로 또는 외부 URL 사용 가능 (자동 CDN 업로드)
- 서치콘솔 연결 시 Google 계정 OAuth 인증 필요
