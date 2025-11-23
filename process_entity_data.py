import pandas as pd
import numpy as np

# Read the CSV file
df = pd.read_csv('data/merged_dataset.csv')

# For each entity, calculate the additional columns
def calculate_entity_features(group):
    # Get unique SDG IDs (excluding NaN values)
    sdg_ids = group['sdg_id'].dropna().unique()
    
    # Calculate total revenue_pct for this entity
    total_revenue_pct = group['revenue_pct'].sum()
    
    # Create the additional columns (same value for all rows in the group)
    result = group.copy()
    
    # Add SDG IDs (up to 3)
    result['sdg_id_1'] = sdg_ids[0] if len(sdg_ids) > 0 else np.nan
    result['sdg_id_2'] = sdg_ids[1] if len(sdg_ids) > 1 else np.nan
    result['sdg_id_3'] = sdg_ids[2] if len(sdg_ids) > 2 else np.nan
    
    # One-hot encoding for revenue_pct not summing to 1
    # Using a tolerance of 0.001 for floating point comparison
    result['revenue_pct_not_1'] = 1 if abs(total_revenue_pct - 1.0) > 0.001 else 0
    
    # Flag for having no SDG goals at all
    result['no_sdg_goals'] = 1 if len(sdg_ids) == 0 else 0
    
    return result

# Apply the grouping and processing, then sort by revenue_pct descending within each group
processed_df = df.groupby('entity_id', group_keys=False).apply(
    lambda x: calculate_entity_features(x.sort_values('revenue_pct', ascending=False))
)

# Convert SDG ID columns to Int64 (nullable integer type) to handle NaN properly
for col in ['sdg_id_1', 'sdg_id_2', 'sdg_id_3']:
    processed_df[col] = processed_df[col].astype('Int64')

# Reset index
processed_df = processed_df.reset_index(drop=True)

# Save to CSV
output_file = 'data/processed_entities.csv'
processed_df.to_csv(output_file, index=False)

print(f"Processed data saved to {output_file}")
print(f"\nDataset shape: {processed_df.shape}")
print(f"\nFirst few rows:")
print(processed_df.head(10))
print(f"\nColumn names:")
print(processed_df.columns.tolist())
print(f"\nSummary statistics:")
print(f"Total rows: {len(processed_df)}")
print(f"Unique entities: {processed_df['entity_id'].nunique()}")
print(f"Rows with revenue_pct not equal to 1: {processed_df[processed_df['revenue_pct_not_1'] == 1]['entity_id'].nunique()} entities")
print(f"Rows with no SDG goals: {processed_df[processed_df['no_sdg_goals'] == 1]['entity_id'].nunique()} entities")