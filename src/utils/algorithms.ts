import { SentimentType, SentimentResult } from "./sentimentAnalyzer";

export type AlgorithmType = "neural-network" | "svm" | "naive-bayes" | "logistic-regression";

export interface AlgorithmInfo {
  id: AlgorithmType;
  name: string;
  description: string;
  accuracy: number; // Simulated accuracy for demo
  speed: "fast" | "medium" | "slow";
}

export interface AlgorithmResult {
  algorithm: AlgorithmInfo;
  result: SentimentResult;
  processingTime: number; // in ms
}

export interface ComparisonResult {
  input: string;
  algorithmResults: AlgorithmResult[];
  bestAlgorithm: AlgorithmInfo;
  recommendation: string;
}

export const algorithms: AlgorithmInfo[] = [
  {
    id: "neural-network",
    name: "Neural Network",
    description: "Deep learning model with multiple hidden layers for pattern recognition",
    accuracy: 89,
    speed: "slow",
  },
  {
    id: "svm",
    name: "SVM",
    description: "Support Vector Machine - finds optimal hyperplane for classification",
    accuracy: 84,
    speed: "medium",
  },
  {
    id: "naive-bayes",
    name: "Naïve Bayes",
    description: "Probabilistic classifier based on Bayes' theorem with independence assumption",
    accuracy: 78,
    speed: "fast",
  },
  {
    id: "logistic-regression",
    name: "Logistic Regression",
    description: "Statistical model using sigmoid function for binary/multi-class classification",
    accuracy: 81,
    speed: "fast",
  },
];

// Word lists for analysis
const positiveWords = [
  "good", "great", "excellent", "amazing", "wonderful", "fantastic", "awesome",
  "love", "loved", "loving", "best", "perfect", "happy", "satisfied", "recommend",
  "quality", "beautiful", "nice", "superb", "brilliant", "outstanding", "incredible",
  "delighted", "pleased", "impressive", "exceptional", "reliable", "worth", "valuable"
];

const negativeWords = [
  "bad", "terrible", "horrible", "awful", "worst", "poor", "hate", "hated",
  "disappointed", "disappointing", "useless", "broken", "defective", "waste",
  "cheap", "fake", "scam", "fraud", "never", "worst", "regret", "return",
  "refund", "damaged", "faulty", "unreliable", "overpriced", "slow", "fail"
];

const neutralIndicators = [
  "okay", "ok", "average", "normal", "fine", "decent", "acceptable", "moderate"
];

// Intensifiers and negations for VADER-like analysis
const intensifiers = ["very", "really", "extremely", "absolutely", "totally", "highly"];
const negations = ["not", "no", "never", "neither", "none", "nobody", "nothing"];

// Neural Network simulation - uses weighted features and activation functions
function neuralNetworkAnalysis(text: string): { sentiment: SentimentType; confidence: number } {
  const words = text.toLowerCase().split(/\s+/);
  
  // Simulate input layer
  let inputFeatures = {
    positiveCount: 0,
    negativeCount: 0,
    neutralCount: 0,
    wordCount: words.length,
    hasExclamation: text.includes("!"),
    hasQuestion: text.includes("?"),
  };
  
  words.forEach(word => {
    const cleanWord = word.replace(/[^a-z]/g, "");
    if (positiveWords.includes(cleanWord)) inputFeatures.positiveCount++;
    if (negativeWords.includes(cleanWord)) inputFeatures.negativeCount++;
    if (neutralIndicators.includes(cleanWord)) inputFeatures.neutralCount++;
  });
  
  // Simulate hidden layer with ReLU activation
  const hiddenLayer = [
    Math.max(0, inputFeatures.positiveCount * 0.8 - inputFeatures.negativeCount * 0.3),
    Math.max(0, inputFeatures.negativeCount * 0.8 - inputFeatures.positiveCount * 0.3),
    Math.max(0, inputFeatures.neutralCount * 0.5 + (inputFeatures.hasExclamation ? 0.2 : 0)),
  ];
  
  // Simulate output layer with softmax-like normalization
  const outputSum = hiddenLayer[0] + hiddenLayer[1] + hiddenLayer[2] + 0.1;
  const outputs = {
    positive: hiddenLayer[0] / outputSum,
    negative: hiddenLayer[1] / outputSum,
    neutral: hiddenLayer[2] / outputSum + 0.3,
  };
  
  let sentiment: SentimentType;
  let maxOutput = Math.max(outputs.positive, outputs.negative, outputs.neutral);
  
  if (outputs.positive === maxOutput && inputFeatures.positiveCount > 0) {
    sentiment = "positive";
  } else if (outputs.negative === maxOutput && inputFeatures.negativeCount > 0) {
    sentiment = "negative";
  } else {
    sentiment = "neutral";
  }
  
  const confidence = Math.min(0.96, 0.6 + maxOutput * 0.35);
  return { sentiment, confidence };
}

// SVM simulation - uses margin-based classification
function svmAnalysis(text: string): { sentiment: SentimentType; confidence: number } {
  const words = text.toLowerCase().split(/\s+/);
  
  // Create feature vector
  let featureVector = 0;
  let intensity = 0;
  
  words.forEach((word, index) => {
    const cleanWord = word.replace(/[^a-z]/g, "");
    
    // Weight by position (words at beginning/end often more important)
    const positionWeight = index < 3 || index > words.length - 3 ? 1.3 : 1.0;
    
    if (positiveWords.includes(cleanWord)) {
      featureVector += 1 * positionWeight;
      intensity += 1;
    }
    if (negativeWords.includes(cleanWord)) {
      featureVector -= 1 * positionWeight;
      intensity += 1;
    }
    
    // Check for intensifiers
    if (intensifiers.includes(cleanWord)) {
      intensity += 0.5;
    }
  });
  
  // SVM decision boundary simulation
  const margin = Math.abs(featureVector);
  
  let sentiment: SentimentType;
  if (featureVector > 0.5) {
    sentiment = "positive";
  } else if (featureVector < -0.5) {
    sentiment = "negative";
  } else {
    sentiment = "neutral";
  }
  
  // Confidence based on distance from decision boundary
  const confidence = Math.min(0.94, 0.55 + margin * 0.15 + intensity * 0.05);
  return { sentiment, confidence };
}

// Naive Bayes - probabilistic classification
function naiveBayesAnalysis(text: string): { sentiment: SentimentType; confidence: number } {
  const words = text.toLowerCase().split(/\s+/);
  
  // Prior probabilities
  const priorPositive = 0.33;
  const priorNeutral = 0.34;
  const priorNegative = 0.33;
  
  let logProbPositive = Math.log(priorPositive);
  let logProbNeutral = Math.log(priorNeutral);
  let logProbNegative = Math.log(priorNegative);
  
  words.forEach(word => {
    const cleanWord = word.replace(/[^a-z]/g, "");
    
    // Likelihood P(word|class)
    if (positiveWords.includes(cleanWord)) {
      logProbPositive += Math.log(0.7);
      logProbNeutral += Math.log(0.15);
      logProbNegative += Math.log(0.15);
    } else if (negativeWords.includes(cleanWord)) {
      logProbPositive += Math.log(0.15);
      logProbNeutral += Math.log(0.15);
      logProbNegative += Math.log(0.7);
    } else if (neutralIndicators.includes(cleanWord)) {
      logProbPositive += Math.log(0.2);
      logProbNeutral += Math.log(0.6);
      logProbNegative += Math.log(0.2);
    }
  });
  
  const maxProb = Math.max(logProbPositive, logProbNeutral, logProbNegative);
  let sentiment: SentimentType;
  
  if (maxProb === logProbPositive) {
    sentiment = "positive";
  } else if (maxProb === logProbNegative) {
    sentiment = "negative";
  } else {
    sentiment = "neutral";
  }
  
  // Normalize for confidence
  const total = Math.exp(logProbPositive) + Math.exp(logProbNeutral) + Math.exp(logProbNegative);
  const confidence = Math.min(0.92, 0.55 + Math.exp(maxProb) / total * 0.4);
  
  return { sentiment, confidence };
}

// Logistic Regression - sigmoid-based classification
function logisticRegressionAnalysis(text: string): { sentiment: SentimentType; confidence: number } {
  const words = text.toLowerCase().split(/\s+/);
  
  // Feature extraction with weights
  let positiveScore = 0;
  let negativeScore = 0;
  
  const weights = {
    positive: 0.8,
    negative: -0.8,
    neutral: 0.1,
    intensifier: 0.3,
    negation: -0.5,
  };
  
  let prevWord = "";
  
  words.forEach(word => {
    const cleanWord = word.replace(/[^a-z]/g, "");
    let wordWeight = 0;
    
    if (positiveWords.includes(cleanWord)) {
      wordWeight = weights.positive;
    } else if (negativeWords.includes(cleanWord)) {
      wordWeight = weights.negative;
    } else if (neutralIndicators.includes(cleanWord)) {
      wordWeight = weights.neutral;
    }
    
    // Apply negation
    if (negations.includes(prevWord)) {
      wordWeight *= -0.8;
    }
    
    // Apply intensifier
    if (intensifiers.includes(prevWord)) {
      wordWeight *= 1.4;
    }
    
    if (wordWeight > 0) positiveScore += wordWeight;
    else negativeScore += Math.abs(wordWeight);
    
    prevWord = cleanWord;
  });
  
  // Sigmoid function simulation
  const z = positiveScore - negativeScore;
  const sigmoid = 1 / (1 + Math.exp(-z));
  
  let sentiment: SentimentType;
  if (sigmoid > 0.6) {
    sentiment = "positive";
  } else if (sigmoid < 0.4) {
    sentiment = "negative";
  } else {
    sentiment = "neutral";
  }
  
  const confidence = Math.min(0.93, 0.5 + Math.abs(sigmoid - 0.5) * 0.8);
  return { sentiment, confidence };
}

function bertAnalysis(text: string): { sentiment: SentimentType; confidence: number } {
  // Simulated BERT-like analysis with higher accuracy
  const words = text.toLowerCase().split(/\s+/);
  
  let contextScore = 0;
  const contextWindow: string[] = [];
  
  words.forEach(word => {
    const cleanWord = word.replace(/[^a-z]/g, "");
    contextWindow.push(cleanWord);
    
    // Simulate contextual understanding
    if (contextWindow.length > 3) {
      contextWindow.shift();
    }
    
    let wordScore = 0;
    
    if (positiveWords.includes(cleanWord)) wordScore = 1;
    if (negativeWords.includes(cleanWord)) wordScore = -1;
    
    // Check context for negations
    if (contextWindow.some(w => negations.includes(w)) && wordScore !== 0) {
      wordScore *= -0.9;
    }
    
    // Check for intensifiers in context
    if (contextWindow.some(w => intensifiers.includes(w))) {
      wordScore *= 1.3;
    }
    
    contextScore += wordScore;
  });
  
  let sentiment: SentimentType;
  if (contextScore > 0.5) {
    sentiment = "positive";
  } else if (contextScore < -0.5) {
    sentiment = "negative";
  } else {
    sentiment = "neutral";
  }
  
  // BERT has higher confidence due to contextual understanding
  const confidence = Math.min(0.97, 0.7 + Math.abs(contextScore) * 0.1);
  
  return { sentiment, confidence };
}

export function analyzeWithAlgorithm(text: string, algorithmId: AlgorithmType): { sentiment: SentimentType; confidence: number } {
  switch (algorithmId) {
    case "neural-network":
      return neuralNetworkAnalysis(text);
    case "svm":
      return svmAnalysis(text);
    case "naive-bayes":
      return naiveBayesAnalysis(text);
    case "logistic-regression":
      return logisticRegressionAnalysis(text);
    default:
      return naiveBayesAnalysis(text);
  }
}

export async function compareAlgorithms(text: string, selectedAlgorithm: AlgorithmType): Promise<ComparisonResult> {
  const algorithmResults: AlgorithmResult[] = [];
  
  for (const algo of algorithms) {
    const startTime = performance.now();
    
    // Simulate processing delay based on speed
    let delay = 100;
    if (algo.speed === "medium") delay = 300;
    if (algo.speed === "slow") delay = 600;
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    const { sentiment, confidence } = analyzeWithAlgorithm(text, algo.id);
    const endTime = performance.now();
    
    algorithmResults.push({
      algorithm: algo,
      result: {
        sentiment,
        confidence,
        text,
      },
      processingTime: Math.round(endTime - startTime),
    });
  }
  
  // Determine best algorithm based on confidence and accuracy
  const selectedResult = algorithmResults.find(r => r.algorithm.id === selectedAlgorithm);
  
  // Calculate weighted scores
  const scoredResults = algorithmResults.map(r => ({
    ...r,
    score: r.result.confidence * 0.6 + (r.algorithm.accuracy / 100) * 0.4,
  }));
  
  const bestResult = scoredResults.reduce((best, current) => 
    current.score > best.score ? current : best
  );
  
  // Generate recommendation
  let recommendation = "";
  
  if (selectedResult && bestResult.algorithm.id === selectedAlgorithm) {
    recommendation = `Great choice! ${selectedResult.algorithm.name} performed best with ${Math.round(selectedResult.result.confidence * 100)}% confidence.`;
  } else if (selectedResult) {
    const selectedConfidence = Math.round(selectedResult.result.confidence * 100);
    const bestConfidence = Math.round(bestResult.result.confidence * 100);
    
    if (bestConfidence - selectedConfidence > 5) {
      recommendation = `Your choice (${selectedResult.algorithm.name}) gave ${selectedConfidence}% confidence. Consider using ${bestResult.algorithm.name} for ${bestConfidence}% confidence and ${bestResult.algorithm.accuracy}% typical accuracy.`;
    } else {
      recommendation = `${selectedResult.algorithm.name} performed well! ${bestResult.algorithm.name} scored slightly higher but both are good choices.`;
    }
  }
  
  return {
    input: text,
    algorithmResults,
    bestAlgorithm: bestResult.algorithm,
    recommendation,
  };
}
