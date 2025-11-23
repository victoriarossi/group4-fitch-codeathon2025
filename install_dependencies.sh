#!/bin/bash

# Install all dependencies for the final submission notebook

echo "============================================================"
echo "🔧 Installing Dependencies for Final Submission Notebook"
echo "============================================================"

# Install core packages
echo ""
echo "📦 Installing core packages..."
pip3 install pandas numpy scikit-learn matplotlib seaborn catboost joblib

# Try to install XGBoost (may fail on Mac without OpenMP)
echo ""
echo "📦 Installing XGBoost (may require OpenMP on Mac)..."
pip3 install xgboost || echo "⚠️  XGBoost installation failed (will use CatBoost instead)"

echo ""
echo "============================================================"
echo "✅ Installation Complete!"
echo "============================================================"
echo ""
echo "💡 Note: If XGBoost fails on Mac, install OpenMP first:"
echo "   brew install libomp"
echo ""
echo "   The notebook will work fine with CatBoost if XGBoost fails."

