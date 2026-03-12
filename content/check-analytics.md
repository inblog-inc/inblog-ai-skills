---
name: inblog-check-analytics
description: "트래픽, 키워드, SEO 분석, 성과 기반 인사이트. 트리거: '트래픽 확인', '키워드 분석', '성과 확인', 'SEO 분석', '성과 좋은 글'"
---

# 트래픽 & SEO 분석 워크플로우

## 전제 조건

- `inblog auth status`로 인증/블로그 확인
- 여러 블로그 보유 시: `inblog blogs list` → `inblog blogs switch <id 또는 subdomain>`
- Team 플랜 이상 필요
- 키워드 분석: Google Search Console 연결 필요 (`inblog search-console status`)

## 유저 인텐트별 워크플로우

### "전체 트래픽 확인"

```bash
# 일별 트래픽 추이
inblog analytics traffic --interval day --json

# 유입 소스 분석
inblog analytics sources --json
```

분석 포인트:
- 일별 트렌드 (증가/감소 추세, 피크 날짜)
- 방문, 클릭, 오가닉 비율
- 주요 유입 소스 (직접, 검색, 소셜, 리퍼럴)

### "성과 좋은 글 분석"

```bash
# 상위 포스트 (방문수 기준)
inblog analytics posts --sort visits --limit 10 --include title --json
```

분석 포인트:
- 상위 포스트 테이블 (제목, 방문, 클릭, CVR)
- CVR이 낮은 글 → CTA 추가/개선 제안
- 클릭 대비 방문이 낮은 글 → meta_description 개선 제안

개별 포스트 심층 분석:
```bash
# 특정 포스트의 시계열 트래픽
inblog analytics post <id> --interval day --json

# 특정 포스트의 유입 소스
inblog analytics post <id> --sources --json
```

### "키워드 분석" (서치콘솔 필요)

```bash
# 서치콘솔 연결 확인
inblog search-console status

# 미연결 시
inblog search-console connect

# 키워드 성과
inblog search-console keywords --sort clicks --json

# 페이지별 성과
inblog search-console pages --sort clicks --json
```

분석 포인트:
- 키워드별 clicks, impressions, CTR, position 테이블
- **기회 키워드 발굴:** impressions 높고 position > 10인 키워드 → 새 글 주제 제안
- **개선 대상:** CTR 낮고 position < 10인 키워드 → 기존 글 meta_description 개선
- **위닝 키워드:** position 1-3, CTR 높은 키워드 → 추가 콘텐츠 확장

### "특정 포스트 성과"

```bash
# 포스트 시계열 트래픽
inblog analytics post <id> --json

# 포스트 유입 소스
inblog analytics post <id> --sources --json
```

분석 포인트:
- 시간대별/일별 트래픽 패턴
- 유입 소스 분포
- 개선 포인트 제안

## 애널리틱스 → 액션 연결

분석 결과에서 다음 액션으로 자연스럽게 연결:

| 인사이트 | 제안 액션 | 연결 스킬 |
|----------|----------|----------|
| 기회 키워드 발견 | "이 키워드로 새 글을 작성할까요?" | `inblog-write-seo-post` |
| CTR 낮은 글 | "meta_description을 개선할까요?" | `inblog-manage-posts` |
| CVR 낮은 글 | "CTA를 추가할까요?" | `inblog-manage-posts` |
| 성과 좋은 주제 | "비슷한 주제로 추가 글을 작성할까요?" | `inblog-write-seo-post` |
| 서치콘솔 미연결 | "서치콘솔을 연결할까요?" | `inblog-setup-blog` |

## 날짜 범위

- 기본: 최근 28일
- 커스텀: `--start-date YYYY-MM-DD --end-date YYYY-MM-DD`
- 서치콘솔 데이터는 2-3일 지연이 있을 수 있음

## 정렬/필터

- 트래픽: `--interval day|hour`, `--type all|home|post|category|author`
- 포스트: `--sort visits|clicks|organic|cvr`, `--order asc|desc`
- 키워드: `--sort clicks|impressions|ctr|position`
- 공통: `--limit N` (기본 20)
