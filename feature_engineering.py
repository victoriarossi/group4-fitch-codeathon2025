import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import numpy as np

df = pd.read_csv("data/merged_dataset_complete.csv")

base = df.sort_values("entity_id").drop_duplicates("entity_id")

rev_pivot = df.pivot_table(
    index="entity_id",
    columns="nace_level_2_code",
    values="revenue_pct",
    aggfunc="sum",
    fill_value=0.0,
)

rev_matrix = rev_pivot.values.astype(float)

if rev_matrix.size > 0:
    scaler = StandardScaler()
    rev_scaled = scaler.fit_transform(rev_matrix)
    n_components = min(10, rev_scaled.shape[0], rev_scaled.shape[1])
    pca = PCA(n_components=n_components, random_state=42)
    rev_pca = pca.fit_transform(rev_scaled)
    rev_pca_df = pd.DataFrame(
        rev_pca,
        index=rev_pivot.index,
        columns=[f"Sector_Comp_{i+1}" for i in range(n_components)],
    ).reset_index()
else:
    rev_pca_df = base[["entity_id"]].copy()

env_rows = df[df["env_score_adjustment"].notna()]
env_agg = (
    env_rows.groupby("entity_id", as_index=False)
    .agg(
        num_activities=("activity_code", "count"),
        avg_env_score_adjustment=("env_score_adjustment", "mean"),
    )
)
env_agg["has_activity"] = 1

env_agg_full = base[["entity_id"]].merge(env_agg, on="entity_id", how="left")
env_agg_full["num_activities"] = env_agg_full["num_activities"].fillna(0).astype(int)
env_agg_full["has_activity"] = env_agg_full["has_activity"].fillna(0).astype(int)

feat = base.merge(rev_pca_df, on="entity_id", how="left")
feat = feat.merge(env_agg_full, on="entity_id", how="left")

feat["revenue_x_environmental_score"] = feat["revenue"] * feat["environmental_score"]
feat["revenue_x_governance_score"] = feat["revenue"] * feat["governance_score"]
feat["E_x_S"] = feat["environmental_score"] * feat["social_score"]
feat["S_x_G"] = feat["social_score"] * feat["governance_score"]

ratio_df = df.copy()
ratio_df["ts2_per_revenue"] = ratio_df["target_scope_2"] / ratio_df["revenue"]
country_proxy = (
    ratio_df.groupby("country_code", as_index=False)["ts2_per_revenue"]
    .mean()
    .rename(columns={"ts2_per_revenue": "country_ts2_per_revenue"})
)

feat = feat.merge(country_proxy, on="country_code", how="left")

feat.to_csv("data/data_after_feature_extraction.csv", index=False)
print("Saved to data/data_after_feature_extraction.csv")
print("Shape:", feat.shape)

df = pd.read_csv("data/data_after_feature_extraction.csv")

df["target_scope_1_log"] = np.log1p(df["target_scope_1"])
df["target_scope_2_log"] = np.log1p(df["target_scope_2"])

df.to_csv("data/data_after_feature_extraction.csv", index=False)

print("Phase 6 complete.")
print("Saved to data/data_after_feature_extraction.csv")
print(df[["target_scope_1", "target_scope_1_log", "target_scope_2", "target_scope_2_log"]].head())


