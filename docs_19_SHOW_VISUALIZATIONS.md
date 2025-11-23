# 📊 All Visualizations Generated!

## ✅ Visualizations Created

All visualizations have been generated and saved as PNG files in the `notebooks/` directory:

### 📁 Location:
```
/Users/yamaannandolia/Desktop/group4-fitch-codeathon2025/notebooks/
```

### 📊 Generated Files:

1. **`target_distributions.png`** ✅
   - **What it shows:** 6 plots showing target variable distributions
   - **Includes:**
     - Scope 1: Raw histogram, Log-transformed histogram, Box plot
     - Scope 2: Raw histogram, Log-transformed histogram, Box plot
   - **Purpose:** Justifies log transformation for modeling

2. **`missing_values_overview.png`** ✅
   - **What it shows:** Bar chart and pie chart of missing values
   - **Includes:**
     - Bar chart: Top 15 features by missing percentage
     - Pie chart: Overall missing vs non-missing data
   - **Purpose:** Visualizes missing value patterns

3. **`missing_values_heatmap.png`** ✅
   - **What it shows:** Heatmap of missing values (first 100 rows)
   - **Purpose:** Shows missing value patterns across features and companies

4. **`correlation_analysis.png`** ✅
   - **What it shows:** Comprehensive correlation analysis
   - **Includes:**
     - Large heatmap: Features vs targets correlation
     - Bar chart: Top 10 features correlated with Scope 1
     - Bar chart: Top 10 features correlated with Scope 2
   - **Purpose:** Validates feature engineering choices

---

## 🎯 How to View the Visualizations

### Option 1: Open PNG Files Directly
Open the PNG files in any image viewer:
```bash
# macOS
open notebooks/target_distributions.png
open notebooks/correlation_analysis.png
# etc.
```

### Option 2: View in Finder/Files
Navigate to:
```
/Users/yamaannandolia/Desktop/group4-fitch-codeathon2025/notebooks/
```
Double-click any PNG file to view it!

### Option 3: List All Visualizations
```bash
cd /Users/yamaannandolia/Desktop/group4-fitch-codeathon2025
ls -lh notebooks/*.png
```

---

## 📝 Visualization Details

### **target_distributions.png**
- **Size:** 2x3 grid (6 plots total)
- **Colors:** Blue/Green for Scope 1/2, Orange/Red for log-transformed
- **Key Insight:** Both targets are highly skewed, justifying log transformation

### **missing_values_overview.png**
- **Size:** 2 plots side-by-side
- **Colors:** Coral for missing, Light blue for non-missing
- **Key Insight:** Shows which features have most missing values

### **missing_values_heatmap.png**
- **Size:** Large heatmap (100 rows x 15 features)
- **Colors:** Yellow-Orange-Red gradient (darker = missing)
- **Key Insight:** Visualizes missing value patterns

### **correlation_analysis.png**
- **Size:** 2x2 grid (3 plots total)
- **Colors:** Cool-warm colormap (red = positive, blue = negative)
- **Key Insight:** Shows which features correlate most with targets

---

## ✅ Next Steps

1. **View the PNG files** - Open them in any image viewer
2. **Use in presentations** - All plots are publication-ready
3. **Include in documentation** - Reference these visualizations in your report

---

## 🔄 To Regenerate Visualizations

Run the script again:
```bash
cd /Users/yamaannandolia/Desktop/group4-fitch-codeathon2025
python3 generate_all_visualizations.py
```

---

**All visualizations are ready to view!** 🎉

