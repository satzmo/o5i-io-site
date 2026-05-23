# DECISIONS — o5i-io-website

> append-only. 정본 (memory보다 우선).

---

## 2026-05-23 — MVP launch 결정

### [decision] Astro 6 + Tailwind v4 + CF Pages 채택

대안: Next.js+Vercel (ocean5i.com 동일, over-engineering), 단순 HTML+CDN (확장 시 재설계). 채택: 정적·빠르고·CF zone과 호스팅 통합·content collection으로 데이터셋 추가 자연 확장.

### [decision] 1-page MVP, 영어 only, 브라우저 자동 번역 위임

다국어 i18n 시스템 안 만듬. semantic HTML로 Chrome/Safari 자동번역 품질 최적화. 1인 운영 부담 최소.

### [decision] 1→10% Growing Pledge 사이트 명시

Hero badge + Mission bullet + Footer 3곳 일관 노출. 자동화 시스템은 별도 spec (`o5i-giving`), 첫 매출 전 완성.

### [decision] 메일과 같은 7/15 window launch

mailto:hello@o5i.io / support@o5i.io 노출은 메일 인프라 launch와 같은 시점.

### [decision] 0.5 Anonymous Operation 적용

Footer institutional ("O5I Inc. · Republic of Korea" only), Citation은 예외 1로 "Lim, S. (2026)" 학술 책임 유지, Git commits anonymous (`user.name="O5I Inc."`, `user.email="noreply@o5i.io"`).

### [analysis] Lighthouse 100/100/100/100

Initial measurement: Performance 100, Accessibility 88, Best Practices 100, SEO 100. Fixed:
- `<main>` landmark 추가 (index.astro)
- `text-neutral-500` → `text-neutral-700/600` (Footer·Mission section·DatasetCard chip 라벨)
- Disabled CTA color contrast

Final: 100/100/100/100.

### [decision] Hero copy grounded (0.4 Copy Tone Discipline)

이전 시적 표현 ("Every label we craft carries the intent it should serve: respect for humanity, love for life, contribution to continual learning") → grounded measurable ("Every dataset we publish documents its purpose, its limits, and what it teaches future AI"). Mission 1·3 body 동일 진화.
