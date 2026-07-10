---
name: CXR14-BPALS
tagline: "Start by finding what's wrong. Refine from there."
purpose: "An independent trust signal over NIH ChestX-ray14's report-derived labels — find which to trust, and focus expert review where it's actually needed."
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
  trial: Free, CC-BY-NC, 1,000-row sample
  standard: Commercial license, full 6,598 rows (4,628 images), 1-year non-exclusive — pricing on request (hello@o5i.io)
  enterprise: Custom coverage — perpetual + domain adaptation
citation: "O5I (2026). CXR14-BPALS: An Independent Label-Quality Signal for NIH ChestX-ray14. Hugging Face Datasets."
license: "https://creativecommons.org/licenses/by-nc/4.0/"
agi_relevance: An upstream data-curation layer (label-quality + active-learning signal) for teams building medical visual-reasoning systems.
automation_load: Quarterly incremental refinement, single-operator maintainable.
hf_url: https://huggingface.co/datasets/o5i/cxr14-bpals-trial
launch_date: "2026-05-26"
status: live
series_roadmap:
  - code: S1a
    name: Trial release
    layer: Per-(image, label) trust signal + flagged hard-case set, free sample
    target_date: "2026-05-26"
    status: confirmed
  - code: S1b
    name: Commercial activation
    layer: + payment infrastructure, full license terms, 1% giving pledge
    target_date: "~2026-Q4"
    status: tentative
  - code: S2
    name: Diagnose
    layer: + diagnostic refinement (lesion location, observable signs)
    target_date: "~2026-10"
    status: tentative
  - code: S3
    name: Reason
    layer: + the reasoning detail behind each judgment
    target_date: "~2027-01"
    status: tentative
  - code: S4
    name: Report
    layer: + paraphrased report-style text per image
    target_date: "~2027-04"
    status: tentative
---

## What it is

NIH ChestX-ray14 is a public dataset of ~112,000 frontal chest radiographs (30,000 patients, 14 thoracic-disease labels). Its labels were extracted automatically from radiology reports rather than verified against the images, so a meaningful share are noisy or wrong.

CXR14-BPALS adds an independent **trust signal** over those labels. Each (image, label) pair is re-examined with a vision-language model, producing a per-label confidence and an agreement signal that flags the suspect, hard, and likely-mislabeled cases — including images crowded with support devices (chest tubes, lines, sternotomy wires) that confound both automated and expert labeling. You don't get a relabeled dataset; you get a map of which existing labels to trust, so you can train on the reliable majority and route the rest to review.

The dataset is annotation-only — the trust signal is keyed to each NIH image, which you load from the public upstream source. The baseline covers a curated set of 4,628 images; coverage expands toward the full collection over time. The free evaluation sample is stratified toward harder, lower-confidence cases — it is for assessing the signal, not a random slice of NIH or a measure of its overall error rate.

## Why this dataset

Medical imaging AI is increasingly gated behind proprietary models, non-commercial licenses, and large institutional pricing. BiomedCLIP, LLaVA-Med, RadFM and most domain-specific medical VLMs are licensed for academic use only — and large hospital data partnerships sit behind opaque pricing accessible to a handful of well-capitalized incumbents. Clinical AI teams in countries and institutions outside that perimeter often cannot use, or even evaluate, the very tools that would help them.

We chose NIH ChestX-ray14 — a fully unrestricted public dataset — and an open, permissively-licensed general-purpose VLM (Apache 2.0) because the result must remain usable by clinical AI startups, academic groups, hospital R&D, and individual researchers who cannot afford the gated medical AI stack. CXR14-BPALS is, in that sense, a small public-interest counterweight to the consolidation of medical imaging AI under a few large vendors.

## Why an open VLM (and not a medical VLM)

Domain-specific medical VLMs achieve higher raw accuracy on their training distributions, but their licenses prohibit commercial use, their weights are not freely redistributable, and their behavior cannot be audited by parties outside the original lab. An open, Apache-2.0 general-purpose VLM is auditable, redistributable, and free to fine-tune — which means CXR14-BPALS can be reproduced, contested, and improved by anyone. The "Bring Your Own VLM" principle is the same: if you don't trust ours, run the check with another open VLM and compare.

## Roadmap

CXR14-BPALS is a layered series. The baseline **identifies** label problems; each later release **deepens** the refinement on the same data, while **coverage broadens** toward the full NIH set — a single license accrues value over time rather than fragmenting across competing variants. Releases after S1 ship on demonstrated demand, not a fixed schedule; dates after S1 are tentative.

- **S1a Trial release** — 2026-05-26 (confirmed): per-(image, label) trust signal and the flagged hard-case set, as a free evaluation sample.
- **S1b Commercial activation** — ~2026-Q4 (tentative): full license terms, payment infrastructure, and the 1% giving pledge come online.
- **S2 Diagnose** — ~2026-10 (tentative): diagnostic refinement (lesion location, observable signs).
- **S3 Reason** — ~2027-01 (tentative): the reasoning detail behind each judgment.
- **S4 Report** — ~2027-04 (tentative): paraphrased report-style text per image.

Alongside this depth ladder, coverage expands from the baseline subset toward the full ~112K collection.

## A note on medical data pricing and openness

Medical AI data flows along a deeply asymmetric path. The raw signal — individual patients' bodies, scans, diagnoses, outcomes — is contributed at no compensation, often as a by-product of clinical care. The downstream models trained on that signal are then sold at high markups, frequently to the same institutions whose patients supplied the data, and almost never back to the patients themselves. Public medical datasets exist because researchers and institutions chose to release them. The current direction of the field — increasingly proprietary models, paywalled benchmarks, opaque hospital data deals — narrows that lineage further while preserving the underlying extraction pattern.

We think the pricing, licensing, and disclosure terms attached to medical AI data deserve more public scrutiny than they currently receive. We cannot return value directly to the patients whose scans underlie any medical dataset, but we can refuse to add another layer of enclosure on top of an already asymmetric flow, and we can route 1% of every sale (growing toward 10%) to organizations advancing patient access and public-interest medical research. CXR14-BPALS is one small example of what a permissively-licensed, open-VLM, transparently-documented medical AI dataset can look like. We hope to see more.

## Attribution

CXR14-BPALS includes the NIH attribution required by the original dataset terms:

- Source: https://nihcc.app.box.com/v/ChestXray-NIHCC
- NIH Clinical Center acknowledgment
- Wang et al. (2017), CVPR — original ChestX-ray14 paper
