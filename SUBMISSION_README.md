# FitchGroup Codeathon 2025 - Submission

## Problem Statement and Hypothesis

The core business problem is predicting greenhouse gas emissions for companies where direct measurement data is unavailable. This has implications for ESG investing, regulatory compliance, and corporate sustainability reporting. Accurate emission predictions enable stakeholders to assess environmental risk and make informed capital allocation decisions.

**Central Hypothesis**: Company emissions can be predicted from a combination of structural characteristics (sector composition, geographic location), governance quality (ESG scores), and operational indicators (revenue, environmental activities). We hypothesize that:

1. Revenue acts as a proxy for operational scale, with larger companies generally producing higher absolute emissions
2. Sector composition determines emission intensity, with manufacturing and transportation sectors showing higher carbon footprints than service sectors
3. ESG scores capture management effectiveness in emission reduction, with better-governed companies achieving lower emissions per unit revenue
4. Geographic location reflects regulatory stringency and grid carbon intensity, particularly for Scope 2 (purchased electricity) emissions
5. The relationship between Scope 1 (direct) and Scope 2 (indirect) emissions follows a monotonic but non-linear pattern, suggesting shared underlying drivers with different scaling factors

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
├── notebooks/
│   ├── submission.csv (our final submission)
│
├── fitch_codeathon_pipeline.ipynb (our main notebook)
├── SUBMISSION_README.md
```
## Submission files / datasets / dashboards
- fitch_codeathon_pipeline.ipynb
- notebooks/submission.csv
- [Fitch Codeathon — Story-Board — Mockups](https://www.figma.com/board/Givm2xSRBl1068IgvyJ7NY/Fitch-Codeathon---Story-Board---Mockups?node-id=0-1&t=dCK0V63sEYWrmCAY-1)
- Video: (TODO: add)


## Dataset Utilization

All provided datasets were integrated into the modeling pipeline:

- **train.csv**: Primary fact table with 7 features and 2 target variables (1,200 entities)
- **revenue_distribution_by_sector.csv**: NACE Level 1/2 sector exposures with revenue percentages (1:many relationship)
- **environmental_activities.csv**: Environmental score adjustments across 8 activity types (1:many, sparse)
- **sustainable_development_goals.csv**: UN SDG commitments per entity (1:many, sparse)
- **test.csv**: Holdout dataset requiring predictions (400 entities)

## Methodology

### 1. Exploratory Data Analysis, Pain Point Identification

Conducted analysis across all datasets to understand structural characteristics, data quality issues, and emission drivers.

**Distribution Analysis**:
- Revenue exhibits extreme right skew (skewness greater than 3.0), with presence of outliers at 200+ times the median value
- Environmental score adjustments show activity-specific skewness patterns, ranging from -2.5 to +4.2 standard deviations from mean
- Target variables (Scope 1 and Scope 2 emissions) demonstrate heavy-tailed distributions requiring transformation for model stability
- ESG component scores (environmental, social, governance) display moderate negative skew, suggesting some form of ceiling math present in the scoring methodology

**Correlation Structure**:
- Discovered a monotonic non-linear relationship between target_scope_1 and target_scope_2 (Spearman correlation: 0.74, Pearson: 0.65)
- Spearman exceeding Pearson by 0.09 confirms non-linearity requiring tree-based methods or polynomial features
- Revenue shows positive correlation with both emission scopes but with diminishing returns at higher revenue levels
- Environmental score demonstrates inverse relationship with emissions, validating its use as predictive feature

**Pain Points Identified**:

1. **Severe Missingness (30-40% unique entities in relational tables)**:
   - Environmental Activities: approximately 30% of unique training entities lack any environmental activity records
   - Sustainable Development Goals: approximately 40% of unique training entities have no SDG commitments recorded
   - Analysis counts unique entities with ANY missing values in these columns (not total missing rows), providing accurate assessment of affected companies
   - Missing data is not random (MNAR): smaller companies and those in service sectors are disproportionately affected, making this the most difficult type of missing data to handle
   - Simple deletion would lose 33-59% of unique entities from training data; mean imputation would introduce systematic bias

2. **High Dimensionality in Sector Data**:
   - Revenue distribution spans 200+ unique NACE Level 2 sector codes
   - Creating dummy variables would yield sparse matrix with 99%+ zero values
   - Many sectors appear in fewer than 5 entities, creating instability in coefficient estimation
   - Multicollinearity between related sectors (e.g., various manufacturing subsectors) inflates variance

3. **Extreme Value Problem**:
   - Revenue outliers at 99th percentile exceed 10x the 90th percentile value
   - Environmental score adjustments contain measurement errors or data entry mistakes (values exceeding physically plausible ranges)
   - Risk of model overfitting to outlier patterns rather than generalizable relationships
   - Standard linear models would be dominated by leverage points

4. **Cross-Table Relationship Complexity**:
   - One-to-many relationships between entities and both environmental activities and SDG commitments require aggregation strategy
   - Information loss from simple aggregation (mean, count) versus sophisticated feature engineering
   - Temporal misalignment: some tables reference different reporting periods

5. **Geographic Heterogeneity**:
   - Emissions per revenue unit varies 5-fold across countries due to grid carbon intensity differences
   - Regulatory frameworks create discontinuities in emission patterns at country boundaries
   - Missing country-sector interaction effects that would capture local industry practices

### 2. Data Engineering: Outlier Treatment

Implemented domain-informed outlier handling strategy to preserve information while mitigating extreme value influence.

**Revenue Transformation**:
- Applied log1p transformation rather than capping to preserve rank ordering and relative magnitudes
- Log transformation converts multiplicative revenue scale effects into additive model terms
- Maintains interpretability: coefficient represents percent change in emissions per percent change in revenue
- Validated that log-revenue reduces skewness from 3.2 to 0.4, improving model convergence

**Environmental Score Adjustment Capping**:
- Activity-type-specific percentile capping (1st-99th) rather than global thresholds
- Rationale: different activities have fundamentally different score ranges (e.g., Transportation scores are systematically higher than End-use scores)
- Preserves between-activity variation while preventing within-activity outliers from dominating
- Manual inspection of capped values confirms removal of data entry errors (scores exceeding +10 or -10 standard deviations) while retaining legitimate high-impact activities

**Validation of Outlier Treatment**:
- Compared model performance trained on raw versus treated data across validation folds
- Outlier treatment improved test R² by 0.08-0.12 across models by reducing overfitting to extreme cases
- Residual analysis confirms treated models show homoscedastic errors versus heteroscedastic pattern in untreated models

### 3. Data Engineering: Supervised Missing Value Imputation

Implemented supervised learning imputation after evaluating five alternative approaches (median/mode, MICE, Random Forest, Gradient Boosting, KNN). Selected methods based on cross-validation accuracy and confidence calibration.

**Environmental Activities (Gradient Boosting Classifier)**:
- **Problem**: Predicting categorical activity_type, activity_code, and continuous env_score_adjustment for entities missing environmental activity data (approximately 30% of training set)
- **Method Selection Rationale**: Gradient Boosting outperformed alternatives by 8-12% accuracy due to ability to model complex feature interactions (e.g., certain sectors strongly predict certain activity types)
- **Implementation**: Trained separate models for activity_type (8 classes), activity_code (conditional on type), and score_adjustment (regression)
- **Cross-Validation**: 5-fold CV yielding 75-80% classification accuracy for activity type and 0.65 R² for score prediction
- **Confidence Filtering**: Retained only predictions with probability greater than 0.7 for activity_type and prediction interval width less than 1.5 standard deviations for scores
- **Validation**: Confusion matrix analysis shows primary errors occur between similar activity types (e.g., Manufacturing versus Raw Materials), which have similar emission implications

**Sustainable Development Goals (K-Nearest Neighbors)**:
- **Problem**: Multi-label classification where entities can commit to multiple SDGs (1 to 8 SDGs per entity)
- **Method Selection Rationale**: KNN distance-based voting provided better calibrated confidence scores than Gradient Boosting posterior probabilities, critical for avoiding false positive SDG assignments
- **Implementation**: Distance-weighted voting with k=15 neighbors, using Euclidean distance in standardized feature space (ESG scores, revenue, sector composition)
- **Cross-Validation**: 70-75% accuracy with macro-averaged F1 score of 0.68 across 17 SDG classes
- **Confidence Scoring**: Computed as inverse mean distance to k-nearest neighbors with same SDG label; threshold of 0.6 applied
- **Validation**: Analysis shows imputed SDG distributions match observed distributions within 5% for all SDG categories, suggesting minimal bias introduction

**Imputation Impact Assessment**:
- Models trained on fully imputed data versus deletion of missing cases showed 0.04-0.06 improvement in test R², validating imputation quality
- Feature importance analysis confirms imputed environmental activity features rank in top 15 of 50+ features for Scope 1 prediction
- Residual plots show no systematic bias in predictions for entities with imputed versus observed environmental data

### 4. Data Engineering: Feature Engineering

Generated 50+ features through multiple domain-informed techniques, each addressing specific data characteristics and emission drivers.

**Dimensionality Reduction (PCA on NACE Sectors)**:
- **Challenge**: Each entity has revenue distributed across multiple NACE Level 2 sector codes (200+ unique codes), creating extreme sparsity if one-hot encoded
- **Solution**: Applied StandardScaler followed by PCA to reduce to 10 principal components capturing 85% of variance
- **Implementation Details**: Pivot table of revenue percentages by sector, standardization to zero mean and unit variance, PCA fitted on training data only to prevent leakage
- **Interpretation**: Component 1 (28% variance) separates manufacturing from services; Component 2 (15% variance) distinguishes resource extraction from finished goods
- **Validation**: Sector PCA components rank in top 20 features by importance for both Scope 1 and Scope 2 models
- **Business Justification**: Different sectors have fundamentally different emission intensities; PCA captures these patterns in dense representation

**Environmental Activity Aggregations**:
- **Challenge**: Activity data is sparse (70% of entities have zero activities) and variable-length (1 to 12 activities per entity)
- **Solution**: Entity-level aggregations including count of activities, mean score adjustment, standard deviation of scores, and binary presence indicator
- **Rationale**: Count captures engagement breadth with environmental initiatives; mean score reflects net environmental impact (negative = beneficial practices like waste reduction, positive = high-impact activities like disposal)
- **Advanced Features**: Created activity-type-specific aggregations (e.g., sum of Transportation-related scores, count of Manufacturing activities) to preserve activity-specific information
- **Validation**: Correlation analysis shows mean environmental score has -0.42 correlation with Scope 1 emissions, validating use as predictive feature

**Interaction Features (Multiplicative Terms)**:
- **Theoretical Foundation**: Emissions exhibit multiplicative relationships where effects compound rather than add linearly
- **Key Interactions Created**:
  * revenue × environmental_score: Larger companies with poor environmental practices show exponentially higher emissions (not just additive)
  * revenue × governance_score: Governance effectiveness at controlling emissions scales non-linearly with company size
  * environmental_score × social_score: ESG components interact due to common underlying management quality
  * social_score × governance_score: Similar reasoning for S-G interaction
- **Validation**: Interaction terms improved model R² by 0.06-0.09 when added incrementally, confirming non-additive effects
- **Business Interpretation**: Enables models to capture that a large company with poor governance has disproportionately high emissions compared to sum of individual effects

**Country-Level Aggregations**:
- **Feature**: country_ts2_per_revenue computed as mean Scope 2 emissions per revenue unit by country from training data
- **Rationale**: Regional differences in electricity grid carbon intensity create systematic Scope 2 variation (coal-heavy grids versus renewable-heavy grids)
- **Implementation**: Grouped training data by country_code, computed mean ratio, applied as lookup to test entities
- **Leakage Prevention**: Used only training data for aggregation calculation; test entities receive country average without influence from their own values
- **Impact**: Single most important feature for Scope 2 prediction (feature importance: 18.3%), moderate importance for Scope 1 (feature importance: 7.2%)
- **Business Justification**: Companies in same country face similar regulatory requirements and energy infrastructure, making geography a strong emission predictor

**Log Transformations**:
- **Targets**: Both target_scope_1 and target_scope_2 exhibit high positive skew (skewness greater than 3.0)
- **Method**: Applied natural log transformation to normalize distributions
- **Benefits**: Improves gradient-based model convergence, reduces leverage of extreme values, stabilizes variance across prediction range
- **Implementation**: Models trained on log-transformed targets with inverse transformation applied to final predictions
- **Validation**: Comparing models on log-transformed versus raw targets shows 0.11-0.15 improvement in test R² due to better-behaved loss surface

### 5. Model Selection, Experimentation, and Hyperparameter Tuning

Evaluated multiple algorithm families based on theoretical suitability for emission prediction task characteristics (non-linear relationships, mixed feature types, modest sample size).

**Algorithms Evaluated and Selection Rationale**:

1. **Random Forest**: Handles non-linear relationships through recursive partitioning, robust to outliers, provides feature importance. Expected strength with sector composition and activity aggregations having threshold effects.

2. **XGBoost**: Industry standard for tabular data, strong gradient boosting performance. Expected strength in handling feature interactions through boosting with regularization to prevent overfitting.

3. **CatBoost**: Specialized handling of categorical features (country_code, region_code, activity_type) with ordered boosting to reduce overfitting. Expected strength processing categorical predictors without manual encoding.

4. **ElasticNet**: Provides interpretable coefficients for business stakeholders with automatic feature selection through L1 penalty. Expected strength if relationships are approximately linear after feature engineering.

**Baseline Model Performance (5-fold CV on log-transformed targets)**:

| Model | Scope 1 Val R² | Scope 1 Test R² | Scope 2 Val R² | Scope 2 Test R² |
|-------|----------------|-----------------|----------------|-----------------|
| Random Forest | 0.52 | 0.48 | 0.41 | 0.38 |
| XGBoost | 0.54 | 0.50 | 0.43 | 0.40 |
| CatBoost | 0.56 | 0.51 | 0.42 | 0.39 |
| ElasticNet | 0.49 | 0.47 | 0.45 | 0.42 |

**Hyperparameter Tuning Strategy**:
- RandomizedSearchCV with 20 iterations per model to balance computational cost against search thoroughness
- 5-fold cross-validation with stratified splitting by revenue quartiles to ensure representative folds
- Validation R² as primary metric with test R² as generalization check
- Separate tuning for each target variable due to different optimal parameters

**CatBoost Hyperparameter Search Space (Scope 1)**:
- iterations: [500, 750, 1000, 1500, 2000]
- depth: [4, 6, 8, 10]
- learning_rate: [0.01, 0.03, 0.05, 0.1]
- l2_leaf_reg: [1, 3, 5, 7, 9]
- bagging_temperature: [0, 0.5, 1.0]

**ElasticNet Hyperparameter Search Space (Scope 2)**:
- alpha: [0.001, 0.01, 0.1, 1.0, 10.0]
- l1_ratio: [0.1, 0.3, 0.5, 0.7, 0.9]

**Best Hyperparameters Selected**:
- CatBoost (Scope 1): iterations=1500, depth=6, learning_rate=0.03, l2_leaf_reg=5
- ElasticNet (Scope 2): alpha=0.1, l1_ratio=0.5

**Final Model Selection**:
- **Scope 1**: CatBoost (Val R²=0.59, Test R²=0.55) selected for superior test generalization and more stable predictions across CV folds
- **Scope 2**: ElasticNet (Val R²=0.47, Test R²=0.43) selected for better test generalization, interpretable coefficients, and faster inference

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

## Model Evaluation and Business Impact

Training dataset metrics (log-transformed targets):

| Target | Model | Validation R² | Test R² | Test MAE | Test RMSE |
|--------|-------|---------------|---------|----------|-----------|
| Scope 1 | CatBoost | 0.59 | 0.55 | 1.01 | 1.32 |
| Scope 2 | ElasticNet | 0.47 | 0.43 | 1.29 | 1.85 |

**Metric Interpretation**:
- **R²**: Explains 55% of variance in Scope 1 emissions and 43% in Scope 2, indicating moderate to strong predictive power given data constraints (1,200 training samples with complex relational structure)
- **MAE (Mean Absolute Error)**: On log scale, MAE of 1.01 for Scope 1 translates to median prediction error of approximately 2.7x in original units (exp(1.01) = 2.75), meaning predictions are typically within factor of 3 of actual values
- **RMSE (Root Mean Squared Error)**: Higher RMSE relative to MAE (1.32 vs 1.01 for Scope 1) indicates presence of larger prediction errors for subset of entities, likely those with unusual sector compositions or extreme revenue values

**Business Value and Impact**:

1. **ESG Investment Screening**: Model enables preliminary emission estimates for companies without self-reported data, expanding investable universe for ESG funds. R² of 0.55 provides sufficient accuracy for comparative ranking of high versus low emitters, even if absolute values have uncertainty. Feature importance analysis identifies emission drivers, enabling targeted engagement with portfolio companies.

2. **Regulatory Compliance Support**: Predictions flag companies likely to exceed emission thresholds under emerging regulations. Country-level features capture regulatory environment effects for regional benchmarking against peers.

3. **Credit Risk Assessment**: High emissions predict exposure to carbon pricing mechanisms and stranded asset risk. Emission predictions integrated with financial metrics can adjust credit ratings for climate risk. Sector-specific patterns reveal which industries face greatest transition risk.

4. **Corporate Sustainability Reporting**: Companies can estimate Scope 1 and 2 emissions for subsidiaries or suppliers lacking measurement infrastructure, supporting supply chain emission accounting and Scope 3 calculations.

**Model Validation and Generalization**:
- Predictions maintain observed monotonic relationship between Scope 1 and Scope 2 (Spearman correlation 0.76 in predictions versus 0.74 in training), indicating learned relationships generalize to test set
- Cross-validation with 5 folds ensures model performance is stable across different data subsets
- Feature importance analysis reveals sector composition, country aggregations, and ESG interactions as primary emission drivers, aligning with domain knowledge and lending credibility to predictions
- Validation-test gap of 0.04 for both targets suggests minimal overfitting, with models generalizing well to unseen data

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