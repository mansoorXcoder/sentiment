# SentiMeter - Sentiment Analysis Workbench

A modern, fast, and interactive web application designed to analyze customer sentiments from raw text or simulated e-commerce product links (Amazon and Flipkart). SentiMeter also features an analytics workbench to compare different sentiment analysis algorithms side-by-side.

---

## 🚀 Features

- **Text Sentiment Analysis:** Paste review texts to instantly detect the underlying sentiment (Positive, Neutral, or Negative) with confidence grading.
- **Product Link Simulator:** Parse Amazon and Flipkart product links to simulate review retrieval and aggregate sentiment distribution.
- **Algorithm Comparison Workbench:** Compare custom classification algorithms side-by-side:
  - **Neural Network:** Deep learning model with simulated multilayer feature weights.
  - **Support Vector Machine (SVM):** Margin-based classification based on feature vectors.
  - **Naïve Bayes:** Probabilistic classifier leveraging prior and likelihood calculations.
  - **Logistic Regression:** Sigmoid classification with negation and intensifier scaling.
- **Aesthetic UI:** Premium, responsive dashboard built with a dark mode glassmorphism theme, smooth animations, and interactive charts.

---

## 🛠️ Tech Stack

- **Frontend & Router:** React 18, TypeScript, React Router DOM v6
- **Build Tool:** Vite
- **Styling:** Tailwind CSS, shadcn/ui
- **Network & State:** TanStack React Query v5
- **Icons & Charts:** Lucide React, Recharts

---

## 📦 Setup & Installation

Follow these steps to run SentiMeter locally:

### 1. Install Node.js
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher recommended) installed.

### 2. Install Project Dependencies
Run the command below in the project root to install the necessary npm packges:
```bash
npm install
```

### 3. Run Development Server
Start the local server with hot reload:
```bash
npm run dev
```
Open your browser of choice and go to **`http://localhost:8080`** (or the port shown in your terminal).

---

## 📦 Production Build

To compile a highly optimized bundle for production:
```bash
npm run build
```
Once the build completes, the compiled files will be located in the `dist` directory. You can preview the production bundle via:
```bash
npm run preview
```

---

## 💡 Notes on Project Files

- **`package.json`**: Standard configuration file managing all node dependencies for running the React app.
- **`requirements.txt`**: Added to document client-side npm equivalent packages alongside a reference list of Python libraries (e.g., FastAPI, uvicorn, PyTorch, Transformers) should you want to migrate to a real Python-based Machine Learning backend.
- **`favicon.svg`**: A custom, lightweight SVG favicon reflecting the SentiMeter branding.
