# o5i.io Landing Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Astro 4 + Tailwind + Cloudflare Pages로 o5i.io 1-page landing 사이트(영어, 5 section, CXR14-BPALS 카드 1건, 1→10% pledge 명시)를 빌드·배포·DNS 연결한다.

**Architecture:** Astro 정적 site → CF Pages 자동 빌드 → o5i.io CNAME 매핑. 콘텐츠는 영문 확정본을 컴포넌트에 직접 하드코드 + CXR14-BPALS만 content collection으로 분리(향후 데이터셋 추가 자연 확장). 메일 인프라 spec과 7/15 같은 window에 launch.

**Tech Stack:** Astro 4.x, Tailwind CSS 3, TypeScript, Cloudflare Pages, Cloudflare DNS, GitHub.

**Reference Spec:** `~/projects/o5i-io-website/docs/specs/2026-05-23-o5i-io-website-design.md`

---

## File Structure

| 경로 | 책임 | Task |
|---|---|---|
| `~/projects/o5i-io-website/package.json` | Astro·Tailwind 의존성 | 1 |
| `~/projects/o5i-io-website/astro.config.mjs` | Astro config (site URL, integrations) | 1 |
| `~/projects/o5i-io-website/tailwind.config.mjs` | Tailwind config | 1 |
| `~/projects/o5i-io-website/tsconfig.json` | TypeScript config | 1 |
| `~/projects/o5i-io-website/src/styles/global.css` | Tailwind base + custom (lang 자동번역 친화) | 1 |
| `~/projects/o5i-io-website/src/content/config.ts` | content collection schema (7-slot zod) | 2 |
| `~/projects/o5i-io-website/src/content/datasets/cxr14-bpals.md` | CXR14-BPALS frontmatter + 본문 | 2 |
| `~/projects/o5i-io-website/src/components/Footer.astro` | footer (회사·연락처·pledge 1줄) | 3 |
| `~/projects/o5i-io-website/src/components/SchemaChips.astro` | 7 slot chip 가로 배치 | 3 |
| `~/projects/o5i-io-website/src/components/DatasetCard.astro` | 1 데이터셋 카드 (4 slot + HF CTA) | 4 |
| `~/projects/o5i-io-website/src/components/Mission.astro` | mission 4 bullet | 5 |
| `~/projects/o5i-io-website/src/components/Hero.astro` | hero + pledge badge + CTA 2건 | 6 |
| `~/projects/o5i-io-website/src/pages/index.astro` | 5 section 조합 + meta·OG | 7 |
| `~/projects/o5i-io-website/public/favicon.svg` | favicon (간단 monogram) | 7 |
| `~/projects/o5i-io-website/public/og-image.png` | OG 1200×630 share 카드 | 7 |
| `~/projects/o5i-io-website/.gitignore` | node_modules·dist·.env | 9 |
| `~/projects/o5i-io-website/README.md` | 운영자 entry | 11 |
| `~/projects/o5i-io-website/DECISIONS.md` | append-only 결정 박제 | 11 |
| `~/vscode-workspace/o5i_io_website_spark.code-workspace` | VSCode 워크스페이스 | 11 |
| `~/vscode-workspace/README.md` | 인덱스 갱신 (1줄 추가) | 11 |
| 본 spec (~/projects/o5i-io-website/docs/specs/...) | markdownlint cleanup | 11 |

---

## Task 1: Astro 프로젝트 초기화 + Tailwind 셋업

**Files:**
- Create: `~/projects/o5i-io-website/package.json`
- Create: `~/projects/o5i-io-website/astro.config.mjs`
- Create: `~/projects/o5i-io-website/tailwind.config.mjs`
- Create: `~/projects/o5i-io-website/tsconfig.json`
- Create: `~/projects/o5i-io-website/src/styles/global.css`

- [ ] **Step 1: Node 버전 확인**

```bash
node --version
```
Expected: `v22.x.x` 또는 `v24.x.x` (Astro 4는 Node 18.17.1 / 20.3.0 / 21+ 필요).

- [ ] **Step 2: Astro 프로젝트 init (minimal 템플릿)**

빈 디렉토리에 init하려면 `--template minimal --typescript strict --no-install --no-git`:

```bash
cd ~/projects/o5i-io-website
npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git --skip-houston
```

대화형 prompt가 "Continue with existing files?" 같은 걸 물으면 Yes (이미 docs/, worklogs/ 있음).

Expected: package.json, astro.config.mjs, tsconfig.json, src/pages/index.astro 등이 생성됨.

- [ ] **Step 3: Tailwind integration 추가**

```bash
cd ~/projects/o5i-io-website
npx astro add tailwind --yes
npm install
```
Expected: `@astrojs/tailwind`, `tailwindcss` 의존성 추가됨. `tailwind.config.mjs` 생성됨.

- [ ] **Step 4: astro.config.mjs에 site URL 명시**

`~/projects/o5i-io-website/astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://o5i.io',
  integrations: [tailwind()],
});
```

- [ ] **Step 5: global.css에 base + 자동번역 친화 규칙**

`~/projects/o5i-io-website/src/styles/global.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  --font-serif: "Iowan Old Style", "Apple Garamond", "Baskerville", "Times New Roman", serif;
}

html {
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

body {
  background: #ffffff;
  color: #0b0b0b;
}

/* auto-translate-friendly: avoid splitting words across lines */
p, li {
  overflow-wrap: break-word;
  hyphens: auto;
}
```

`~/projects/o5i-io-website/src/pages/index.astro` 상단에 import 보장:
```astro
---
import '../styles/global.css';
---
<!-- 본 task에선 빈 페이지로 충분, Task 7에서 채움 -->
<html lang="en">
  <body>placeholder</body>
</html>
```

- [ ] **Step 6: dev server 가동 + 200 OK 확인**

```bash
cd ~/projects/o5i-io-website && npm run dev &
sleep 5
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4321/
kill %1
```
Expected: `200`. Astro dev banner 출력 + curl 200.

---

## Task 2: Content Collection schema (7-slot) + CXR14-BPALS 콘텐츠

**Files:**
- Create: `~/projects/o5i-io-website/src/content/config.ts`
- Create: `~/projects/o5i-io-website/src/content/datasets/cxr14-bpals.md`

- [ ] **Step 1: content collection schema 작성**

`~/projects/o5i-io-website/src/content/config.ts`:
```typescript
import { defineCollection, z } from 'astro:content';

const datasetCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    purpose: z.string(),
    ethical_use: z.object({
      allowed: z.array(z.string()),
      forbidden: z.array(z.string()),
    }),
    frontier: z.string(),
    accessibility: z.object({
      trial: z.string(),
      standard: z.string(),
      enterprise: z.string(),
    }),
    citation: z.string(),
    agi_relevance: z.string(),
    automation_load: z.string(),
    hf_url: z.string().optional(),
    launch_date: z.string(),
    status: z.enum(['draft', 'announced', 'live']),
  }),
});

export const collections = {
  datasets: datasetCollection,
};
```

- [ ] **Step 2: CXR14-BPALS 콘텐츠 작성 (7-slot frontmatter)**

`~/projects/o5i-io-website/src/content/datasets/cxr14-bpals.md`:
```markdown
---
name: CXR14-BPALS
tagline: Domain-agnostic label confidence on NIH ChestX-ray14 via Bayesian Active Learning.
purpose: Reduce labeling cost up to ~12x via confidence-stratified subsets. Bring your own VLM, train smarter.
ethical_use:
  allowed:
    - Medical research
    - Diagnostic AI tooling
    - Clinical AI education
  forbidden:
    - Insurance discrimination
    - Patient re-identification
    - Military medical targeting
frontier: Medical imaging baselines for global-south clinical AI startups and academic groups.
accessibility:
  trial: Free, CC-BY-NC, 1K rows preview
  standard: Commercial license, full 112K rows, 1-year non-exclusive
  enterprise: Custom — perpetual + custom domain adaptation
citation: "Lim, S. (2026). CXR14-BPALS: Bayesian Active Learning for Multi-Label Chest X-ray Diagnosis. Hugging Face Datasets."
agi_relevance: Cold-start baseline for medical visual reasoning systems. Active-learning reasoning trace embedded as upstream signal for future foundation models.
automation_load: Quarterly incremental relabeling, single-operator maintainable.
launch_date: "2026-07-15"
status: announced
---

CXR14-BPALS adds Bayesian-active-learning confidence metadata to the NIH ChestX-ray14 dataset using a domain-agnostic VLM pipeline. The result is a label-confidence stratified training set, enabling teams to train competitive multi-label chest X-ray models with a fraction of the original labels.

Attribution per NIH terms is included in the data card on Hugging Face.
```

- [ ] **Step 3: build로 schema validation 확인**

```bash
cd ~/projects/o5i-io-website && npm run build
```
Expected: `▶ src/content/datasets/cxr14-bpals.md` validated. 빌드 success. schema mismatch 시 에러 메시지로 즉시 fail.

---

## Task 3: Footer + SchemaChips 컴포넌트

**Files:**
- Create: `~/projects/o5i-io-website/src/components/Footer.astro`
- Create: `~/projects/o5i-io-website/src/components/SchemaChips.astro`

- [ ] **Step 1: Footer.astro 작성**

`~/projects/o5i-io-website/src/components/Footer.astro`:
```astro
---
const year = new Date().getFullYear();
---
<footer class="border-t border-neutral-200 mt-24 py-12 text-sm text-neutral-600">
  <div class="max-w-4xl mx-auto px-6 space-y-4">
    <div>
      <span class="font-medium text-neutral-900">O5I Inc.</span>
      &nbsp;·&nbsp; Republic of Korea
    </div>
    <div class="space-x-4">
      <a href="mailto:hello@o5i.io" class="underline hover:text-neutral-900">hello@o5i.io</a>
      <a href="mailto:support@o5i.io" class="underline hover:text-neutral-900">support@o5i.io</a>
    </div>
    <div class="space-x-4">
      <a href="https://github.com/satzmo/o5i-io-site" class="underline hover:text-neutral-900" rel="noopener">GitHub</a>
      <a href="https://huggingface.co/" class="underline hover:text-neutral-900" rel="noopener">Hugging Face</a>
    </div>
    <div class="text-neutral-500">
      1% → 10% pledge · every sale, automatically.
      Annual transparency report at <span class="font-mono">o5i.io/giving</span> (coming).
    </div>
    <div class="text-neutral-400 pt-2">
      © {year} O5I Inc. &nbsp; Purpose-embedded datasets for the AI era.
    </div>
  </div>
</footer>
```

- [ ] **Step 2: SchemaChips.astro 작성**

`~/projects/o5i-io-website/src/components/SchemaChips.astro`:
```astro
---
const slots = [
  'purpose',
  'ethical_use',
  'frontier',
  'accessibility',
  'citation',
  'agi_relevance',
  'automation_load',
];
---
<div class="flex flex-wrap gap-2 justify-center mt-6">
  {slots.map((slot) => (
    <span class="px-3 py-1 text-xs font-mono rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
      {slot}
    </span>
  ))}
</div>
```

- [ ] **Step 3: build 확인**

```bash
cd ~/projects/o5i-io-website && npm run build
```
Expected: 빌드 success.

---

## Task 4: DatasetCard 컴포넌트

**Files:**
- Create: `~/projects/o5i-io-website/src/components/DatasetCard.astro`

- [ ] **Step 1: DatasetCard.astro 작성**

`~/projects/o5i-io-website/src/components/DatasetCard.astro`:
```astro
---
import type { CollectionEntry } from 'astro:content';

interface Props {
  dataset: CollectionEntry<'datasets'>;
}

const { dataset } = Astro.props;
const d = dataset.data;
const isLive = d.status === 'live' && d.hf_url;
---
<article class="border border-neutral-200 rounded-lg p-8 max-w-2xl mx-auto">
  <h3 class="text-2xl font-semibold text-neutral-900">{d.name}</h3>
  <p class="mt-2 text-neutral-700">{d.tagline}</p>

  <dl class="mt-6 space-y-3 text-sm">
    <div class="grid grid-cols-[100px_1fr] gap-3">
      <dt class="font-mono text-neutral-500 uppercase text-xs pt-0.5">Purpose</dt>
      <dd class="text-neutral-800">{d.purpose}</dd>
    </div>
    <div class="grid grid-cols-[100px_1fr] gap-3">
      <dt class="font-mono text-neutral-500 uppercase text-xs pt-0.5">Frontier</dt>
      <dd class="text-neutral-800">{d.frontier}</dd>
    </div>
    <div class="grid grid-cols-[100px_1fr] gap-3">
      <dt class="font-mono text-neutral-500 uppercase text-xs pt-0.5">License</dt>
      <dd class="text-neutral-800">
        Trial — {d.accessibility.trial}<br/>
        Standard — {d.accessibility.standard}<br/>
        Enterprise — {d.accessibility.enterprise}
      </dd>
    </div>
    <div class="grid grid-cols-[100px_1fr] gap-3">
      <dt class="font-mono text-neutral-500 uppercase text-xs pt-0.5">Cite</dt>
      <dd class="text-neutral-800 italic">{d.citation}</dd>
    </div>
  </dl>

  <div class="mt-8">
    {isLive ? (
      <a
        href={d.hf_url}
        class="inline-block px-5 py-2 rounded bg-neutral-900 text-white font-medium hover:bg-neutral-700"
        rel="noopener"
      >
        View on Hugging Face →
      </a>
    ) : (
      <span class="inline-block px-5 py-2 rounded bg-neutral-200 text-neutral-500 font-medium cursor-not-allowed">
        View on Hugging Face → (Coming July 2026)
      </span>
    )}
  </div>
</article>
```

- [ ] **Step 2: build 확인**

```bash
cd ~/projects/o5i-io-website && npm run build
```
Expected: 빌드 success. CollectionEntry type 오류 없음.

---

## Task 5: Mission 컴포넌트 (4 bullet 포함 1→10% pledge)

**Files:**
- Create: `~/projects/o5i-io-website/src/components/Mission.astro`

- [ ] **Step 1: Mission.astro 작성**

`~/projects/o5i-io-website/src/components/Mission.astro`:
```astro
---
const bullets = [
  {
    title: 'ACTIVE GOOD, NOT PASSIVE VIRTUE',
    body: "We don't abandon. We don't look away. We correct. Public datasets steeped in surveillance, violence, or bias are precisely what we must label, mitigate, and transform — so what we hand to the next model is documented, not laundered.",
  },
  {
    title: 'CONTINUAL LEARNING IS FOREVER',
    body: 'Superintelligence is not omniscience. Frontiers keep expanding — Earth, space, climate. So does the need for honest, purpose-embedded data.',
  },
  {
    title: "YOUR LABELS BECOME AI'S REASONING",
    body: 'A label is not just a class. It is a signal embedded in every model trained on it — and in models distilled from those.',
  },
  {
    title: '1% TODAY, 10% TOMORROW',
    body: '1% of every sale is automatically donated to organizations advancing humanity and life. As revenue stabilizes, we grow this share step by step — toward 10%.',
  },
];
---
<section id="mission" class="max-w-4xl mx-auto px-6 py-20">
  <h2 class="text-sm font-mono uppercase tracking-widest text-neutral-500 text-center">
    Why we exist
  </h2>
  <div class="mt-10 grid md:grid-cols-2 gap-10">
    {bullets.map((b) => (
      <div>
        <h3 class="text-base font-mono uppercase tracking-wide text-neutral-900">
          {b.title}
        </h3>
        <p class="mt-3 text-neutral-700 leading-relaxed">{b.body}</p>
      </div>
    ))}
  </div>
</section>
```

- [ ] **Step 2: build 확인**

```bash
cd ~/projects/o5i-io-website && npm run build
```
Expected: 빌드 success.

---

## Task 6: Hero 컴포넌트 (headline + sub + pledge badge + CTA 2건)

**Files:**
- Create: `~/projects/o5i-io-website/src/components/Hero.astro`

- [ ] **Step 1: Hero.astro 작성**

`~/projects/o5i-io-website/src/components/Hero.astro`:
```astro
---
// no props — content is fixed at MVP
---
<section class="max-w-4xl mx-auto px-6 pt-28 pb-20 text-center">
  <h1 class="text-4xl md:text-6xl font-semibold tracking-tight text-neutral-900 leading-tight">
    Purpose-embedded datasets<br class="hidden md:block"/>
    for the AI era.
  </h1>
  <p class="mt-6 text-lg text-neutral-700 max-w-2xl mx-auto leading-relaxed">
    Every dataset we publish documents its purpose,
    its limits, and what it teaches future AI.
  </p>

  <div class="mt-8">
    <span class="inline-block px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wide bg-emerald-50 text-emerald-800 border border-emerald-200">
      1% of every sale today — growing toward 10% as we scale
    </span>
  </div>

  <div class="mt-12 flex flex-wrap gap-4 justify-center">
    <a
      href="#datasets"
      class="px-6 py-3 rounded bg-neutral-900 text-white font-medium hover:bg-neutral-700"
    >
      Explore Datasets ↓
    </a>
    <a
      href="https://huggingface.co/"
      class="px-6 py-3 rounded border border-neutral-300 text-neutral-800 font-medium hover:bg-neutral-50"
      rel="noopener"
    >
      Hugging Face Profile →
    </a>
  </div>
</section>
```

- [ ] **Step 2: build 확인**

```bash
cd ~/projects/o5i-io-website && npm run build
```
Expected: 빌드 success.

---

## Task 7: index.astro 조합 + OG meta + favicon + og-image placeholder

**Files:**
- Modify: `~/projects/o5i-io-website/src/pages/index.astro` (전체 교체)
- Create: `~/projects/o5i-io-website/public/favicon.svg`
- Create: `~/projects/o5i-io-website/public/og-image.png` (1200×630 placeholder)

- [ ] **Step 1: favicon.svg 작성 (간단 monogram)**

`~/projects/o5i-io-website/public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#0b0b0b"/>
  <text x="32" y="42" text-anchor="middle" font-family="ui-sans-serif, system-ui" font-size="28" font-weight="600" fill="#ffffff">o5i</text>
</svg>
```

- [ ] **Step 2: og-image.png placeholder 생성**

```bash
cd ~/projects/o5i-io-website
python3 - <<'PYEOF'
from PIL import Image, ImageDraw, ImageFont
img = Image.new('RGB', (1200, 630), color=(11, 11, 11))
d = ImageDraw.Draw(img)
try:
    font_big = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 64)
    font_sm = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 28)
except Exception:
    font_big = ImageFont.load_default()
    font_sm = ImageFont.load_default()
d.text((80, 220), 'Purpose-embedded datasets', font=font_big, fill=(255, 255, 255))
d.text((80, 300), 'for the AI era.', font=font_big, fill=(255, 255, 255))
d.text((80, 420), 'o5i.io  ·  O5I Inc.', font=font_sm, fill=(200, 200, 200))
d.text((80, 470), '1% of every sale — growing toward 10%', font=font_sm, fill=(100, 200, 140))
img.save('public/og-image.png', optimize=True)
print('og-image.png written:', img.size)
PYEOF
ls -la public/og-image.png
```
Expected: PNG ~30~80KB 생성. PIL 없으면 `mamba install -c conda-forge pillow -y`.

- [ ] **Step 3: index.astro 전체 작성**

`~/projects/o5i-io-website/src/pages/index.astro`:
```astro
---
import '../styles/global.css';
import { getEntry } from 'astro:content';
import Hero from '../components/Hero.astro';
import Mission from '../components/Mission.astro';
import DatasetCard from '../components/DatasetCard.astro';
import SchemaChips from '../components/SchemaChips.astro';
import Footer from '../components/Footer.astro';

const cxr14 = await getEntry('datasets', 'cxr14-bpals');

const siteTitle = 'O5I — Purpose-embedded datasets for the AI era';
const siteDesc = 'O5I Inc. publishes AI datasets that document their purpose, ethical use, and what they teach future AI. 1% of every sale automatically donated to mission-aligned organizations, growing toward 10%.';
const siteUrl = 'https://o5i.io/';
const ogImage = 'https://o5i.io/og-image.png';
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{siteTitle}</title>
    <meta name="description" content={siteDesc} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content={siteUrl} />
    <meta property="og:title" content={siteTitle} />
    <meta property="og:description" content={siteDesc} />
    <meta property="og:image" content={ogImage} />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={siteTitle} />
    <meta name="twitter:description" content={siteDesc} />
    <meta name="twitter:image" content={ogImage} />
  </head>
  <body>
    <Hero />
    <Mission />

    <section id="datasets" class="py-20 bg-neutral-50">
      <h2 class="text-sm font-mono uppercase tracking-widest text-neutral-500 text-center">
        Datasets
      </h2>
      <div class="mt-10 px-6">
        <DatasetCard dataset={cxr14} />
      </div>
    </section>

    <section id="how" class="max-w-4xl mx-auto px-6 py-20 text-center">
      <h2 class="text-sm font-mono uppercase tracking-widest text-neutral-500">
        How we build
      </h2>
      <p class="mt-6 text-neutral-700 max-w-2xl mx-auto leading-relaxed">
        Every dataset is documented across a 7-slot schema —
        making purpose, ethics, and limits visible to anyone.
      </p>
      <SchemaChips />
    </section>

    <Footer />
  </body>
</html>
```

- [ ] **Step 4: build + dev server visual check**

```bash
cd ~/projects/o5i-io-website && npm run build
```
Expected: `dist/index.html` 생성. 약 80~120KB.

```bash
cd ~/projects/o5i-io-website && npm run dev &
sleep 3
curl -s http://localhost:4321/ | grep -E "Purpose-embedded|CXR14-BPALS|1% of every sale|hello@o5i.io"
kill %1
```
Expected: 4 grep 모두 hit (hero·dataset·pledge·footer email).

---

## Task 8: 로컬 dev 검증 + Lighthouse score

**Files:** (no files modified)

- [ ] **Step 1: 정적 빌드 + preview server**

```bash
cd ~/projects/o5i-io-website
npm run build
npm run preview &
sleep 3
```

- [ ] **Step 2: Lighthouse CLI 측정**

```bash
which lighthouse || npm install -g lighthouse
lighthouse http://localhost:4321/ --output=json --output-path=/tmp/lh-o5i.json --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless --no-sandbox" --quiet
python3 -c "
import json
d = json.load(open('/tmp/lh-o5i.json'))
for k, v in d['categories'].items():
    print(f\"  {k:20s} {round(v['score']*100):3d}\")
"
kill %1
```
Expected: 4 카테고리 모두 ≥ 95. 95 미달 항목이 있으면 lighthouse JSON의 audits 섹션에서 어떤 audit가 빠졌는지 확인 → 경량 fix (이미지 alt, meta description 길이 등).

- [ ] **Step 3: 자동 번역 확인 (수동)**

대표님 manual: Chrome에서 `http://localhost:4321/` 열고 우클릭 → "Translate to Korean" 또는 "한국어로 번역". Hero·Mission·Dataset 카드가 자연스러운 한국어로 번역되는지 확인. 어색한 문장이 있으면 메모 (Task 11 cleanup 단계에서 wording 조정).

---

## Task 9: GitHub 저장소 생성 + .gitignore + 첫 commit

**Files:**
- Create: `~/projects/o5i-io-website/.gitignore`

- [ ] **Step 1: .gitignore 작성**

`~/projects/o5i-io-website/.gitignore`:
```
node_modules/
dist/
.astro/
.env
.env.local
.env.*.local
.DS_Store
*.log
```

- [ ] **Step 2: git init + anonymous git config + 첫 commit (0.5 적용)**

```bash
cd ~/projects/o5i-io-website
git init -b main

# 0.5 Anonymous Operation: 본 repo만 anonymous identity
git config user.name "O5I Inc."
git config user.email "noreply@o5i.io"

git add .gitignore astro.config.mjs tailwind.config.mjs tsconfig.json package.json package-lock.json src/ public/ docs/ README.md DECISIONS.md
git status
git commit -m "Initial commit: o5i.io landing MVP (Astro + Tailwind + CF Pages)"
```
Expected: commit author "O5I Inc. <noreply@o5i.io>". 전역 `~/.gitconfig`는 건드리지 않음 (다른 repo는 sehan.lim 유지).

검증: `git log --format='%an <%ae>' -1` → `O5I Inc. <noreply@o5i.io>`

> README.md·DECISIONS.md는 Task 11에서 작성 — 그 시점 이후 Task 9를 다시 돌거나 추가 commit 1건으로 처리. 본 Task에서는 빈 README 1줄 둠:
> `echo "# o5i-io-website" > README.md && echo "(see DECISIONS.md, see docs/specs/)" >> README.md`

- [ ] **Step 3: GitHub 신규 repo 생성 (manual, browser)**

대표님 browser: https://github.com/new
- Owner: `satzmo` (대표님 본인 계정, 0.5 doctrine 정합)
- Repo: `o5i-io-site`
- Visibility: Private 또는 Public — Public 권장 (CF Pages free plan + open source signal)
- Add README/.gitignore/license 모두 체크 X (이미 로컬에 있음)
- Create repository

- [ ] **Step 4: remote 추가 + push**

```bash
cd ~/projects/o5i-io-website
git remote add origin git@github.com:satzmo/o5i-io-site.git
git push -u origin main
```
Expected: 첫 push 성공. SSH key는 spark에 기존 ocean5i.com 설정 동일 ([[o5i-website]] 참고).

---

## Task 10: Cloudflare Pages 연결 + DNS CNAME + SSL 검증

**대표님이 CF Dashboard에서 수행. Claude는 안내·검증만.**

- [ ] **Step 1: CF Pages 프로젝트 생성**

https://dash.cloudflare.com → Account → Workers & Pages → Create application → Pages → Connect to Git
- Connect GitHub → `satzmo/o5i-io-site` 선택
- Build settings:
  - Framework preset: **Astro**
  - Build command: `npm run build`
  - Build output directory: `dist`
  - Node version: `20.x` (또는 22.x)
- Production branch: `main`
- Click "Save and Deploy"

→ 첫 빌드 시작. 2~3분 후 `<project>.pages.dev` 형식 URL 부여됨. 메모.

- [ ] **Step 2: 빌드 성공 확인**

CF Pages dashboard에서 "Deployments" 탭 → 첫 deployment status가 "Success". `<project>.pages.dev` URL 클릭 → 본 페이지 정상 렌더링 확인.

Expected: Hero·Mission·Dataset·Footer 모두 정상.

- [ ] **Step 3: o5i.io 커스텀 도메인 연결**

CF Pages 프로젝트 → "Custom domains" 탭 → "Set up a custom domain"
- Domain: `o5i.io` 입력 → Continue → CF가 자동으로 `CNAME @ → <project>.pages.dev` 추가 안내 → "Activate domain"
- 다시 "Set up a custom domain" → Domain: `www.o5i.io` → 동일 진행

CF 자동으로 DNS 레코드를 zone에 추가하므로 수동 DNS 작업 없음.

- [ ] **Step 4: DNS·SSL 검증 (CLI)**

```bash
dig +short o5i.io
dig +short www.o5i.io
curl -sI https://o5i.io | head -5
curl -sI https://www.o5i.io | head -5
```
Expected:
- dig: A 또는 CNAME으로 CF IP 응답
- curl: `HTTP/2 200`, `server: cloudflare`

SSL 인증서는 CF가 자동 발급 (5~15분 소요 가능). 처음에 526/503 나오면 5분 대기 후 재시도.

- [ ] **Step 5: 브라우저 다목적지 visual 확인 (manual)**

대표님: Chrome, Safari, Firefox에서 `https://o5i.io/` 열어보고:
- Hero·Mission·Dataset·Footer 모두 정상
- pledge badge 가독성 OK
- mailto: 클릭 시 메일 클라이언트 열림
- "View on Hugging Face → (Coming July 2026)" disabled state 확인
- mobile (스마트폰 브라우저): Hero 줄바꿈 자연스럽게

이슈 발견 시 메모 → Task 11 cleanup에서 수정.

---

## Task 11: README + DECISIONS + 워크스페이스 + cleanup + 마무리 박제

**Files:**
- Create: `~/projects/o5i-io-website/README.md`
- Create: `~/projects/o5i-io-website/DECISIONS.md`
- Create: `~/vscode-workspace/o5i_io_website_spark.code-workspace`
- Modify: `~/vscode-workspace/README.md` (1줄 추가)
- Modify: `~/projects/o5i-io-website/docs/specs/2026-05-23-o5i-io-website-design.md` (markdownlint cleanup)
- Modify: `~/projects/o5i-mission/DECISIONS.md` (완료 박제 append)

- [ ] **Step 1: README.md 작성**

`~/projects/o5i-io-website/README.md`:
```markdown
# o5i-io-website

O5I Inc. AI 비즈니스 도메인 `o5i.io`의 1-page landing 사이트.

## Stack
Astro 4 + Tailwind CSS 3 + TypeScript → Cloudflare Pages (auto-deploy from `main`).

## Local dev
```
npm install
npm run dev        # http://localhost:4321
npm run build      # → dist/
npm run preview    # serve dist/
```

## Content updates
- 데이터셋 카드: `src/content/datasets/<id>.md` (frontmatter = 7-slot schema, `src/content/config.ts`)
- 텍스트(Hero·Mission·Footer): 해당 컴포넌트 직접 수정
- CXR14-BPALS launch 후 `status: live` + `hf_url` 설정 → 빌드·deploy

## Deploy
`git push` → CF Pages 자동 빌드 (1~2분) → `https://o5i.io`.

## Related
- 상위 워크스페이스: [[o5i_mission]] (~/projects/o5i-mission/)
- 메일 인프라: [[o5i-io-mail]] (~/projects/o5i-io-mail/)
- 첫 데이터셋: [[project_cxr14_bpals_business_v0_1]]
- 1→10% pledge 자동화: 별도 spec (Google Tasks `o5i-giving`)
```

- [ ] **Step 2: DECISIONS.md 작성 (시드 박제)**

`~/projects/o5i-io-website/DECISIONS.md`:
```markdown
# DECISIONS — o5i-io-website

> append-only. 정본 (memory보다 우선).

## 2026-05-23 — MVP launch 결정

### [decision] Astro + Tailwind + CF Pages 채택
대안: Next.js+Vercel (ocean5i.com 동일 스택, over-engineering), 단순 HTML+CDN (확장 시 재설계). 채택 이유: 정적·빠르고·CF zone과 호스팅 통합·content collection으로 데이터셋 추가 자연 확장.

### [decision] 1-page MVP, 영어 only, 브라우저 자동 번역 위임
다국어 i18n 시스템 안 만듬. semantic HTML로 Chrome/Safari 자동번역 품질 최적화. 1인 운영 부담 최소.

### [decision] 1→10% Growing Pledge 사이트 명시
Hero badge + Mission bullet + Footer 3곳 일관 노출. 자동화 시스템은 별도 spec (`o5i-giving`), 첫 매출 전 완성.

### [decision] 메일과 같은 7/15 window launch
mailto:hello@o5i.io / support@o5i.io 노출은 메일 인프라 launch와 같은 시점.
```

- [ ] **Step 3: VSCode 워크스페이스 파일 생성**

`~/vscode-workspace/o5i_io_website_spark.code-workspace`:
```json
{
  "folders": [
    {
      "path": "/home/shlim/projects/o5i-io-website",
      "name": "o5i-io-website (본진)"
    }
  ],
  "settings": {
    "files.exclude": {
      "**/.DS_Store": true,
      "**/node_modules": true,
      "**/dist": true,
      "**/.astro": true
    }
  }
}
```

- [ ] **Step 4: ~/vscode-workspace/README.md 인덱스 갱신**

`~/vscode-workspace/README.md`의 "현재 등록된 워크스페이스" 표에 1줄 추가:
```
| `o5i_io_website_spark.code-workspace` | spark | `~/projects/o5i-io-website/` | (단일 root) | o5i.io landing 사이트 (Astro + Tailwind + CF Pages, 2026-05-23 신설) |
```

- [ ] **Step 5: spec markdownlint cleanup**

```bash
which mdformat || mamba install -c conda-forge mdformat -y
mdformat --wrap no ~/projects/o5i-io-website/docs/specs/2026-05-23-o5i-io-website-design.md
markdownlint ~/projects/o5i-io-website/docs/specs/2026-05-23-o5i-io-website-design.md 2>&1 | wc -l
```
Expected: 경고 수 크게 감소 (MD060 같은 환경별 룰은 0으로 안 떨어질 수 있음 — cosmetic OK).

- [ ] **Step 6: o5i-mission/DECISIONS.md에 사이트 launch 박제**

`~/projects/o5i-mission/DECISIONS.md` append (끝에):
```markdown

## 2026-MM-DD (실 launch 일) — o5i.io 사이트 v1 launch

### [decision] o5i.io 1-page landing 사이트 v1 운영 개시
- URL: https://o5i.io
- 산출물: ~/projects/o5i-io-website/ (Astro + Tailwind + CF Pages)
- 사명 thesis의 첫 외화 channel — 12 통찰 + 선함 axiom + 1→10% pledge 모두 사이트에 직간접 발현
- 이후 사이트 변경은 본 워크스페이스 DECISIONS.md(`~/projects/o5i-io-website/DECISIONS.md`)에 박제
```

- [ ] **Step 7: 최종 commit + push**

```bash
cd ~/projects/o5i-io-website
git add README.md DECISIONS.md docs/
git commit -m "Add README, DECISIONS, spec cleanup"
git push
```
Expected: CF Pages 자동 빌드 trigger. 1~2분 후 deployment success. https://o5i.io 정상.

- [ ] **Step 8: spark→dellma 백업**

마무리 step 5d에서 자동 처리되지만 즉시 강제:
```bash
~/bin/spark-to-dellma-backup.sh
```

---

## Self-Review

### Spec coverage

| Spec 섹션 | 구현 Task |
|---|---|
| 1. 동기 | (문서) |
| 2.1 포함 (1-page, 5 section, 4 slot, mailto, CF Pages) | T1·T2·T3·T4·T5·T6·T7·T10 모두 |
| 2.2 out-of-scope | (T7 index.astro에 명시적으로 페이지 1개) |
| 3.1 tech stack | T1 |
| 3.2 데이터 흐름 | T9·T10 |
| 3.3 컴포넌트 책임 | T3·T4·T5·T6 |
| 4.1 Hero copy | T6 |
| 4.2 Mission 4 bullet | T5 |
| 4.3 Datasets card | T2·T4 |
| 4.4 How we build chips | T3 (SchemaChips) + T7 (index 조합) |
| 4.5 Footer | T3 |
| 5 디렉토리 | T1·T2·T11 |
| 6.1 CF Pages 셋업 | T10 |
| 6.2 DNS CNAME | T10 (CF가 자동 추가) |
| 6.3 메일과 7/15 launch | T9 (mailto 표시) + 운영 시점 일치는 spec 노트 |
| 7.1 콘텐츠 갱신 | T11 README |
| 7.2 모니터링 | T10 dashboard 확인 |
| 7.3 백업 | T11 spark→dellma |
| 7.4 1→10% pledge | T5 (Mission), T6 (Hero badge), T3 (Footer), T2 (— 콘텐츠 자체엔 직접 표기 없음, mission에서 다룸) |
| 8 사명 정합 검증 | (문서) |
| 9 acceptance 10건 | T7·T8·T10 모두 검증 |
| 10 다음 단계 | (본 plan이 그것) |

**갭 없음**. 모든 spec 요구사항이 task로 mapping됨.

### Placeholder scan

- T1 Step 2의 `--skip-houston`: Astro CLI 옵션 (대화형 mascot skip), 실제 옵션. OK.
- T7 Step 2 `huggingface.co/` URL: 실 handle 결정 시 갱신. T2의 `hf_url` field도 launch 시점에 채움. Plan 내 명시.
- T10 `<project>.pages.dev`: CF가 자동 부여, plan에 그렇게 명시. OK.
- T11 DECISIONS 박제의 `YYYY-MM-DD`: 실 launch 일에 채움. Plan에 그렇게 명시. OK.

모두 의도된 자리. 진짜 placeholder 없음.

### Type consistency

- `CollectionEntry<'datasets'>` (T4) ↔ `defineCollection({type: 'content', schema:...})` (T2): 일관 ✓
- `dataset.data.status === 'live'` (T4) ↔ `z.enum(['draft','announced','live'])` (T2): 일관 ✓
- `getEntry('datasets', 'cxr14-bpals')` (T7) ↔ 파일명 `cxr14-bpals.md` (T2): 일관 ✓
- `dataset.data.accessibility.{trial,standard,enterprise}` (T4) ↔ schema (T2): 일관 ✓
- `dataset.data.hf_url` optional (T2) → T4의 `isLive = status === 'live' && d.hf_url` 조건: 일관 ✓

이름·signature 모두 일관.

---

## Execution Handoff

Plan complete and saved to `~/projects/o5i-io-website/docs/plans/2026-05-23-o5i-io-website-setup.md`. Two execution options:

**1. Subagent-Driven (recommended)** — Claude가 task별 fresh subagent dispatch, task 간 review checkpoint. 본 plan은 manual step(T1 Step 2의 npm create 대화, T9 Step 3 GitHub repo 생성, T10 Steps 1·3·5 CF Pages·DNS·visual)에서 대표님 작업 요청 후 재개.

**2. Inline Execution** — 본 세션에서 직접 executing-plans로 batch 진행. 더 빠르나 컨텍스트 길어짐.

어느 쪽으로 진행할까요? 또는 일단 plan만 두고 다른 흐름(예: 수혜 단체 brainstorming, 메일 plan 실행 등)으로 가실 수도 있습니다.
