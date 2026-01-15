export type SentimentType = "positive" | "neutral" | "negative";

export interface SentimentResult {
  sentiment: SentimentType;
  confidence: number;
  text: string;
}

export interface AnalysisResult {
  inputType: "text" | "amazon" | "flipkart";
  results: SentimentResult[];
  summary: {
    positive: number;
    neutral: number;
    negative: number;
    averageConfidence: number;
    dominantSentiment: SentimentType;
  };
  reviewCount: number;
  error?: string;
}

// Positive and negative word lists for simple sentiment analysis
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

// Detect input type
export function detectInputType(input: string): "text" | "amazon" | "flipkart" | "invalid" {
  const trimmedInput = input.trim().toLowerCase();
  
  // Check for Amazon URLs
  if (
    trimmedInput.includes("amazon.") ||
    trimmedInput.includes("amzn.to") ||
    trimmedInput.includes("a.co")
  ) {
    return "amazon";
  }
  
  // Check for Flipkart URLs
  if (
    trimmedInput.includes("flipkart.") ||
    trimmedInput.includes("fkrt.it")
  ) {
    return "flipkart";
  }
  
  // Check if it looks like a URL but not supported
  if (trimmedInput.startsWith("http://") || trimmedInput.startsWith("https://")) {
    return "invalid";
  }
  
  // Otherwise, treat as text
  return "text";
}

// Simple sentiment analysis for text
function analyzeTextSentiment(text: string): SentimentResult {
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
    confidence = Math.min(0.95, 0.5 + (positiveScore / (totalScore * 2)));
  } else if (negativeScore > positiveScore && negativeScore > neutralScore) {
    sentiment = "negative";
    confidence = Math.min(0.95, 0.5 + (negativeScore / (totalScore * 2)));
  } else {
    sentiment = "neutral";
    confidence = Math.min(0.9, 0.4 + (neutralScore / (totalScore * 2)));
  }
  
  return { sentiment, confidence, text };
}

// Mock reviews for simulation
const mockReviews = {
  positive: [
    "Absolutely love this product! Best purchase I've made this year.",
    "Excellent quality, highly recommend to everyone.",
    "Amazing value for money, very satisfied with my purchase.",
    "Great product, exactly as described. Very happy!",
    "Superb quality and fast delivery. Will buy again!"
  ],
  neutral: [
    "It's okay, does what it's supposed to do.",
    "Average product, nothing special but works fine.",
    "Decent quality for the price. Acceptable.",
    "Normal product, meets basic expectations.",
    "Fine for everyday use, nothing extraordinary."
  ],
  negative: [
    "Very disappointed with the quality. Not worth it.",
    "Terrible product, broke after one week of use.",
    "Waste of money, would not recommend to anyone.",
    "Poor quality and bad customer service.",
    "Defective item received, very frustrating experience."
  ]
};

// Simulate fetching reviews from e-commerce sites
function simulateReviewFetch(): SentimentResult[] {
  const reviews: SentimentResult[] = [];
  
  // Generate random mix of reviews
  const positiveCount = Math.floor(Math.random() * 4) + 2;
  const neutralCount = Math.floor(Math.random() * 3) + 1;
  const negativeCount = Math.floor(Math.random() * 3) + 1;
  
  for (let i = 0; i < positiveCount; i++) {
    const text = mockReviews.positive[Math.floor(Math.random() * mockReviews.positive.length)];
    reviews.push({
      sentiment: "positive",
      confidence: 0.75 + Math.random() * 0.2,
      text
    });
  }
  
  for (let i = 0; i < neutralCount; i++) {
    const text = mockReviews.neutral[Math.floor(Math.random() * mockReviews.neutral.length)];
    reviews.push({
      sentiment: "neutral",
      confidence: 0.55 + Math.random() * 0.25,
      text
    });
  }
  
  for (let i = 0; i < negativeCount; i++) {
    const text = mockReviews.negative[Math.floor(Math.random() * mockReviews.negative.length)];
    reviews.push({
      sentiment: "negative",
      confidence: 0.7 + Math.random() * 0.2,
      text
    });
  }
  
  // Shuffle reviews
  return reviews.sort(() => Math.random() - 0.5);
}

// Main analysis function
export async function analyzeSentiment(input: string): Promise<AnalysisResult> {
  const inputType = detectInputType(input);
  
  // Handle invalid URLs
  if (inputType === "invalid") {
    return {
      inputType: "text",
      results: [],
      summary: {
        positive: 0,
        neutral: 0,
        negative: 0,
        averageConfidence: 0,
        dominantSentiment: "neutral"
      },
      reviewCount: 0,
      error: "Unable to fetch reviews from this link. Please check the URL or try manual text input."
    };
  }
  
  let results: SentimentResult[];
  
  if (inputType === "text") {
    // Analyze provided text
    const result = analyzeTextSentiment(input);
    results = [result];
  } else {
    // Simulate fetching reviews from e-commerce sites
    // Add artificial delay to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 10% chance of simulating a fetch failure
    if (Math.random() < 0.1) {
      return {
        inputType,
        results: [],
        summary: {
          positive: 0,
          neutral: 0,
          negative: 0,
          averageConfidence: 0,
          dominantSentiment: "neutral"
        },
        reviewCount: 0,
        error: "Unable to fetch reviews from this link. Please check the URL or try manual text input."
      };
    }
    
    results = simulateReviewFetch();
  }
  
  // Calculate summary
  const positive = results.filter(r => r.sentiment === "positive").length;
  const neutral = results.filter(r => r.sentiment === "neutral").length;
  const negative = results.filter(r => r.sentiment === "negative").length;
  
  const averageConfidence = results.length > 0
    ? results.reduce((sum, r) => sum + r.confidence, 0) / results.length
    : 0;
  
  let dominantSentiment: SentimentType;
  if (positive >= neutral && positive >= negative) {
    dominantSentiment = "positive";
  } else if (negative >= positive && negative >= neutral) {
    dominantSentiment = "negative";
  } else {
    dominantSentiment = "neutral";
  }
  
  return {
    inputType: inputType === "text" ? "text" : inputType,
    results,
    summary: {
      positive,
      neutral,
      negative,
      averageConfidence,
      dominantSentiment
    },
    reviewCount: results.length
  };
}
