import pandas as pd
import numpy as np
import joblib

# Load the test data that has been processed with feature engineering
df_test = pd.read_csv("data/test_after_feature_engineering.csv")

# Note: Test data doesn't have target columns
# Keep nace_level_2_code as it might be a feature
drop_cols = ["country_code", "entity_id"]

base_features_test = df_test.drop(columns=drop_cols, errors="ignore")

feature_cols = joblib.load("models/feature_cols.joblib")
X_test = base_features_test[feature_cols]

best_scope1 = joblib.load("models/best_scope1.joblib")
best_scope2 = joblib.load("models/best_scope2.joblib")

pred_scope1_log = best_scope1.predict(X_test)
pred_scope2_log = best_scope2.predict(X_test)

# Convert from log scale back to original scale using expm1 (inverse of log1p)
pred_scope1 = np.expm1(pred_scope1_log)
pred_scope2 = np.expm1(pred_scope2_log)

out = pd.DataFrame({
    "entity_id": df_test["entity_id"],
    "pred_target_scope_1": pred_scope1,
    "pred_target_scope_2": pred_scope2,
})

out.to_csv("data/test_predictions.csv", index=False)
print("Saved predictions to data/test_predictions.csv")