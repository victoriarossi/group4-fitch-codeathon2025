# 📁 File Index - Clear Organization Guide

## 🎯 Quick Start

### **For Judges / Reviewers:**
- 📊 **MOST IMPORTANT**: `notebooks/comprehensive_analysis_executed.ipynb`
  - **This is the ONE file you need!** Contains everything: code, visualizations, explanations, and final submission
  - See `JUDGES_REVIEW_GUIDE.md` for complete review instructions

### **For Developers:**
- 📊 **Main Notebook**: `notebooks/comprehensive_analysis.ipynb`
- 📈 **With Visualizations**: `notebooks/comprehensive_analysis_executed.ipynb`
- 📝 **This Guide**: `FILE_INDEX.md` (you are here!)

---

## 📚 Documentation Files (`docs_*`)

All documentation files are prefixed with `docs_` and numbered for easy navigation.

### Project Planning
| File | What It Is |
|------|------------|
| `docs_01_PROJECT_PLAN.md` | Complete step-by-step project plan |
| `docs_02_QUICK_CHECKLIST.md` | Quick checklist of tasks |

### Phase Results
| File | What It Is |
|------|------------|
| `docs_03_PHASE1_FINDINGS.md` | Findings from Phase 1 (data exploration) |
| `docs_04_PHASE2_3_RESULTS.md` | Results from Phase 2 & 3 (merging, feature engineering) |
| `docs_05_PHASE4_5_RESULTS.md` | Results from Phase 4 & 5 (modeling, predictions) |

### Feature Documentation
| File | What It Is |
|------|------------|
| `docs_06_FEATURE_DOCUMENTATION.md` | Complete feature engineering documentation |
| `docs_07_FEATURE_IMPACT_SUMMARY.md` | Summary of feature impact |
| `docs_08_SIMPLE_FEATURE_EXPLANATION.md` | Simple explanations of features |

### Visualization Documentation
| File | What It Is |
|------|------------|
| `docs_09_VISUALIZATION_PROGRESS.md` | Progress tracker for visualizations |
| `docs_10_VISUALIZATIONS_ADDED.md` | List of all visualizations added |
| `docs_11_VIEW_VISUALIZATIONS.md` | How to view visualizations inline |

### How-To Guides
| File | What It Is |
|------|------------|
| `docs_12_HOW_TO_RUN.md` | How to run the notebook |
| `docs_13_HOW_TO_VIEW_VISUALIZATIONS.md` | How to view visualizations |
| `docs_14_HOW_TO_INTERPRET_FINDINGS.md` | How to interpret results |

### Other Documentation
| File | What It Is |
|------|------------|
| `docs_15_FIND_YOUR_FINDINGS.md` | Guide to finding all findings |
| `docs_16_README_FINDINGS.md` | Quick reference for findings |
| `docs_17_EXPLANATION_TEMPLATE.md` | Template for submission explanation |
| `docs_18_QUICK_VIEW_VISUALIZATIONS.md` | Quick guide to view visualizations |
| `docs_19_SHOW_VISUALIZATIONS.md` | Show all visualizations |

---

## 🛠️ Script Files (`scripts_*`)

All script files are prefixed with `scripts_` and numbered.

| File | What It Does |
|------|--------------|
| `scripts_01_run_notebook.py` | Runs notebook and saves outputs |
| `scripts_02_start_notebook.sh` | Starts Jupyter notebook server |
| `scripts_03_generate_visualizations.py` | Generates all visualization PNG files |
| `scripts_04_add_visualizations.py` | Adds visualizations to notebook |
| `scripts_05_execute_notebook.py` | Executes notebook with visualizations |

---

## 📊 Notebook Files (`notebooks/`)

| File | What It Is |
|------|------------|
| `comprehensive_analysis.ipynb` | **Main notebook** - your primary work |
| `comprehensive_analysis_executed.ipynb` | **Executed version** - has outputs & visualizations embedded |
| `revised_comprehensive_analysis.ipynb` | Revised version with ElasticNet approach |
| `revised_comprehensive_analysis_executed.ipynb` | Executed revised version |
| `baseline_model_and_inference.ipynb` | Starter/baseline notebook |
| `basic_feature_engineering.ipynb` | Starter feature engineering notebook |

---

## 📦 Data Files (`data/`)

| File | What It Is |
|------|------------|
| `train.csv` | Training data |
| `test.csv` | Test data |
| `revenue_distribution_by_sector.csv` | Sector revenue data |
| `environmental_activities.csv` | Environmental activities data |
| `sustainable_development_goals.csv` | SDG commitments data |

---

## 💾 Model & Output Files (`notebooks/`)

### Pickled Data
| File | What It Is |
|------|------------|
| `final_train_revised.pkl` | Final training data (feature engineered) |
| `final_test_revised.pkl` | Final test data (feature engineered) |
| `final_train_fe.pkl` | Training data with feature engineering |
| `final_test_fe.pkl` | Test data with feature engineering |

### Models
| File | What It Is |
|------|------------|
| `model_scope1_final.pkl` | Final model for Scope 1 emissions |
| `model_scope2_final.pkl` | Final model for Scope 2 emissions |
| `scaler_scope1.pkl` | Scaler for Scope 1 features |
| `scaler_scope2.pkl` | Scaler for Scope 2 features |

### Submissions
| File | What It Is |
|------|------------|
| `submission_final_elasticnet.csv` | Final submission file (ElasticNet) |
| `submission_revised_boosting.csv` | Submission file (Boosting) |

### Visualizations (PNG)
| File | What It Is |
|------|------------|
| `target_distributions.png` | Target variable distributions |
| `correlation_analysis.png` | Correlation heatmaps |
| `missing_values_*.png` | Missing value visualizations |

---

## 🎯 Quick Reference

### "I want to..."
- **Run the notebook**: Use `scripts_01_run_notebook.py` or open `comprehensive_analysis.ipynb`
- **See visualizations**: Open `comprehensive_analysis_executed.ipynb` or read `docs_11_VIEW_VISUALIZATIONS.md`
- **Understand features**: Read `docs_06_FEATURE_DOCUMENTATION.md`
- **See results**: Read `docs_05_PHASE4_5_RESULTS.md`
- **Generate visualizations**: Run `scripts_03_generate_visualizations.py`
- **Find submission**: Look for `submission_final_elasticnet.csv` in `notebooks/`

---

## 📁 Folder Structure

```
group4-fitch-codeathon2025/
├── 📚 docs_*.md              (All documentation)
├── 🛠️ scripts_*.py           (All scripts)
├── 📊 notebooks/             (All notebooks, models, outputs)
│   ├── comprehensive_analysis.ipynb (Main notebook)
│   ├── *.pkl                 (Data & models)
│   ├── *.csv                 (Submissions)
│   └── *.png                 (Visualizations)
├── 📦 data/                  (Original data files)
├── README.md                 (Project README)
├── requirements.txt          (Dependencies)
└── FILE_INDEX.md            (This file!)
```

---

**💡 Tip:** All files are now organized with clear prefixes (`docs_`, `scripts_`) and numbers for easy navigation!
