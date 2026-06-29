"""
Script to combine multiple datasets and add sentiment labels
"""

import pandas as pd
import numpy as np

def add_sentiment_labels(df):
    """
    Add sentiment labels based on rating values
    """
    def get_sentiment(rating):
        if pd.isna(rating):
            return 'neutral'
        elif rating >= 4.0:
            return 'positive'
        elif rating >= 2.5:
            return 'neutral'
        else:
            return 'negative'
    
    df['Sentiment'] = df['Rating'].apply(get_sentiment)
    return df

def combine_datasets():
    """
    Combine multiple dataset files into one
    """
    print("Loading datasets...")
    
    # Load both datasets
    lappi_df = pd.read_csv('dataset/lappi.csv')
    realme_df = pd.read_csv('dataset/realme.csv')
    
    print(f"Lappi dataset shape: {lappi_df.shape}")
    print(f"Realme dataset shape: {realme_df.shape}")
    
    # Add product type column
    lappi_df['Product_Type'] = 'Laptop'
    realme_df['Product_Type'] = 'Earbuds'
    
    # Combine datasets
    combined_df = pd.concat([lappi_df, realme_df], ignore_index=True)
    
    print(f"Combined dataset shape: {combined_df.shape}")
    
    # Add sentiment labels
    print("Adding sentiment labels based on ratings...")
    combined_df = add_sentiment_labels(combined_df)
    
    # Check sentiment distribution
    print("\nSentiment distribution:")
    print(combined_df['Sentiment'].value_counts())
    
    # Create the expected format for the preprocessing pipeline
    # Map columns to expected names
    processed_df = combined_df.copy()
    
    # Rename columns to match expected format
    column_mapping = {
        'Review_ID': 'Review ID',
        'Review_Text': 'Review Text',
        'Product_Name': 'Product Name'
    }
    
    processed_df = processed_df.rename(columns=column_mapping)
    
    # Create Product Link column (placeholder)
    processed_df['Product Link'] = 'N/A'
    
    # Select and reorder columns to match expected format
    final_columns = ['Review ID', 'Product Link', 'Review Text', 'Rating', 'Sentiment']
    final_df = processed_df[final_columns].copy()
    
    # Remove rows with missing review text
    final_df = final_df.dropna(subset=['Review Text'])
    final_df = final_df[final_df['Review Text'].str.strip() != '']
    
    print(f"\nFinal dataset shape: {final_df.shape}")
    print(f"Columns: {list(final_df.columns)}")
    
    # Save combined dataset
    final_df.to_csv('scraped_reviews.csv', index=False)
    print("\nCombined dataset saved as 'scraped_reviews.csv'")
    
    return final_df

if __name__ == "__main__":
    df = combine_datasets()
    print("\nDataset combination completed successfully!")
