"""
Data Preprocessing Pipeline for Sentiment Analysis
This module handles data cleaning, tokenization, and stopword removal
"""

import pandas as pd
import numpy as np
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import PorterStemmer
from sklearn.model_selection import train_test_split
import pickle
import os

# Download required NLTK data
def download_nltk_data():
    """Download necessary NLTK data"""
    try:
        nltk.data.find('tokenizers/punkt')
    except LookupError:
        nltk.download('punkt')
    
    try:
        nltk.data.find('corpora/stopwords')
    except LookupError:
        nltk.download('stopwords')

class DataPreprocessor:
    def __init__(self):
        download_nltk_data()
        self.stemmer = PorterStemmer()
        self.stop_words = set(stopwords.words('english'))
        
    def clean_text(self, text):
        """
        Clean text data by removing special characters, URLs, and extra whitespace
        """
        if pd.isna(text):
            return ""
        
        # Convert to string
        text = str(text)
        
        # Remove URLs
        text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
        
        # Remove email addresses
        text = re.sub(r'\S+@\S+', '', text)
        
        # Remove special characters and digits
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text).strip()
        
        # Convert to lowercase
        text = text.lower()
        
        return text
    
    def tokenize_text(self, text):
        """
        Tokenize text into individual words
        """
        if not text:
            return []
        return word_tokenize(text)
    
    def remove_stopwords(self, tokens):
        """
        Remove stopwords from tokenized text
        """
        return [token for token in tokens if token not in self.stop_words and len(token) > 2]
    
    def stem_tokens(self, tokens):
        """
        Apply stemming to tokens
        """
        return [self.stemmer.stem(token) for token in tokens]
    
    def preprocess_text(self, text):
        """
        Complete preprocessing pipeline for a single text
        """
        # Clean text
        cleaned_text = self.clean_text(text)
        
        # Tokenize
        tokens = self.tokenize_text(cleaned_text)
        
        # Remove stopwords
        filtered_tokens = self.remove_stopwords(tokens)
        
        # Apply stemming
        stemmed_tokens = self.stem_tokens(filtered_tokens)
        
        # Join back to string
        return ' '.join(stemmed_tokens)
    
    def preprocess_dataframe(self, df, text_column='Review Text', sentiment_column='Sentiment'):
        """
        Preprocess entire dataframe
        """
        print("Starting data preprocessing...")
        
        # Create a copy of the dataframe
        processed_df = df.copy()
        
        # Preprocess text column
        print(f"Preprocessing {text_column} column...")
        processed_df['processed_text'] = processed_df[text_column].apply(self.preprocess_text)
        
        # Remove rows with empty processed text
        processed_df = processed_df[processed_df['processed_text'].str.len() > 0]
        
        # Encode sentiment labels
        if sentiment_column in processed_df.columns:
            print(f"Encoding {sentiment_column} labels...")
            sentiment_mapping = {'positive': 1, 'neutral': 0, 'negative': -1}
            processed_df['sentiment_encoded'] = processed_df[sentiment_column].map(sentiment_mapping)
            
            # Remove rows with unmapped sentiment values
            processed_df = processed_df.dropna(subset=['sentiment_encoded'])
        
        print(f"Preprocessing completed. Shape: {processed_df.shape}")
        return processed_df
    
    def split_data(self, df, test_size=0.2, random_state=42):
        """
        Split data into training and testing sets
        """
        print(f"Splitting data into train ({1-test_size:.0%}) and test ({test_size:.0%}) sets...")
        
        X = df['processed_text']
        y = df['sentiment_encoded']
        
        # Check if we can use stratified splitting
        unique_classes = y.value_counts()
        min_class_count = unique_classes.min()
        
        if min_class_count < 2:
            print(f"Warning: Some classes have only {min_class_count} sample(s). Using random split instead of stratified.")
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=test_size, random_state=random_state
            )
        else:
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=test_size, random_state=random_state, stratify=y
            )
        
        print(f"Training set size: {len(X_train)}")
        print(f"Test set size: {len(X_test)}")
        print(f"Training set class distribution:")
        print(y_train.value_counts().sort_index())
        print(f"Test set class distribution:")
        print(y_test.value_counts().sort_index())
        
        return X_train, X_test, y_train, y_test

def main():
    """
    Main function to demonstrate data preprocessing
    """
    # Check if dataset exists
    dataset_path = 'scraped_reviews.csv'
    
    if not os.path.exists(dataset_path):
        print(f"Dataset not found at {dataset_path}")
        print("Please ensure your dataset is named 'scraped_reviews.csv' and placed in the current directory")
        print("Expected columns: 'Review ID', 'Product Link', 'Review Text', 'Rating', 'Sentiment'")
        return
    
    # Load dataset
    print("Loading dataset...")
    df = pd.read_csv(dataset_path)
    print(f"Dataset loaded. Shape: {df.shape}")
    print(f"Columns: {list(df.columns)}")
    
    # Initialize preprocessor
    preprocessor = DataPreprocessor()
    
    # Preprocess data
    processed_df = preprocessor.preprocess_dataframe(df)
    
    # Split data
    X_train, X_test, y_train, y_test = preprocessor.split_data(processed_df)
    
    # Save processed data
    print("Saving processed data...")
    processed_df.to_csv('processed_reviews.csv', index=False)
    
    # Save train/test splits
    train_data = pd.DataFrame({
        'processed_text': X_train,
        'sentiment_encoded': y_train
    })
    test_data = pd.DataFrame({
        'processed_text': X_test,
        'sentiment_encoded': y_test
    })
    
    train_data.to_csv('train_data.csv', index=False)
    test_data.to_csv('test_data.csv', index=False)
    
    print("Data preprocessing completed successfully!")
    print("Files created:")
    print("- processed_reviews.csv (full processed dataset)")
    print("- train_data.csv (training set)")
    print("- test_data.csv (test set)")

if __name__ == "__main__":
    main()
