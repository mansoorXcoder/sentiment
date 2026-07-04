from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import os
from typing import Optional, List, Dict, Any


class PredictRequest(BaseModel):
    text: str
    model: Optional[str] = None


def load_models(models_dir: str = "./models"):
    vectorizer = None
    models = {}
    vectorizer_path = os.path.join(models_dir, "tfidf_vectorizer.pkl")
    if os.path.exists(vectorizer_path):
        vectorizer = joblib.load(vectorizer_path)

    model_files = {
        "Logistic Regression": "logistic_regression.pkl",
        "Naive Bayes": "naive_bayes.pkl",
        "SVM": "svm.pkl",
        "Neural Network": "neural_network.pkl",
    }

    for name, file in model_files.items():
        path = os.path.join(models_dir, file)
        if os.path.exists(path):
            models[name] = joblib.load(path)

    return vectorizer, models


app = FastAPI(title="Sentiment Analysis API")
VECTORIZER, MODELS = load_models()


@app.get("/health")
def health() -> Dict[str, Any]:
    return {
        "status": "ok",
        "vectorizer_loaded": VECTORIZER is not None,
        "models_loaded": list(MODELS.keys()),
    }


@app.get("/models")
def models() -> Dict[str, Any]:
    return {"models": list(MODELS.keys())}


def preprocess_text(text: str) -> str:
    import re
    text = str(text)
    text = re.sub(r"http\S+|www\S+|https\S+", "", text)
    text = re.sub(r"\S+@\S+", "", text)
    text = re.sub(r"[^a-zA-Z\s]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text.lower()


@app.post("/predict")
def predict(req: PredictRequest) -> Dict[str, Any]:
    if VECTORIZER is None or not MODELS:
        return {"error": "Models not loaded"}

    processed = preprocess_text(req.text)
    if not processed:
        return {"error": "Empty text"}

    X = VECTORIZER.transform([processed])

    targets = {req.model: MODELS.get(req.model)} if req.model and req.model in MODELS else MODELS
    results = {}
    for name, model in targets.items():
        try:
            pred = int(model.predict(X)[0])
            proba = None
            if hasattr(model, "predict_proba"):
                p = model.predict_proba(X)[0]
                proba = {
                    "negative": float(p[0]) if len(p) > 0 else 0.0,
                    "neutral": float(p[1]) if len(p) > 1 else 0.0,
                    "positive": float(p[2]) if len(p) > 2 else 0.0,
                }
            label = {-1: "negative", 0: "neutral", 1: "positive"}.get(pred, "unknown")
            results[name] = {"sentiment": label, "confidence": proba, "raw_prediction": pred}
        except Exception as e:
            results[name] = {"error": str(e)}

    return {"text": req.text, "processed_text": processed, "predictions": results}


