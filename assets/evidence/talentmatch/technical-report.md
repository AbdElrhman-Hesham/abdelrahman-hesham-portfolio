# TalentMatch — Technical Report

Capstone Project 3: *TalentMatch AI — Intelligent CV & Job Matching and Recommendation System*.
All numbers below are produced by the notebooks in this repository and saved in `02_model/reports/`.

## 1. Problem and scope

**User and decision.** A recruiter (or career advisor) has one job description and many CVs and must decide who to
read first. TalentMatch produces a ranked shortlist with evidence; it does **not** decide who is hired.

**What "match" means.** A match is written evidence in the CV for what the job asks: similar wording (TF-IDF),
similar topics (LSA), coverage of the job's required skills (skills taxonomy) and enough years of experience. The
system outputs, per candidate, a 0–100 evidence score, the points contributed by each signal, the matched and
missing skills and the predicted professional field of the CV. It also works the other way round
(candidate-to-job): one CV scored against several jobs.

**Target job families.** The 28 jobs of the ranking dataset are grouped into five families: Software, Data & AI;
IT Infrastructure; Engineering; Business & Finance; HR & Administration. The field classifier covers the 24
categories of the Resume dataset.

**Excluded on purpose.** `address` and `age_requirement` are never used. Gender, age, nationality, religion and
marital-status words are removed from every text before matching. No photos or disability information are used.
No large language model is used.

## 2. Data

| Dataset | Size | Use |
|---|---|---|
| Resume Data for Ranking (Kaggle) | 9,544 CV–job pairs, 35 columns, `matched_score` 0–1 | analysis, Power BI, ranking model |
| Resume Dataset (Kaggle, `Resume.csv`) | 2,484 CVs, 24 categories | field classifier; unlabelled text for embeddings |

**Audit findings** (`01_data_analysis/data_cleaning_and_eda.ipynb`, `02_model/01_resume_classification.ipynb`)

* 9,544 rows contain only **343 distinct candidates** × 28 jobs → every split is done by candidate.
* The candidate column `responsibilities` equals the job's responsibilities in **100 %** of rows → dropped (target leakage).
* One CV was submitted twice with different scores → merged, scores averaged (9,516 pairs remain).
* Columns with 60–93 % missing values (languages, certification links, extracurriculars) dropped; stringified lists,
  mixed date formats, typographic characters and a trailing newline in a job title repaired.
* Resume dataset: 2 exact duplicates, 1 near-empty CV and **13 near-duplicate CVs** (TF-IDF cosine ≥ 0.90) removed
  before splitting → 2,468 CVs. Three small classes: Agriculture (63), Automobile (36), BPO (22).
* **Shortcut:** 65.7 % of CV headings contain the category name ("FINANCE MANAGER"). The heading is removed; keeping
  it would inflate validation macro-F1 from 0.617 to 0.657.

## 3. Methods

**Text preparation** (identical in notebooks and app): lower-case; keep letters, digits and `+ # . / -` (so `c++`,
`c#`, `node.js` survive); collapse whitespace; for matching, remove protected-attribute words. English stop words
are removed inside TF-IDF because they carry no job-specific signal. Porter stemming was tested and **not** used
(validation macro-F1 0.597 with vs 0.617 without).

**Splits.** Classification: stratified 70/15/15 (1,727 / 370 / 371) after de-duplication. Ranking:
`GroupShuffleSplit` by candidate, 70/15/15 → 240 / 51 / 52 candidates, zero overlap, and the most similar held-out /
training CV pair has cosine 0.85 (< 0.90). Vectorisers are fitted on training data only.

**CV field classifier.** TF-IDF (1–2-grams, 50k features) + four algorithms compared on validation macro-F1:
Linear SVM 0.617 · Random Forest 0.590 · Logistic Regression 0.579 · Naive Bayes 0.487. The Linear SVM is
calibrated (`CalibratedClassifierCV`) so the app can show a probability per field.

**Ranking signals**

| Signal | Definition |
|---|---|
| TF-IDF (baseline) | cosine similarity of TF-IDF vectors (1–2-grams) |
| LSA | cosine similarity after Truncated SVD (50 dimensions, chosen on validation) |
| Word2Vec-style | PPMI word–context matrix (window 5) factorised with SVD (300 dims); document vector = TF-IDF-weighted mean of word vectors |
| Skill coverage | share of the job's required skills found in the CV (130-skill taxonomy, 8 categories, synonym aliases) |
| Experience fit | min(candidate years / required years, 1); 0.5 when unknown |

Representations are learned without labels from training CVs, the 28 job descriptions and the 2,481 external CVs
(2.0 M words). LSA was kept as *the* semantic signal because it scored slightly higher than the Word2Vec-style
embeddings on validation (NDCG@10 0.911 vs 0.910).

**Final score.** `0.50 × TF-IDF + 0.30 × LSA + 0.10 × skills + 0.10 × experience`, chosen by grid search on validation
NDCG@10 with every signal ≥ 10 % so that each remains visible. Experience fit was kept only because it improved
validation results.

## 4. Results (untouched test sets)

**Classification** (371 CVs): macro-F1 **0.646**, accuracy **70.1 %**; 5-fold CV on development data 0.604 ± 0.017.
Per-class F1 and the confusion matrix are in `02_model/reports/figures/`. Largest confusions: Apparel → Designer,
Apparel → Sales, Finance → Accountant (3 each) — neighbouring professions rather than random errors.

**Ranking** (52 candidates × 28 jobs; relevance = supplied `matched_score`)

| Method | NDCG@10 | Precision@5 | Spearman |
|---|---:|---:|---:|
| Random order | 0.779 | 0.043 | −0.01 |
| TF-IDF baseline | 0.873 | 0.179 | 0.31 |
| LSA | 0.901 | 0.207 | 0.37 |
| Word2Vec-style | 0.909 | 0.164 | 0.44 |
| Skill coverage | 0.887 | 0.236 | 0.31 |
| Experience fit | 0.817 | 0.179 | 0.20 |
| **TalentMatch combined** | **0.912** | 0.207 | 0.41 |

The combined score beats the baseline on every metric and has the best NDCG@10; single signals win Precision@5
(skills) and Spearman (embeddings). The embeddings' nearest neighbours are meaningful (python → pandas, numpy,
tensorflow; autocad → autodesk, inventor, microstation), and K-Means on the document vectors finds 5 domain
clusters (silhouette 0.30).

## 5. Error analysis and fairness

* **Synonyms** (PowerBI, PostgreSQL): TF-IDF 17.4 but skills 60 and semantic 88.5 → total 46.2.
* **Keyword stuffing**: scores 61.6 — higher than the honest synonym CV. Weakness, shown in the demo; the missing
  experience context is visible to the reviewer.
* **Cross-domain** (civil engineer for a data job) 6.5 and **very short CV** 6.7, with missing skills listed; the app
  refuses CVs under 8 words.
* **Generic job description**: no skill is detected, skill coverage is 0 for all, the app warns the user.
* **Label noise**: several pairs with `matched_score` ≥ 0.85 share almost no vocabulary or skills with the job
  (`02_model/reports/ranking_largest_errors.csv`).
* **Misclassified CVs**: examples in the classification notebook — a consultant CV about government regulations
  predicted Advocate; an Apparel CV that is really a graphic-design template (placeholders such as `[Job Title]`)
  predicted Designer; a generic administrative profile labelled Public Relations predicted Apparel.
* **Counterfactual fairness test** on a real test CV: swapping male/female words, Egyptian/British nationality,
  age 25/55, Muslim/Christian and married/single changes the score by **0.0**; swapping two names changes it by 0.1
  (names cannot be filtered reliably, so users are asked to remove them). This is a regression test, not a full audit.

## 6. System design and deployment

```text
01_data_analysis notebook ──> data/clean/*.csv, skills_taxonomy.json ──> Power BI report
                                     │
02_model notebooks ──> models/ranking_engine.joblib, resume_classifier.joblib, golden_cases.json
                                     │
03_app/matcher.py (same text preparation) ──> streamlit_app.py (UI)  +  api.py (FastAPI)
```

* **Artifacts** carry a version (`1.0.0`), the fitted vectorisers, SVD, word vectors, taxonomy and weights; they are
  git-ignored and re-created by running the notebooks.
* **API** (FastAPI, validated with Pydantic): `POST /rank` (job → candidates), `POST /recommend` (candidate → jobs),
  `POST /classify`, `GET /health`; 422 for invalid input, 503 with instructions when models are missing.
* **UI** (Streamlit): rank candidates (PDF/TXT upload or paste, score breakdown, has/missing skills, CSV export),
  recommend jobs for one CV, classify a CV (top-3 fields with confidence), and an explanation page.
* **Tests** (37, `03_app/tests`): text helpers, PDF edge cases, ranking/recommendation behaviour, API contracts and a
  **golden-case test** proving the app reproduces the notebooks' scores and predictions exactly.

## 7. Limitations and next steps

* `matched_score` is undocumented and noisy; metrics measure agreement with it, not hiring success → collect recruiter
  feedback as labels in a pilot.
* Keyword stuffing still inflates TF-IDF → down-weight repeated terms and detect stuffing explicitly.
* The 130-skill taxonomy misses rare technologies → grow it from job ads.
* English only; the classifier is trained on long CVs and is less certain on short ones (confidence is shown).
* Before any public redistribution of data or a public demo, the dataset licences must be reviewed (course guide
  instructor note); raw data is therefore not committed to the repository.
