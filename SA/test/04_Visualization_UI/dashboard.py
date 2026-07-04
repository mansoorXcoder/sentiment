"""
Interactive Dashboard for Sentiment Analysis
Advanced visualization and monitoring dashboard
"""

import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px
import plotly.graph_objects as go
from wordcloud import WordCloud
import joblib
import os
from datetime import datetime
import json

# Page configuration
st.set_page_config(
    page_title="Sentiment Analysis Dashboard",
    page_icon="🎭",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        color: #1f77b4;
        text-align: center;
        margin-bottom: 2rem;
    }
    .metric-card {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid #1f77b4;
    }
    .positive { color: #28a745; }
    .neutral { color: #ffc107; }
    .negative { color: #dc3545; }
</style>
""", unsafe_allow_html=True)

class SentimentDashboard:
    def __init__(self):
        self.models = {}
        self.vectorizer = None
        self.load_models()
    
    def load_models(self):
        """Load trained models"""
        models_dir = '../02_Static_Implementation/models'
        
        try:
            # Load vectorizer
            vectorizer_path = os.path.join(models_dir, 'tfidf_vectorizer.pkl')
            if os.path.exists(vectorizer_path):
                self.vectorizer = joblib.load(vectorizer_path)
            
            # Load models
            model_files = {
                'Logistic Regression': 'logistic_regression.pkl',
                'Naive Bayes': 'naive_bayes.pkl',
                'SVM': 'svm.pkl',
                'Neural Network': 'neural_network.pkl'
            }
            
            for name, filename in model_files.items():
                model_path = os.path.join(models_dir, filename)
                if os.path.exists(model_path):
                    self.models[name] = joblib.load(model_path)
            
            st.success(f"Loaded {len(self.models)} models successfully!")
            
        except Exception as e:
            st.error(f"Error loading models: {str(e)}")
    
    def preprocess_text(self, text):
        """Preprocess text for prediction"""
        if pd.isna(text) or not text:
            return ""
        
        import re
        text = str(text)
        text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
        text = re.sub(r'\S+@\S+', '', text)
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        text = re.sub(r'\s+', ' ', text).strip()
        text = text.lower()
        
        return text
    
    def predict_sentiment(self, text, model_name=None):
        """Predict sentiment for given text"""
        if not self.vectorizer or not self.models:
            return {"error": "Models not loaded"}
        
        processed_text = self.preprocess_text(text)
        if not processed_text:
            return {"error": "Empty text"}
        
        try:
            text_vector = self.vectorizer.transform([processed_text])
            
            if model_name and model_name in self.models:
                models_to_use = {model_name: self.models[model_name]}
            else:
                models_to_use = self.models
            
            predictions = {}
            for name, model in models_to_use.items():
                try:
                    prediction = model.predict(text_vector)[0]
                    prediction_proba = None
                    
                    if hasattr(model, 'predict_proba'):
                        proba = model.predict_proba(text_vector)[0]
                        prediction_proba = {
                            'negative': float(proba[0]) if len(proba) > 0 else 0.0,
                            'neutral': float(proba[1]) if len(proba) > 1 else 0.0,
                            'positive': float(proba[2]) if len(proba) > 2 else 0.0
                        }
                    
                    sentiment_map = {-1: 'negative', 0: 'neutral', 1: 'positive'}
                    sentiment_label = sentiment_map.get(prediction, 'unknown')
                    
                    predictions[name] = {
                        'sentiment': sentiment_label,
                        'confidence': prediction_proba,
                        'raw_prediction': int(prediction)
                    }
                    
                except Exception as e:
                    predictions[name] = {"error": str(e)}
            
            return {
                "text": text,
                "processed_text": processed_text,
                "predictions": predictions
            }
            
        except Exception as e:
            return {"error": str(e)}

def main():
    """Main dashboard function"""
    
    # Header
    st.markdown('<h1 class="main-header">🎭 Sentiment Analysis Dashboard</h1>', unsafe_allow_html=True)
    
    # Initialize dashboard
    dashboard = SentimentDashboard()
    
    # Sidebar
    st.sidebar.title("Navigation")
    page = st.sidebar.selectbox(
        "Choose a page",
        ["Real-time Analysis", "Model Performance", "Data Visualization", "Word Cloud", "About"]
    )
    
    if page == "Real-time Analysis":
        show_realtime_analysis(dashboard)
    elif page == "Model Performance":
        show_model_performance()
    elif page == "Data Visualization":
        show_data_visualization()
    elif page == "Word Cloud":
        show_word_cloud()
    elif page == "About":
        show_about()

def show_realtime_analysis(dashboard):
    """Real-time sentiment analysis page"""
    st.header("🔍 Real-time Sentiment Analysis")
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        # Text input
        text_input = st.text_area(
            "Enter text for sentiment analysis:",
            height=150,
            placeholder="Type your text here..."
        )
        
        # Model selection
        model_options = ["All Models"] + list(dashboard.models.keys())
        selected_model = st.selectbox("Select Model:", model_options)
        
        # Analyze button
        if st.button("Analyze Sentiment", type="primary"):
            if text_input.strip():
                with st.spinner("Analyzing..."):
                    result = dashboard.predict_sentiment(
                        text_input, 
                        selected_model if selected_model != "All Models" else None
                    )
                
                if "error" in result:
                    st.error(f"Error: {result['error']}")
                else:
                    display_prediction_results(result)
            else:
                st.warning("Please enter some text to analyze.")
    
    with col2:
        # Quick stats
        st.subheader("📊 Quick Stats")
        
        if os.path.exists('../02_Static_Implementation/models/model_results.csv'):
            results_df = pd.read_csv('../02_Static_Implementation/models/model_results.csv')
            
            col2_1, col2_2 = st.columns(2)
            with col2_1:
                st.metric("Models Loaded", len(dashboard.models))
            with col2_2:
                best_model = results_df.loc[results_df['F1-Score'].idxmax(), 'Model']
                st.metric("Best Model", best_model)
            
            # Model performance chart
            fig = px.bar(
                results_df, 
                x='Model', 
                y='F1-Score',
                title="Model Performance (F1-Score)",
                color='F1-Score',
                color_continuous_scale='Viridis'
            )
            st.plotly_chart(fig, use_container_width=True)

def display_prediction_results(result):
    """Display prediction results"""
    st.subheader("📈 Analysis Results")
    
    # Original and processed text
    col1, col2 = st.columns(2)
    with col1:
        st.write("**Original Text:**")
        st.write(result['text'])
    with col2:
        st.write("**Processed Text:**")
        st.write(result['processed_text'])
    
    # Predictions
    st.subheader("🎯 Predictions")
    
    for model_name, prediction in result['predictions'].items():
        if "error" in prediction:
            st.error(f"**{model_name}:** Error - {prediction['error']}")
        else:
            sentiment = prediction['sentiment']
            confidence = prediction['confidence']
            
            # Create columns for each prediction
            col1, col2, col3 = st.columns([2, 1, 1])
            
            with col1:
                st.write(f"**{model_name}:**")
            
            with col2:
                sentiment_color = {
                    'positive': '🟢',
                    'neutral': '🟡', 
                    'negative': '🔴'
                }
                st.write(f"{sentiment_color.get(sentiment, '⚪')} {sentiment.upper()}")
            
            with col3:
                if confidence:
                    conf_score = confidence.get(sentiment, 0) * 100
                    st.write(f"({conf_score:.1f}%)")

def show_model_performance():
    """Model performance page"""
    st.header("📊 Model Performance Analysis")
    
    if os.path.exists('../02_Static_Implementation/models/model_results.csv'):
        results_df = pd.read_csv('../02_Static_Implementation/models/model_results.csv')
        
        # Performance metrics
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric("Best Accuracy", f"{results_df['Accuracy'].max():.3f}")
        with col2:
            st.metric("Best F1-Score", f"{results_df['F1-Score'].max():.3f}")
        with col3:
            st.metric("Best Precision", f"{results_df['Precision'].max():.3f}")
        with col4:
            st.metric("Best Recall", f"{results_df['Recall'].max():.3f}")
        
        # Performance comparison
        st.subheader("Model Comparison")
        
        metrics = ['Accuracy', 'Precision', 'Recall', 'F1-Score']
        fig = go.Figure()
        
        for metric in metrics:
            fig.add_trace(go.Bar(
                name=metric,
                x=results_df['Model'],
                y=results_df[metric],
                text=results_df[metric].round(3),
                textposition='auto'
            ))
        
        fig.update_layout(
            title="Model Performance Comparison",
            xaxis_title="Models",
            yaxis_title="Score",
            barmode='group'
        )
        
        st.plotly_chart(fig, use_container_width=True)
        
        # Detailed results table
        st.subheader("Detailed Results")
        st.dataframe(results_df, use_container_width=True)
        
    else:
        st.warning("Model results file not found. Please run the static implementation first.")

def show_data_visualization():
    """Data visualization page"""
    st.header("📈 Data Visualization")
    
    # Load processed data
    if os.path.exists('../processed_reviews.csv'):
        df = pd.read_csv('../processed_reviews.csv')
        
        # Sentiment distribution
        st.subheader("Sentiment Distribution")
        
        col1, col2 = st.columns(2)
        
        with col1:
            sentiment_counts = df['Sentiment'].value_counts()
            fig = px.pie(
                values=sentiment_counts.values,
                names=sentiment_counts.index,
                title="Sentiment Distribution",
                color_discrete_map={
                    'positive': '#28a745',
                    'neutral': '#ffc107',
                    'negative': '#dc3545'
                }
            )
            st.plotly_chart(fig, use_container_width=True)
        
        with col2:
            fig = px.bar(
                x=sentiment_counts.index,
                y=sentiment_counts.values,
                title="Sentiment Counts",
                color=sentiment_counts.index,
                color_discrete_map={
                    'positive': '#28a745',
                    'neutral': '#ffc107',
                    'negative': '#dc3545'
                }
            )
            st.plotly_chart(fig, use_container_width=True)
        
        # Rating distribution
        st.subheader("Rating Distribution")
        rating_counts = df['Rating'].value_counts().sort_index()
        
        fig = px.bar(
            x=rating_counts.index,
            y=rating_counts.values,
            title="Rating Distribution",
            labels={'x': 'Rating', 'y': 'Count'}
        )
        st.plotly_chart(fig, use_container_width=True)
        
        # Text length analysis
        st.subheader("Text Length Analysis")
        df['text_length'] = df['Review Text'].str.len()
        
        fig = px.histogram(
            df,
            x='text_length',
            color='Sentiment',
            title="Text Length Distribution by Sentiment",
            nbins=20
        )
        st.plotly_chart(fig, use_container_width=True)
        
    else:
        st.warning("Processed data not found. Please run data preprocessing first.")

def show_word_cloud():
    """Word cloud generation page"""
    st.header("☁️ Word Cloud Generation")
    
    if os.path.exists('../processed_reviews.csv'):
        df = pd.read_csv('../processed_reviews.csv')
        
        # Sentiment selection
        sentiment_options = ['All'] + list(df['Sentiment'].unique())
        selected_sentiment = st.selectbox("Select Sentiment:", sentiment_options)
        
        # Filter data
        if selected_sentiment == 'All':
            text_data = df['processed_text'].dropna().str.cat(sep=' ')
        else:
            text_data = df[df['Sentiment'] == selected_sentiment]['processed_text'].dropna().str.cat(sep=' ')
        
        if text_data.strip():
            # Generate word cloud
            st.subheader(f"Word Cloud for {selected_sentiment} Sentiment")
            
            wordcloud = WordCloud(
                width=800,
                height=400,
                background_color='white',
                colormap='viridis',
                max_words=100
            ).generate(text_data)
            
            fig, ax = plt.subplots(figsize=(10, 5))
            ax.imshow(wordcloud, interpolation='bilinear')
            ax.axis('off')
            st.pyplot(fig)
            
            # Most common words
            st.subheader("Most Common Words")
            from collections import Counter
            words = text_data.split()
            word_counts = Counter(words)
            most_common = word_counts.most_common(20)
            
            common_df = pd.DataFrame(most_common, columns=['Word', 'Count'])
            st.dataframe(common_df, use_container_width=True)
            
        else:
            st.warning("No text data available for the selected sentiment.")
    else:
        st.warning("Processed data not found. Please run data preprocessing first.")

def show_about():
    """About page"""
    st.header("ℹ️ About This Dashboard")
    
    st.markdown("""
    ## Sentiment Analysis Project Dashboard
    
    This interactive dashboard provides comprehensive tools for sentiment analysis including:
    
    ### Features:
    - **Real-time Analysis**: Analyze sentiment of any text input
    - **Model Performance**: Compare different ML models
    - **Data Visualization**: Explore your dataset with interactive charts
    - **Word Clouds**: Visual representation of most common words
    - **Export Capabilities**: Download results and visualizations
    
    ### Models Available:
    - Logistic Regression
    - Naive Bayes
    - Support Vector Machine (SVM)
    - Neural Network (MLP)
    
    ### Project Structure:
    1. **Data Preprocessing**: Text cleaning and preparation
    2. **Static Implementation**: Model training and evaluation
    3. **Dynamic Implementation**: Real-time prediction system
    4. **Visualization & UI**: This dashboard
    
    ### Technology Stack:
    - **Backend**: Python, scikit-learn, NLTK
    - **Frontend**: Streamlit, Plotly, Matplotlib
    - **Visualization**: WordCloud, Seaborn, Plotly
    
    ### Getting Started:
    1. Ensure all models are trained (run static implementation)
    2. Have processed data available
    3. Use the navigation menu to explore different features
    
    For more information, check the individual repository README files.
    """)

if __name__ == "__main__":
    main()
