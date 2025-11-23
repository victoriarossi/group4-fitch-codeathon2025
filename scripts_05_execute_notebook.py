#!/usr/bin/env python3
"""
Execute notebook and save with all outputs (visualizations embedded)
This will create a notebook with all visualizations visible inline
"""

import nbformat
from nbconvert.preprocessors import ExecutePreprocessor
import os

print("=" * 70)
print("🔄 EXECUTING NOTEBOOK WITH VISUALIZATIONS")
print("=" * 70)

# Notebook to execute
notebook_path = "notebooks/comprehensive_analysis.ipynb"
output_path = "notebooks/comprehensive_analysis_with_visualizations.ipynb"

if not os.path.exists(notebook_path):
    print(f"❌ Notebook not found: {notebook_path}")
    # Try alternative
    notebook_path = "notebooks/comprehensive_analysis_executed.ipynb"
    if os.path.exists(notebook_path):
        print(f"✅ Found executed version: {notebook_path}")
        print("   This notebook already has outputs!")
        print(f"   Open it to see visualizations: {notebook_path}")
    else:
        print("❌ No notebook found to execute")
    exit(1)

print(f"\n📓 Notebook: {notebook_path}")
print(f"💾 Output: {output_path}")
print(f"\n⏳ Executing notebook (this will take a few minutes)...")
print("   Visualizations will be embedded inline in cells")

try:
    # Read notebook
    with open(notebook_path, 'r') as f:
        nb = nbformat.read(f, as_version=4)
    
    # Execute with timeout
    ep = ExecutePreprocessor(timeout=600, kernel_name='python3')
    
    # Execute notebook
    ep.preprocess(nb, {'metadata': {'path': 'notebooks/'}})
    
    # Save executed notebook
    with open(output_path, 'w') as f:
        nbformat.write(nb, f)
    
    print(f"\n✅ Notebook executed successfully!")
    print(f"📁 Saved to: {output_path}")
    print(f"\n📊 Visualizations are now embedded inline in the notebook!")
    print(f"   Open {output_path} to see all visualizations directly in cells")
    
except Exception as e:
    print(f"\n❌ Error executing notebook: {e}")
    print(f"\n💡 Alternative: Open the notebook in Jupyter and run cells manually")
    print(f"   Then save - visualizations will appear inline")
    print(f"\n   Or check if executed version exists:")
    executed = "notebooks/comprehensive_analysis_executed.ipynb"
    if os.path.exists(executed):
        print(f"   ✅ Found: {executed}")
        print(f"   This may already have visualizations embedded!")

