import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

os.makedirs("model_graphs", exist_ok=True)

df = pd.read_csv("data/model_metrics.csv")
sns.set(style="whitegrid")

targets = df["target"].unique()
models = df["model"].unique()

# 1. MAE Comparison (Val vs Test, both targets)
fig, axes = plt.subplots(1, 2, figsize=(14, 5))
for i, target in enumerate(targets):
    df_t = df[df["target"] == target]
    plot_df = df_t.melt(
        id_vars=["phase", "target", "model"],
        value_vars=["val_mae", "test_mae"],
        var_name="dataset",
        value_name="value"
    )
    plot_df["dataset"] = plot_df["dataset"].map({"val_mae": "Validation", "test_mae": "Test"})
    sns.barplot(data=plot_df, x="model", y="value", hue="dataset", ax=axes[i])
    axes[i].set_title(f"MAE: Validation vs Test\n{target}")
    axes[i].set_xlabel("Model")
    axes[i].set_ylabel("MAE")
    axes[i].tick_params(axis='x', rotation=45)
plt.tight_layout()
plt.savefig("model_graphs/mae_comparison.png")
plt.close()

# 2. RMSE Comparison (Val vs Test, both targets)
fig, axes = plt.subplots(1, 2, figsize=(14, 5))
for i, target in enumerate(targets):
    df_t = df[df["target"] == target]
    plot_df = df_t.melt(
        id_vars=["phase", "target", "model"],
        value_vars=["val_rmse", "test_rmse"],
        var_name="dataset",
        value_name="value"
    )
    plot_df["dataset"] = plot_df["dataset"].map({"val_rmse": "Validation", "test_rmse": "Test"})
    sns.barplot(data=plot_df, x="model", y="value", hue="dataset", ax=axes[i])
    axes[i].set_title(f"RMSE: Validation vs Test\n{target}")
    axes[i].set_xlabel("Model")
    axes[i].set_ylabel("RMSE")
    axes[i].tick_params(axis='x', rotation=45)
plt.tight_layout()
plt.savefig("model_graphs/rmse_comparison.png")
plt.close()

# 3. R² Comparison (Val vs Test, both targets)
fig, axes = plt.subplots(1, 2, figsize=(14, 5))
for i, target in enumerate(targets):
    df_t = df[df["target"] == target]
    plot_df = df_t.melt(
        id_vars=["phase", "target", "model"],
        value_vars=["val_r2", "test_r2"],
        var_name="dataset",
        value_name="value"
    )
    plot_df["dataset"] = plot_df["dataset"].map({"val_r2": "Validation", "test_r2": "Test"})
    sns.barplot(data=plot_df, x="model", y="value", hue="dataset", ax=axes[i])
    axes[i].set_title(f"R²: Validation vs Test\n{target}")
    axes[i].set_xlabel("Model")
    axes[i].set_ylabel("R²")
    axes[i].tick_params(axis='x', rotation=45)
plt.tight_layout()
plt.savefig("model_graphs/r2_comparison.png")
plt.close()

# 4. Test Performance Summary (all metrics, both targets)
fig, axes = plt.subplots(2, 3, figsize=(16, 10))
metrics = [("test_mae", "Test MAE"), ("test_rmse", "Test RMSE"), ("test_r2", "Test R²")]
for i, target in enumerate(targets):
    df_t = df[df["target"] == target]
    for j, (col, label) in enumerate(metrics):
        sns.barplot(data=df_t, x="model", y=col, hue="phase", ax=axes[i, j])
        axes[i, j].set_title(f"{label}\n{target}")
        axes[i, j].set_xlabel("Model")
        axes[i, j].set_ylabel(label)
        axes[i, j].tick_params(axis='x', rotation=45)
        axes[i, j].legend(fontsize=8)
plt.tight_layout()
plt.savefig("model_graphs/test_performance_summary.png")
plt.close()

print("Generated 4 graphs in model_graphs/")

df = pd.read_csv("data/model_metrics.csv")
sns.set(style="whitegrid")

targets = df["target"].unique()
models = df["model"].unique()

# Simplify phase names for display
df["phase_label"] = df["phase"].apply(lambda x: "Baseline" if "baseline" in x else "Tuned")

# 1. Validation R² - Baseline vs Tuned (both targets)
fig, axes = plt.subplots(1, 2, figsize=(14, 5))
for i, target in enumerate(targets):
    df_t = df[df["target"] == target]
    sns.barplot(data=df_t, x="model", y="val_r2", hue="phase_label", ax=axes[i])
    axes[i].set_title(f"Validation R²: Baseline vs Tuned\n{target}")
    axes[i].set_xlabel("Model")
    axes[i].set_ylabel("R²")
    axes[i].tick_params(axis='x', rotation=45)
    axes[i].legend(title="Phase")
plt.tight_layout()
plt.savefig("model_graphs/val_r2_baseline_vs_tuned.png")
plt.close()

# 2. Test R² - Baseline vs Tuned (both targets)
fig, axes = plt.subplots(1, 2, figsize=(14, 5))
for i, target in enumerate(targets):
    df_t = df[df["target"] == target]
    sns.barplot(data=df_t, x="model", y="test_r2", hue="phase_label", ax=axes[i])
    axes[i].set_title(f"Test R²: Baseline vs Tuned\n{target}")
    axes[i].set_xlabel("Model")
    axes[i].set_ylabel("R²")
    axes[i].tick_params(axis='x', rotation=45)
    axes[i].legend(title="Phase")
plt.tight_layout()
plt.savefig("model_graphs/test_r2_baseline_vs_tuned.png")
plt.close()

# 3. Validation R² by Model (both targets side by side)
fig, ax = plt.subplots(figsize=(12, 5))
plot_df = df.copy()
plot_df["target_label"] = plot_df["target"].apply(
    lambda x: "Scope 1" if "scope_1" in x else "Scope 2"
)
sns.barplot(data=plot_df, x="model", y="val_r2", hue="target_label", ax=ax)
ax.set_title("Validation R² by Model and Target")
ax.set_xlabel("Model")
ax.set_ylabel("R²")
ax.legend(title="Target")
plt.tight_layout()
plt.savefig("model_graphs/val_r2_by_target.png")
plt.close()

# 4. Test R² by Model (both targets side by side)
fig, ax = plt.subplots(figsize=(12, 5))
sns.barplot(data=plot_df, x="model", y="test_r2", hue="target_label", ax=ax)
ax.set_title("Test R² by Model and Target")
ax.set_xlabel("Model")
ax.set_ylabel("R²")
ax.legend(title="Target")
plt.tight_layout()
plt.savefig("model_graphs/test_r2_by_target.png")
plt.close()

print("Generated 4 more graphs in model_graphs/")