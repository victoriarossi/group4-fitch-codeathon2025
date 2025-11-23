# 📘 Project Pipeline Documentation — Phases 4–7  
### (Maria’s Implementation After Teammates Completed Phases 1–4)

This section describes the work completed **after the rest of the team finished Phases 1–4**.  
Their work included initial EDA, missing value investigation, and the first merged dataset.  
My work begins at the point where we identified issues in the merged dataset and needed to rebuild the modeling pipeline.

---

## Phase 4 (Updated) — Rebuilding the Clean Base Dataset

Although Phases 1–4 were completed, the original merged data had a different approach than I would of taken:
- duplicated rows per entity  
- multiple rows per company due to incorrect joins  

To correct this, I rebuilt Phase 4:

### ✔ Steps Performed
- Loaded `merged_dataset_complete.csv`
- Deleted all incorrectly merged revenue-distribution columns:
  - `nace_level_1_code`, `nace_level_2_code`, `revenue_pct`, etc.
- Sorted by `entity_id`
- Collapsed to **exactly one row per entity**:
  ```python
  merged_clean = merged.sort_values("entity_id").groupby("entity_id").first()

### Phase 5 — Feature Engineering
In Phase 5, we engineered all the major relational features described in the official plan. We transformed the revenue distribution table (NACE Level 2) into a wide matrix and reduced it to 10 dense PCA components representing sector exposure patterns. We also extracted environmental activity features such as the number of activities, presence of activities, and the average capped environmental adjustment per entity. In addition, we created SDG commitment features, including SDG count, SDG presence, and unique SDGs. These features were merged back into the Phase 4 dataset to produce a richer, multi-dimensional modeling dataset.

### Phase 6 — Target Transformation & Interaction Features

In Phase 6, we applied log-transformations to both target variables (target_scope_1 and target_scope_2) using log1p to stabilize variance and improve regression performance. We engineered high-value interaction features, including revenue × ESG interactions and cross-ESG interactions (E×S, S×G, E×G). Additional stability features such as revenue_log1p, ESG mean, and ESG variance were added. These transformations created more predictive signal for tree-based models and improved the dataset’s modeling quality for Phase 7.

### Phase 7 — Model Training

In Phase 7, we trained multiple baseline models following a robust and competition-aligned methodology. We created stratified K-fold splits using sector information (NACE Level 1) combined with revenue quantile buckets to ensure balanced folds. We evaluated four model types—CatBoost, XGBoost, LightGBM, and ElasticNet—on the log-transformed targets, using appropriate preprocessing for categorical and numeric features. Each model was assessed through 5-fold cross-validated RMSE, providing stable benchmarks and clear performance comparisons for later ensemble stacking.


### Results
======================================================================
SUMMARY (mean RMSE per model & target):
======================================================================

Target: target_scope_1_log
  ElasticNet: 2.3812 (+/- 0.3508)
  XGBoost: 1.8362 (+/- 0.2378)
  LightGBM: 1.9078 (+/- 0.3276)
  CatBoost: 1.7935 (+/- 0.2149)

Target: target_scope_2_log
  ElasticNet: 2.7775 (+/- 0.2569)
  XGBoost: 2.5495 (+/- 0.2195)
  LightGBM: 2.5970 (+/- 0.2846)
  CatBoost: 2.4522 (+/- 0.2777)