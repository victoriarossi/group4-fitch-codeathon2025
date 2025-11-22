import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import sys

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

numeric_cols = ["revenue", "environmental_score", "social_score", "governance_score"]
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
