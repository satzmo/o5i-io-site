# o5i.io Landing Site (MVP) — Design Spec

- **작성일**: 2026-05-23
- **작성자**: 임세한 (O5I Inc.)
- **상태**: Draft (대표님 리뷰 대기)
- **상위 워크스페이스**: `o5i_mission` — 본 사이트는 사명 thesis와 12 통찰의 *외화 channel*
- **연관 spec**: `~/projects/o5i-io-mail/docs/specs/2026-05-23-o5i-io-mail-design.md` (메일 인프라, 같은 7/15 launch window)
- **선행 메모리**: `project_o5i_io_domain`, `project_o5i_mission_thesis_v0_1`, `project_cxr14_bpals_business_v0_1`, `o5i-website`(ocean5i.com 참고)

## 1. 동기

### 1.1 사업 맥락
- O5I Inc.의 AI 비즈니스 본진 도메인 `o5i.io`는 현재 어떤 서비스도 안 가리킴 (Cloudflare zone만 active, 방어용 DNS 3건).
- 2026-W5(6/29~7/5) Vercel 신규 사이트 빌드가 이미 메모리에 예정되어 있었음.
- 첫 데이터셋 상품 CXR14-BPALS가 7/15 HF Hub launch 예정. 사이트는 그 직전·동시 launch가 자연.

### 1.2 진짜 목적 (대표님 명시)
> "우리 미션을 장황하지 않게, 직관적으로 우리의 비즈니스 모델이 지향하는 점을 분명히 인식할 수 있도록 구성하자, 판매하는 데이터셋이 우리 미션이 전파되어 나가는 거지."

→ **사이트의 핵심 기능 = 사명 thesis의 직관적 전시 + 그 thesis가 발현된 첫 데이터셋(CXR14-BPALS)으로의 연결**. 데이터셋이 단순 상품이 아닌 *미션 전파의 통로*임을 첫 화면에서 인식 가능해야 함.

### 1.3 사명 워크스페이스와의 관계
사이트는 [[project_o5i_mission_thesis_v0_1]] 12 통찰의 압축·외화. 의사결정 필터 0~5번 (선함·upstream·purpose-embedded·frontier·판매망·1인 부담·AGI 지속성)이 모두 본 spec에 반영.

## 2. 범위 (MVP)

### 2.1 포함
- 영어 단일 (en) 1 page landing
- 5 section (Hero / Mission / Datasets / How / Footer)
- 첫 데이터셋(CXR14-BPALS) 카드 1건 (7-slot schema 중 핵심 4 slot 노출)
- mailto CTA (메일 인프라 7/15 동시 launch 전제)
- Cloudflare Pages 정적 배포

### 2.2 명시적 out-of-scope (YAGNI)
- 블로그·뉴스·changelog
- Datasets catalog index page (현재 1건이라 카드 충분)
- 별도 About / Pricing 페이지 (footer 1줄 + 카드 내 짧게)
- Auth·결제 (HF Hub로 위임)
- 다국어 i18n 시스템 (브라우저 자동 번역 위임 — 대표님 결정)
- 분석·tracking (필요 시 CF Web Analytics 무료, 별도 spec)
- BIMI·OG share Twitter Card 고급 (기본 OG만)

## 3. 아키텍처

### 3.1 기술 스택
| 영역 | 선택 | 이유 |
|---|---|---|
| Framework | Astro 4.x | 정적 site 빌드, semantic HTML 출력, content collection으로 향후 데이터셋 확장 자연 |
| Style | Tailwind CSS 3 | utility-first, 1인 운영 부담 최소, 디자인 일관성 |
| 호스팅 | Cloudflare Pages | o5i.io zone이 이미 CF에 있어 DNS 통합 자연, 무료 plan 충분, edge 빠름 |
| DNS | Cloudflare | 기존 zone에 `CNAME @, www → <pages>.pages.dev` 2건 추가 |
| 저장소 | GitHub `LimJih00n/o5i-io-site` (또는 신규) | CF Pages 자동 빌드 trigger, push 1회로 배포 |
| 언어 | 영어 only, `<html lang="en">` | 글로벌 시간차 시장, semantic HTML로 브라우저 자동번역 친화 |

### 3.2 데이터 흐름
```
[대표님 commit → GitHub push]
        ↓
[Cloudflare Pages 자동 빌드 (Astro build)]
        ↓
[정적 자산 deploy → CF edge 전 세계 캐시]
        ↓
[사용자 → o5i.io / www.o5i.io] ── 정적 HTML 즉시 응답
        │
        ├─ [View on Hugging Face →] ──→ huggingface.co/datasets/...
        └─ [mailto:hello@o5i.io] ──→ CF Email Routing (메일 spec) → Gmail
```

### 3.3 컴포넌트 (`src/components/`)
| 파일 | 책임 | 책임 아님 |
|---|---|---|
| `Hero.astro` | thesis 한 문장 + sub-line + primary CTA 2건 | 데이터셋 정보 |
| `Mission.astro` | 3 bullet (good direction / continual learning / upstream impact) | 데이터셋, contact |
| `DatasetCard.astro` | 1 데이터셋의 4 slot 노출 + HF link | 7-slot 전체 펼침 (향후 상세 페이지에서) |
| `SchemaChips.astro` | 7-slot 이름만 chip 가로 배치 (의지·목적·frontier 등) | chip 클릭 인터랙션 |
| `Footer.astro` | 회사명·발명자 1줄·연락처·외부 링크 | About 본문 |

각 컴포넌트는 props 없이 또는 최소 props만 받음. `Hero`만 props 받음 (향후 A/B 테스트 가능성).

## 4. 콘텐츠 (영문, 확정본)

### 4.1 Hero
- **Headline**: `Purpose-embedded datasets for the AI era.`
- **Sub-line**: `Every dataset we publish documents its purpose, its limits, and what it teaches future AI.`
- **Pledge badge** (Hero 아래 작은 chip 형태): `1% of every sale today — growing toward 10% as we scale.`
- **Primary CTA**: `Explore Datasets ↓` (페이지 내 #datasets 앵커)
- **Secondary CTA**: `Hugging Face Profile →` (외부)

### 4.2 Mission section (4 bullet)
```
ACTIVE GOOD, NOT PASSIVE VIRTUE
We don't abandon. We don't look away. We correct.
Public datasets steeped in surveillance, violence,
or bias are precisely what we must label, mitigate,
and transform — so what we hand to the next model
is documented, not laundered.

CONTINUAL LEARNING IS FOREVER
Superintelligence is not omniscience.
Frontiers keep expanding — Earth, space, climate.
So does the need for honest, purpose-embedded data.

YOUR LABELS BECOME AI'S REASONING
A label is not just a class. It is a signal
embedded in every model trained on it — and in
models distilled from those.

1% TODAY, 10% TOMORROW
1% of every sale is automatically donated to
organizations advancing humanity and life.
As revenue stabilizes, we grow this share
step by step — toward 10%.
```

> 1번째 bullet 진화 사유 (2026-05-23 대표님 통찰): "선함이 선한 것만 보는 것이 아니다, 교화가 더 중요." 단순 select/reject framing("We choose what to label — and what not to")은 표층. 회피된 악은 다른 곳에 그대로 남아 AGI 학습에 들어가므로, 직접 정제·교화하는 것이 진정한 선함. [[project_o5i_mission_thesis_v0_1]] § 0.1 참조.

### 4.3 Datasets section (CXR14-BPALS 카드, 1건)
```
CXR14-BPALS
────────────────────────────────────────
Domain-agnostic label confidence on
NIH ChestX-ray14 via Bayesian Active
Learning. Bring your own VLM, train smarter.

PURPOSE     Reduce labeling cost up to ~12x
            via confidence-stratified subsets.
FRONTIER    Medical imaging baselines for
            global-south clinical AI startups.
LICENSE     Trial (CC-BY-NC) · Standard
            (commercial, $X/year) · Enterprise.
CITE        Lim, S. (2026). CXR14-BPALS:
            Bayesian Active Learning for
            Multi-Label Chest X-ray Diagnosis.

[View on Hugging Face →]  (Coming July 2026)
```

CXR14 launch 전: `[View on Hugging Face →]` 버튼 disabled state + "Coming July 2026" label.
CXR14 launch 후 (7/15+): 버튼 active, label 제거, 실 HF URL 연결.

### 4.4 How we build (operationalize)
```
HOW WE BUILD

Every dataset is documented across a 7-slot schema —
making purpose, ethics, and limits visible to anyone.

[ purpose ] [ ethical_use ] [ frontier ] [ accessibility ]
[ citation ] [ agi_relevance ] [ automation_load ]
```
Chip은 시각적 element만, 클릭 인터랙션 없음 (MVP).

### 4.5 Footer
```
O5I Inc.   ·   Sehan Lim, Ph.D.   ·   Republic of Korea

hello@o5i.io     support@o5i.io
GitHub: github.com/LimJih00n     Hugging Face: huggingface.co/<handle>

1% → 10% pledge · every sale, automatically.
Annual transparency report at o5i.io/giving (coming).

© 2026 O5I Inc.   Purpose-embedded datasets for the AI era.
```

## 5. 디렉토리·저장소 구조

```
~/projects/o5i-io-website/
├── README.md                       사이트 운영자 entry
├── DECISIONS.md                    append-only 결정 누적
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
├── tsconfig.json
├── src/
│   ├── pages/
│   │   └── index.astro             1 page MVP 전체
│   ├── components/
│   │   ├── Hero.astro
│   │   ├── Mission.astro
│   │   ├── DatasetCard.astro
│   │   ├── SchemaChips.astro
│   │   └── Footer.astro
│   ├── content/
│   │   ├── config.ts               content collection schema (7-slot)
│   │   └── datasets/
│   │       └── cxr14-bpals.md      frontmatter = 7-slot, body = 상세
│   └── styles/global.css
├── public/
│   ├── favicon.svg
│   └── og-image.png                1200x630 OG share 카드
├── docs/
│   ├── specs/2026-05-23-o5i-io-website-design.md      본 문서
│   └── plans/2026-05-23-o5i-io-website-setup.md       implementation plan (writing-plans 단계 산출)
└── worklogs/                       워크스페이스 메인 워크로그
```

GitHub: `LimJih00n/o5i-io-site` (지훈님 계정, 기존 ocean5i.com 동일 패턴 — `.gitignore`에 `.env*`, `dist/`, `node_modules/`)

VSCode 워크스페이스: `~/vscode-workspace/o5i_io_website_spark.code-workspace` (단일 호스트=spark)

## 6. 배포·DNS

### 6.1 CF Pages 셋업
1. CF dashboard → Pages → Create application → Connect to Git (GitHub LimJih00n/o5i-io-site)
2. Build settings: framework preset = Astro, build command = `npm run build`, output dir = `dist`
3. Production branch = `main`, preview branches = 자동 (PR 마다)

### 6.2 DNS 변경 (Cloudflare zone `o5i.io`)
| 작업 | Type | Name | Value | Proxy |
|---|---|---|---|---|
| 추가 | CNAME | `@` | `<project>.pages.dev` | Proxied (orange) |
| 추가 | CNAME | `www` | `<project>.pages.dev` | Proxied |

CF Pages가 자동으로 SSL 발급. `o5i.io`와 `www.o5i.io` 모두 활성. www → apex redirect는 Cloudflare Page Rule 1건으로.

### 6.3 메일 spec과의 동시 launch
사이트 launch와 메일 인프라(o5i-io-mail) launch 모두 **7/15 window**. 그 전엔:
- 사이트: dev/staging 환경에서 빌드·미리보기만
- 메일: spec·plan 자산 유지, 실행은 7월 초

사용자에게 mailto: 노출은 메일 인프라 launch와 같은 timestamp 또는 그 후.

## 7. 운영

### 7.1 콘텐츠 갱신 워크플로우
1. `src/content/datasets/<new>.md` 추가 (frontmatter 7-slot)
2. `src/pages/index.astro`에서 새 카드 import (또는 자동 list 도입은 dataset 2건 시점부터)
3. `git push` → CF Pages 자동 빌드·deploy (~1분)

### 7.2 모니터링
- CF Pages dashboard에서 빌드 실패·404 등 확인 (월 1회 점검)
- CF Web Analytics 무료 활성화 검토 (cookie-free, GDPR 친화)

### 7.3 백업
- spark→dellma 정기 백업에 `~/projects/o5i-io-website/` 포함 ([[feedback_spark_dellma_backup]])
- GitHub repo가 사실상 백업 (코드+콘텐츠 모두)

## 7.4 1% → 10% Growing Pledge (대표님 결정, 2026-05-23)

### 정책
- **사업 시작 시 상품 매출의 1%**를 자동으로 미션 정합 단체·조직에 기부
- **매출 증가·수익 안정화에 따라 점진적으로 비율 확대 → 최대 10%**
- "자동" = 결제 → 영수증 → 비율 분리 → 분기/연 1회 송금이 *코드 path로 박힘*
- 약속(soft pledge) 아닌 *system commitment*
- 비율은 config-driven (단순 상수 아닌), 단계 변경 시 코드 수정 없이 적용

### 단계 (예시 — 구체 trigger는 별도 결정)
| 단계 | 비율 | 적용 조건 (TBD) |
|---|---|---|
| Phase 1 | 1% | 사업 시작 ~ 매출 안정화 전 |
| Phase 2 | 3% | (예) ARR ₩X 도달 또는 흑자 N분기 연속 |
| Phase 3 | 5% | (예) ARR ₩Y 도달 |
| Phase 4 | 7% | (예) 운영 인건비·고정비 충당 후 잉여율 안정 |
| Phase 5 (ceiling) | 10% | (예) 장기 안정 운영 |

→ 정량 trigger는 별도 결정 (자동 발동 vs 매년 결산 시 대표님 판단 vs 이사회 의결 등 옵션). MVP는 1% 시작 + 매년 결산 시 점검 권장.

### 사이트 노출
- Hero 아래 pledge badge (단문 chip)
- Mission section 4번째 bullet `1% PLEDGED, ALWAYS`
- Footer 1줄 + `o5i.io/giving` 향후 페이지 안내
- Annual transparency report (연 1회 갱신, 별도 spec)

### 자동화 spec (본 spec 외, follow-up)
- 별도 spec `o5i-1pct-giving` 필요 (Stripe/Paddle webhook → 1% 분리 회계 → 분기 일괄 송금 → 영수증 박제)
- Google Tasks에 등록, 첫 매출 발생 시점에 launch
- 사이트 launch 시점엔 *pledge 선언만 노출*, 실제 자동화는 첫 매출 이전에 완성

### 수혜 단체 선정 (별도 결정, 본 spec 외)
- 사명 thesis와 정렬: 인류 존중·기여 + 생명 사랑
- 후보 카테고리: 의료 접근성·환경·교육·기후·생물 다양성
- 한국·글로벌 비율, 단일 단체 vs 다중 분산, 매년 갱신 vs 영구 등은 별도 결정
- 7/15 launch 전 1차 선정 권장 (사이트에 명시 가능)

### 회계·법무
- 한국 법인 기부금 손금산입 (지정기부금 한도 내)
- 매년 결산 시 1% 실제 지급 확인 + 사이트 transparency report 갱신
- 자비스 세무기장에 분개 처리 의뢰 ([[project_jarvis_tax_bookkeeping]])

### 위반 시 영향
- 약속하고 실행 안 하면 false signal → 사명 thesis 전체 신뢰도 손상
- → 자동화가 핵심: 의지에 의존하지 않는 시스템 강제

## 8. 사명 thesis 정합 검증 (의사결정 필터 0~5)

| 필터 | 통과 여부·근거 |
|---|---|
| 0 선함 axiom | ✓ Mission section 명시 ("We don't abandon. We don't look away. We correct.") + **1% Pledge로 axiom의 재무 강제 (§7.4)** |
| 0.4 Copy Tone Discipline | ✓ Hero sub-line·Mission 1·3 body·OG description 모두 grounded (5-test 통과 — measurability·falsifiability·sentimental flag·grandiosity flag·Mission 4 모범) |
| 0.5 Anonymous Operation | ✓ Footer institutional only ("Sehan Lim, Ph.D." 제거), Citation은 예외 1로 "Lim, S. (2026)" 유지 (학술 책임), Git anonymous config (Task 9 Step 2) |
| 0' upstream impact | ✓ Mission section의 "Your labels become AI's reasoning" |
| 1 frontier·시간차 | ✓ Dataset card "global-south clinical AI startups" 명시 |
| 2 purpose-embedded | ✓ Hero·How we build 모두 "purpose" 키워드 중심 |
| 3 판매망 신뢰축 | ✓ License·Cite 카드에 노출, mailto + HF link |
| 4 1인 운영 부담 | ✓ Astro 정적·CF Pages 무료·1 page·자동 번역 위임 |
| 5 AGI 지속성 | ✓ "Continual learning is forever" 정면 노출 |

## 9. 성공 기준 (acceptance)

본 spec 구현 종료 시점에 모두 true:

1. `https://o5i.io` 와 `https://www.o5i.io` 모두 SSL 정상 응답, HTML lang="en"
2. Hero·Mission·Datasets·How·Footer 5 section 모두 렌더링
3. CXR14-BPALS 카드 4 slot 노출 (purpose·frontier·license·cite)
3a. Hero pledge badge + Mission 4번째 bullet "1% PLEDGED" + Footer 1% 줄 모두 렌더링
4. CF Pages 자동 빌드 OK (build log green)
5. mailto:hello@o5i.io 클릭 시 메일 클라이언트 열림 (실 도달은 메일 인프라 launch에 의존)
6. Chrome·Safari·Firefox 데스크탑 + 모바일 1종 렌더링 정상
7. Lighthouse score: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95
8. Chrome 자동 번역으로 한국어·중국어·아랍어 변환 시 의미 유지
9. OG share 이미지가 Twitter·LinkedIn·Slack 미리보기에 정상 표시
10. README + DECISIONS.md 박제 완료, VSCode 워크스페이스 등록

## 10. 다음 단계 (writing-plans 입력)

본 spec 승인 후 `superpowers:writing-plans` 스킬로 단계별 실행 계획 작성. 예상 task 수: 8~10 (Astro 초기화 → 컴포넌트 5개 → 콘텐츠 작성 → CF Pages 연결 → DNS 추가 → 도달성 검증 → Lighthouse → 박제). 메일 인프라 plan과 7/15 같은 window에 묶어 진행.
