# Approach Explanation Template

Use this template to document your approach for submission.

---

## Model Performance

### Training Dataset Performance

**Scope 1 Emissions:**
- Training RMSE: [Your value]
- Validation RMSE: [Your value]
- Mean Absolute Error (MAE): [Your value]
- R² Score: [Your value]

**Scope 2 Emissions:**
- Training RMSE: [Your value]
- Validation RMSE: [Your value]
- Mean Absolute Error (MAE): [Your value]
- R² Score: [Your value]

**Notes on Performance:**
- [Describe any overfitting concerns, if train performance is much better than validation]
- [Mention any specific company types or patterns that were harder to predict]

---

## Model Type

### Primary Model
- **Algorithm:** [e.g., XGBoost, LightGBM, Random Forest, Linear Regression, Ensemble]
- **Rationale:** [Why you chose this model - e.g., "XGBoost was chosen because it handles non-linear relationships well and emissions data is highly non-linear"]

### Model Configuration
- **Hyperparameters:** [List key hyperparameters, e.g., learning_rate=0.1, max_depth=6, n_estimators=200]
- **Training Strategy:** [e.g., "Trained separate models for Scope 1 and Scope 2", "Used 5-fold cross-validation for hyperparameter tuning"]

### Alternative Models Tested
- [List other models you tried and why you didn't use them, e.g., "Tried Linear Regression as baseline but it underperformed due to non-linear relationships"]

---

## Feature Engineering & Data Transformations

### Key Features Created

1. **Geographic Features:**
   - [What you did: e.g., "One-hot encoded region_code to capture regional differences in energy grid carbon intensity"]
   - [Why: e.g., "Different regions have different electricity grid carbon intensities, which directly affects Scope 2 emissions"]

2. **Sector Features:**
   - [What: e.g., "Created revenue percentage features for each NACE Level 1 sector"]
   - [Why: e.g., "Different sectors have vastly different emission intensities - manufacturing companies typically have higher Scope 1 emissions than service companies"]

3. **Sector Diversity Features:**
   - [What: e.g., "Calculated Herfindahl-Hirschman Index (HHI) to measure sector concentration"]
   - [Why: e.g., "Diversified companies may have different emission profiles than single-sector companies"]

4. **Environmental Activity Features:**
   - [What: e.g., "Summed env_score_adjustment values and counted number of activities per company"]
   - [Why: e.g., "Companies with more positive environmental activities (negative adjustments) may have lower emissions"]

5. **SDG Commitment Features:**
   - [What: e.g., "One-hot encoded SDG commitments and created count of total SDGs"]
   - [Why: e.g., "SDG 7 (Clean Energy) and SDG 13 (Climate Action) are directly related to emissions"]

6. **Revenue-Based Features:**
   - [What: e.g., "Created log(revenue) to handle skewed distribution and revenue × sector interactions"]
   - [Why: e.g., "Revenue is a strong proxy for company size, and larger companies typically have higher absolute emissions, but the relationship is non-linear"]

7. **Sustainability Score Features:**
   - [What: e.g., "Used environmental_score and created interactions with revenue"]
   - [Why: e.g., "Environmental score likely correlates with emissions, and the relationship may vary by company size"]

8. **Interaction Features:**
   - [What: e.g., "Created revenue × dominant_sector_pct and region × sector interactions"]
   - [Why: e.g., "The relationship between revenue and emissions varies by sector - a large manufacturing company will have different emissions than a large service company"]

### Data Transformations

1. **Target Variable Transformation:**
   - [What: e.g., "Applied log transformation to target variables"]
   - [Why: e.g., "Emissions data is highly right-skewed with many small companies and few very large ones. Log transformation makes the distribution more normal and helps linear models perform better"]

2. **Feature Scaling:**
   - [What: e.g., "Applied StandardScaler to all features"]
   - [Why: e.g., "Necessary for linear models and helps gradient-based algorithms converge faster"]

3. **Missing Value Handling:**
   - [What: e.g., "Used left joins for relational tables and filled missing values with 0"]
   - [Why: e.g., "Absence of environmental activities or SDG commitments is meaningful information (company doesn't engage in these), so 0 is appropriate"]

4. **Outlier Handling:**
   - [What: e.g., "Kept all outliers as they represent legitimate large companies"]
   - [Why: e.g., "Outliers in revenue and emissions are real large companies, not data errors. Log transformation reduces their impact on model training"]

### Feature Selection

- **Method:** [e.g., "Used VarianceThreshold to remove near-constant features, then selected top features by correlation with targets"]
- **Final Feature Count:** [Number]
- **Most Important Features:** [List top 5-10 features, e.g., "revenue, log_revenue, environmental_score, sect_C_pct (Manufacturing), env_score_adjustment"]

---

## Key Insights & Findings

### What Worked Well
- [e.g., "Sector features were highly predictive - companies in manufacturing sectors consistently had higher Scope 1 emissions"]
- [e.g., "Log transformation of targets significantly improved model performance"]
- [e.g., "Environmental score was a strong predictor, especially when combined with revenue"]

### Challenges Encountered
- [e.g., "Highly skewed target distribution made it difficult for linear models to capture extreme values"]
- [e.g., "Some companies had missing sector data, requiring careful handling"]
- [e.g., "Scope 2 predictions were more challenging than Scope 1, likely due to greater variability in electricity grid carbon intensity"]

### Surprising Findings
- [e.g., "SDG commitments were less predictive than expected - many companies commit to SDGs but don't necessarily have lower emissions"]
- [e.g., "Sector diversity (number of sectors) was negatively correlated with emissions - more diversified companies had lower emissions per revenue unit"]

---

## Methodology Summary

**High-Level Approach:**
[2-3 sentence summary of your overall approach, e.g., "We engineered features from all available data sources, focusing on sector exposures, environmental activities, and company characteristics. We trained separate XGBoost models for Scope 1 and Scope 2 emissions, using log-transformed targets to handle skewed distributions. Final predictions were generated using the best-performing models validated through cross-validation."]

---

## Code Organization

- **Notebooks/Files:** [List your main code files and what each does]
- **Reproducibility:** [Mention if you set random seeds, saved models, etc.]

---

## Future Improvements (Optional)

If you had more time, what would you try?
- [e.g., "External data on sector-specific emission factors"]
- [e.g., "More sophisticated ensemble methods"]
- [e.g., "Deep learning models for capturing complex interactions"]

---

## Notes

- Keep this document concise but complete
- Focus on explaining the "why" behind decisions
- Be honest about limitations and challenges
- Use clear, technical but accessible language

