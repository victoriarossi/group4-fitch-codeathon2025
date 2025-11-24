# Fitch Codeathon 2025 - Pipeline Documentation
*Extracted from Victoria's complete pipeline notebook*

# Fitch Codeathon 2025 - Complete Data Science Pipeline

This notebook provides a comprehensive walkthrough of our entire data analysis and modeling pipeline for predicting target_scope_1 and target_scope_2 emissions.

## Setup and Imports

## 1. Data Familiarization

First, we analyze all datasets to understand their structure, content, and quality.

## 2. Dataset Summary

Let's examine the summary of our datasets:

### Environmental activities dataset

### Revenue Distribution dataset

### Sustainable Development Goals dataset

### Train dataset

### Key Findings from Data Familiarization:

- **Environmental Activities Dataset**: Contains environmental score adjustments for different activity types
- **Revenue Distribution Dataset**: Shows revenue breakdown by NACE sector codes
- **Sustainable Development Goals Dataset**: Links entities to SDG commitments
- **Training Dataset**: Main dataset with target variables (target_scope_1 and target_scope_2)

The analysis revealed several highly skewed columns that will require transformation or outlier treatment.

## 3. Trend and Distribution Analysis

Now we analyze the distributions of numeric columns and explore the relationship between target variables.

## 4. Distribution Visualizations

### Numeric Feature Distributions

### Distribution graphs

|   |   |
|:---:|:---:|
| ![Alt1](plots/esg_distributions/environmental_score_hist.png) | ![Alt2](plots/esg_distributions/governance_score_hist.png) |
| ![Alt3](plots/esg_distributions/revenue_hist.png) | ![Alt4](plots/esg_distributions/social_score_hist.png) |
| ![Alt5](plots/esg_distributions/target_scope_1_hist.png) | ![Alt6](plots/esg_distributions/target_scope_2_hist.png) |

### Target Scope Correlation Analysis

We investigated the relationship between `target_scope_1` and `target_scope_2`:

| Target Scope 1 vs 2 | Log(Target Scope 1) vs 2 |
| :---: | :---: |
| ![Scatter](./plots/target_scope_1_vs_2_scatter.png) | ![Log Scatter](./plots/log_target_scope_1_vs_2_scatter.png) |
| **LOWESS Smoothed Trend** | **Hexbin Density Plot** |
| ![LOWESS](./plots/log_target_scope_1_vs_2_lowess.png) | ![Hexbin](./plots/log_target_scope_1_vs_2_hexbin.png) |

### Key Discovery: Monotonic Relationship

**Our analysis revealed that `target_scope_1` and `target_scope_2` have a MONOTONIC relationship:**

- **Spearman correlation** (0.74+) is higher than **Pearson correlation** (0.65+)
- This indicates that as `target_scope_1` increases, `target_scope_2` tends to increase as well
- However, the relationship is **not linear** - it follows a monotonic but non-linear pattern
- The LOWESS smoothing curve and hexbin density plot clearly show this non-linear trend

**Implication for modeling**: We should use models that can capture non-linear relationships, such as tree-based methods or add polynomial/interaction features.

## 5. Outlier Treatment

We apply outlier treatment to handle extreme values that could skew our models.

## 6. Outlier Treatment Results

### Treatment Strategy:

1. **Revenue**: Applied log1p transformation (no capping needed)
2. **Environmental Score Adjustments**: Capped at 1st and 99th percentiles for each activity type

## 7. Missing Values Strategy - Merging Datasets

After outlier treatment, we merge all datasets to create a complete view and identify missing values.

## 8. Missing Values Analysis

Let's examine which values are missing in our merged dataset:

## 9. Imputation Strategy

### Problem:
We have significant missing values in two datasets:
- **Environmental Activities** data (activity_type, activity_code, env_score_adjustment)
- **Sustainable Development Goals** data (sdg_id, sdg_name)

### Approaches Tested:
We experimented with multiple imputation methods:
1. **Random Forest**
2. **Median/Mode**
3. **Gradient Boosting**
4. **K-Nearest Neighbors (KNN)**
5. **MICE (Multiple Imputation by Chained Equations)**

### Final Decision:
After comparing model accuracy and confidence scores, we selected:

- **Gradient Boosting** for Environmental Activities imputation
  - Reason: Higher prediction confidence and better handling of complex feature interactions
  - Cross-validation accuracy: ~75-80%
  - Better feature importance interpretation

- **K-Nearest Neighbors (KNN)** for Sustainable Development Goals imputation
  - Reason: Better confidence scores for categorical SDG predictions
  - Cross-validation accuracy: ~70-75%
  - More robust for multi-class classification with distance-based weighting

Both methods showed superior performance compared to simpler approaches and provided high-confidence predictions.

## 10. Running Imputations

### 10.1 Gradient Boosting - Environmental Activities Imputation

### 10.2 KNN - Sustainable Development Goals Imputation

## 11. Merging Imputed Data

Now we combine all imputed values into a single complete dataset.

## 12. Feature Engineering

Feature engineering transforms raw data into model-ready features that capture complex relationships.

### What it does:

1. **Sector Revenue PCA**: 
   - Creates pivot table of revenue percentages by NACE sector codes
   - Applies PCA to reduce dimensionality while preserving sector patterns
   - Generates `Sector_Comp_1` through `Sector_Comp_10` features

2. **Environmental Activity Aggregations**:
   - Counts number of activities per entity (`num_activities`)
   - Computes average environmental score adjustment
   - Creates binary indicator for activity presence

3. **Interaction Features**:
   - `revenue_x_environmental_score`: Captures company size effect on environmental impact
   - `revenue_x_governance_score`: Size-governance relationship
   - `E_x_S`, `S_x_G`: ESG component interactions

4. **Country-Level Features**:
   - `country_ts2_per_revenue`: Average Scope 2 emissions per revenue for each country
   - Helps capture regional regulatory and infrastructure differences

5. **Log Transformations**:
   - `target_scope_1_log` and `target_scope_2_log`
   - Normalizes skewed target distributions for better model performance

### Why this matters:

- **Dimensionality Reduction**: PCA reduces hundreds of sector codes to 10 meaningful components
- **Non-linear Patterns**: Interaction terms help models capture multiplicative relationships
- **Geographic Context**: Country aggregations encode regional differences in emissions
- **Better Model Performance**: Engineered features typically improve R² by 10-20% over raw features

## 13. Model Training

We train and tune multiple models for predicting target_scope_1 and target_scope_2.

### Process:
1. **Baseline Models**: Random Forest, XGBoost, CatBoost, ElasticNet
2. **Hyperparameter Tuning**: RandomizedSearchCV with 20 iterations
3. **Model Selection**: Choose best model per target based on validation R²
4. **Final Models Saved**:
   - `best_scope1.joblib`: Best model for target_scope_1
   - `best_scope2.joblib`: Best model for target_scope_2
   - `feature_cols.joblib`: List of features used

## 14. Processing Test Data

To make predictions on test.csv, we must apply the SAME feature engineering pipeline.

## 15. Why Test Data Processing is Critical

### The Problem:
Our models were trained on **engineered features**, not raw data. The test.csv file only contains raw features.

### What process_test_data.py does:

1. **Merges supplementary datasets**: Joins environmental_activities, SDG, and revenue data to test entities

2. **Recreates PCA components**: 
   - Uses training data to fit StandardScaler and PCA
   - Transforms test revenue distribution into same `Sector_Comp_1-10` space
   - Critical: Must use SAME scaler/PCA fitted on training data

3. **Generates aggregations**:
   - Environmental activity counts and averages
   - Sector-level statistics (from training data)
   - Country-level statistics (from training data)

4. **Creates interaction features**:
   - All multiplication/ratio features: `revenue_x_environmental_score`, `E_x_S`, etc.
   - ESG PCA components using training data's PCA transformation

5. **Handles missing values**:
   - Fills with training data medians to maintain consistency
   - Ensures no NaN values that would break prediction

### Why this matters:

**Feature alignment is crucial**:
- Models expect EXACT same features in SAME order
- PCA/scaling must use training parameters (not refit on test)
- Aggregations must reference training statistics

**Without proper feature engineering**:
- ❌ Model would see completely different feature space
- ❌ Predictions would be meaningless or fail entirely
- ❌ Feature names/counts wouldn't match

**With proper feature engineering**:
- ✓ Test data in same feature space as training
- ✓ Models can make accurate predictions
- ✓ Results are comparable and valid

## 16. Generate Predictions

Now we use our trained models to predict target_scope_1 and target_scope_2 for test entities.

## 17. Final Predictions

Let's examine our predictions for the test set:

## Summary

### Complete Pipeline:

1. ✅ **Data Familiarization**: Analyzed 4 datasets, identified skewness and missing values
2. ✅ **Distribution Analysis**: Discovered monotonic (non-linear) relationship between target scopes
3. ✅ **Outlier Treatment**: Applied log transformation and percentile capping
4. ✅ **Imputation**: 
   - Gradient Boosting for Environmental Activities (~75-80% accuracy)
   - KNN for Sustainable Development Goals (~70-75% accuracy)
5. ✅ **Feature Engineering**: Created 50+ engineered features including PCA, interactions, aggregations
6. ✅ **Model Training**: Tuned 4 algorithms, selected best for each target
7. ✅ **Test Processing**: Applied identical feature engineering to test data
8. ✅ **Predictions**: Generated emissions predictions maintaining observed relationships

### Key Insights:

- **Non-linear relationships** between emission scopes required sophisticated models
- **Feature engineering** was crucial - models perform significantly better with engineered features
- **Careful imputation** maintained data quality while handling 30-40% missing values
- **Test data processing** required exact replication of training transformations

### Files Generated:

- `data/test_predictions.csv` - Final predictions
- `models/best_scope1.joblib` - Trained model for Scope 1
- `models/best_scope2.joblib` - Trained model for Scope 2
- `models/feature_cols.joblib` - Feature list for reproducibility

