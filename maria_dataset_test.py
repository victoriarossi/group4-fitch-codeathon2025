import pandas as pd
import numpy as np
from sklearn.decomposition import PCA

# ------------------------------------------------------------
# LOAD DATA
# ------------------------------------------------------------
df = pd.read_csv("data/merged_dataset_complete.csv")
phase4 = pd.read_csv("data/phase4_rebuilt_clean.csv")

print("Loaded merged dataset:", df.shape)
print("Loaded Phase 4 dataset:", phase4.shape)

# ------------------------------------------------------------
# 5.1 REVENUE DISTRIBUTION → WIDE MATRIX → PCA(10)
# ------------------------------------------------------------

rev = df[["entity_id", "nace_level_2_code", "revenue_pct"]].dropna()

rev_wide = rev.pivot_table(
    index="entity_id",
    columns="nace_level_2_code",
    values="revenue_pct",
    aggfunc="sum",
    fill_value=0
)

pca = PCA(n_components=10)
pca_matrix = pca.fit_transform(rev_wide)

rev_pca = pd.DataFrame(
    pca_matrix,
    index=rev_wide.index,
    columns=[f"Sector_Comp_{i+1}" for i in range(10)]
).reset_index()

# ------------------------------------------------------------
# 5.2 ENVIRONMENTAL ACTIVITIES → COUNT, FLAG, MEAN ADJ
# ------------------------------------------------------------
env = df[["entity_id", "activity_type", "env_score_adjustment_capped"]].dropna()

env_features = (
    env.groupby("entity_id").agg(
        num_env_activities=("activity_type", "count"),
        has_env_activity=("activity_type", lambda x: 1),
        avg_env_adjustment=("env_score_adjustment_capped", "mean"),
    )
    .reset_index()
)

env_features = env_features.fillna({
    "num_env_activities": 0,
    "has_env_activity": 0,
    "avg_env_adjustment": 0,
})

# ------------------------------------------------------------
# 5.3 SDG FEATURES → num, unique, flag
# ------------------------------------------------------------
sdg = df[["entity_id", "sdg_id"]].dropna()

sdg_features = (
    sdg.groupby("entity_id").agg(
        num_sdgs=("sdg_id", "count"),
        has_sdg=("sdg_id", lambda x: 1),
        unique_sdgs=("sdg_id", lambda x: len(set(x)))
    )
    .reset_index()
)

sdg_features = sdg_features.fillna({
    "num_sdgs": 0,
    "has_sdg": 0,
    "unique_sdgs": 0
})

# ------------------------------------------------------------
# 5.4 MERGE EVERYTHING — FINAL PHASE-5 DATASET
# ------------------------------------------------------------
phase5 = (
    phase4
    .merge(rev_pca, on="entity_id", how="left")
    .merge(env_features, on="entity_id", how="left")
    .merge(sdg_features, on="entity_id", how="left")
)

phase5.to_csv("data/phase5_ready_dataset.csv", index=False)

print("Phase 5 complete. Saved → data/phase5_ready_dataset.csv")
print("Final shape:", phase5.shape)
print("\nMissing values:")
print(phase5.isna().sum())
