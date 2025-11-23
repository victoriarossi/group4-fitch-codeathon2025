import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.neighbors import KNeighborsClassifier
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import matplotlib.pyplot as plt
import seaborn as sns
import sys

log = open("knn_sdg_imputation_log.txt", "w")
sys.stdout = log

# Load data
print("Loading data...")
df = pd.read_csv('data/merged_dataset.csv')

print(f"\nDataset shape: {df.shape}")
print(f"Missing sdg_id: {df['sdg_id'].isna().sum()} rows")
print(f"Known sdg_id: {df['sdg_id'].notna().sum()} rows")

# Separate rows with and without sdg_id
df_known = df[df['sdg_id'].notna()].copy()
df_unknown = df[df['sdg_id'].isna()].copy()

print(f"\nSDG distribution in known data:")
print(df_known['sdg_id'].value_counts().sort_index())

# ============================================================================
# FEATURE ENGINEERING
# ============================================================================

def prepare_features(data):
    """Prepare features for KNN imputation"""
    features = data.copy()
    
    # Numerical features (will be scaled)
    numerical_cols = [
        'revenue_log',
        'environmental_score',
        'social_score', 
        'governance_score',
        'target_scope_1',
        'target_scope_2',
        'env_score_adjustment_capped'
    ]
    
    # Categorical features (will be label encoded)
    categorical_cols = [
        'region_code',
        'activity_type',
        'nace_level_1_code'
    ]
    
    # Handle missing values in features
    for col in numerical_cols:
        if features[col].isna().any():
            features[col] = features[col].fillna(features[col].median())
    
    for col in categorical_cols:
        if features[col].isna().any():
            features[col] = features[col].fillna(features[col].mode()[0])
    
    return features[numerical_cols + categorical_cols], numerical_cols, categorical_cols

# Prepare features
X_known, num_cols, cat_cols = prepare_features(df_known)
X_unknown, _, _ = prepare_features(df_unknown)
y_known = df_known['sdg_id'].values

# ============================================================================
# PREPROCESSING
# ============================================================================

print("\n" + "="*80)
print("FEATURE PREPROCESSING")
print("="*80)

# Label encode categorical features - fit on ALL data to handle unseen categories
label_encoders = {}
for col in cat_cols:
    le = LabelEncoder()
    # Combine both datasets to fit encoder on all possible values
    all_values = pd.concat([X_known[col], X_unknown[col]], axis=0)
    le.fit(all_values)
    X_known[col] = le.transform(X_known[col])
    X_unknown[col] = le.transform(X_unknown[col])
    label_encoders[col] = le

# Scale numerical features
scaler = StandardScaler()
X_known[num_cols] = scaler.fit_transform(X_known[num_cols])
X_unknown[num_cols] = scaler.transform(X_unknown[num_cols])

print(f"\nFeatures used: {list(X_known.columns)}")
print(f"Total features: {X_known.shape[1]}")

# ============================================================================
# MODEL VALIDATION (CROSS-VALIDATION ON KNOWN DATA)
# ============================================================================

print("\n" + "="*80)
print("MODEL VALIDATION")
print("="*80)

# Test different k values
k_values = [5, 10, 15, 20, 25]
cv_scores = {}

print("\nTesting different k values with 5-fold cross-validation:")
print("-" * 60)

for k in k_values:
    knn = KNeighborsClassifier(n_neighbors=k, weights='distance')
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    scores = cross_val_score(knn, X_known, y_known, cv=skf, scoring='accuracy')
    cv_scores[k] = scores
    print(f"k={k:2d}: {scores.mean():.4f} (+/- {scores.std():.4f})")

# Select best k
best_k = max(cv_scores, key=lambda k: cv_scores[k].mean())
print(f"\nBest k value: {best_k} (accuracy: {cv_scores[best_k].mean():.4f})")

# ============================================================================
# TRAIN-TEST SPLIT VALIDATION
# ============================================================================

print("\n" + "="*80)
print("TRAIN-TEST VALIDATION (80-20 split)")
print("="*80)

# Create train-test split for detailed evaluation
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(
    X_known, y_known, test_size=0.2, random_state=42, stratify=y_known
)

# Train model with best k
knn_best = KNeighborsClassifier(n_neighbors=best_k, weights='distance')
knn_best.fit(X_train, y_train)

# Predictions
y_pred = knn_best.predict(X_test)
y_pred_proba = knn_best.predict_proba(X_test)

# Evaluation metrics
accuracy = accuracy_score(y_test, y_pred)
print(f"\nTest Set Accuracy: {accuracy:.4f}")

print("\nClassification Report:")
print(classification_report(y_test, y_pred, zero_division=0))

# Confusion matrix
cm = confusion_matrix(y_test, y_pred)
unique_sdgs = sorted(df_known['sdg_id'].unique())

plt.figure(figsize=(12, 10))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
            xticklabels=unique_sdgs, yticklabels=unique_sdgs)
plt.title(f'Confusion Matrix (k={best_k})')
plt.ylabel('True SDG')
plt.xlabel('Predicted SDG')
plt.tight_layout()
plt.savefig('plots/sdg_confusion_matrix.png', dpi=300, bbox_inches='tight')
print("\nConfusion matrix saved to: plots/sdg_confusion_matrix.png")

# ============================================================================
# PREDICTION CONFIDENCE ANALYSIS
# ============================================================================

print("\n" + "="*80)
print("PREDICTION CONFIDENCE ANALYSIS")
print("="*80)

# Get maximum probability for each prediction
max_proba = y_pred_proba.max(axis=1)

print(f"\nPrediction Confidence Statistics:")
print(f"Mean confidence: {max_proba.mean():.4f}")
print(f"Median confidence: {np.median(max_proba):.4f}")
print(f"Min confidence: {max_proba.min():.4f}")
print(f"Max confidence: {max_proba.max():.4f}")

# Confidence by correctness
correct_mask = (y_test == y_pred)
print(f"\nMean confidence for correct predictions: {max_proba[correct_mask].mean():.4f}")
print(f"Mean confidence for incorrect predictions: {max_proba[~correct_mask].mean():.4f}")

# Plot confidence distribution
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# Overall confidence distribution
axes[0].hist(max_proba, bins=20, edgecolor='black', alpha=0.7)
axes[0].set_xlabel('Prediction Confidence (Max Probability)')
axes[0].set_ylabel('Frequency')
axes[0].set_title('Distribution of Prediction Confidence')
axes[0].axvline(max_proba.mean(), color='red', linestyle='--', 
                label=f'Mean: {max_proba.mean():.3f}')
axes[0].legend()

# Confidence by correctness
axes[1].hist(max_proba[correct_mask], bins=15, alpha=0.6, label='Correct', 
             edgecolor='black')
axes[1].hist(max_proba[~correct_mask], bins=15, alpha=0.6, label='Incorrect',
             edgecolor='black')
axes[1].set_xlabel('Prediction Confidence (Max Probability)')
axes[1].set_ylabel('Frequency')
axes[1].set_title('Confidence: Correct vs Incorrect Predictions')
axes[1].legend()

plt.tight_layout()
plt.savefig('plots/sdg_confidence_analysis.png', dpi=300, bbox_inches='tight')
print("\nConfidence analysis saved to: plots/sdg_confidence_analysis.png")

# ============================================================================
# FINAL MODEL TRAINING & IMPUTATION
# ============================================================================

print("\n" + "="*80)
print("FINAL IMPUTATION")
print("="*80)

# Train final model on ALL known data
knn_final = KNeighborsClassifier(n_neighbors=best_k, weights='distance')
knn_final.fit(X_known, y_known)

# Predict missing sdg_id values
sdg_predictions = knn_final.predict(X_unknown)
sdg_probabilities = knn_final.predict_proba(X_unknown)
max_proba_unknown = sdg_probabilities.max(axis=1)

print(f"\nImputed {len(sdg_predictions)} missing sdg_id values")
print(f"\nPredicted SDG distribution:")
unique, counts = np.unique(sdg_predictions, return_counts=True)
for sdg, count in zip(unique, counts):
    print(f"  SDG {sdg:2.0f}: {count:3d} rows ({count/len(sdg_predictions)*100:.1f}%)")

print(f"\nImputation Confidence Statistics:")
print(f"Mean confidence: {max_proba_unknown.mean():.4f}")
print(f"Median confidence: {np.median(max_proba_unknown):.4f}")
print(f"Min confidence: {max_proba_unknown.min():.4f}")
print(f"Predictions with >70% confidence: {(max_proba_unknown > 0.7).sum()} ({(max_proba_unknown > 0.7).sum()/len(max_proba_unknown)*100:.1f}%)")
print(f"Predictions with >50% confidence: {(max_proba_unknown > 0.5).sum()} ({(max_proba_unknown > 0.5).sum()/len(max_proba_unknown)*100:.1f}%)")

# ============================================================================
# SAVE RESULTS
# ============================================================================

# Create output dataframe
df_imputed = df.copy()
df_imputed.loc[df_imputed['sdg_id'].isna(), 'sdg_id'] = sdg_predictions

# Add confidence score column
df_imputed['sdg_confidence'] = np.nan
df_imputed.loc[df_imputed.index.isin(df_unknown.index), 'sdg_confidence'] = max_proba_unknown

# Map sdg_id to sdg_name for imputed rows
sdg_mapping = df_known[['sdg_id', 'sdg_name']].drop_duplicates().set_index('sdg_id')['sdg_name'].to_dict()
df_imputed.loc[df_imputed['sdg_name'].isna(), 'sdg_name'] = df_imputed.loc[df_imputed['sdg_name'].isna(), 'sdg_id'].map(sdg_mapping)

# Save imputed dataset
output_file = 'data/merged_dataset_imputed_sdg.csv'
df_imputed.to_csv(output_file, index=False)
print(f"\nImputed dataset saved to: {output_file}")

# Save detailed imputation results
imputation_details = pd.DataFrame({
    'entity_id': df_unknown['entity_id'].values,
    'predicted_sdg_id': sdg_predictions,
    'confidence': max_proba_unknown,
    'region': df_unknown['region_name'].values,
    'industry': df_unknown['nace_level_1_name'].values,
})
imputation_details.to_csv('data/sdg_imputation_details.csv', index=False)
print(f"Imputation details saved to: data/sdg_imputation_details.csv")

# ============================================================================
# QUALITY DIAGNOSTIC SUMMARY
# ============================================================================

print("\n" + "="*80)
print("IMPUTATION QUALITY DIAGNOSTICS")
print("="*80)

print("\n✓ VALIDATION METRICS:")
print(f"  - Cross-validation accuracy: {cv_scores[best_k].mean():.4f}")
print(f"  - Test set accuracy: {accuracy:.4f}")
print(f"  - Optimal k value: {best_k}")

print("\n✓ CONFIDENCE METRICS:")
print(f"  - Mean imputation confidence: {max_proba_unknown.mean():.4f}")
print(f"  - High confidence (>70%): {(max_proba_unknown > 0.7).sum()}/{len(max_proba_unknown)} ({(max_proba_unknown > 0.7).sum()/len(max_proba_unknown)*100:.1f}%)")

print("\n✓ DISTRIBUTION COMPARISON:")
known_dist = df_known['sdg_id'].value_counts(normalize=True).sort_index()
imputed_dist = pd.Series(sdg_predictions).value_counts(normalize=True).sort_index()
print("  SDG distributions (known vs imputed):")
comparison = pd.DataFrame({
    'Known %': known_dist * 100,
    'Imputed %': imputed_dist * 100
}).fillna(0)
print(comparison.round(1))

print("\n✓ OUTPUT FILES:")
print(f"  - {output_file}")
print(f"  - data/sdg_imputation_details.csv")
print(f"  - plots/sdg_confusion_matrix.png")
print(f"  - plots/sdg_confidence_analysis.png")

print("\n" + "="*80)
print("IMPUTATION COMPLETE!")
print("="*80)