# How to Run the Notebook

## Option 1: Run in Cursor (Recommended - Easiest)

If you're using Cursor IDE:

1. **Open the notebook**: The file `notebooks/comprehensive_analysis.ipynb` should already be open
2. **Run cells**: 
   - Click the "Run" button above each cell, OR
   - Press `Shift + Enter` to run the current cell and move to the next
   - Press `Ctrl + Enter` (or `Cmd + Enter` on Mac) to run the current cell without moving
3. **Run all cells**: Use the "Run All" button at the top of the notebook

## Option 2: Using Jupyter Notebook/Lab

### Step 1: Install Dependencies
```bash
# Navigate to the project directory
cd /Users/yamaannandolia/Desktop/group4-fitch-codeathon2025

# Install required packages
pip install -r requirements.txt

# If you need Jupyter Notebook (if not already installed)
pip install jupyter notebook
```

### Step 2: Start Jupyter
```bash
# Start Jupyter Notebook
jupyter notebook

# OR start Jupyter Lab (more modern interface)
jupyter lab
```

### Step 3: Open and Run
1. A browser window will open
2. Navigate to the `notebooks` folder
3. Click on `comprehensive_analysis.ipynb`
4. Run cells using:
   - `Shift + Enter` - Run cell and move to next
   - `Ctrl + Enter` - Run cell and stay
   - `Run All` button in the toolbar

## Option 3: Using VS Code

1. **Install Python extension** in VS Code
2. **Open the notebook**: File → Open → `comprehensive_analysis.ipynb`
3. **Select kernel**: Click the kernel selector in top right, choose your Python environment
4. **Run cells**: Click the "Run Cell" button or use `Shift + Enter`

## Option 4: Using Google Colab

1. Upload the notebook to Google Colab
2. Upload the `data` folder to Colab
3. Update file paths: Change `"../data/"` to `"/content/data/"` in the notebook
4. Run cells sequentially

## Quick Start Commands

### Check if Python is installed:
```bash
python --version
# or
python3 --version
```

### Check if packages are installed:
```bash
python -c "import pandas, numpy, matplotlib, sklearn; print('All packages installed!')"
```

### Install missing packages:
```bash
pip install pandas numpy matplotlib seaborn scikit-learn
```

## Troubleshooting

### Issue: "ModuleNotFoundError"
**Solution**: Install the missing package
```bash
pip install <package_name>
```

### Issue: "FileNotFoundError" when loading data
**Solution**: Make sure you're running from the correct directory. The notebook expects:
- `../data/train.csv` (relative to notebooks folder)
- If running from root, change paths to `data/train.csv`

### Issue: Jupyter not starting
**Solution**: 
```bash
pip install --upgrade jupyter
jupyter notebook --no-browser
```

### Issue: Kernel keeps dying
**Solution**: 
- Check if you have enough memory
- Restart the kernel: Kernel → Restart
- Try running cells one at a time

## Recommended Workflow

1. **Start with Phase 1**: Run the first few cells to load data
2. **Check outputs**: Review the validation messages (✅ means good, ⚠️ means warning)
3. **Run sequentially**: Don't skip ahead - later cells depend on earlier ones
4. **Read the markdown cells**: They explain what and why we're doing each step
5. **Document findings**: Update the "Phase 1 Summary" cell with your observations

## Tips

- **Run cells one at a time** initially to understand what each does
- **Read the output** - validation checks will tell you if something is wrong
- **Save frequently** - Notebooks auto-save, but it's good practice
- **If a cell fails**: Check the error message, fix the issue, then re-run

## Next Steps After Running

Once you've run Phase 1:
1. Review the outputs and findings
2. Let me know what you discovered
3. We'll proceed to Phase 2 (Data Quality & Preprocessing)
4. Continue building out the notebook with feature engineering

