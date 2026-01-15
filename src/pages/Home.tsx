import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  MessageSquareText, 
  BarChart3, 
  ShoppingCart, 
  Zap,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Home = () => {
  const features = [
    {
      icon: MessageSquareText,
      title: "Text Analysis",
      description: "Analyze any review text instantly with our simple sentiment detection algorithm"
    },
    {
      icon: ShoppingCart,
      title: "E-commerce Support",
      description: "Paste Amazon or Flipkart product links to analyze customer reviews automatically"
    },
    {
      icon: BarChart3,
      title: "Visual Results",
      description: "See sentiment breakdown with confidence scores and easy-to-understand charts"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get real-time analysis with no signup required – completely free to use"
    }
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 mb-8 animate-fade-in">
              <Star className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-accent-foreground">
                Free Educational Tool for Students
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
              Understand{" "}
              <span className="gradient-text">Customer Sentiment</span>
              {" "}in Seconds
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "100ms" }}>
              Analyze product reviews from text or e-commerce links. Perfect for students learning about 
              Natural Language Processing and sentiment analysis.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
              <Button asChild size="lg" className="gradient-bg text-primary-foreground font-semibold shadow-soft-lg hover:opacity-90 transition-opacity">
                <Link to="/analyze">
                  Start Analyzing
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/about">
                  Learn How It Works
                </Link>
              </Button>
            </div>

            {/* Sentiment Preview */}
            <div className="mt-16 flex justify-center gap-6 animate-fade-in" style={{ animationDelay: "400ms" }}>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg sentiment-positive border">
                <ThumbsUp className="w-5 h-5" />
                <span className="font-medium">Positive</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg sentiment-neutral border">
                <Minus className="w-5 h-5" />
                <span className="font-medium">Neutral</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg sentiment-negative border">
                <ThumbsDown className="w-5 h-5" />
                <span className="font-medium">Negative</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple Yet Powerful
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built specifically for students to understand sentiment analysis concepts 
              through hands-on experimentation
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="bg-card rounded-xl p-6 border border-border shadow-soft-sm card-hover animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl border border-border p-8 shadow-soft-lg">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto font-display font-bold text-xl">
                    1
                  </div>
                  <h3 className="font-display font-semibold">Input</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter review text or paste a product link
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto font-display font-bold text-xl">
                    2
                  </div>
                  <h3 className="font-display font-semibold">Analyze</h3>
                  <p className="text-sm text-muted-foreground">
                    Our algorithm detects sentiment patterns
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto font-display font-bold text-xl">
                    3
                  </div>
                  <h3 className="font-display font-semibold">Results</h3>
                  <p className="text-sm text-muted-foreground">
                    View detailed sentiment breakdown
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to Analyze Sentiment?
          </h2>
          <p className="text-muted-foreground mb-8">
            Start exploring how customers feel about products
          </p>
          <Button asChild size="lg" className="gradient-bg text-primary-foreground font-semibold shadow-soft-lg hover:opacity-90">
            <Link to="/analyze">
              Try It Now – It's Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
