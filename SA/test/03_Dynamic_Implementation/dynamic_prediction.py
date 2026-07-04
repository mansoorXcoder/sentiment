"""
Dynamic Prediction System for Sentiment Analysis
Real-time sentiment prediction using trained models
"""

import pandas as pd
import numpy as np
import joblib
import os
from sklearn.feature_extraction.text import TfidfVectorizer
import warnings
warnings.filterwarnings('ignore')

class SentimentPredictor:
    def __init__(self, models_dir='models'):
        """
        Initialize the sentiment predictor with trained models
        """
        self.models_dir = models_dir
        self.vectorizer = None
        self.models = {}
        self.model_names = []
        self.load_models()
    
    def load_models(self):
        """
        Load all trained models and vectorizer
        """
        print("Loading trained models...")
        
        # Load vectorizer
        vectorizer_path = os.path.join(self.models_dir, 'tfidf_vectorizer.pkl')
        if os.path.exists(vectorizer_path):
            self.vectorizer = joblib.load(vectorizer_path)
            print("✓ Vectorizer loaded")
        else:
            print("✗ Vectorizer not found!")
            return
        
        # Load models
        model_files = {
            'Logistic Regression': 'logistic_regression.pkl',
            'Naive Bayes': 'naive_bayes.pkl',
            'SVM': 'svm.pkl',
            'Neural Network': 'neural_network.pkl'
        }
        
        for name, filename in model_files.items():
            model_path = os.path.join(self.models_dir, filename)
            if os.path.exists(model_path):
                self.models[name] = joblib.load(model_path)
                self.model_names.append(name)
                print(f"✓ {name} loaded")
            else:
                print(f"✗ {name} not found!")
        
        print(f"Loaded {len(self.models)} models successfully!")
    
    def preprocess_text(self, text):
        """
        Preprocess input text (same as training pipeline)
        """
        if pd.isna(text) or not text:
            return ""
        
        # Basic cleaning
        import re
        text = str(text)
        text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
        text = re.sub(r'\S+@\S+', '', text)
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        text = re.sub(r'\s+', ' ', text).strip()
        text = text.lower()
        
        return text
    
    def predict_sentiment(self, text, model_name=None):
        """
        Predict sentiment for given text
        """
        if not self.vectorizer or not self.models:
            return {"error": "Models not loaded properly"}
        
        # Preprocess text
        processed_text = self.preprocess_text(text)
        
        if not processed_text:
            return {"error": "Empty or invalid text"}
        
        # Vectorize text
        try:
            text_vector = self.vectorizer.transform([processed_text])
        except Exception as e:
            return {"error": f"Vectorization failed: {str(e)}"}
        
        # Get predictions from all models or specific model
        if model_name and model_name in self.models:
            models_to_use = {model_name: self.models[model_name]}
        else:
            models_to_use = self.models
        
        predictions = {}
        for name, model in models_to_use.items():
            try:
                prediction = model.predict(text_vector)[0]
                prediction_proba = None
                
                # Get prediction probabilities if available
                if hasattr(model, 'predict_proba'):
                    proba = model.predict_proba(text_vector)[0]
                    prediction_proba = {
                        'negative': float(proba[0]) if len(proba) > 0 else 0.0,
                        'neutral': float(proba[1]) if len(proba) > 1 else 0.0,
                        'positive': float(proba[2]) if len(proba) > 2 else 0.0
                    }
                
                # Convert numeric prediction to label
                sentiment_map = {-1: 'negative', 0: 'neutral', 1: 'positive'}
                sentiment_label = sentiment_map.get(prediction, 'unknown')
                
                predictions[name] = {
                    'sentiment': sentiment_label,
                    'confidence': prediction_proba,
                    'raw_prediction': int(prediction)
                }
                
            except Exception as e:
                predictions[name] = {"error": f"Prediction failed: {str(e)}"}
        
        return {
            "text": text,
            "processed_text": processed_text,
            "predictions": predictions,
            "model_count": len(predictions)
        }
    
    def predict_batch(self, texts, model_name=None):
        """
        Predict sentiment for multiple texts
        """
        results = []
        for i, text in enumerate(texts):
            result = self.predict_sentiment(text, model_name)
            result['index'] = i
            results.append(result)
        
        return results
    
    def get_model_info(self):
        """
        Get information about loaded models
        """
        return {
            "loaded_models": self.model_names,
            "model_count": len(self.models),
            "vectorizer_loaded": self.vectorizer is not None
        }

def main():
    """
    Demo function for testing the prediction system
    """
    print("Sentiment Analysis - Dynamic Prediction System")
    print("=" * 50)
    
    # Initialize predictor
    predictor = SentimentPredictor()
    
    if not predictor.models:
        print("No models loaded. Please ensure models are available.")
        return
    
    # Demo predictions
    test_texts = [
        "This product is amazing! I love it!",
        "The quality is okay, nothing special.",
        "Terrible product, waste of money.",
        "Great value for money, highly recommended!",
        "Not sure about this one, seems average."
    ]
    
    print("\nTesting predictions:")
    print("-" * 30)
    
    for i, text in enumerate(test_texts, 1):
        print(f"\n{i}. Text: '{text}'")
        result = predictor.predict_sentiment(text)
        
        if "error" in result:
            print(f"   Error: {result['error']}")
        else:
            print(f"   Processed: '{result['processed_text']}'")
            for model_name, prediction in result['predictions'].items():
                if "error" not in prediction:
                    print(f"   {model_name}: {prediction['sentiment']} (confidence: {prediction['confidence']})")
                else:
                    print(f"   {model_name}: Error - {prediction['error']}")

if __name__ == "__main__":
    main()
