#!/usr/bin/env python3
"""
Generate all visualizations from the notebook
This script creates all visualization plots and saves them as PNG files
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
warnings.filterwarnings('ignore')

# Set style
plt.style.use('seaborn-v0_8-darkgrid')
sns.set_palette("husl")
np.random.seed(42)

print("=" * 70)
print("📊 GENERATING ALL VISUALIZATIONS")
print("=" * 70)

# Load data
print("\n1️⃣  Loading data...")
train = pd.read_csv("data/train.csv")
test = pd.read_csv("data/test.csv")
sector = pd.read_csv("data/revenue_distribution_by_sector.csv")
environmental = pd.read_csv("data/environmental_activities.csv")
sdg = pd.read_csv("data/sustainable_development_goals.csv")

print(f"✅ Data loaded: Train={train.shape}, Test={test.shape}")

# VISUALIZATION 1: Target Variable Distributions
print("\n2️⃣  Creating target distribution visualizations...")
fig, axes = plt.subplots(2, 3, figsize=(18, 12))

# Row 1: Scope 1 Emissions
axes[0, 0].hist(train['target_scope_1'], bins=50, edgecolor='black', alpha=0.7, color='steelblue')
axes[0, 0].set_title('Scope 1 Emissions Distribution (Raw)', fontsize=12, fontweight='bold')
axes[0, 0].set_xlabel('Scope 1 Emissions')
axes[0, 0].set_ylabel('Frequency')
axes[0, 0].grid(True, alpha=0.3)

axes[0, 1].hist(np.log1p(train['target_scope_1']), bins=50, edgecolor='black', alpha=0.7, color='orange')
axes[0, 1].set_title('Log(Scope 1 + 1) Distribution', fontsize=12, fontweight='bold')
axes[0, 1].set_xlabel('Log(Scope 1 + 1)')
axes[0, 1].set_ylabel('Frequency')
axes[0, 1].grid(True, alpha=0.3)

axes[0, 2].boxplot(train['target_scope_1'], vert=True, patch_artist=True,
                   boxprops=dict(facecolor='steelblue', alpha=0.7))
axes[0, 2].set_title('Scope 1 Emissions Box Plot', fontsize=12, fontweight='bold')
axes[0, 2].set_ylabel('Scope 1 Emissions')
axes[0, 2].grid(True, alpha=0.3)

# Row 2: Scope 2 Emissions
axes[1, 0].hist(train['target_scope_2'], bins=50, edgecolor='black', alpha=0.7, color='green')
axes[1, 0].set_title('Scope 2 Emissions Distribution (Raw)', fontsize=12, fontweight='bold')
axes[1, 0].set_xlabel('Scope 2 Emissions')
axes[1, 0].set_ylabel('Frequency')
axes[1, 0].grid(True, alpha=0.3)

axes[1, 1].hist(np.log1p(train['target_scope_2']), bins=50, edgecolor='black', alpha=0.7, color='red')
axes[1, 1].set_title('Log(Scope 2 + 1) Distribution', fontsize=12, fontweight='bold')
axes[1, 1].set_xlabel('Log(Scope 2 + 1)')
axes[1, 1].set_ylabel('Frequency')
axes[1, 1].grid(True, alpha=0.3)

axes[1, 2].boxplot(train['target_scope_2'], vert=True, patch_artist=True,
                   boxprops=dict(facecolor='green', alpha=0.7))
axes[1, 2].set_title('Scope 2 Emissions Box Plot', fontsize=12, fontweight='bold')
axes[1, 2].set_ylabel('Scope 2 Emissions')
axes[1, 2].grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('notebooks/target_distributions.png', dpi=150, bbox_inches='tight')
print("✅ Saved: notebooks/target_distributions.png")
plt.close()

# Merge data for remaining visualizations
print("\n3️⃣  Preparing merged data for visualizations...")
train_merged = train.copy()

# Merge sector data
sector_agg_l1 = sector.pivot_table(
    values='revenue_pct',
    index='entity_id',
    columns='nace_level_1_code',
    aggfunc='sum',
    fill_value=0
).add_prefix('sect_l1_').add_suffix('_pct').reset_index()

sector_summary = sector.groupby('entity_id').agg({
    'revenue_pct': ['sum', 'count']
}).reset_index()
sector_summary.columns = ['entity_id', 'total_revenue_pct', 'num_sectors']

train_merged = train_merged.merge(sector_agg_l1, on='entity_id', how='left')
train_merged = train_merged.merge(sector_summary, on='entity_id', how='left')

# Merge environmental
env_agg = environmental.groupby('entity_id').agg({
    'env_score_adjustment': ['sum', 'count', 'mean'],
    'activity_type': lambda x: x.nunique()
}).reset_index()
env_agg.columns = ['entity_id', 'env_adjustment_sum', 'num_env_activities', 'env_adjustment_mean', 'num_activity_types']

env_pos = environmental[environmental['env_score_adjustment'] > 0].groupby('entity_id')['env_score_adjustment'].sum().reset_index()
env_pos.columns = ['entity_id', 'env_positive_sum']
env_neg = environmental[environmental['env_score_adjustment'] < 0].groupby('entity_id')['env_score_adjustment'].sum().reset_index()
env_neg.columns = ['entity_id', 'env_negative_sum']

env_features = env_agg.merge(env_pos, on='entity_id', how='left')
env_features = env_features.merge(env_neg, on='entity_id', how='left')

train_merged = train_merged.merge(env_features, on='entity_id', how='left')

# Merge SDG
sdg_summary = sdg.groupby('entity_id').agg({
    'sdg_id': 'count'
}).reset_index()
sdg_summary.columns = ['entity_id', 'num_sdgs']

sdg['has_sdg_7'] = (sdg['sdg_id'] == 7).astype(int)
sdg['has_sdg_13'] = (sdg['sdg_id'] == 13).astype(int)
sdg['has_sdg_7_or_13'] = (sdg['has_sdg_7'] | sdg['has_sdg_13']).astype(int)

sdg_flags = sdg.groupby('entity_id')[['has_sdg_7', 'has_sdg_13', 'has_sdg_7_or_13']].max().reset_index()
sdg_features = sdg_summary.merge(sdg_flags, on='entity_id', how='left')

train_merged = train_merged.merge(sdg_features, on='entity_id', how='left')

# Fill missing values
env_cols = ['env_adjustment_sum', 'num_env_activities', 'env_adjustment_mean', 'num_activity_types', 'env_positive_sum', 'env_negative_sum']
for col in env_cols:
    if col in train_merged.columns:
        train_merged[col] = train_merged[col].fillna(0)

sdg_cols = ['num_sdgs', 'has_sdg_7', 'has_sdg_13', 'has_sdg_7_or_13']
for col in sdg_cols:
    if col in train_merged.columns:
        train_merged[col] = train_merged[col].fillna(0)

sect_cols = [col for col in train_merged.columns if 'sect_l1_' in col] + ['total_revenue_pct', 'num_sectors']
for col in sect_cols:
    if col in train_merged.columns and train_merged[col].isnull().sum() > 0:
        train_merged[col] = train_merged[col].fillna(0)

print("✅ Data merged and prepared")

# VISUALIZATION 2: Missing Value Visualizations
print("\n4️⃣  Creating missing value visualizations...")
missing_df = pd.DataFrame({
    'Column': train_merged.columns,
    'Missing_Count': train_merged.isnull().sum().values,
    'Missing_Percentage': (train_merged.isnull().sum() / len(train_merged) * 100).values
}).sort_values('Missing_Percentage', ascending=False)

missing_df_plot = missing_df[missing_df['Missing_Percentage'] > 0].copy()

if len(missing_df_plot) > 0:
    fig, axes = plt.subplots(1, 2, figsize=(18, 6))
    
    # Bar chart
    top_missing = missing_df_plot.head(15)
    axes[0].barh(range(len(top_missing)), top_missing['Missing_Percentage'].values[::-1], 
                 color='coral', alpha=0.7, edgecolor='black')
    axes[0].set_yticks(range(len(top_missing)))
    axes[0].set_yticklabels(top_missing['Column'].values[::-1])
    axes[0].set_xlabel('Missing Percentage (%)', fontsize=12)
    axes[0].set_title('Top 15 Features by Missing Value Percentage', fontsize=14, fontweight='bold')
    axes[0].grid(True, alpha=0.3, axis='x')
    
    # Pie chart
    total_missing = train_merged.isnull().sum().sum()
    total_cells = train_merged.shape[0] * train_merged.shape[1]
    missing_pct = (total_missing / total_cells) * 100
    non_missing_pct = 100 - missing_pct
    
    axes[1].pie([missing_pct, non_missing_pct], 
                labels=[f'Missing ({missing_pct:.1f}%)', f'Non-Missing ({non_missing_pct:.1f}%)'],
                autopct='%1.1f%%', startangle=90, colors=['coral', 'lightblue'],
                explode=(0.1, 0), shadow=True)
    axes[1].set_title('Overall Missing vs Non-Missing Data', fontsize=14, fontweight='bold')
    
    plt.tight_layout()
    plt.savefig('notebooks/missing_values_overview.png', dpi=150, bbox_inches='tight')
    print("✅ Saved: notebooks/missing_values_overview.png")
    plt.close()
    
    # Heatmap
    missing_matrix = train_merged.isnull().astype(int)
    cols_with_missing = missing_df_plot['Column'].head(15).tolist()
    if len(cols_with_missing) > 0:
        fig, ax = plt.subplots(figsize=(14, 10))
        sns.heatmap(
            missing_matrix[cols_with_missing].head(100), 
            yticklabels=False,
            cbar=True,
            cmap='YlOrRd',
            ax=ax,
            cbar_kws={'label': 'Missing (1) / Present (0)'}
        )
        ax.set_title('Missing Value Heatmap (First 100 Rows)', fontsize=14, fontweight='bold')
        ax.set_xlabel('Features', fontsize=12)
        ax.set_ylabel('Companies (first 100)', fontsize=12)
        plt.xticks(rotation=45, ha='right')
        plt.tight_layout()
        plt.savefig('notebooks/missing_values_heatmap.png', dpi=150, bbox_inches='tight')
        print("✅ Saved: notebooks/missing_values_heatmap.png")
        plt.close()

# VISUALIZATION 3: Correlation Analysis
print("\n5️⃣  Creating correlation visualizations...")
numeric_cols = train_merged.select_dtypes(include=[np.number]).columns.tolist()
if 'entity_id' in numeric_cols:
    numeric_cols.remove('entity_id')

corr_matrix = train_merged[numeric_cols].corr()

target_corr_s1 = corr_matrix['target_scope_1'].sort_values(ascending=False, key=abs)
target_corr_s2 = corr_matrix['target_scope_2'].sort_values(ascending=False, key=abs)

fig = plt.figure(figsize=(20, 14))
gs = fig.add_gridspec(2, 2, hspace=0.3, wspace=0.3)

# Heatmap
ax1 = fig.add_subplot(gs[0, :])
important_features = (target_corr_s1[target_corr_s1.index != 'target_scope_1'].head(15).index.tolist() +
                     target_corr_s2[target_corr_s2.index != 'target_scope_2'].head(15).index.tolist() +
                     ['target_scope_1', 'target_scope_2'])
important_features = list(set(important_features))
important_features = [f for f in important_features if f in numeric_cols]

sns.heatmap(
    train_merged[important_features].corr(),
    annot=True,
    fmt='.2f',
    cmap='coolwarm',
    center=0,
    square=True,
    linewidths=0.5,
    cbar_kws={"shrink": 0.8},
    ax=ax1
)
ax1.set_title('Correlation Heatmap - Key Features & Targets', fontsize=14, fontweight='bold')

# Scope 1 correlations
ax2 = fig.add_subplot(gs[1, 0])
top_corr_s1 = target_corr_s1[target_corr_s1.index != 'target_scope_1'].head(10)
colors_s1 = ['red' if x > 0 else 'blue' for x in top_corr_s1.values]
ax2.barh(range(len(top_corr_s1)), top_corr_s1.values[::-1], color=colors_s1[::-1], alpha=0.7, edgecolor='black')
ax2.set_yticks(range(len(top_corr_s1)))
ax2.set_yticklabels(top_corr_s1.index[::-1])
ax2.set_xlabel('Correlation with Scope 1', fontsize=12)
ax2.set_title('Top 10 Features Correlated with Scope 1', fontsize=12, fontweight='bold')
ax2.axvline(x=0, color='black', linestyle='-', linewidth=0.5)
ax2.grid(True, alpha=0.3, axis='x')

# Scope 2 correlations
ax3 = fig.add_subplot(gs[1, 1])
top_corr_s2 = target_corr_s2[target_corr_s2.index != 'target_scope_2'].head(10)
colors_s2 = ['red' if x > 0 else 'blue' for x in top_corr_s2.values]
ax3.barh(range(len(top_corr_s2)), top_corr_s2.values[::-1], color=colors_s2[::-1], alpha=0.7, edgecolor='black')
ax3.set_yticks(range(len(top_corr_s2)))
ax3.set_yticklabels(top_corr_s2.index[::-1])
ax3.set_xlabel('Correlation with Scope 2', fontsize=12)
ax3.set_title('Top 10 Features Correlated with Scope 2', fontsize=12, fontweight='bold')
ax3.axvline(x=0, color='black', linestyle='-', linewidth=0.5)
ax3.grid(True, alpha=0.3, axis='x')

plt.tight_layout()
plt.savefig('notebooks/correlation_analysis.png', dpi=150, bbox_inches='tight')
print("✅ Saved: notebooks/correlation_analysis.png")
plt.close()

print("\n" + "=" * 70)
print("✅ ALL VISUALIZATIONS GENERATED!")
print("=" * 70)
print("\n📁 Visualizations saved in: notebooks/")
print("\n📊 Generated files:")
print("   1. target_distributions.png")
print("   2. missing_values_overview.png")
print("   3. missing_values_heatmap.png")
print("   4. correlation_analysis.png")
print("\n✅ You can now view all visualizations as PNG files!")

