# Sentiment Analysis Project

A comprehensive sentiment analysis project that processes e-commerce reviews and predicts sentiment using multiple machine learning algorithms.

## Project Flow

This project follows a structured approach as shown in the project flow map:

1. **Data Phase**: Web scraping from e-commerce sites (Amazon, Flipkart)
2. **Data Preprocessing**: Cleaning, tokenization, stopword removal
3. **Static Implementation**: Multiple ML algorithms with evaluation
4. **Dynamic Implementation**: Real-time prediction system
5. **Visualization & UI**: Results display and user interface
6. **Future Scope**: Multilingual support, API integration

## Current Status

✅ **Data Phase**: Dataset ready (`scraped_reviews.csv`)
🔄 **Data Preprocessing**: Ready to process your dataset
⏳ **Static Implementation**: Ready to train and evaluate models

## Dataset Requirements

Your dataset should be named `scraped_reviews.csv` and contain the following columns:
- `Review ID`: Unique identifier for each review
- `Product Link`: URL of the product
- `Review Text`: The actual review text
- `Rating`: Numerical rating (1-5)
- `Sentiment`: Sentiment label (positive/neutral/negative)

## Quick Start

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Place Your Dataset**:
   - Ensure your dataset is named `scraped_reviews.csv`
   - Place it in the project root directory

3. **Run Data Preprocessing**:
   ```bash
   python data_preprocessing.py
   ```

4. **Run Static Implementation**:
   ```bash
   python static_implementation.py
   ```

## Files Generated

### After Data Preprocessing:
- `processed_reviews.csv`: Full processed dataset
- `train_data.csv`: Training set (80%)
- `test_data.csv`: Test set (20%)

### After Static Implementation:
- `models/`: Directory containing saved models
  - `tfidf_vectorizer.pkl`: TF-IDF vectorizer
  - `logistic_regression.pkl`: Logistic Regression model
  - `naive_bayes.pkl`: Naive Bayes model
  - `svm.pkl`: Support Vector Machine model
  - `neural_network.pkl`: Neural Network model
  - `model_results.csv`: Performance metrics
- `confusion_matrices.png`: Confusion matrices for all models
- `performance_comparison.png`: Performance comparison charts

## Algorithms Implemented

1. **Logistic Regression**: Linear classification with probability outputs
2. **Naive Bayes**: Probabilistic classifier based on Bayes' theorem
3. **Support Vector Machine (SVM)**: Linear kernel for text classification
4. **Neural Network**: Multi-layer perceptron with hidden layers

## Evaluation Metrics

- **Accuracy**: Overall correctness of predictions
- **Precision**: True positives / (True positives + False positives)
- **Recall**: True positives / (True positives + False negatives)
- **F1-Score**: Harmonic mean of precision and recall
- **Cross-Validation**: 5-fold CV for robust evaluation

## Next Steps

After completing the static implementation, you can proceed to:

1. **Dynamic Implementation**: Real-time prediction system
2. **Visualization & UI**: Interactive dashboard
3. **Model Deployment**: API integration for production use

## Project Structure

```
├── requirements.txt              # Python dependencies
├── data_preprocessing.py        # Data cleaning and preprocessing
├── static_implementation.py     # ML model training and evaluation
├── README.md                    # This file
├── scraped_reviews.csv         # Your dataset (place here)
└── models/                     # Generated model files
```

## Requirements

- Python 3.8+
- pandas, numpy, scikit-learn
- nltk for text processing
- matplotlib, seaborn for visualization
- joblib for model serialization

## Notes

- The preprocessing pipeline handles text cleaning, tokenization, stopword removal, and stemming
- All models are saved in pickle format for easy loading
- Performance metrics are automatically calculated and saved
- Visualizations are generated for model comparison
