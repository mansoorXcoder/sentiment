"""
Static Implementation for Sentiment Analysis
This module implements multiple ML algorithms and evaluates their performance
"""

import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.svm import SVC
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report, confusion_matrix
from sklearn.model_selection import cross_val_score
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
import os

class SentimentAnalyzer:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
        self.models = {}
        self.results = {}
        
    def load_data(self, train_path='train_data.csv', test_path='test_data.csv'):
        """
        Load preprocessed training and test data
        """
        print("Loading preprocessed data...")
        
        if not os.path.exists(train_path) or not os.path.exists(test_path):
            print("Preprocessed data files not found. Please run data_preprocessing.py first.")
            return None, None, None, None
        
        train_df = pd.read_csv(train_path)
        test_df = pd.read_csv(test_path)
        
        X_train = train_df['processed_text']
        y_train = train_df['sentiment_encoded']
        X_test = test_df['processed_text']
        y_test = test_df['sentiment_encoded']
        
        print(f"Training data shape: {X_train.shape}")
        print(f"Test data shape: {X_test.shape}")
        
        return X_train, X_test, y_train, y_test
    
    def vectorize_data(self, X_train, X_test):
        """
        Convert text data to TF-IDF vectors
        """
        print("Vectorizing text data...")
        
        X_train_tfidf = self.vectorizer.fit_transform(X_train)
        X_test_tfidf = self.vectorizer.transform(X_test)
        
        print(f"Training vectors shape: {X_train_tfidf.shape}")
        print(f"Test vectors shape: {X_test_tfidf.shape}")
        
        return X_train_tfidf, X_test_tfidf
    
    def initialize_models(self):
        """
        Initialize all machine learning models
        """
        self.models = {
            'Logistic Regression': LogisticRegression(random_state=42, max_iter=1000),
            'Naive Bayes': MultinomialNB(),
            'SVM': SVC(kernel='linear', random_state=42),
            'Neural Network': MLPClassifier(hidden_layer_sizes=(100, 50), random_state=42, max_iter=500)
        }
        print("Models initialized successfully!")
    
    def train_models(self, X_train, y_train):
        """
        Train all models
        """
        print("Training models...")
        
        for name, model in self.models.items():
            print(f"Training {name}...")
            model.fit(X_train, y_train)
            print(f"{name} training completed!")
    
    def evaluate_models(self, X_train, X_test, y_train, y_test):
        """
        Evaluate all models and return performance metrics
        """
        print("Evaluating models...")
        
        for name, model in self.models.items():
            print(f"Evaluating {name}...")
            
            # Make predictions
            y_pred = model.predict(X_test)
            
            # Calculate metrics
            accuracy = accuracy_score(y_test, y_pred)
            precision = precision_score(y_test, y_pred, average='weighted')
            recall = recall_score(y_test, y_pred, average='weighted')
            f1 = f1_score(y_test, y_pred, average='weighted')
            
            # Cross-validation score (use training data for CV since test set might be too small)
            try:
                cv_folds = min(5, X_train.shape[0]//2)
                if cv_folds >= 2:
                    cv_scores = cross_val_score(model, X_train, y_train, cv=cv_folds)
                else:
                    cv_scores = np.array([0.0])
            except ValueError as e:
                print(f"Warning: Cross-validation failed for {name}: {e}")
                cv_scores = np.array([0.0])
            
            # Store results
            self.results[name] = {
                'accuracy': accuracy,
                'precision': precision,
                'recall': recall,
                'f1_score': f1,
                'cv_mean': cv_scores.mean(),
                'cv_std': cv_scores.std(),
                'predictions': y_pred
            }
            
            print(f"{name} - Accuracy: {accuracy:.4f}, F1: {f1:.4f}")
    
    def print_detailed_results(self, y_test):
        """
        Print detailed evaluation results
        """
        print("\n" + "="*60)
        print("DETAILED EVALUATION RESULTS")
        print("="*60)
        
        results_df = pd.DataFrame({
            'Model': list(self.results.keys()),
            'Accuracy': [self.results[model]['accuracy'] for model in self.results.keys()],
            'Precision': [self.results[model]['precision'] for model in self.results.keys()],
            'Recall': [self.results[model]['recall'] for model in self.results.keys()],
            'F1-Score': [self.results[model]['f1_score'] for model in self.results.keys()],
            'CV Mean': [self.results[model]['cv_mean'] for model in self.results.keys()],
            'CV Std': [self.results[model]['cv_std'] for model in self.results.keys()]
        })
        
        print(results_df.to_string(index=False, float_format='%.4f'))
        
        # Find best model
        best_model = max(self.results.keys(), key=lambda x: self.results[x]['f1_score'])
        print(f"\nBest performing model: {best_model}")
        print(f"Best F1-Score: {self.results[best_model]['f1_score']:.4f}")
    
    def save_models(self, model_dir='models'):
        """
        Save all trained models and vectorizer
        """
        print("Saving models...")
        
        # Create models directory
        os.makedirs(model_dir, exist_ok=True)
        
        # Save vectorizer
        joblib.dump(self.vectorizer, f'{model_dir}/tfidf_vectorizer.pkl')
        print("Vectorizer saved!")
        
        # Save each model
        for name, model in self.models.items():
            model_path = f'{model_dir}/{name.lower().replace(" ", "_")}.pkl'
            joblib.dump(model, model_path)
            print(f"{name} saved to {model_path}")
        
        # Save results
        results_df = pd.DataFrame({
            'Model': list(self.results.keys()),
            'Accuracy': [self.results[model]['accuracy'] for model in self.results.keys()],
            'Precision': [self.results[model]['precision'] for model in self.results.keys()],
            'Recall': [self.results[model]['recall'] for model in self.results.keys()],
            'F1-Score': [self.results[model]['f1_score'] for model in self.results.keys()],
            'CV Mean': [self.results[model]['cv_mean'] for model in self.results.keys()],
            'CV Std': [self.results[model]['cv_std'] for model in self.results.keys()]
        })
        
        results_df.to_csv(f'{model_dir}/model_results.csv', index=False)
        print("Model results saved!")
    
    def plot_confusion_matrices(self, y_test, save_plots=True):
        """
        Plot confusion matrices for all models
        """
        print("Creating confusion matrices...")
        
        n_models = len(self.models)
        fig, axes = plt.subplots(2, 2, figsize=(15, 12))
        axes = axes.ravel()
        
        for i, (name, model) in enumerate(self.models.items()):
            y_pred = self.results[name]['predictions']
            cm = confusion_matrix(y_test, y_pred)
            
            sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=axes[i])
            axes[i].set_title(f'{name} Confusion Matrix')
            axes[i].set_xlabel('Predicted')
            axes[i].set_ylabel('Actual')
        
        plt.tight_layout()
        
        if save_plots:
            plt.savefig('confusion_matrices.png', dpi=300, bbox_inches='tight')
            print("Confusion matrices saved as 'confusion_matrices.png'")
        
        plt.show()
    
    def plot_performance_comparison(self, save_plots=True):
        """
        Plot performance comparison across models
        """
        print("Creating performance comparison plots...")
        
        metrics = ['accuracy', 'precision', 'recall', 'f1_score']
        model_names = list(self.results.keys())
        
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        axes = axes.ravel()
        
        for i, metric in enumerate(metrics):
            values = [self.results[model][metric] for model in model_names]
            
            bars = axes[i].bar(model_names, values, color=['skyblue', 'lightgreen', 'salmon', 'gold'])
            axes[i].set_title(f'{metric.replace("_", " ").title()}')
            axes[i].set_ylabel('Score')
            axes[i].set_ylim(0, 1)
            
            # Add value labels on bars
            for bar, value in zip(bars, values):
                axes[i].text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.01,
                           f'{value:.3f}', ha='center', va='bottom')
            
            # Rotate x-axis labels
            axes[i].tick_params(axis='x', rotation=45)
        
        plt.tight_layout()
        
        if save_plots:
            plt.savefig('performance_comparison.png', dpi=300, bbox_inches='tight')
            print("Performance comparison saved as 'performance_comparison.png'")
        
        plt.show()

def main():
    """
    Main function to run static implementation
    """
    print("Starting Static Implementation for Sentiment Analysis")
    print("="*60)
    
    # Initialize analyzer
    analyzer = SentimentAnalyzer()
    
    # Load data
    X_train, X_test, y_train, y_test = analyzer.load_data()
    
    if X_train is None:
        return
    
    # Vectorize data
    X_train_tfidf, X_test_tfidf = analyzer.vectorize_data(X_train, X_test)
    
    # Initialize models
    analyzer.initialize_models()
    
    # Train models
    analyzer.train_models(X_train_tfidf, y_train)
    
    # Evaluate models
    analyzer.evaluate_models(X_train_tfidf, X_test_tfidf, y_train, y_test)
    
    # Print results
    analyzer.print_detailed_results(y_test)
    
    # Save models
    analyzer.save_models()
    
    # Create visualizations
    analyzer.plot_confusion_matrices(y_test)
    analyzer.plot_performance_comparison()
    
    print("\nStatic implementation completed successfully!")
    print("All models have been trained, evaluated, and saved.")

if __name__ == "__main__":
    main()
