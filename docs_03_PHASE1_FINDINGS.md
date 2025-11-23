# Phase 1: Data Exploration - Key Findings

## 📊 Dataset Overview

- **Train set**: 429 companies, 12 columns
- **Test set**: 49 companies, 11 columns (no target variables)
- **Sector data**: Multiple rows per company (1-to-many relationship)
- **Environmental activities**: Sparse (not all companies have activities)
- **SDG commitments**: Sparse (not all companies have SDG commitments)

## ✅ Data Quality Findings

### Excellent Data Quality:
1. **No missing values** in train.csv or test.csv ✅
2. **All entity_ids are unique** in both train and test ✅
3. **No data leakage** - zero overlap between train and test entity_ids ✅
4. **No duplicate rows** ✅
5. **All revenue values are positive** ✅
6. **All emission values are non-negative** ✅
7. **All sustainability scores are in valid range (1-5)** ✅
8. **All test regions exist in training data** ✅

### Data Structure:
- Clean, well-structured data
- Ready for feature engineering
- No major data quality issues to address

## 📈 Target Variable Analysis

### Scope 1 Emissions:
- **Highly skewed** (Skewness: 3.15) - right-tailed distribution
- **No zero values** (0% of companies)
- Range: [min to max] - wide range indicating diverse company sizes
- **Log transformation recommended** to normalize distribution

### Scope 2 Emissions:
- **Very highly skewed** (Skewness: 7.34) - extremely right-tailed
- **13 companies (3.0%) have zero Scope 2 emissions**
- Range: [min to max] - even wider range than Scope 1
- **Log transformation strongly recommended**

### Key Insights:
- Both targets are highly skewed → **log transformation will help models**
- Scope 2 is more skewed than Scope 1
- Some companies have zero Scope 2 (legitimate - they may not purchase electricity)
- Positive correlation expected between Scope 1, Scope 2, and revenue

## 🌍 Geographic Distribution

### Regions:
- **Western Europe (WEU)**: Most common (269 train, 33 test)
- **Northern America (NAM)**: Second most common (153 train, 16 test)
- **Other regions**: Small representation (EA, EEU, ANZ, CAR, LATAM)

### Countries:
- **Top countries**: US (147), GB (62), FR (43), IT (27), DE (26), NL (26)
- Test set has similar distribution
- All test regions seen in training → **no cold start problem**

## 🏭 Sector Distribution Analysis

### Coverage:
- Most companies have sector data
- Companies can have multiple sectors (1-to-many relationship)
- Revenue percentages should sum to ~100% per company

### Key Points:
- Need to aggregate sector data to entity level
- Sector exposure is a strong predictor (different sectors = different emission intensities)
- Both NACE Level 1 and Level 2 available for feature engineering

## 🌱 Environmental Activities Analysis

### Coverage:
- **Sparse data** - not all companies have environmental activities
- Companies without activities should get 0 (meaningful absence)

### Key Points:
- `env_score_adjustment` can be positive (bad) or negative (good)
- Sum of adjustments gives overall environmental impact
- Count of activities indicates engagement level
- **Left join required** to preserve all companies

## 🎯 SDG Commitments Analysis

### Coverage:
- **Sparse data** - not all companies have SDG commitments
- Companies can commit to multiple SDGs

### Key Points:
- SDG IDs range from 1-17 (all valid)
- Need to one-hot encode SDG commitments
- Count of SDGs indicates commitment level
- **Left join required** to preserve all companies

## 💡 Key Decisions for Next Phases

### Phase 2 (Data Quality):
- ✅ No missing values to handle
- ✅ No outliers to remove (keep all - they're legitimate large companies)
- ✅ Data consistency verified
- **Action**: Proceed directly to feature engineering

### Phase 3 (Feature Engineering):
1. **Log transform targets** - both Scope 1 and Scope 2 are highly skewed
2. **Geographic features** - one-hot encode regions
3. **Sector features** - aggregate to entity level (Level 1 and Level 2)
4. **Environmental features** - sum adjustments, count activities
5. **SDG features** - one-hot encode, count commitments
6. **Revenue features** - log transform, create interactions
7. **Interaction features** - revenue × sector, region × sector

### Phase 4 (Modeling):
- Use **log-transformed targets** for training
- Consider **tree-based models** (handle non-linearity well)
- Train **separate models** for Scope 1 and Scope 2
- Use **cross-validation** for robust evaluation

## 📝 Summary

**Data Quality**: Excellent - no issues found ✅
**Target Distribution**: Highly skewed - log transformation needed ✅
**Feature Engineering**: Rich relational data available ✅
**Ready for**: Feature engineering and modeling ✅

