import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import sys

log = open("dataset_summary.txt", "w")
sys.stdout = log

# Load data
env_activities = pd.read_csv("data/environmental_activities.csv")
revenue_distribution = pd.read_csv("data/revenue_distribution_by_sector.csv")
sustainable_goals = pd.read_csv("data/sustainable_development_goals.csv")
train_data = pd.read_csv("data/train.csv")

# Display basic information about each dataset
print("Environmental Activities Dataset:")  
print("Size:", env_activities.shape)
print("Missing values per column:", env_activities.isnull().sum())
print("Unique activity types:", env_activities['activity_type'].nunique())
print("Unique activity code per type:", env_activities.groupby('activity_type')['activity_code'].nunique())
skew_values = env_activities[['env_score_adjustment']].skew().sort_values(ascending=False)
print("Skewness per column:", skew_values)
high_skew = skew_values[abs(skew_values) > 1]
print("\nHighly skewed columns (|skew| > 1):", high_skew.index.tolist())
print(env_activities.head())

print("\n" + "-"*50 + "\n")
print("-"*50 + "\n")
print("-"*50 + "\n")

print("\nRevenue Distribution by Sector Dataset:")
print("Size:", revenue_distribution.shape)
print("Missing values per column:", revenue_distribution.isnull().sum())
revenue_per_company = revenue_distribution.groupby("entity_id")["revenue_pct"].sum()
print("Companies who didn't report 100% revenue:", revenue_per_company[revenue_per_company < 1].count())
print("Unique level 1 sectors:", revenue_distribution['nace_level_1_code'].nunique())
print("Unique level 2 sectors:", revenue_distribution['nace_level_2_code'].nunique())
skew_values = revenue_distribution[['revenue_pct']].skew().sort_values(ascending=False)
print("Skewness per column:", skew_values)
high_skew = skew_values[abs(skew_values) > 1]
print("\nHighly skewed columns (|skew| > 1):", high_skew.index.tolist())
print(revenue_distribution.head())

print("\n" + "-"*50 + "\n")
print("-"*50 + "\n")
print("-"*50 + "\n")

print("\nSustainable Development Goals Dataset:")
print("Size:", sustainable_goals.shape)
print("Missing values per column:", sustainable_goals.isnull().sum())
print("Unique SDG codes:", sustainable_goals['sdg_id'].nunique())
print("Average number of SDG entries per entity:", sustainable_goals.groupby('entity_id').size().mean())
print("Company with most SDG entries:", sustainable_goals['entity_id'].value_counts().idxmax(), sustainable_goals['entity_id'].value_counts().max())
print("Company with less SDG entries:", sustainable_goals['entity_id'].value_counts().idxmin(), sustainable_goals['entity_id'].value_counts().min())
print(sustainable_goals.head())

print("\n" + "-"*50 + "\n")
print("-"*50 + "\n")
print("-"*50 + "\n")

print("\nTrain Dataset:")
print("Size:", train_data.shape)
print("Missing values per column:", train_data.isnull().sum())
print("Unique regions:", train_data['region_code'].nunique())
print("Unique countries:", train_data['country_code'].nunique())
print("Target scope 1 range:", train_data['target_scope_1'].min(), "to", train_data['target_scope_1'].max())
print("Target scope 2 range:", train_data['target_scope_2'].min(), "to", train_data['target_scope_2'].max())
print("Environmental_score range:", train_data['environmental_score'].min(), "to", train_data['environmental_score'].max())
skew_values = train_data[['target_scope_1', 'target_scope_2', 'environmental_score']].skew().sort_values(ascending=False)
print("Skewness per column:\n", skew_values)
high_skew = skew_values[abs(skew_values) > 1]
print("\nHighly skewed columns (|skew| > 1):", high_skew.index.tolist())
print(train_data.head())
