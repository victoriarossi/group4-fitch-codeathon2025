import os
import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

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

sys.stdout = Tee("outlier_treatment_output.txt")

os.makedirs("plots/outlier_treatment/revenue", exist_ok=True)
os.makedirs("plots/outlier_treatment/env_activities", exist_ok=True)

train = pd.read_csv("data/train.csv")
env_activities = pd.read_csv("data/environmental_activities.csv")

def plot_before_after(series_before, series_after, name, outdir):
    sb = series_before.dropna()
    sa = series_after.dropna()

    fig, axes = plt.subplots(1, 2, figsize=(10, 4))
    sns.histplot(sb, kde=True, ax=axes[0])
    axes[0].set_title(f"{name} before")
    sns.histplot(sa, kde=True, ax=axes[1])
    axes[1].set_title(f"{name} after")
    fig.tight_layout()
    fig.savefig(os.path.join(outdir, f"{name}_hist_before_after.png"))
    plt.close(fig)

    fig, axes = plt.subplots(1, 2, figsize=(8, 4))
    sns.boxplot(x=sb, ax=axes[0])
    axes[0].set_title(f"{name} before")
    sns.boxplot(x=sa, ax=axes[1])
    axes[1].set_title(f"{name} after")
    fig.tight_layout()
    fig.savefig(os.path.join(outdir, f"{name}_box_before_after.png"))
    plt.close(fig)

print("=== Phase 3: Outlier Treatment ===")

train["revenue_log"] = np.log1p(train["revenue"])
print("\n[revenue] Applied log1p transform (no capping).")
plot_before_after(train["revenue"], train["revenue_log"], "revenue_log", "plots/outlier_treatment/revenue")

env_activities["env_score_adjustment_capped"] = env_activities["env_score_adjustment"]

for activity_type, group in env_activities.groupby("activity_type"):
    s = group["env_score_adjustment"].dropna()
    if s.empty:
        continue

    p1, p99 = s.quantile([0.01, 0.99])
    capped = group["env_score_adjustment"].clip(lower=p1, upper=p99)
    env_activities.loc[group.index, "env_score_adjustment_capped"] = capped

    n_changed = (group["env_score_adjustment"] != capped).sum()
    print(f"\n[env_score_adjustment | {activity_type}]")
    print(f"1st pct={p1:.4f}, 99th pct={p99:.4f}")
    print(f"Values capped to percentiles: {n_changed}")

    safe_name = str(activity_type).replace(" ", "_").replace("/", "_")
    plot_before_after(
        group["env_score_adjustment"],
        capped,
        f"{safe_name}_env_score_adjustment",
        "plots/outlier_treatment/env_activities"
    )

train.to_csv("data/train_outliers_fixed.csv", index=False)
env_activities.to_csv("data/environmental_activities_outliers_fixed.csv", index=False)

print("\nSaved:")
print("  data/train_outliers_fixed.csv")
print("  data/environmental_activities_outliers_fixed.csv")
print("Plots in plots/outlier_treatment/")
