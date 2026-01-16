import { AlgorithmType, algorithms, AlgorithmInfo } from "@/utils/algorithms";
import { Check, Zap, Clock, Brain } from "lucide-react";

interface AlgorithmSelectorProps {
  selected: AlgorithmType | null;
  onSelect: (algorithm: AlgorithmType) => void;
  disabled?: boolean;
}

const speedIcons = {
  fast: <Zap className="w-3 h-3" />,
  medium: <Clock className="w-3 h-3" />,
  slow: <Brain className="w-3 h-3" />,
};

const speedColors = {
  fast: "text-positive",
  medium: "text-neutral",
  slow: "text-primary",
};

const AlgorithmSelector = ({ selected, onSelect, disabled }: AlgorithmSelectorProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">Choose Algorithm</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {algorithms.map((algo) => {
          const isSelected = selected === algo.id;
          
          return (
            <button
              key={algo.id}
              onClick={() => onSelect(algo.id)}
              disabled={disabled}
              className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left
                ${isSelected 
                  ? "border-primary bg-accent shadow-soft-md" 
                  : "border-border bg-card hover:border-primary/50 hover:shadow-soft-sm"
                }
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              
              {/* Algorithm name */}
              <h4 className="font-display font-semibold text-foreground mb-1 pr-6">
                {algo.name}
              </h4>
              
              {/* Description */}
              <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                {algo.description}
              </p>
              
              {/* Stats */}
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <span className="font-medium text-foreground">{algo.accuracy}%</span>
                  accuracy
                </span>
                <span className={`flex items-center gap-1 ${speedColors[algo.speed]}`}>
                  {speedIcons[algo.speed]}
                  {algo.speed}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AlgorithmSelector;
