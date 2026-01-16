import { ComparisonResult, AlgorithmType } from "@/utils/algorithms";
import { Trophy, Zap, Brain, Clock, ThumbsUp, ThumbsDown, Minus, Lightbulb, BarChart2 } from "lucide-react";
import { SentimentType } from "@/utils/sentimentAnalyzer";

interface AlgorithmComparisonProps {
  comparison: ComparisonResult;
  selectedAlgorithm: AlgorithmType;
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
    bgClass: "bg-positive-light"
  },
  neutral: {
    emoji: "😐",
    label: "Neutral",
    icon: Minus,
    colorClass: "text-neutral",
    bgClass: "bg-neutral-light"
  },
  negative: {
    emoji: "😞",
    label: "Negative",
    icon: ThumbsDown,
    colorClass: "text-negative",
    bgClass: "bg-negative-light"
  }
};

const speedIcons = {
  fast: <Zap className="w-3 h-3" />,
  medium: <Clock className="w-3 h-3" />,
  slow: <Brain className="w-3 h-3" />,
};

const AlgorithmComparison = ({ comparison, selectedAlgorithm }: AlgorithmComparisonProps) => {
  const { algorithmResults, bestAlgorithm, recommendation } = comparison;
  
  // Sort: selected first, then best, then others by confidence
  const sortedResults = [...algorithmResults].sort((a, b) => {
    if (a.algorithm.id === selectedAlgorithm) return -1;
    if (b.algorithm.id === selectedAlgorithm) return 1;
    if (a.algorithm.id === bestAlgorithm.id) return -1;
    if (b.algorithm.id === bestAlgorithm.id) return 1;
    return b.result.confidence - a.result.confidence;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Recommendation Banner */}
      <div className="bg-accent rounded-xl p-4 border border-primary/20 flex items-start gap-3 animate-scale-in">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-1">
            AI Recommendation
          </h4>
          <p className="text-sm text-muted-foreground">{recommendation}</p>
        </div>
      </div>

      {/* Comparison Header */}
      <div className="flex items-center gap-2">
        <BarChart2 className="w-5 h-5 text-primary" />
        <h3 className="font-display font-semibold text-foreground">
          All Algorithms Comparison
        </h3>
      </div>

      {/* Algorithm Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedResults.map((result, index) => {
          const isSelected = result.algorithm.id === selectedAlgorithm;
          const isBest = result.algorithm.id === bestAlgorithm.id;
          const config = sentimentConfig[result.result.sentiment];
          
          return (
            <div
              key={result.algorithm.id}
              className={`relative bg-card rounded-xl p-4 border-2 transition-all duration-300 animate-slide-up ${
                isSelected 
                  ? "border-primary shadow-soft-lg" 
                  : isBest 
                    ? "border-positive/50 shadow-soft-md" 
                    : "border-border shadow-soft-sm"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Badges */}
              <div className="absolute top-3 right-3 flex gap-1">
                {isSelected && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-medium">
                    Your Choice
                  </span>
                )}
                {isBest && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-positive text-primary-foreground font-medium flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    Best
                  </span>
                )}
              </div>

              {/* Algorithm Info */}
              <h4 className="font-display font-semibold text-foreground mb-1 pr-20">
                {result.algorithm.name}
              </h4>
              
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                <span>{result.algorithm.accuracy}% accuracy</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  {speedIcons[result.algorithm.speed]}
                  {result.processingTime}ms
                </span>
              </div>

              {/* Sentiment Result */}
              <div className={`rounded-lg p-3 ${config.bgClass} border border-current/10`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{config.emoji}</span>
                  <div>
                    <p className={`font-display font-bold ${config.colorClass}`}>
                      {config.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(result.result.confidence * 100)}% confidence
                    </p>
                  </div>
                </div>
              </div>

              {/* Confidence Bar */}
              <div className="mt-3">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      result.result.sentiment === "positive" 
                        ? "bg-positive" 
                        : result.result.sentiment === "negative"
                          ? "bg-negative"
                          : "bg-neutral"
                    }`}
                    style={{ width: `${result.result.confidence * 100}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="bg-card rounded-xl p-5 border border-border shadow-soft-sm">
        <h4 className="font-display font-semibold text-foreground mb-4">
          Analysis Summary
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-display font-bold text-foreground">
              {algorithmResults.length}
            </p>
            <p className="text-xs text-muted-foreground">Algorithms</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-display font-bold text-positive">
              {algorithmResults.filter(r => r.result.sentiment === "positive").length}
            </p>
            <p className="text-xs text-muted-foreground">Said Positive</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-display font-bold text-neutral">
              {algorithmResults.filter(r => r.result.sentiment === "neutral").length}
            </p>
            <p className="text-xs text-muted-foreground">Said Neutral</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-display font-bold text-negative">
              {algorithmResults.filter(r => r.result.sentiment === "negative").length}
            </p>
            <p className="text-xs text-muted-foreground">Said Negative</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmComparison;
