# Sentiment Analysis Web Interface

A modern, fast, and interactive web application designed to analyze customer sentiments from raw text or e-commerce product links (Amazon and Flipkart). This application also includes a dedicated tool to compare different sentiment analysis algorithms side-by-side.

## Features

- **Text Sentiment Analysis:** Type or paste arbitrary text or reviews to instantly analyze the underlying sentiment (Positive, Neutral, Negative).
- **Product Link Analysis:** Enter Amazon or Flipkart product URLs to simulate sentiment analysis on accumulated customer reviews.
- **Algorithm Comparison:** Choose and compare various sentiment analysis algorithms (e.g., Naive Bayes, BERT, VADER, RoBERTa) to determine the best performer.
- **Interactive UI:** Built with an intuitive, responsive, and beautiful interface powered by Tailwind CSS and Radix UI components.

## Technologies Used

- **Frontend Framework:** React 18, Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **State Management & Queries:** TanStack React Query
- **Routing:** React Router DOM (v6)
- **Icons:** Lucide React

## Setup Instructions

This project is a modern web application leveraging Node.js. 

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- npm (comes with Node.js)

### Installation

1. Navigate to the project directory:
   ```bash
   cd SentimentAnalysis
   ```

2. Install the necessary dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:8080` (or the port specified in your terminal output) to view the application.

## Build for Production

To create an optimized production-ready bundle, run:
```bash
npm run build
```
The compiled assets will be placed into the `dist` directory. You can preview the production build using:
```bash
npm run preview
```

## Note on "Requirements"
Because this project runs entirely within the Node ecosystem (using Vite/React), dependencies are managed through `package.json` rather than a Python `requirements.txt`. All required libraries will be automatically installed when you run `npm install`.
