import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import sys
from scipy.stats import spearmanr

class Tee:
    def __init__(self, filename):
        self.file = open(filename, "w")
        self.stdout = sys.stdout

    def write(self, data):
        self.stdout.write(data)
        self.file.write(data)

    def flush(self):
        self.stdout.flush()
        self.file.flush()

sys.stdout = Tee("trend_n_dist_analysis.txt")

os.makedirs("plots/esg_distributions", exist_ok=True)
os.makedirs("plots/esg_boxplots", exist_ok=True)
os.makedirs("plots/env_activities", exist_ok=True)

train = pd.read_csv("data/train.csv")
env_activities = pd.read_csv("data/environmental_activities.csv")

numeric_cols = ["revenue", "environmental_score", "social_score", "governance_score", "target_scope_1", "target_scope_2"]
train = train.copy()
train["revenue_log"] = np.log1p(train["revenue"])

for col in numeric_cols + ["revenue_log"]:
    s = train[col].dropna()

    plt.figure(figsize=(6, 4))
    sns.histplot(s, kde=True)
    plt.title(f"Distribution of {col}")
    plt.tight_layout()
    plt.savefig(f"plots/esg_distributions/{col}_hist.png")
    plt.close()

    plt.figure(figsize=(4, 4))
    sns.boxplot(x=s)
    plt.title(f"Boxplot of {col}")
    plt.tight_layout()
    plt.savefig(f"plots/esg_boxplots/{col}_box.png")
    plt.close()

    q1 = s.quantile(0.25)
    q3 = s.quantile(0.75)
    iqr = q3 - q1
    lower = q1 - 1.5 * iqr
    upper = q3 + 1.5 * iqr
    mask = (s < lower) | (s > upper)
    outliers = s[mask]

    print(f"\n=== {col} ===")
    print(f"Q1={q1:.4f}, Q3={q3:.4f}, IQR={iqr:.4f}")
    print(f"IQR bounds: [{lower:.4f}, {upper:.4f}]")
    print(f"Outlier count: {len(outliers)}")
    if len(outliers) > 0:
        print("Smallest 5 outliers:")
        print(outliers.sort_values().head().to_string())
        print("Largest 5 outliers:")
        print(outliers.sort_values().tail().to_string())

for activity_type, group in env_activities.groupby("activity_type"):
    s = group["env_score_adjustment"].dropna()
    if s.empty:
        continue

    safe_name = str(activity_type).replace(" ", "_")

    plt.figure(figsize=(6, 4))
    sns.histplot(s, kde=True)
    plt.title(f"Env score adjustment distribution: {activity_type}")
    plt.tight_layout()
    plt.savefig(f"plots/env_activities/{safe_name}_env_score_hist.png")
    plt.close()

    plt.figure(figsize=(4, 4))
    sns.boxplot(x=s)
    plt.title(f"Env score adjustment boxplot: {activity_type}")
    plt.tight_layout()
    plt.savefig(f"plots/env_activities/{safe_name}_env_score_box.png")
    plt.close()

    q1 = s.quantile(0.25)
    q3 = s.quantile(0.75)
    iqr = q3 - q1
    lower = q1 - 1.5 * iqr
    upper = q3 + 1.5 * iqr
    mask = (s < lower) | (s > upper)
    outliers = s[mask]

    print(f"\n=== env_score_adjustment for {activity_type} ===")
    print(f"Q1={q1:.4f}, Q3={q3:.4f}, IQR={iqr:.4f}")
    print(f"IQR bounds: [{lower:.4f}, {upper:.4f}]")
    print(f"Outlier count: {len(outliers)}")
    if len(outliers) > 0:
        print("Smallest 5 outliers:")
        print(outliers.sort_values().head().to_string())
        print("Largest 5 outliers:")
        print(outliers.sort_values().tail().to_string())


# Check correlation between target_scope_1 and target_scope_2
ts1 = train["target_scope_1"]
ts2 = train["target_scope_2"]

common_index = ts1.index.intersection(ts2.index)
correlation = ts1.loc[common_index].corr(ts2.loc[common_index])
print(f"\nPearsons correlation between target_scope_1 and target_scope_2: {correlation:.4f}")    
rho, p = spearmanr(ts1.loc[common_index], ts2.loc[common_index])
print(f"Spearman correlation between target_scope_1 and target_scope_2: {rho:.4f}")
# As target_scope_1 increases, target_scope_2 tends to increase as well, but not in a linear way. 
# Because Spearman's rho is higher than Pearson's r, this suggests a monotonic but non-linear relationship.
plt.figure(figsize=(6, 6))
sns.scatterplot(x=ts1, y=ts2)
plt.title("Scatter plot of target_scope_1 vs target_scope_2")
plt.xlabel("target_scope_1")
plt.ylabel("target_scope_2")
plt.tight_layout()
plt.savefig("plots/target_scope_1_vs_2_scatter.png")
plt.close()
print("Scatter plot saved to plots/target_scope_1_vs_2_scatter.png")

# Check correlation between log target_scope_1 and target_scope_2
ts1_log = np.log1p(ts1)
common_index = ts1_log.index.intersection(ts2.index)
correlation_log = ts1_log.loc[common_index].corr(ts2.loc[common_index])
print(f"\nPearsons correlation between log(target_scope_1) and target_scope_2: {correlation_log:.4f}")
plt.figure(figsize=(6, 6))
sns.scatterplot(x=ts1_log, y=ts2)
plt.title("Scatter plot of log(target_scope_1) vs target_scope_2")
plt.xlabel("log(target_scope_1)")
plt.ylabel("target_scope_2")
plt.tight_layout()
plt.savefig("plots/log_target_scope_1_vs_2_scatter.png")
plt.close()
print("Scatter plot saved to plots/log_target_scope_1_vs_2_scatter.png")


# Because of Monotonic relationship between target_scope_1 and target_scope_2,
# LOWESS Smoothing Curve
x = np.log(ts1.loc[common_index] + 1)
y = ts2.loc[common_index]

plt.figure(figsize=(8,6))
sns.regplot(x=x, y=y, lowess=True, scatter_kws={'s':10}, line_kws={'color': 'red'})
plt.xlabel("log(target_scope_1)")
plt.ylabel("target_scope_2")
plt.title("LOWESS Smoothed Trend Between target_scope_1 and target_scope_2")
plt.tight_layout()
plt.savefig("plots/log_target_scope_1_vs_2_lowess.png")
plt.close()

plt.figure(figsize=(8,6))
plt.hexbin(x, y, gridsize=40, mincnt=1)
plt.colorbar(label="counts")
plt.xlabel("log(target_scope_1)")
plt.ylabel("target_scope_2")
plt.title("Hexbin Density Plot")
plt.savefig("plots/log_target_scope_1_vs_2_hexbin.png")
plt.close()

sns.kdeplot(
    x=x,
    y=y,
    fill=True,
    levels=30,
    thresh=0.05
)
plt.xlabel("log(target_scope_1)")
plt.ylabel("target_scope_2")
plt.title("2D KDE")
plt.tight_layout()
plt.savefig("plots/log_target_scope_1_vs_2_kde.png")
plt.close()