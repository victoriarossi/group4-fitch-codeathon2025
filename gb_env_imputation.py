import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score, StratifiedKFold, train_test_split
from sklearn.metrics import classification_report, accuracy_score
import sys
import warnings
warnings.filterwarnings('ignore')

log = open("gb_env_imputation_log.txt", "w")
sys.stdout = log

# Load data
print("Loading data...")
df = pd.read_csv('data/merged_dataset.csv')

print(f"\nDataset shape: {df.shape}")
print(f"Missing activity_type: {df['activity_type'].isna().sum()} rows")
print(f"Known activity_type: {df['activity_type'].notna().sum()} rows")

df_known = df[df['activity_type'].notna()].copy()
df_unknown = df[df['activity_type'].isna()].copy()

print(f"\nActivity type distribution in known data:")
print(df_known['activity_type'].value_counts())

# ============================================================================
# CREATE MAPPINGS
# ============================================================================

print("\n" + "="*80)
print("CREATING ACTIVITY MAPPINGS")
print("="*80)

activity_type_to_code = df_known.groupby('activity_type')['activity_code'].agg(
    lambda x: x.mode().iloc[0] if len(x.mode()) > 0 else x.iloc[0]
).to_dict()

activity_type_to_env_adj = df_known.groupby('activity_type')['env_score_adjustment'].median().to_dict()
activity_type_to_env_adj_capped = df_known.groupby('activity_type')['env_score_adjustment_capped'].median().to_dict()

for act_type in sorted(activity_type_to_code.keys()):
    print(f"  {act_type}: code={activity_type_to_code[act_type]}, "
          f"env_adj={activity_type_to_env_adj[act_type]:.4f}")

# ============================================================================
# FEATURE ENGINEERING
# ============================================================================

def prepare_features(data):
    """Prepare features for Random Forest"""
    features = data.copy()
    
    numerical_cols = [
        'revenue_log',
        'overall_score',
        'environmental_score',
        'social_score', 
        'governance_score',
        'target_scope_1',
        'target_scope_2',
        'revenue_pct',
    ]
    
    categorical_cols = [
        'region_code',
        'nace_level_1_code',
        'nace_level_2_code',
        'country_code',
    ]
    
    # Derived features
    features['scope_ratio'] = features['target_scope_1'] / (features['target_scope_2'] + 1)
    features['scope_total'] = features['target_scope_1'] + features['target_scope_2']
    features['env_gov_ratio'] = features['environmental_score'] / (features['governance_score'] + 0.1)
    features['score_variance'] = features[['environmental_score', 'social_score', 'governance_score']].std(axis=1)
    
    derived_cols = ['scope_ratio', 'scope_total', 'env_gov_ratio', 'score_variance']
    
    for col in numerical_cols + derived_cols:
        if col in features.columns:
            features[col] = features[col].fillna(features[col].median())
            features[col] = features[col].replace([np.inf, -np.inf], features[col].median())
    
    for col in categorical_cols:
        if col in features.columns:
            features[col] = features[col].fillna('UNKNOWN')
    
    all_cols = numerical_cols + derived_cols + categorical_cols
    available_cols = [c for c in all_cols if c in features.columns]
    
    return features[available_cols], [c for c in numerical_cols + derived_cols if c in available_cols], [c for c in categorical_cols if c in available_cols]

X_known, num_cols, cat_cols = prepare_features(df_known)
X_unknown, _, _ = prepare_features(df_unknown)
y_known = df_known['activity_type'].values

# ============================================================================
# PREPROCESSING
# ============================================================================

print("\n" + "="*80)
print("FEATURE PREPROCESSING")
print("="*80)

label_encoders = {}
for col in cat_cols:
    le = LabelEncoder()
    all_values = pd.concat([X_known[col].astype(str), X_unknown[col].astype(str)], axis=0)
    le.fit(all_values)
    X_known[col] = le.transform(X_known[col].astype(str))
    X_unknown[col] = le.transform(X_unknown[col].astype(str))
    label_encoders[col] = le

scaler = StandardScaler()
X_known[num_cols] = scaler.fit_transform(X_known[num_cols])
X_unknown[num_cols] = scaler.transform(X_unknown[num_cols])

print(f"Features used ({len(X_known.columns)}): {list(X_known.columns)}")

# ============================================================================
# GRADIENT BOOSTING MODEL
# ============================================================================

print("\n" + "="*80)
print("GRADIENT BOOSTING TRAINING")
print("="*80)

from sklearn.ensemble import GradientBoostingClassifier

gb_model = GradientBoostingClassifier(
    n_estimators=150, 
    max_depth=5, 
    learning_rate=0.1,
    random_state=42
)

# Cross-validation
skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = cross_val_score(gb_model, X_known, y_known, cv=skf, scoring='accuracy')
print(f"Cross-validation accuracy: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")

# Train-test split validation
X_train, X_test, y_train, y_test = train_test_split(
    X_known, y_known, test_size=0.2, random_state=42, stratify=y_known
)

gb_model.fit(X_train, y_train)
y_pred = gb_model.predict(X_test)
y_pred_proba = gb_model.predict_proba(X_test)

accuracy = accuracy_score(y_test, y_pred)
print(f"Test set accuracy: {accuracy:.4f}")

print("\nClassification Report:")
print(classification_report(y_test, y_pred, zero_division=0))

# Feature importance
feat_imp = pd.DataFrame({
    'feature': X_known.columns,
    'importance': gb_model.feature_importances_
}).sort_values('importance', ascending=False)
print("\nTop 10 Feature Importances:")
print(feat_imp.head(10).to_string(index=False))

# ============================================================================
# FINAL IMPUTATION
# ============================================================================

print("\n" + "="*80)
print("FINAL IMPUTATION")
print("="*80)

gb_model.fit(X_known, y_known)
activity_predictions = gb_model.predict(X_unknown)
activity_probabilities = gb_model.predict_proba(X_unknown)
max_proba_unknown = activity_probabilities.max(axis=1)

print(f"\nImputed {len(activity_predictions)} values")
print("\nPredicted distribution:")
unique, counts = np.unique(activity_predictions, return_counts=True)
for act, count in zip(unique, counts):
    print(f"  {act}: {count:3d} ({count/len(activity_predictions)*100:.1f}%)")

# ============================================================================
# SAVE RESULTS
# ============================================================================

df_imputed = df.copy()

df_imputed.loc[df_imputed['activity_type'].isna(), 'activity_type'] = activity_predictions

mask = df_imputed['activity_code'].isna()
df_imputed.loc[mask, 'activity_code'] = df_imputed.loc[mask, 'activity_type'].map(activity_type_to_code)

mask = df_imputed['env_score_adjustment'].isna()
df_imputed.loc[mask, 'env_score_adjustment'] = df_imputed.loc[mask, 'activity_type'].map(activity_type_to_env_adj)

mask = df_imputed['env_score_adjustment_capped'].isna()
df_imputed.loc[mask, 'env_score_adjustment_capped'] = df_imputed.loc[mask, 'activity_type'].map(activity_type_to_env_adj_capped)

df_imputed['activity_confidence'] = np.nan
df_imputed.loc[df_imputed.index.isin(df_unknown.index), 'activity_confidence'] = max_proba_unknown

df_imputed.drop(columns=['activity_confidence'], errors='ignore', inplace=True)

output_file = 'data/merged_dataset_imputed_activity.csv'
df_imputed.to_csv(output_file, index=False)
print(f"\nSaved to: {output_file}")

# ============================================================================
# SUMMARY
# ============================================================================

print("\n" + "="*80)
print("IMPUTATION QUALITY DIAGNOSTICS")
print("="*80)

print(f"\n✓ Model: Gradient Boosting (150 trees, max_depth=5)")
print(f"✓ Cross-validation accuracy: {cv_scores.mean():.4f}")
print(f"✓ Test set accuracy: {accuracy:.4f}")
print(f"✓ Mean imputation confidence: {max_proba_unknown.mean():.4f}")
print(f"✓ High confidence (>70%): {(max_proba_unknown > 0.7).sum()}/{len(max_proba_unknown)}")
print(f"✓ High confidence (>50%): {(max_proba_unknown > 0.5).sum()}/{len(max_proba_unknown)}")

print("\n" + "="*80)
print("COMPLETE!")
print("="*80)