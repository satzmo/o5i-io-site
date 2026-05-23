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
