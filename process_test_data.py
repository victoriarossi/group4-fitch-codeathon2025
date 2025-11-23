import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

# Load test data
df_test_raw = pd.read_csv("data/test.csv")

# Load supplementary data for merging
df_env = pd.read_csv("data/environmental_activities.csv")
df_sdg = pd.read_csv("data/sustainable_development_goals.csv")
df_revenue = pd.read_csv("data/revenue_distribution_by_sector.csv")

# Load training data to get aggregations and statistics
df_train = pd.read_csv("data/merged_dataset_complete.csv")

print("Test data shape:", df_test_raw.shape)
print("Test columns:", df_test_raw.columns.tolist())

# Merge all supplementary data (this creates multiple rows per entity)
df_test = pd.merge(df_test_raw, df_env, on="entity_id", how="left")
df_test = pd.merge(df_test, df_sdg, on="entity_id", how="left")
df_test = pd.merge(df_test, df_revenue, on="entity_id", how="left")

print("After merging, test data shape:", df_test.shape)

# Prepare base dataset - one row per entity (deduplicated)
base_test = df_test.sort_values("entity_id").drop_duplicates("entity_id")

# Create revenue pivot table for PCA
if "nace_level_2_code" in df_test.columns and "revenue_pct" in df_test.columns:
    rev_pivot_test = df_test.pivot_table(
        index="entity_id",
        columns="nace_level_2_code",
        values="revenue_pct",
        aggfunc="sum",
        fill_value=0.0,
    )
    
    # Get training revenue pivot to align columns
    rev_pivot_train = df_train.pivot_table(
        index="entity_id",
        columns="nace_level_2_code",
        values="revenue_pct",
        aggfunc="sum",
        fill_value=0.0,
    )
    
    # Align test pivot with training pivot columns
    rev_pivot_test = rev_pivot_test.reindex(columns=rev_pivot_train.columns, fill_value=0.0)
    
    # Apply PCA (fit on training, transform test)
    rev_matrix_train = rev_pivot_train.values.astype(float)
    rev_matrix_test = rev_pivot_test.values.astype(float)
    
    scaler = StandardScaler()
    scaler.fit(rev_matrix_train)
    rev_scaled_test = scaler.transform(rev_matrix_test)
    
    n_components = min(10, rev_scaled_test.shape[0], rev_scaled_test.shape[1])
    pca = PCA(n_components=n_components, random_state=42)
    pca.fit(scaler.transform(rev_matrix_train))
    rev_pca_test = pca.transform(rev_scaled_test)
    
    rev_pca_df_test = pd.DataFrame(
        rev_pca_test,
        index=rev_pivot_test.index,
        columns=[f"Sector_Comp_{i+1}" for i in range(n_components)],
    ).reset_index()
else:
    rev_pca_df_test = base_test[["entity_id"]].copy()
    print("Warning: Missing nace_level_2_code or revenue_pct")

# Environmental activity aggregations
env_rows_test = df_test[df_test["env_score_adjustment"].notna()]
if len(env_rows_test) > 0:
    env_agg_test = (
        env_rows_test.groupby("entity_id", as_index=False)
        .agg(
            num_activities=("activity_code", "count"),
            avg_env_score_adjustment=("env_score_adjustment", "mean"),
        )
    )
    env_agg_test["has_activity"] = 1
else:
    env_agg_test = pd.DataFrame(columns=["entity_id", "num_activities", "avg_env_score_adjustment", "has_activity"])

env_agg_full_test = base_test[["entity_id"]].merge(env_agg_test, on="entity_id", how="left")
env_agg_full_test["num_activities"] = env_agg_full_test["num_activities"].fillna(0).astype(int)
env_agg_full_test["has_activity"] = env_agg_full_test["has_activity"].fillna(0).astype(int)

# Merge features
feat_test = base_test.merge(rev_pca_df_test, on="entity_id", how="left")
feat_test = feat_test.merge(env_agg_full_test, on="entity_id", how="left")

# Add revenue_log feature
feat_test["revenue_log"] = np.log1p(feat_test["revenue"])

# Add env_score_adjustment_capped (capped version of env_score_adjustment)
if "avg_env_score_adjustment" in feat_test.columns:
    feat_test["env_score_adjustment_capped"] = feat_test["avg_env_score_adjustment"].clip(-1.0, 1.0)
else:
    feat_test["env_score_adjustment_capped"] = np.nan

# Create interaction features
feat_test["revenue_x_environmental_score"] = feat_test["revenue"] * feat_test["environmental_score"]
feat_test["revenue_x_governance_score"] = feat_test["revenue"] * feat_test["governance_score"]
feat_test["E_x_S"] = feat_test["environmental_score"] * feat_test["social_score"]
feat_test["S_x_G"] = feat_test["social_score"] * feat_test["governance_score"]

# Add country-level proxy (from training data)
ratio_df_train = df_train.copy()
ratio_df_train["ts2_per_revenue"] = ratio_df_train["target_scope_2"] / ratio_df_train["revenue"]
country_proxy = (
    ratio_df_train.groupby("country_code", as_index=False)["ts2_per_revenue"]
    .mean()
    .rename(columns={"ts2_per_revenue": "country_ts2_per_revenue"})
)

feat_test = feat_test.merge(country_proxy, on="country_code", how="left")

# Additional features from training_model.py
# nace_level_2_code should already be in feat_test from base_test
if "nace_level_2_code" in feat_test.columns:
    # Sector-based aggregations (using training data statistics)
    sector_agg_train = df_train.groupby("nace_level_2_code").agg({
        "target_scope_2": ["mean", "median"]
    }).reset_index()
    sector_agg_train.columns = ["nace_level_2_code", "sector_avg_scope2", "sector_median_scope2"]
    
    # Apply log transformation to training aggregations
    sector_agg_train["sector_avg_scope2_log"] = np.log1p(sector_agg_train["sector_avg_scope2"])
    sector_agg_train["sector_median_scope2_log"] = np.log1p(sector_agg_train["sector_median_scope2"])
    
    feat_test = feat_test.merge(
        sector_agg_train[["nace_level_2_code", "sector_avg_scope2_log", "sector_median_scope2_log"]], 
        on="nace_level_2_code", 
        how="left"
    )
else:
    print("Warning: nace_level_2_code not found in test data. Skipping sector aggregations.")
    feat_test["sector_avg_scope2_log"] = np.nan
    feat_test["sector_median_scope2_log"] = np.nan

# Country-based aggregations (from training data)
country_agg_train = df_train.groupby("country_code").agg({
    "target_scope_2": "mean",
    "revenue": "mean",
    "environmental_score": "mean"
}).reset_index()
country_agg_train.columns = ["country_code", "country_avg_scope2", "country_revenue_mean", "country_avg_esg"]
country_agg_train["country_avg_scope2_log"] = np.log1p(country_agg_train["country_avg_scope2"])
country_agg_train["country_avg_scope2_per_revenue"] = country_agg_train["country_avg_scope2"] / country_agg_train["country_revenue_mean"]

feat_test = feat_test.merge(
    country_agg_train[["country_code", "country_avg_scope2_log", "country_avg_scope2_per_revenue", "country_avg_esg"]], 
    on="country_code", 
    how="left"
)

# More interaction features
feat_test["rev_x_env"] = feat_test["revenue"] * feat_test["environmental_score"]
feat_test["rev_x_gov"] = feat_test["revenue"] * feat_test["governance_score"]
feat_test["env_x_gov"] = feat_test["environmental_score"] * feat_test["governance_score"]
feat_test["esg_sum"] = feat_test["environmental_score"] + feat_test["social_score"] + feat_test["governance_score"]

# Sector component x country interaction
if "Sector_Comp_1" in feat_test.columns and "country_ts2_per_revenue" in feat_test.columns:
    feat_test["sector1_x_country"] = feat_test["Sector_Comp_1"] * feat_test["country_ts2_per_revenue"]

# ESG PCA components (fit on training, transform test)
df_train_unique = df_train.sort_values("entity_id").drop_duplicates("entity_id")
esg_mat_train = df_train_unique[["environmental_score", "social_score", "governance_score", "revenue"]].fillna(0)
esg_mat_test = feat_test[["environmental_score", "social_score", "governance_score", "revenue"]].fillna(0)

pca_esg = PCA(n_components=2, random_state=42)
pca_esg.fit(esg_mat_train)
esg_pca_test = pca_esg.transform(esg_mat_test)
feat_test["ESG_Comp_1"] = esg_pca_test[:, 0]
feat_test["ESG_Comp_2"] = esg_pca_test[:, 1]

print("Final test data shape:", feat_test.shape)
print("Final test columns:", feat_test.columns.tolist())

# Fill missing values (important for models like ElasticNet that don't accept NaN)
print("\nHandling missing values...")
numeric_cols = feat_test.select_dtypes(include=[np.number]).columns
missing_before = feat_test[numeric_cols].isnull().sum().sum()
print(f"Total missing values before imputation: {missing_before}")

# Fill missing values with median for numeric columns
for col in numeric_cols:
    if feat_test[col].isnull().any():
        # Use training data median if available, otherwise test data median
        if col in df_train_unique.columns:
            fill_value = df_train_unique[col].median()
        else:
            fill_value = feat_test[col].median()
        
        if pd.isna(fill_value):
            fill_value = 0
        
        feat_test[col] = feat_test[col].fillna(fill_value)

missing_after = feat_test[numeric_cols].isnull().sum().sum()
print(f"Total missing values after imputation: {missing_after}")

# Save to CSV
feat_test.to_csv("data/test_after_feature_engineering.csv", index=False)
print("\nSaved processed test data to data/test_after_feature_engineering.csv")
print("\nSample of processed test data:")
print(feat_test[["entity_id", "revenue", "environmental_score", "ESG_Comp_1", "ESG_Comp_2"]].head())
print("\nFeature count:", len([c for c in feat_test.columns if c not in ["entity_id", "country_code", "nace_level_2_code"]]))