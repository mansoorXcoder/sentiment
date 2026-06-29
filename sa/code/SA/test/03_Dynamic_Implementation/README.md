# Dynamic Implementation Repository

This repository contains the real-time sentiment prediction system.

## Overview
This phase implements the dynamic prediction system for:
- Real-time sentiment analysis
- User input processing
- Model loading and prediction
- Feedback collection for retraining

## Files
- `dynamic_prediction.py` - Real-time prediction system
- `web_interface.py` - Web-based user interface
- `api_server.py` - REST API server
- `requirements.txt` - Python dependencies
- `models/` - Pre-trained models (copy from Static Implementation)

## Features
- **Real-time Prediction**: Analyze sentiment of user input
- **Multiple Input Methods**: Text input, file upload
- **Model Selection**: Choose from different trained models
- **Feedback Collection**: Store user feedback for model improvement
- **Web Interface**: User-friendly web interface
- **API Endpoints**: REST API for integration

## Prerequisites
- Trained models from Static Implementation repository
- Preprocessed data pipeline

## Usage

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run Web Interface**:
   ```bash
   python web_interface.py
   ```

3. **Run API Server**:
   ```bash
   python api_server.py
   ```

## API Endpoints
- `POST /predict` - Predict sentiment of text
- `POST /upload` - Upload file for batch prediction
- `GET /models` - List available models
- `POST /feedback` - Submit feedback for retraining

## Next Steps
After dynamic implementation, move to the **Visualization & UI** repository for advanced visualizations.
