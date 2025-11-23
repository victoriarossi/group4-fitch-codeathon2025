import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import ElasticNet
from xgboost import XGBRegressor
from catboost import CatBoostRegressor
from sklearn.decomposition import PCA
import joblib
import os
import sys
import warnings
warnings.filterwarnings('ignore')

os.makedirs("models", exist_ok=True)

log = open("model_training_log.txt", "w")
sys.stdout = log

df = pd.read_csv("data/data_after_feature_extraction.csv")

df["sector_avg_scope2_log"] = df.groupby("nace_level_2_code")["target_scope_2_log"].transform("mean")
df["sector_median_scope2_log"] = df.groupby("nace_level_2_code")["target_scope_2_log"].transform("median")

df["country_avg_scope2_log"] = df.groupby("country_code")["target_scope_2_log"].transform("mean")
country_scope2_mean = df.groupby("country_code")["target_scope_2"].transform("mean")
country_revenue_mean = df.groupby("country_code")["revenue"].transform("mean")
df["country_avg_scope2_per_revenue"] = country_scope2_mean / country_revenue_mean
df["country_avg_esg"] = df.groupby("country_code")["environmental_score"].transform("mean")

df["rev_x_env"] = df["revenue"] * df["environmental_score"]
df["rev_x_gov"] = df["revenue"] * df["governance_score"]
df["env_x_gov"] = df["environmental_score"] * df["governance_score"]
df["esg_sum"] = df["environmental_score"] + df["social_score"] + df["governance_score"]

if "Sector_Comp_1" in df.columns and "country_ts2_per_revenue" in df.columns:
    df["sector1_x_country"] = df["Sector_Comp_1"] * df["country_ts2_per_revenue"]

esg_mat = df[["environmental_score", "social_score", "governance_score", "revenue"]].fillna(0)
pca = PCA(n_components=2, random_state=42)
esg_pca = pca.fit_transform(esg_mat)
df["ESG_Comp_1"] = esg_pca[:, 0]
df["ESG_Comp_2"] = esg_pca[:, 1]

df.to_csv("data/data_after_feature_engineering.csv", index=False)

train_val, test = train_test_split(df, test_size=0.15, random_state=42, shuffle=True)
train, val = train_test_split(train_val, test_size=0.1765, random_state=42, shuffle=True)

print("Train shape:", train.shape)
print("Val shape:", val.shape)
print("Test shape:", test.shape)

targets = ["target_scope_1_log", "target_scope_2_log"]
drop_cols = ["target_scope_1", "target_scope_2", "country_code", "entity_id"]

base_features = train.drop(columns=drop_cols + targets, errors="ignore")
feature_cols = base_features.select_dtypes(include=[np.number]).columns.tolist()

metrics = []
best_scope1 = None
best_scope2 = None

for target in targets:
    X_train = train[feature_cols]
    y_train = train[target]
    X_val = val[feature_cols]
    y_val = val[target]
    X_test = test[feature_cols]
    y_test = test[target]

    models = {
        "RandomForest": RandomForestRegressor(
            n_estimators=300,
            random_state=42,
        ),
        "CatBoost": CatBoostRegressor(
            loss_function="RMSE",
            random_seed=42,
            verbose=False,
        ),
        "XGBoost": XGBRegressor(
            objective="reg:squarederror",
            n_estimators=300,
            max_depth=4,
            learning_rate=0.05,
            subsample=0.9,
            colsample_bytree=0.9,
            random_state=42,
        ),
        "ElasticNet": ElasticNet(
            alpha=0.1,
            l1_ratio=0.5,
        ),
    }

    for name, model in models.items():
        model.fit(X_train, y_train)

        val_pred = model.predict(X_val)
        test_pred = model.predict(X_test)

        val_mae = mean_absolute_error(y_val, val_pred)
        val_rmse = np.sqrt(mean_squared_error(y_val, val_pred))
        val_r2 = r2_score(y_val, val_pred)

        test_mae = mean_absolute_error(y_test, test_pred)
        test_rmse = np.sqrt(mean_squared_error(y_test, test_pred))
        test_r2 = r2_score(y_test, test_pred)

        metrics.append({
            "phase": "baseline_phase10",
            "target": target,
            "model": name,
            "val_mae": val_mae,
            "val_rmse": val_rmse,
            "val_r2": val_r2,
            "test_mae": test_mae,
            "test_rmse": test_rmse,
            "test_r2": test_r2,
        })

X_train_tuned = train[feature_cols]
X_val_tuned = val[feature_cols]
X_test_tuned = test[feature_cols]

def tune_and_eval(model_name, model, param_dist, target_name, phase_label):
    y_train_tuned = train[target_name]
    y_val_tuned = val[target_name]
    y_test_tuned = test[target_name]

    search = RandomizedSearchCV(
        model,
        param_distributions=param_dist,
        n_iter=20,
        scoring="neg_mean_squared_error",
        cv=3,
        random_state=42,
        n_jobs=-1,
        verbose=1,
    )
    search.fit(X_train_tuned, y_train_tuned)
    best = search.best_estimator_

    val_pred = best.predict(X_val_tuned)
    test_pred = best.predict(X_test_tuned)

    metrics.append({
        "phase": phase_label,
        "target": target_name,
        "model": model_name,
        "val_mae": mean_absolute_error(y_val_tuned, val_pred),
        "val_rmse": np.sqrt(mean_squared_error(y_val_tuned, val_pred)),
        "val_r2": r2_score(y_val_tuned, val_pred),
        "test_mae": mean_absolute_error(y_test_tuned, test_pred),
        "test_rmse": np.sqrt(mean_squared_error(y_test_tuned, test_pred)),
        "test_r2": r2_score(y_test_tuned, test_pred),
    })
    return best

rf_param_dist = {
    "n_estimators": [200, 400, 600, 800],
    "max_depth": [None, 5, 10, 20],
    "min_samples_split": [2, 5, 10],
    "min_samples_leaf": [1, 2, 4],
    "max_features": ["sqrt", "log2", 0.5, None],
}

xgb_param_dist = {
    "n_estimators": [200, 400, 600, 800],
    "max_depth": [3, 4, 5, 6],
    "learning_rate": [0.01, 0.03, 0.05, 0.1],
    "subsample": [0.7, 0.85, 1.0],
    "colsample_bytree": [0.7, 0.85, 1.0],
}

cat_param_dist = {
    "depth": [4, 6, 8],
    "learning_rate": [0.01, 0.03, 0.05, 0.1],
    "l2_leaf_reg": [1, 3, 5, 7, 9],
    "iterations": [200, 400, 600],
}

en_param_dist = {
    "alpha": [0.001, 0.01, 0.1, 1.0, 10.0],
    "l1_ratio": [0.1, 0.3, 0.5, 0.7, 0.9],
    "max_iter": [5000]
}

for t, phase_label in [
    ("target_scope_1_log", "tuned_scope1_phase10"),
    ("target_scope_2_log", "tuned_scope2_phase10"),
]:
    rf_best = tune_and_eval(
        "RandomForest",
        RandomForestRegressor(random_state=42),
        rf_param_dist,
        t,
        phase_label,
    )
    xgb_best = tune_and_eval(
        "XGBoost",
        XGBRegressor(objective="reg:squarederror", random_state=42),
        xgb_param_dist,
        t,
        phase_label,
    )
    cat_best = tune_and_eval(
        "CatBoost",
        CatBoostRegressor(loss_function="RMSE", random_seed=42, verbose=False),
        cat_param_dist,
        t,
        phase_label,
    )
    en_best = tune_and_eval(
        "ElasticNet",
        ElasticNet(),
        en_param_dist,
        t,
        phase_label,
    )

    if t == "target_scope_1_log":
        best_scope1 = cat_best
    if t == "target_scope_2_log":
        best_scope2 = en_best


metrics_df = pd.DataFrame(metrics)
metrics_df.to_csv("data/model_metrics.csv", index=False)

joblib.dump(best_scope1, "models/best_scope1.joblib")
joblib.dump(best_scope2, "models/best_scope2.joblib")
joblib.dump(feature_cols, "models/feature_cols.joblib")

print("Saved metrics to data/model_metrics.csv")
print(metrics_df)
