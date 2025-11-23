# FitchGroup Codeathon 2025 - Submission

## Objective

Predict company-level Scope 1 and Scope 2 greenhouse gas emissions for holdout test dataset entities using gradient boosting models trained on engineered features from multiple relational tables.

## Repository Structure

```
├── data/
│   ├── train.csv
│   ├── test.csv
│   ├── revenue_distribution_by_sector.csv
│   ├── environmental_activities.csv
│   ├── sustainable_development_goals.csv
│   ├── merged_dataset_complete.csv
│   ├── test_predictions.csv
│
├── models/
│   ├── best_scope1.joblib
│   ├── best_scope2.joblib
│   ├── feature_cols.joblib
│
├── fitch_codeathon_pipeline.ipynb
├── SUBMISSION_README.md
└── submission.csv
```

## Dataset Utilization

All provided datasets were integrated into the modeling pipeline:

- **train.csv**: Primary fact table with 7 features and 2 target variables (1,200 entities)
- **revenue_distribution_by_sector.csv**: NACE Level 1/2 sector exposures with revenue percentages (1:many relationship)
- **environmental_activities.csv**: Environmental score adjustments across 8 activity types (1:many, sparse)
- **sustainable_development_goals.csv**: UN SDG commitments per entity (1:many, sparse)
- **test.csv**: Holdout dataset requiring predictions (400 entities)

## Methodology

### 1. Data Analysis

Conducted comprehensive analysis revealing:
- High skewness in revenue, environmental scores, and target variables
- 30-40% missing values in environmental_activities and sustainable_development_goals tables
- Monotonic non-linear relationship between target_scope_1 and target_scope_2 (Spearman correlation: 0.74, Pearson: 0.65)

### 2. Outlier Treatment

Applied statistical transformations to handle extreme values:
- Log1p transformation on revenue field
- Percentile capping (1st-99th) on env_score_adjustment by activity_type
- Preserved distribution characteristics while reducing outlier impact

### 3. Missing Value Imputation

Implemented supervised learning imputation with cross-validation:

**Environmental Activities (Gradient Boosting):**
- Activity type, code, and score predictions for entities without data
- Cross-validation accuracy: 75-80%
- Confidence threshold filtering on predictions

**Sustainable Development Goals (K-Nearest Neighbors):**
- SDG ID classification using distance-weighted voting
- Cross-validation accuracy: 70-75%
- Distance-based confidence scoring

### 4. Feature Engineering

Generated 50+ features through multiple techniques addressing specific data characteristics:

**Dimensionality Reduction (PCA on NACE Sectors):**
- Each entity has revenue distributed across multiple NACE Level 2 sector codes (200+ unique codes)
- Creating dummy variables would result in extreme sparsity and curse of dimensionality (and introduce multicollinearity)
- Applied StandardScaler followed by PCA to reduce to 10 principal components
- Captures 85% of variance while condensing sector composition into dense numerical features
- Component loadings reveal sector co-occurrence patterns (e.g., manufacturing clusters)
- Fitted on training data to prevent data leakage, transformed test data using same parameters

**Environmental Activity Aggregations:**
- Activity data is sparse (not all entities have environmental activities reported)
- Aggregated to entity level: count of activities, mean score adjustment, presence indicator
- Count captures engagement level with environmental initiatives 
- Mean score reflects net environmental impact (we modeled it as negative = beneficial, positive = detrimental)
- Reduces sparse 1:many relationship to fixed-width features per entity

**Interaction Features (Multiplicative Terms):**
- Linear models assume additive effects; emissions often show multiplicative relationships
- revenue × environmental_score: larger companies with poor environmental practices have exponentially higher emissions
- revenue × governance_score: governance quality scales differently with company size
- E × S and S × G: ESG components interact (since companies strong in one area are often strong in others)
- Enables models to capture non-linear patterns without polynomial expansion

**Country-Level Aggregations:**
- country_ts2_per_revenue: mean Scope 2 emissions per revenue unit by country
- Captures regional differences in electricity grid carbon intensity
- Encodes regulatory environment and infrastructure maturity
- Computed from training data to avoid leakage, applied as lookup to test entities
- Most used for Scope 2 predictions (since purchased electricity varies significantly by region)

**Log Transformations:**
- Both target variables exhibited high positive skew (skewness > 3)
- Log transformation normalizes distributions, improving model convergence
- Reduces impact of extreme outliers on gradient-based learners
- Models trained on log-transformed targets, predictions inverse-transformed for final output

### 5. Model Training

Tested multiple algorithms with hyperparameter tuning:

**Algorithms Evaluated:**
- Random Forest
- XGBoost
- CatBoost
- ElasticNet

**Training Process:**
- RandomizedSearchCV with 20 iterations
- 5-fold cross-validation
- Separate models for target_scope_1_log and target_scope_2_log
- Validation R² used for model selection

**Best Models Selected:**
- Scope 1: CatBoost (Test R² = 0.55)
- Scope 2: ElasticNet (Test R² = 0.43)

### 6. Test Data Processing

Applied identical feature engineering pipeline to test.csv:
- Merged supplementary datasets (revenue distribution, environmental activities, SDG)
- Applied training data's fitted PCA transformations
- Generated interaction features using same formulas
- Filled missing values with training data medians
- Ensured exact feature alignment (same columns, same order)

### 7. Prediction Generation

Generated final predictions:
- Loaded trained models (best_scope1.joblib, best_scope2.joblib)
- Applied inverse log transformation to predicted log values
- Exported predictions to test_predictions.csv
- Maintained monotonic relationship observed in training data (Spearman correlation in predictions: 0.76)

## Model Performance

Training dataset metrics (log-transformed targets):

| Target | Model | Validation R² | Test R² | Test MAE | Test RMSE |
|--------|-------|---------------|---------|----------|-----------|
| Scope 1 | CatBoost | 0.59 | 0.55 | 1.01 | 1.32 |
| Scope 2 | ElasticNet | 0.47 | 0.43 | 1.29 | 1.85 |

## Files Generated

- `data/test_predictions.csv`: Raw predictions with entity_id, pred_target_scope_1, pred_target_scope_2
- `models/best_scope1.joblib`: Trained CatBoost model for Scope 1
- `models/best_scope2.joblib`: Trained ElasticNet model for Scope 2
- `models/feature_cols.joblib`: Feature list ensuring reproducible predictions

## Key Technical Decisions

1. **Gradient Boosting over simpler imputation**: Superior performance for categorical activity predictions with complex feature interactions
2. **KNN for SDG imputation**: Distance-based confidence scoring provided better multi-class classification than alternatives
3. **PCA for sector features**: Reduced 200+ NACE codes to 10 components while preserving 85% variance
4. **Separate models per target**: Scope 1 and Scope 2 have different emission drivers requiring specialized model parameters
5. **Feature engineering over raw features**: Engineered features improved R² by approximately 15-20% compared to baseline models on raw data