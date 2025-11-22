import pandas as pd

# df1 = pd.read_csv("data/train_outliers_fixed.csv")
# df2 = pd.read_csv("data/environmental_activities_outliers_fixed.csv")
# df3 = pd.read_csv("data/revenue_distribution_by_sector.csv")
# df4 = pd.read_csv("data/sustainable_development_goals.csv")

# merged = pd.merge(df1, df2, on="entity_id", how="outer")
# merged = pd.merge(merged, df3, on="entity_id", how="outer")
# merged = pd.merge(merged, df4, on="entity_id", how="outer")

# merged.sort_values(by="entity_id", inplace=True)

# merged.to_csv("data/merged_dataset.csv", index=False)
# print("Merged dataset saved to data/merged_dataset.csv")

df = pd.read_csv("data/merged_dataset_cleaned.csv")

# Remove rows that have missing columns region_id until target_scope_2
df = df[df.loc[:, "region_code":"target_scope_2"].notnull().all(axis=1)]

df.to_csv("data/merged_dataset.csv", index=False)
# print("Cleaned merged dataset saved to data/merged_dataset_cleaned.csv")


print("Missing values per column in merged dataset:")
missing_counts = df.isnull().sum()
for col, count in missing_counts.items():
    print(f"{col}: {count}")

