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

## What it is

CXR14-BPALS layers Bayesian active-learning confidence metadata on top of the NIH ChestX-ray14 multi-label classification dataset (14 thoracic diseases, 112K frontal chest radiographs across 30K patients). Each row carries the original NIH label, a confidence score derived from multi-prompt VLM agreement, and a visual-reasoning trace decomposed across five radiological axes (brightness, markings, abnormal shapes, edges, symmetry). Teams can train competitive multi-label models using stratified high-confidence subsets — often a fraction of the full label set — without sacrificing AUC on the standard test split.

## Why this dataset

Medical imaging AI is increasingly gated behind proprietary models, non-commercial licenses, and large institutional pricing. BiomedCLIP, LLaVA-Med, RadFM and most domain-specific medical VLMs are licensed for academic use only — and large hospital data partnerships sit behind opaque pricing accessible to a handful of well-capitalized incumbents. Clinical AI teams in countries and institutions outside that perimeter often cannot use, or even evaluate, the very tools that would help them.

We chose NIH ChestX-ray14 — a fully unrestricted public dataset — and an open-source general-purpose VLM (Qwen2.5-VL, Apache 2.0) because the result must remain usable by clinical AI startups, academic groups, hospital R&D, and individual researchers who cannot afford the gated medical AI stack. CXR14-BPALS is, in that sense, a small public-interest counterweight to the consolidation of medical imaging AI under a few large vendors.

## Why open-source VLM (and not a medical VLM)

Domain-specific medical VLMs achieve higher raw accuracy on their training distributions, but their licenses prohibit commercial use, their weights are not freely redistributable, and their behavior cannot be audited by parties outside the original lab. An open-source general-purpose VLM under Apache 2.0 is auditable, redistributable, and free to fine-tune — which means CXR14-BPALS can be reproduced, contested, and improved by anyone. The "Bring Your Own VLM" path in the spec is the same principle: if you don't trust ours, run the pipeline with another open VLM and compare.

## A note on medical data pricing and openness

Medical AI data flows along a deeply asymmetric path. The raw signal — individual patients' bodies, scans, diagnoses, outcomes — is contributed at no compensation, often as a by-product of clinical care. The downstream models trained on that signal are then sold at high markups, frequently to the same institutions whose patients supplied the data, and almost never back to the patients themselves. Public medical datasets exist because researchers and institutions chose to release them. The current direction of the field — increasingly proprietary models, paywalled benchmarks, opaque hospital data deals — narrows that lineage further while preserving the underlying extraction pattern.

We think the pricing, licensing, and disclosure terms attached to medical AI data deserve more public scrutiny than they currently receive. We cannot return value directly to the patients whose scans underlie any medical dataset, but we can refuse to add another layer of enclosure on top of an already asymmetric flow, and we can route 1% of every sale (growing toward 10%) to organizations advancing patient access and public-interest medical research. CXR14-BPALS is one small example of what a permissively-licensed, open-VLM, transparently-documented medical AI dataset can look like. We hope to see more.

## Attribution

CXR14-BPALS includes the NIH attribution required by the original dataset terms:

- Source: https://nihcc.app.box.com/v/ChestXray-NIHCC
- NIH Clinical Center acknowledgment
- Wang et al. (2017), CVPR — original ChestX-ray14 paper
