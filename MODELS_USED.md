# 📊 Models Used in This Project

## ✅ **Models Currently Used**

Based on the executed notebook `comprehensive_analysis_executed.ipynb`:

### **📊 Main Notebook (`comprehensive_analysis_executed.ipynb`)**

**Models Compared:**
1. **Linear Regression** (with StandardScaler)
2. **Random Forest** (100 trees, max_depth=10)
3. **Gradient Boosting** (optional, if available)

**Selected Models (Based on Cross-Validation RMSE):**
- ✅ **Scope 1**: **Random Forest** (CV RMSE: 1.93 ± 0.20)
- ✅ **Scope 2**: **Random Forest** (CV RMSE: 2.42 ± 0.17)

**Final Models:**
- `model_scope1.pkl` - Random Forest for Scope 1 emissions
- `model_scope2.pkl` - Random Forest for Scope 2 emissions

---

### **📊 Revised Notebook (`revised_comprehensive_analysis_elasticnet.ipynb`)**

**Models Compared:**
1. **Gradient Boosting** (sklearn)
2. **CatBoost** (if available)
3. **XGBoost** (if available)
4. **ElasticNet** (with StandardScaler)

**Selected Models (Based on Validation Performance):**
- ✅ **Scope 1**: **ElasticNet** (best on validation set)
- ✅ **Scope 2**: **ElasticNet** (best on validation set)

**Final Models:**
- `model_scope1_final.pkl` - ElasticNet for Scope 1 emissions
- `scaler_scope1.pkl` - StandardScaler for Scope 1 features
- `model_scope2_final.pkl` - ElasticNet for Scope 2 emissions
- `scaler_scope2.pkl` - StandardScaler for Scope 2 features

**Final Submission:**
- `submission_final_elasticnet.csv` - Generated using ElasticNet models

---

## 🎯 **Which Models Are Actually Being Used?**

### **For Main Submission:**
Check which model files exist:

```bash
# Check saved models
ls -la notebooks/model_*.pkl

# Check submissions
ls -la notebooks/submission*.csv
```

### **Most Recent Submission:**
Based on file timestamps:
- **`submission_final_elasticnet.csv`** - Uses ElasticNet models
- **`submission_revised_boosting.csv`** - Uses Gradient Boosting models
- **`submission_comprehensive.csv`** - Uses Random Forest models (original)

---

## 📋 **Model Details**

### **Random Forest (Main Notebook)**
- **Algorithm**: Random Forest Regressor
- **Parameters**: n_estimators=100, max_depth=10
- **Why Selected**: Best cross-validation RMSE for both targets
- **Performance**:
  - Scope 1: RMSE = 1.93 ± 0.20
  - Scope 2: RMSE = 2.42 ± 0.17

### **ElasticNet (Revised Notebook)**
- **Algorithm**: ElasticNet (L1 + L2 regularization)
- **Parameters**: alpha=0.1, l1_ratio=0.5
- **Preprocessing**: StandardScaler (required for linear models)
- **Why Selected**: Best validation performance
- **Advantages**: 
  - Handles multicollinearity well
  - Feature selection built-in (L1 regularization)
  - Interpretable coefficients

### **Gradient Boosting (Optional)**
- **Algorithm**: GradientBoostingRegressor
- **Parameters**: n_estimators=200, max_depth=6, learning_rate=0.1
- **Status**: Trained and compared, but not selected as final model

---

## 🔍 **How to Check Which Models Are Used**

### **Check the Notebook:**
1. Open `notebooks/comprehensive_analysis_executed.ipynb`
2. Look for "Step 4.6: Model Comparison & Selection"
3. See which models were selected

### **Check Saved Models:**
```bash
cd notebooks
ls -la model_*.pkl
```

### **Check Submissions:**
```bash
cd notebooks
ls -la submission*.csv
# Check timestamps to see most recent
```

---

## 💡 **Summary**

**Most Likely Models Being Used:**
- **Main notebook**: **Random Forest** for both Scope 1 and Scope 2
- **Revised notebook**: **ElasticNet** for both Scope 1 and Scope 2

**To Confirm:**
- Check `notebooks/comprehensive_analysis_executed.ipynb` - see Phase 4 results
- Check saved model files - see which ones exist
- Check submission files - see which one was generated most recently

