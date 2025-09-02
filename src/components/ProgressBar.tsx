import React from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  questionsCorrect?: number;
  questionsAsked?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  questionsCorrect = 0,
  questionsAsked = 0,
}) => {
  const progressPercentage = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div className="w-full max-w-md mx-auto mb-6 fade-in">
      {/* Progress Header */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-[hsl(var(--foreground))]">
          Verification Progress
        </span>
        {questionsAsked > 0 && (
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            {questionsCorrect}/{questionsAsked} correct
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div 
          className="progress-fill transition-all duration-700 ease-out" 
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center space-x-2">
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            
            return (
              <div
                key={stepNumber}
                className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium transition-all duration-300 ${
                  isCompleted
                    ? 'bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]'
                    : isCurrent
                    ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] ring-2 ring-[hsl(var(--primary))] ring-opacity-30'
                    : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-3 h-3" />
                ) : isCurrent ? (
                  <Clock className="w-3 h-3" />
                ) : (
                  <Circle className="w-3 h-3" />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Text */}
        <span className="text-xs text-[hsl(var(--muted-foreground))] font-medium">
          {currentStep}/{totalSteps}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;