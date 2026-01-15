import { 
  Brain, 
  BookOpen, 
  Code2, 
  Lightbulb,
  ThumbsUp,
  ThumbsDown,
  Minus,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const About = () => {
  const concepts = [
    {
      title: "What is Sentiment Analysis?",
      content: "Sentiment analysis is a Natural Language Processing (NLP) technique used to identify and extract subjective information from text. It determines whether a piece of writing is positive, negative, or neutral.",
      icon: Brain
    },
    {
      title: "How Does It Work?",
      content: "Our analyzer uses a lexicon-based approach, comparing words in the input text against predefined lists of positive and negative words. The ratio of these words determines the overall sentiment and confidence score.",
      icon: Lightbulb
    },
    {
      title: "Real-World Applications",
      content: "Businesses use sentiment analysis to monitor brand reputation, analyze customer feedback, track social media mentions, and improve customer service through automated response systems.",
      icon: BookOpen
    },
    {
      title: "Technical Implementation",
      content: "This educational tool demonstrates basic NLP concepts. Production systems typically use machine learning models like BERT, transformers, or fine-tuned neural networks for higher accuracy.",
      icon: Code2
    }
  ];

  const positiveWords = ["good", "great", "excellent", "amazing", "love", "perfect", "recommend"];
  const negativeWords = ["bad", "terrible", "poor", "hate", "waste", "disappointed", "broken"];

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            How Sentiment Analysis Works
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Learn the fundamentals of Natural Language Processing and how machines 
            understand human emotions from text
          </p>
        </div>

        {/* Main Concepts */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-16">
          {concepts.map((concept, index) => (
            <div 
              key={concept.title}
              className="bg-card rounded-xl p-6 border border-border shadow-soft-sm card-hover animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0">
                  <concept.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                    {concept.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {concept.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Word Lists */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="font-display text-2xl font-bold text-foreground text-center mb-8">
            Sample Word Lists Used
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Positive Words */}
            <div className="bg-positive-light rounded-xl p-6 border border-positive/20">
              <div className="flex items-center gap-3 mb-4">
                <ThumbsUp className="w-5 h-5 text-positive" />
                <h3 className="font-display font-semibold text-positive">Positive Indicators</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {positiveWords.map(word => (
                  <span 
                    key={word}
                    className="px-3 py-1 rounded-full bg-positive/10 text-positive text-sm font-medium"
                  >
                    {word}
                  </span>
                ))}
                <span className="px-3 py-1 rounded-full bg-positive/10 text-positive text-sm">
                  + more...
                </span>
              </div>
            </div>

            {/* Negative Words */}
            <div className="bg-negative-light rounded-xl p-6 border border-negative/20">
              <div className="flex items-center gap-3 mb-4">
                <ThumbsDown className="w-5 h-5 text-negative" />
                <h3 className="font-display font-semibold text-negative">Negative Indicators</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {negativeWords.map(word => (
                  <span 
                    key={word}
                    className="px-3 py-1 rounded-full bg-negative/10 text-negative text-sm font-medium"
                  >
                    {word}
                  </span>
                ))}
                <span className="px-3 py-1 rounded-full bg-negative/10 text-negative text-sm">
                  + more...
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Process Flow */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="font-display text-2xl font-bold text-foreground text-center mb-8">
            The Analysis Process
          </h2>
          
          <div className="bg-card rounded-xl border border-border p-6 shadow-soft-sm">
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { step: "1", title: "Input", desc: "Text or URL received" },
                { step: "2", title: "Detect", desc: "Identify input type" },
                { step: "3", title: "Tokenize", desc: "Split into words" },
                { step: "4", title: "Score", desc: "Calculate sentiment" }
              ].map((item, index) => (
                <div key={item.step} className="flex md:flex-col items-center gap-3 text-center">
                  <div className="w-10 h-10 rounded-full gradient-bg text-primary-foreground flex items-center justify-center font-display font-bold">
                    {item.step}
                  </div>
                  <div className="md:mt-2">
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  {index < 3 && (
                    <ArrowRight className="w-4 h-4 text-muted-foreground hidden md:block absolute right-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Limitations */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="font-display text-2xl font-bold text-foreground text-center mb-8">
            Understand the Limitations
          </h2>
          
          <div className="bg-accent/50 rounded-xl p-6 border border-accent">
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "This is an educational demo, not production-ready",
                "Lexicon-based approach misses context and sarcasm",
                "E-commerce links use simulated review data",
                "Real systems use ML models for better accuracy",
                "No user data is stored or collected",
                "Results are for learning purposes only"
              ].map((limitation, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{limitation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">
            Ready to Try It Yourself?
          </h2>
          <Button asChild size="lg" className="gradient-bg text-primary-foreground font-semibold shadow-soft-lg hover:opacity-90">
            <Link to="/analyze">
              Start Analyzing
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default About;
