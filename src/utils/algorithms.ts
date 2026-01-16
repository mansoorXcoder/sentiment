import { SentimentType, SentimentResult } from "./sentimentAnalyzer";

export type AlgorithmType = "lexicon" | "naive-bayes" | "vader" | "textblob" | "bert";

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
    id: "lexicon",
    name: "Lexicon-Based",
    description: "Simple word matching using positive/negative word lists",
    accuracy: 68,
    speed: "fast",
  },
  {
    id: "naive-bayes",
    name: "Naive Bayes",
    description: "Probabilistic classifier based on word frequencies",
    accuracy: 76,
    speed: "fast",
  },
  {
    id: "vader",
    name: "VADER",
    description: "Rule-based model tuned for social media sentiment",
    accuracy: 82,
    speed: "fast",
  },
  {
    id: "textblob",
    name: "TextBlob",
    description: "Pattern-based sentiment analysis library",
    accuracy: 74,
    speed: "medium",
  },
  {
    id: "bert",
    name: "BERT Transformer",
    description: "Deep learning model with contextual understanding",
    accuracy: 91,
    speed: "slow",
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

function lexiconAnalysis(text: string): { sentiment: SentimentType; confidence: number } {
  const words = text.toLowerCase().split(/\s+/);
  
  let positiveScore = 0;
  let negativeScore = 0;
  let neutralScore = 0;
  
  words.forEach(word => {
    const cleanWord = word.replace(/[^a-z]/g, "");
    if (positiveWords.includes(cleanWord)) positiveScore++;
    if (negativeWords.includes(cleanWord)) negativeScore++;
    if (neutralIndicators.includes(cleanWord)) neutralScore++;
  });
  
  const totalScore = positiveScore + negativeScore + neutralScore;
  
  let sentiment: SentimentType;
  let confidence: number;
  
  if (totalScore === 0) {
    sentiment = "neutral";
    confidence = 0.5;
  } else if (positiveScore > negativeScore && positiveScore > neutralScore) {
    sentiment = "positive";
    confidence = Math.min(0.92, 0.55 + (positiveScore / (totalScore * 2)));
  } else if (negativeScore > positiveScore && negativeScore > neutralScore) {
    sentiment = "negative";
    confidence = Math.min(0.92, 0.55 + (negativeScore / (totalScore * 2)));
  } else {
    sentiment = "neutral";
    confidence = Math.min(0.85, 0.45 + (neutralScore / (totalScore * 2)));
  }
  
  return { sentiment, confidence };
}

function naiveBayesAnalysis(text: string): { sentiment: SentimentType; confidence: number } {
  const words = text.toLowerCase().split(/\s+/);
  
  // Simulated prior probabilities
  const priorPositive = 0.33;
  const priorNeutral = 0.34;
  const priorNegative = 0.33;
  
  let logProbPositive = Math.log(priorPositive);
  let logProbNeutral = Math.log(priorNeutral);
  let logProbNegative = Math.log(priorNegative);
  
  words.forEach(word => {
    const cleanWord = word.replace(/[^a-z]/g, "");
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
  const confidence = Math.min(0.94, 0.55 + Math.exp(maxProb) / total * 0.4);
  
  return { sentiment, confidence };
}

function vaderAnalysis(text: string): { sentiment: SentimentType; confidence: number } {
  const words = text.toLowerCase().split(/\s+/);
  
  let compoundScore = 0;
  let prevWord = "";
  
  words.forEach(word => {
    const cleanWord = word.replace(/[^a-z]/g, "");
    let wordScore = 0;
    
    if (positiveWords.includes(cleanWord)) wordScore = 1;
    if (negativeWords.includes(cleanWord)) wordScore = -1;
    if (neutralIndicators.includes(cleanWord)) wordScore = 0;
    
    // Check for intensifiers
    if (intensifiers.includes(prevWord)) {
      wordScore *= 1.5;
    }
    
    // Check for negations
    if (negations.includes(prevWord)) {
      wordScore *= -0.75;
    }
    
    // Check for exclamation marks
    if (word.includes("!")) {
      wordScore *= 1.2;
    }
    
    compoundScore += wordScore;
    prevWord = cleanWord;
  });
  
  // Normalize compound score
  const normalizedScore = compoundScore / Math.sqrt(compoundScore * compoundScore + 15);
  
  let sentiment: SentimentType;
  if (normalizedScore >= 0.05) {
    sentiment = "positive";
  } else if (normalizedScore <= -0.05) {
    sentiment = "negative";
  } else {
    sentiment = "neutral";
  }
  
  const confidence = Math.min(0.95, 0.6 + Math.abs(normalizedScore) * 0.35);
  
  return { sentiment, confidence };
}

function textBlobAnalysis(text: string): { sentiment: SentimentType; confidence: number } {
  const words = text.toLowerCase().split(/\s+/);
  
  let polarity = 0;
  let subjectivity = 0;
  let wordCount = 0;
  
  words.forEach(word => {
    const cleanWord = word.replace(/[^a-z]/g, "");
    if (positiveWords.includes(cleanWord)) {
      polarity += 0.5;
      subjectivity += 0.6;
      wordCount++;
    } else if (negativeWords.includes(cleanWord)) {
      polarity -= 0.5;
      subjectivity += 0.6;
      wordCount++;
    } else if (neutralIndicators.includes(cleanWord)) {
      polarity += 0.1;
      subjectivity += 0.3;
      wordCount++;
    }
  });
  
  if (wordCount > 0) {
    polarity /= wordCount;
    subjectivity /= wordCount;
  }
  
  let sentiment: SentimentType;
  if (polarity > 0.1) {
    sentiment = "positive";
  } else if (polarity < -0.1) {
    sentiment = "negative";
  } else {
    sentiment = "neutral";
  }
  
  const confidence = Math.min(0.93, 0.55 + Math.abs(polarity) * 0.4 + subjectivity * 0.1);
  
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
    case "lexicon":
      return lexiconAnalysis(text);
    case "naive-bayes":
      return naiveBayesAnalysis(text);
    case "vader":
      return vaderAnalysis(text);
    case "textblob":
      return textBlobAnalysis(text);
    case "bert":
      return bertAnalysis(text);
    default:
      return lexiconAnalysis(text);
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
