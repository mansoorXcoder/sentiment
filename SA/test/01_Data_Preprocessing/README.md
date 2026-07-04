# Data Preprocessing Repository

This repository contains all the data preprocessing components for the Sentiment Analysis project.

## Overview
This phase handles the complete data preprocessing pipeline including:
- Data combination from multiple sources
- Text cleaning and normalization
- Tokenization and stopword removal
- Text stemming
- Data splitting into train/test sets

## Files
- `combine_datasets.py` - Combines multiple dataset files and adds sentiment labels
- `data_preprocessing.py` - Main preprocessing pipeline
- `requirements.txt` - Python dependencies
- `dataset/` - Input datasets (lappi.csv, realme.csv)
- `scraped_reviews.csv` - Combined dataset output
- `processed_reviews.csv` - Fully processed dataset
- `train_data.csv` - Training set (80%)
- `test_data.csv` - Test set (20%)

## Usage

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Combine Datasets**:
   ```bash
   python combine_datasets.py
   ```

3. **Run Preprocessing**:
   ```bash
   python data_preprocessing.py
   ```

## Input Requirements
- Dataset files should be in CSV format
- Required columns: Review_ID, Review_Text, Rating
- Optional columns: Review_Title, Product_Name, etc.

## Output
- Processed text data ready for machine learning
- Train/test splits with proper class distribution
- Sentiment labels based on ratings (positive/neutral/negative)

## Next Steps
After preprocessing, move to the **Static Implementation** repository for model training.
