import { useState } from "react";
import { Search, Link2, FileText, Loader2, AlertCircle, Sparkles, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeSentiment, detectInputType, AnalysisResult } from "@/utils/sentimentAnalyzer";
import { AlgorithmType, compareAlgorithms, ComparisonResult } from "@/utils/algorithms";
import SentimentResult from "@/components/SentimentResult";
import AlgorithmSelector from "@/components/AlgorithmSelector";
import AlgorithmComparison from "@/components/AlgorithmComparison";

const Analyze = () => {
  const [input, setInput] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const inputType = input.trim() ? detectInputType(input) : null;

  const getInputTypeLabel = () => {
    if (!inputType) return null;
    switch (inputType) {
      case "amazon":
        return { icon: Link2, label: "Amazon Product Link", color: "text-orange-500" };
      case "flipkart":
        return { icon: Link2, label: "Flipkart Product Link", color: "text-blue-500" };
      case "text":
        return { icon: FileText, label: "Text Input", color: "text-primary" };
      case "invalid":
        return { icon: AlertCircle, label: "Unsupported URL", color: "text-destructive" };
      default:
        return null;
    }
  };

  const typeInfo = getInputTypeLabel();

  const handleAnalyze = async () => {
    if (!input.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setComparisonResult(null);

    try {
      // If algorithm is selected, run comparison
      if (selectedAlgorithm && inputType === "text") {
        const comparison = await compareAlgorithms(input, selectedAlgorithm);
        setComparisonResult(comparison);
      } else {
        // Regular analysis for e-commerce links
        const analysisResult = await analyzeSentiment(input);
        
        if (analysisResult.error) {
          setError(analysisResult.error);
        } else {
          setResult(analysisResult);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setInput("");
    setResult(null);
    setComparisonResult(null);
    setSelectedAlgorithm(null);
    setError(null);
  };

  const exampleInputs = [
    { label: "Positive Text", value: "This product is absolutely amazing! Best purchase I've ever made. The quality is superb and delivery was fast." },
    { label: "Negative Text", value: "Terrible quality, broke after one day. Waste of money. Very disappointed with this purchase." },
    { label: "Amazon Link", value: "https://www.amazon.in/dp/B08N5WRWNW" },
    { label: "Flipkart Link", value: "https://www.flipkart.com/product/p/itm123" },
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Analyze Sentiment
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enter text or paste a product link from Amazon or Flipkart to analyze customer sentiment
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Input Section */}
          <div className="bg-card rounded-2xl border border-border shadow-soft-lg p-6 mb-8 animate-slide-up">
            {/* Input Area */}
            <div className="relative">
              <Textarea
                placeholder="Type your review text or paste an Amazon/Flipkart product link..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[120px] resize-none text-base border-2 border-muted focus:border-primary transition-colors pr-4"
                disabled={isAnalyzing}
              />
              
              {/* Input Type Indicator */}
              {typeInfo && (
                <div className={`absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-medium ${typeInfo.color}`}>
                  <typeInfo.icon className="w-3.5 h-3.5" />
                  <span>{typeInfo.label}</span>
                </div>
              )}
            </div>

            {/* Example Inputs */}
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2">Try an example:</p>
              <div className="flex flex-wrap gap-2">
                {exampleInputs.map((example) => (
                  <button
                    key={example.label}
                    onClick={() => setInput(example.value)}
                    disabled={isAnalyzing}
                    className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-accent transition-colors disabled:opacity-50"
                  >
                    {example.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Algorithm Selection - Only for text input */}
            {inputType === "text" && input.trim() && (
              <div className="mt-6 pt-6 border-t border-border animate-fade-in">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-primary" />
                  <h3 className="font-display font-semibold text-foreground">
                    Select Analysis Algorithm
                  </h3>
                  <span className="text-xs text-muted-foreground">(optional)</span>
                </div>
                <AlgorithmSelector
                  selected={selectedAlgorithm}
                  onSelect={setSelectedAlgorithm}
                  disabled={isAnalyzing}
                />
                {selectedAlgorithm && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    ✨ All algorithms will run simultaneously, and we'll suggest the best performer!
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 mt-6">
              <Button
                onClick={handleAnalyze}
                disabled={!input.trim() || isAnalyzing || inputType === "invalid"}
                className="flex-1 sm:flex-none gradient-bg text-primary-foreground hover:opacity-90 font-semibold shadow-soft-md"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {selectedAlgorithm ? "Compare Algorithms" : "Analyze Sentiment"}
                  </>
                )}
              </Button>
              
              {(input || result || comparisonResult) && (
                <Button
                  variant="outline"
                  onClick={handleClear}
                  disabled={isAnalyzing}
                  size="lg"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-negative-light border border-negative/30 rounded-xl p-4 mb-8 flex items-start gap-3 animate-scale-in">
              <AlertCircle className="w-5 h-5 text-negative flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-negative">Analysis Failed</p>
                <p className="text-sm text-negative/80 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Algorithm Comparison Results */}
          {comparisonResult && selectedAlgorithm && (
            <AlgorithmComparison 
              comparison={comparisonResult} 
              selectedAlgorithm={selectedAlgorithm} 
            />
          )}

          {/* Regular Results (for e-commerce links) */}
          {result && !comparisonResult && <SentimentResult result={result} />}

          {/* Instructions Card */}
          {!result && !comparisonResult && !error && (
            <div className="bg-accent/50 rounded-xl p-6 border border-accent animate-fade-in">
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-primary" />
                How to Use
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                    <p><strong>Text Input:</strong> Type or paste any review text directly</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                    <p><strong>Choose Algorithm:</strong> Select a sentiment analysis method to compare results</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                    <p><strong>E-commerce Links:</strong> Paste Amazon or Flipkart product URLs</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                    <p><strong>Compare Results:</strong> See all algorithms compared with best performer highlighted</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analyze;
