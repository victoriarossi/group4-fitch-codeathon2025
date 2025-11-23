import pandas as pd
import numpy as np

df = pd.read_csv("data/phase5_ready_dataset.csv")

print("Loaded Phase 5 dataset:", df.shape)

df["target_scope_1_log"] = np.log1p(df["target_scope_1"])
df["target_scope_2_log"] = np.log1p(df["target_scope_2"])

print("Applied log1p to target_scope_1 and target_scope_2")

df["revenue_safe"] = df["revenue"].clip(lower=0)
df["rev_x_env"] = df["revenue_safe"] * df["environmental_score"]
df["rev_x_gov"] = df["revenue_safe"] * df["governance_score"]

df["E_x_S"] = df["environmental_score"] * df["social_score"]
df["S_x_G"] = df["social_score"] * df["governance_score"]
df["E_x_G"] = df["environmental_score"] * df["governance_score"]

print("Added ESG & revenue interaction features")

df["revenue_log1p"] = np.log1p(df["revenue_safe"])

df["esg_mean"] = df[["environmental_score","social_score","governance_score"]].mean(axis=1)
df["esg_var"]  = df[["environmental_score","social_score","governance_score"]].var(axis=1)
df["env_norm"] = df["environmental_score"] / df["esg_mean"]
df["gov_norm"] = df["governance_score"] / df["esg_mean"]
df["soc_norm"] = df["social_score"] / df["esg_mean"]

print("Added optional normalized & statistical ESG features")
df.to_csv("data/phase6_final_dataset.csv", index=False)
print("Phase 6 complete. Saved → data/phase6_final_dataset.csv")
print("Final Shape:", df.shape)
print("Missing values summary:")
print(df.isna().sum())
