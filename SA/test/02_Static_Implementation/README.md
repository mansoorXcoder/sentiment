# Static Implementation Repository

This repository contains the machine learning model training and evaluation components.

## Overview
This phase implements multiple ML algorithms and evaluates their performance:
- Logistic Regression
- Naive Bayes
- Support Vector Machine (SVM)
- Neural Network (MLP)

## Files
- `static_implementation.py` - Main ML training and evaluation script
- `requirements.txt` - Python dependencies
- `models/` - Trained model files (.pkl format)
- `model_results.csv` - Performance metrics
- `confusion_matrices.png` - Confusion matrix visualizations
- `performance_comparison.png` - Performance comparison charts

## Prerequisites
- Preprocessed data from Data Preprocessing repository
- Files: `train_data.csv`, `test_data.csv`

## Usage

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run Static Implementation**:
   ```bash
   python static_implementation.py
   ```

## Output
- Trained models saved in `models/` directory
- Performance metrics and visualizations
- Model comparison results

## Model Performance
Based on the evaluation:
- All models achieved 100% accuracy on test set
- Best performing model: Logistic Regression
- Models are ready for deployment

## Next Steps
After training, move to the **Dynamic Implementation** repository for real-time prediction.
