import { AnalysisResult, SentimentType } from "@/utils/sentimentAnalyzer";
import { ThumbsUp, ThumbsDown, Minus, TrendingUp, MessageCircle, BarChart3 } from "lucide-react";

interface SentimentResultProps {
  result: AnalysisResult;
}

const sentimentConfig: Record<SentimentType, {
  emoji: string;
  label: string;
  icon: typeof ThumbsUp;
  colorClass: string;
  bgClass: string;
}> = {
  positive: {
    emoji: "😊",
    label: "Positive",
    icon: ThumbsUp,
    colorClass: "text-positive",
    bgClass: "sentiment-positive"
  },
  neutral: {
    emoji: "😐",
    label: "Neutral",
    icon: Minus,
    colorClass: "text-neutral",
    bgClass: "sentiment-neutral"
  },
  negative: {
    emoji: "😞",
    label: "Negative",
    icon: ThumbsDown,
    colorClass: "text-negative",
    bgClass: "sentiment-negative"
  }
};

const SentimentResult = ({ result }: SentimentResultProps) => {
  const { summary, results, reviewCount, inputType } = result;
  const config = sentimentConfig[summary.dominantSentiment];
  const Icon = config.icon;

  const total = summary.positive + summary.neutral + summary.negative;
  const positivePercent = total > 0 ? (summary.positive / total) * 100 : 0;
  const neutralPercent = total > 0 ? (summary.neutral / total) * 100 : 0;
  const negativePercent = total > 0 ? (summary.negative / total) * 100 : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Main Sentiment Card */}
      <div className={`rounded-xl p-6 border-2 ${config.bgClass} animate-scale-in`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-5xl" role="img" aria-label={config.label}>
              {config.emoji}
            </span>
            <div>
              <h3 className="font-display text-2xl font-bold">
                {config.label} Sentiment
              </h3>
              <p className="text-sm opacity-80">
                {inputType === "text" 
                  ? "Based on text analysis" 
                  : `Based on ${reviewCount} reviews`}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 opacity-70" />
              <span className="font-display text-3xl font-bold">
                {Math.round(summary.averageConfidence * 100)}%
              </span>
            </div>
            <p className="text-sm opacity-70">Confidence</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Positive */}
        <div className="bg-card rounded-xl p-4 border border-border shadow-soft-sm card-hover">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-positive" />
              <span className="text-sm font-medium text-muted-foreground">Positive</span>
            </div>
            <span className="font-display font-bold text-positive">{summary.positive}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-positive rounded-full transition-all duration-700 ease-out"
              style={{ width: `${positivePercent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{Math.round(positivePercent)}%</p>
        </div>

        {/* Neutral */}
        <div className="bg-card rounded-xl p-4 border border-border shadow-soft-sm card-hover">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Minus className="w-4 h-4 text-neutral" />
              <span className="text-sm font-medium text-muted-foreground">Neutral</span>
            </div>
            <span className="font-display font-bold text-neutral">{summary.neutral}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-neutral rounded-full transition-all duration-700 ease-out"
              style={{ width: `${neutralPercent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{Math.round(neutralPercent)}%</p>
        </div>

        {/* Negative */}
        <div className="bg-card rounded-xl p-4 border border-border shadow-soft-sm card-hover">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <ThumbsDown className="w-4 h-4 text-negative" />
              <span className="text-sm font-medium text-muted-foreground">Negative</span>
            </div>
            <span className="font-display font-bold text-negative">{summary.negative}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-negative rounded-full transition-all duration-700 ease-out"
              style={{ width: `${negativePercent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{Math.round(negativePercent)}%</p>
        </div>
      </div>

      {/* Visual Bar Chart */}
      {total > 1 && (
        <div className="bg-card rounded-xl p-5 border border-border shadow-soft-sm">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h4 className="font-display font-semibold">Sentiment Distribution</h4>
          </div>
          <div className="h-8 rounded-lg overflow-hidden flex">
            {positivePercent > 0 && (
              <div 
                className="bg-positive flex items-center justify-center text-xs font-medium text-primary-foreground transition-all duration-700"
                style={{ width: `${positivePercent}%` }}
              >
                {positivePercent > 15 && `${Math.round(positivePercent)}%`}
              </div>
            )}
            {neutralPercent > 0 && (
              <div 
                className="bg-neutral flex items-center justify-center text-xs font-medium text-primary-foreground transition-all duration-700"
                style={{ width: `${neutralPercent}%` }}
              >
                {neutralPercent > 15 && `${Math.round(neutralPercent)}%`}
              </div>
            )}
            {negativePercent > 0 && (
              <div 
                className="bg-negative flex items-center justify-center text-xs font-medium text-primary-foreground transition-all duration-700"
                style={{ width: `${negativePercent}%` }}
              >
                {negativePercent > 15 && `${Math.round(negativePercent)}%`}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Individual Reviews */}
      {results.length > 1 && (
        <div className="bg-card rounded-xl p-5 border border-border shadow-soft-sm">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="w-5 h-5 text-primary" />
            <h4 className="font-display font-semibold">Analyzed Reviews</h4>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {results.map((review, index) => {
              const reviewConfig = sentimentConfig[review.sentiment];
              return (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="text-xl flex-shrink-0">{reviewConfig.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground line-clamp-2">{review.text}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs font-medium ${reviewConfig.colorClass}`}>
                        {reviewConfig.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        • {Math.round(review.confidence * 100)}% confidence
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SentimentResult;
