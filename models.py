import pandas as pd
import numpy as np

from sklearn.model_selection import StratifiedKFold
from sklearn.metrics import mean_squared_error
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline

from sklearn.linear_model import ElasticNet

from xgboost import XGBRegressor
from lightgbm import LGBMRegressor
from catboost import CatBoostRegressor

# ===========================================================
# LOAD PHASE 6 DATA
# ===========================================================
df = pd.read_csv("data/phase6_final_dataset.csv")
print("Loaded Phase 6 dataset:", df.shape)

# ===========================================================
# DEFINE TARGETS & BASIC FEATURES
# ===========================================================
target_cols = ["target_scope_1_log", "target_scope_2_log"]

# Columns we definitely do NOT model on
drop_cols = [
    "entity_id",
    "region_name",
    "country_name",
    "sdg_name",
    "target_scope_1",
    "target_scope_2",
]

# Ensure they exist before dropping
drop_cols = [c for c in drop_cols if c in df.columns]

feature_df = df.drop(columns=drop_cols)

# ===========================================================
# STRATIFICATION: SECTOR/REGION + REVENUE BUCKET
# ===========================================================
# Revenue bucket (size stratification)
df["revenue_bucket"] = pd.qcut(
    df["revenue"],
    q=5,
    labels=False,
    duplicates="drop"
)

# Prefer NACE Level 1 if present, else region_code
if "nace_level_1_code" in df.columns:
    base_group = df["nace_level_1_code"].astype(str)
    print("Stratifying by NACE Level 1 + revenue bucket.")
else:
    base_group = df["region_code"].astype(str)
    print("Stratifying by region_code + revenue bucket.")

df["strata"] = base_group + "_" + df["revenue_bucket"].astype(str)

# Encode strata to integers for StratifiedKFold
strata_labels, strata = np.unique(df["strata"], return_inverse=True)

# ===========================================================
# PREPARE FEATURES: NUMERIC + CATEGORICAL
# ===========================================================
# We will:
# - keep CatBoost on raw categoricals
# - use one-hot encoding for XGB/LGBM/ElasticNet

# Identify target-free feature frame
X_full = feature_df.copy()

# Remove log targets from features (they're y)
for t in target_cols:
    if t in X_full.columns:
        X_full = X_full.drop(columns=[t])

# Identify numeric vs categorical
num_cols = X_full.select_dtypes(include=[np.number]).columns.tolist()
cat_cols = [c for c in X_full.columns if c not in num_cols]

print(f"Numeric features: {len(num_cols)}")
print(f"Categorical features: {len(cat_cols)}")

# For tree models (except CatBoost), we one-hot encode categoricals
X_tree = pd.get_dummies(X_full, columns=cat_cols, drop_first=True)
print("After one-hot encoding, X_tree shape:", X_tree.shape)

# For CatBoost, we keep X_full as-is and pass indices of categorical features
cat_feature_indices = [X_full.columns.get_loc(c) for c in cat_cols]

# ===========================================================
# HELPER: CROSS-VALIDATION EVALUATION
# ===========================================================
def cv_rmse(model_name, model, X, y, strata, use_catboost=False, cat_features=None):
    print(f"\n=== {model_name} | Target: {y.name} ===")
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    rmses = []

    fold = 1
    for train_idx, val_idx in skf.split(X, strata):
        X_train, X_val = X.iloc[train_idx], X.iloc[val_idx]
        y_train, y_val = y.iloc[train_idx], y.iloc[val_idx]

        if use_catboost:
            model.fit(
                X_train,
                y_train,
                cat_features=cat_features,
                verbose=False
            )
        else:
            model.fit(X_train, y_train)

        preds = model.predict(X_val)
        rmse = np.sqrt(mean_squared_error(y_val, preds))
        rmses.append(rmse)
        print(f"  Fold {fold} RMSE: {rmse:.4f}")
        fold += 1

    print(f"  Mean RMSE: {np.mean(rmses):.4f}  |  Std: {np.std(rmses):.4f}")
    return rmses

# ===========================================================
# LOOP OVER TARGETS & MODELS
# ===========================================================
results = {}

for target in target_cols:
    print("\n" + "#" * 70)
    print(f"TRAINING MODELS FOR TARGET: {target}")
    print("#" * 70)

    y = df[target]

    # ---------------------------------------------
    # 1) ElasticNet (linear baseline on one-hot X)
    # ---------------------------------------------
    enet = make_pipeline(
        StandardScaler(with_mean=False),
        ElasticNet(alpha=0.001, l1_ratio=0.5, random_state=42, max_iter=5000)
    )
    enet_rmse = cv_rmse(
        model_name="ElasticNet",
        model=enet,
        X=X_tree,
        y=y,
        strata=strata
    )

    # ---------------------------------------------
    # 2) XGBoost Regressor
    # ---------------------------------------------
    xgb = XGBRegressor(
        n_estimators=400,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        objective="reg:squarederror",
        random_state=42,
        tree_method="hist"
    )
    xgb_rmse = cv_rmse(
        model_name="XGBoost",
        model=xgb,
        X=X_tree,
        y=y,
        strata=strata
    )

    # ---------------------------------------------
    # 3) LightGBM Regressor
    # ---------------------------------------------
    lgbm = LGBMRegressor(
        n_estimators=500,
        max_depth=-1,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        objective="regression",
        random_state=42
    )
    lgbm_rmse = cv_rmse(
        model_name="LightGBM",
        model=lgbm,
        X=X_tree,
        y=y,
        strata=strata
    )

    # ---------------------------------------------
    # 4) CatBoost Regressor (handles categoricals natively)
    # ---------------------------------------------
    ctb = CatBoostRegressor(
        depth=6,
        learning_rate=0.05,
        loss_function="RMSE",
        n_estimators=600,
        random_state=42,
        verbose=False
    )
    ctb_rmse = cv_rmse(
        model_name="CatBoost",
        model=ctb,
        X=X_full,
        y=y,
        strata=strata,
        use_catboost=True,
        cat_features=cat_feature_indices
    )

    results[target] = {
        "ElasticNet": enet_rmse,
        "XGBoost": xgb_rmse,
        "LightGBM": lgbm_rmse,
        "CatBoost": ctb_rmse
    }

print("\n" + "=" * 70)
print("SUMMARY (mean RMSE per model & target):")
print("=" * 70)

for target, model_scores in results.items():
    print(f"\nTarget: {target}")
    for model_name, rmses in model_scores.items():
        print(f"  {model_name}: {np.mean(rmses):.4f} (+/- {np.std(rmses):.4f})")
