#!/usr/bin/env python3
"""
Script to run all cells in the comprehensive_analysis.ipynb notebook
"""
import nbformat
from nbconvert.preprocessors import ExecutePreprocessor
import sys
import os

# Change to the notebooks directory
notebook_path = 'notebooks/comprehensive_analysis.ipynb'

print("=" * 60)
print("Running Comprehensive Analysis Notebook")
print("=" * 60)
print(f"\nNotebook: {notebook_path}")
print("\nThis will execute all cells in the notebook...")
print("=" * 60)

# Read the notebook
with open(notebook_path, 'r') as f:
    nb = nbformat.read(f, as_version=4)

# Execute the notebook
ep = ExecutePreprocessor(timeout=600, kernel_name='python3')
try:
    ep.preprocess(nb, {'metadata': {'path': 'notebooks/'}})
    print("\n✅ All cells executed successfully!")
except Exception as e:
    print(f"\n❌ Error executing notebook: {e}")
    sys.exit(1)

# Save the executed notebook
output_path = 'notebooks/comprehensive_analysis_executed.ipynb'
with open(output_path, 'w') as f:
    nbformat.write(nb, f)
    
print(f"\n✅ Executed notebook saved to: {output_path}")
print("\nCheck the notebook to see all outputs!")

