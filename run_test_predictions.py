"""
Master script to process test data and generate predictions.

This script:
1. Processes the test.csv file with the same feature engineering as training
2. Generates predictions using the trained models
3. Converts predictions from log scale to original scale
"""

import subprocess
import sys

print("=" * 60)
print("STEP 1: Processing test data with feature engineering")
print("=" * 60)

result = subprocess.run([sys.executable, "process_test_data.py"], capture_output=True, text=True)
print(result.stdout)
if result.stderr:
    print("STDERR:", result.stderr)
if result.returncode != 0:
    print(f"Error in process_test_data.py (exit code {result.returncode})")
    sys.exit(1)

print("\n" + "=" * 60)
print("STEP 2: Generating predictions on processed test data")
print("=" * 60)

result = subprocess.run([sys.executable, "predict_both_scopes.py"], capture_output=True, text=True)
print(result.stdout)
if result.stderr:
    print("STDERR:", result.stderr)
if result.returncode != 0:
    print(f"Error in predict_both_scopes.py (exit code {result.returncode})")
    sys.exit(1)

print("\n" + "=" * 60)
print("COMPLETE! Predictions saved to data/test_predictions.csv")
print("=" * 60)