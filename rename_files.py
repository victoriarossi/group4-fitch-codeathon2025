#!/usr/bin/env python3
"""
Rename files to have clearer, organized names
"""

import os
import shutil

print("=" * 70)
print("🔄 RENAMING FILES FOR BETTER ORGANIZATION")
print("=" * 70)

# Create organized naming structure
renaming_plan = {
    # Documentation - Project Planning
    "PROJECT_PLAN.md": "docs_01_PROJECT_PLAN.md",
    "QUICK_CHECKLIST.md": "docs_02_QUICK_CHECKLIST.md",
    
    # Documentation - Phase Results
    "PHASE1_FINDINGS.md": "docs_03_PHASE1_FINDINGS.md",
    "PHASE2_3_RESULTS.md": "docs_04_PHASE2_3_RESULTS.md",
    "PHASE4_5_RESULTS.md": "docs_05_PHASE4_5_RESULTS.md",
    
    # Documentation - Features
    "FEATURE_SELECTION_DOCUMENTATION.md": "docs_06_FEATURE_DOCUMENTATION.md",
    "FEATURE_IMPACT_SUMMARY.md": "docs_07_FEATURE_IMPACT_SUMMARY.md",
    "SIMPLE_FEATURE_EXPLANATION.md": "docs_08_SIMPLE_FEATURE_EXPLANATION.md",
    
    # Documentation - Visualizations
    "VISUALIZATION_PROGRESS.md": "docs_09_VISUALIZATION_PROGRESS.md",
    "VISUALIZATIONS_ADDED.md": "docs_10_VISUALIZATIONS_ADDED.md",
    "VIEW_VISUALIZATIONS_INLINE.md": "docs_11_VIEW_VISUALIZATIONS.md",
    
    # Documentation - Guides
    "HOW_TO_RUN.md": "docs_12_HOW_TO_RUN.md",
    "HOW_TO_VIEW_VISUALIZATIONS.md": "docs_13_HOW_TO_VIEW_VISUALIZATIONS.md",
    "HOW_TO_INTERPRET_FINDINGS.md": "docs_14_HOW_TO_INTERPRET_FINDINGS.md",
    
    # Documentation - Other
    "FIND_YOUR_FINDINGS.md": "docs_15_FIND_YOUR_FINDINGS.md",
    "README_FINDINGS.md": "docs_16_README_FINDINGS.md",
    "EXPLANATION_TEMPLATE.md": "docs_17_EXPLANATION_TEMPLATE.md",
    "QUICK_VIEW_VISUALIZATIONS.md": "docs_18_QUICK_VIEW_VISUALIZATIONS.md",
    "SHOW_VISUALIZATIONS.md": "docs_19_SHOW_VISUALIZATIONS.md",
    
    # Scripts
    "run_notebook.py": "scripts_01_run_notebook.py",
    "start_notebook.sh": "scripts_02_start_notebook.sh",
    "generate_all_visualizations.py": "scripts_03_generate_visualizations.py",
    "add_visualizations.py": "scripts_04_add_visualizations.py",
    "execute_and_save_visualizations.py": "scripts_05_execute_notebook.py",
}

print("\n📋 Renaming Plan:\n")

# Show what will be renamed
renamed_count = 0
not_found = []

for old_name, new_name in sorted(renaming_plan.items()):
    if os.path.exists(old_name):
        print(f"✅ {old_name:50} → {new_name}")
        renamed_count += 1
    else:
        not_found.append(old_name)

if not_found:
    print(f"\n⚠️  Files not found (will skip):")
    for f in not_found:
        print(f"   - {f}")

print(f"\n📊 Total files to rename: {renamed_count}")

# Ask for confirmation
response = input("\n❓ Proceed with renaming? (yes/no): ").strip().lower()

if response in ['yes', 'y']:
    print("\n🔄 Renaming files...")
    
    renamed = []
    errors = []
    
    for old_name, new_name in renaming_plan.items():
        if os.path.exists(old_name):
            try:
                shutil.move(old_name, new_name)
                renamed.append((old_name, new_name))
                print(f"✅ Renamed: {old_name} → {new_name}")
            except Exception as e:
                errors.append((old_name, str(e)))
                print(f"❌ Error renaming {old_name}: {e}")
    
    print("\n" + "=" * 70)
    print(f"✅ RENAMING COMPLETE!")
    print("=" * 70)
    print(f"\n📊 Summary:")
    print(f"   ✅ Successfully renamed: {len(renamed)} files")
    if errors:
        print(f"   ❌ Errors: {len(errors)} files")
    
    # Create index file
    print("\n📝 Creating FILE_INDEX.md...")
    with open("FILE_INDEX.md", "w") as f:
        f.write("# 📁 File Index - Organized Structure\n\n")
        f.write("## 📚 Documentation Files (docs_*)\n\n")
        f.write("| File | Description |\n")
        f.write("|------|-------------|\n")
        
        for old, new in renamed:
            if new.startswith("docs_"):
                desc = old.replace(".md", "").replace("_", " ").title()
                f.write(f"| `{new}` | {desc} |\n")
        
        f.write("\n## 🛠️ Script Files (scripts_*)\n\n")
        f.write("| File | Description |\n")
        f.write("|------|-------------|\n")
        
        for old, new in renamed:
            if new.startswith("scripts_"):
                desc = old.replace(".py", "").replace(".sh", "").replace("_", " ").title()
                f.write(f"| `{new}` | {desc} |\n")
    
    print("✅ Created FILE_INDEX.md")
    print("\n💡 See FILE_INDEX.md for organized list of all files!")
    
else:
    print("\n❌ Renaming cancelled.")

