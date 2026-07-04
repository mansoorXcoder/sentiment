"""
Web Interface for Sentiment Analysis
Simple web interface for real-time sentiment prediction
"""

from flask import Flask, render_template, request, jsonify
import os
import json
from dynamic_prediction import SentimentPredictor

app = Flask(__name__)

# Initialize predictor
predictor = SentimentPredictor()

@app.route('/')
def index():
    """Main page"""
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    """API endpoint for sentiment prediction"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        model_name = data.get('model', None)
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        result = predictor.predict_sentiment(text, model_name)
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/models', methods=['GET'])
def get_models():
    """Get available models"""
    return jsonify(predictor.get_model_info())

@app.route('/batch_predict', methods=['POST'])
def batch_predict():
    """API endpoint for batch prediction"""
    try:
        data = request.get_json()
        texts = data.get('texts', [])
        model_name = data.get('model', None)
        
        if not texts:
            return jsonify({'error': 'No texts provided'}), 400
        
        results = predictor.predict_batch(texts, model_name)
        return jsonify({'results': results})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Create templates directory and HTML file
    os.makedirs('templates', exist_ok=True)
    
    html_content = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sentiment Analysis</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            text-align: center;
            margin-bottom: 30px;
        }
        .input-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #555;
        }
        textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            resize: vertical;
            min-height: 100px;
        }
        select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
        }
        button {
            background-color: #007bff;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            width: 100%;
        }
        button:hover {
            background-color: #0056b3;
        }
        .result {
            margin-top: 20px;
            padding: 15px;
            border-radius: 5px;
            display: none;
        }
        .result.positive {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
        }
        .result.neutral {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
        }
        .result.negative {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
        }
        .model-info {
            background-color: #e9ecef;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
            font-size: 14px;
        }
        .loading {
            text-align: center;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎭 Sentiment Analysis Tool</h1>
        
        <div class="model-info" id="modelInfo">
            Loading model information...
        </div>
        
        <form id="sentimentForm">
            <div class="input-group">
                <label for="textInput">Enter your text for sentiment analysis:</label>
                <textarea id="textInput" placeholder="Type your text here..." required></textarea>
            </div>
            
            <div class="input-group">
                <label for="modelSelect">Select Model (optional):</label>
                <select id="modelSelect">
                    <option value="">All Models</option>
                </select>
            </div>
            
            <button type="submit">Analyze Sentiment</button>
        </form>
        
        <div id="result" class="result"></div>
    </div>

    <script>
        // Load model information
        fetch('/models')
            .then(response => response.json())
            .then(data => {
                const modelInfo = document.getElementById('modelInfo');
                const modelSelect = document.getElementById('modelSelect');
                
                modelInfo.innerHTML = `Loaded ${data.model_count} models: ${data.loaded_models.join(', ')}`;
                
                data.loaded_models.forEach(model => {
                    const option = document.createElement('option');
                    option.value = model;
                    option.textContent = model;
                    modelSelect.appendChild(option);
                });
            })
            .catch(error => {
                document.getElementById('modelInfo').innerHTML = 'Error loading model information';
            });

        // Handle form submission
        document.getElementById('sentimentForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const text = document.getElementById('textInput').value;
            const model = document.getElementById('modelSelect').value;
            const resultDiv = document.getElementById('result');
            
            if (!text.trim()) {
                alert('Please enter some text to analyze.');
                return;
            }
            
            resultDiv.innerHTML = '<div class="loading">Analyzing sentiment...</div>';
            resultDiv.style.display = 'block';
            resultDiv.className = 'result';
            
            fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    model: model || null
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    resultDiv.innerHTML = `<strong>Error:</strong> ${data.error}`;
                    resultDiv.className = 'result';
                } else {
                    let html = '<h3>Analysis Results:</h3>';
                    html += `<p><strong>Original Text:</strong> "${data.text}"</p>`;
                    html += `<p><strong>Processed Text:</strong> "${data.processed_text}"</p>`;
                    html += '<h4>Predictions:</h4>';
                    
                    Object.entries(data.predictions).forEach(([modelName, prediction]) => {
                        if (prediction.error) {
                            html += `<p><strong>${modelName}:</strong> Error - ${prediction.error}</p>`;
                        } else {
                            const sentiment = prediction.sentiment;
                            const confidence = prediction.confidence;
                            html += `<p><strong>${modelName}:</strong> `;
                            html += `<span style="font-weight: bold; color: ${
                                sentiment === 'positive' ? 'green' : 
                                sentiment === 'negative' ? 'red' : 'orange'
                            }">${sentiment.toUpperCase()}</span>`;
                            
                            if (confidence) {
                                html += ` (Confidence: ${(confidence[sentiment] * 100).toFixed(1)}%)`;
                            }
                            html += '</p>';
                        }
                    });
                    
                    resultDiv.innerHTML = html;
                    
                    // Determine overall sentiment for styling
                    const sentiments = Object.values(data.predictions)
                        .filter(p => !p.error)
                        .map(p => p.sentiment);
                    
                    if (sentiments.length > 0) {
                        const mostCommon = sentiments.reduce((a, b, i, arr) => 
                            arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b
                        );
                        resultDiv.classList.add(mostCommon);
                    }
                }
            })
            .catch(error => {
                resultDiv.innerHTML = `<strong>Error:</strong> ${error.message}`;
                resultDiv.className = 'result';
            });
        });
    </script>
</body>
</html>
    """
    
    with open('templates/index.html', 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print("Starting web interface...")
    print("Open your browser and go to: http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
