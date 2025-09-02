import React from 'react';
import { CheckCircle, XCircle, RotateCcw, Shield } from 'lucide-react';
import { Button } from './ui/button';

interface AuthResultProps {
  status: 'success' | 'failed';
  score: number;
  questionsCorrect?: number;
  questionsTotal?: number;
  onReset: () => void;
}

const AuthResult: React.FC<AuthResultProps> = ({
  status,
  score,
  questionsCorrect = 0,
  questionsTotal = 0,
  onReset,
}) => {
  const isSuccess = status === 'success';

  return (
    <div className="w-full max-w-md mx-auto text-center fade-in">
      {/* Result Icon */}
      <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
        isSuccess 
          ? 'bg-[hsl(var(--success-light))]' 
          : 'bg-[hsl(var(--error-light))]'
      } scale-in`}>
        {isSuccess ? (
          <CheckCircle className="w-12 h-12 text-[hsl(var(--success))]" />
        ) : (
          <XCircle className="w-12 h-12 text-[hsl(var(--error))]" />
        )}
      </div>

      {/* Result Title */}
      <h2 className={`text-2xl font-bold mb-3 ${
        isSuccess 
          ? 'text-[hsl(var(--success))]' 
          : 'text-[hsl(var(--error))]'
      }`}>
        {isSuccess ? 'Authentication Successful!' : 'Authentication Failed'}
      </h2>

      {/* Result Message */}
      <p className="text-[hsl(var(--muted-foreground))] mb-6 leading-relaxed">
        {isSuccess 
          ? `Welcome back! Your identity has been verified with a confidence score of ${score}%.`
          : `We couldn't verify your identity. You scored ${score}%. Please try again with a valid CSV file.`
        }
      </p>

      {/* Score Details */}
      <div className={`p-4 rounded-xl mb-6 ${
        isSuccess 
          ? 'bg-[hsl(var(--success-light))]' 
          : 'bg-[hsl(var(--error-light))]'
      }`}>
        <div className="flex items-center justify-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span className="font-medium">Final Score:</span>
            <span className={`font-bold ${
              isSuccess 
                ? 'text-[hsl(var(--success))]' 
                : 'text-[hsl(var(--error))]'
            }`}>
              {score}%
            </span>
          </div>
          
          {questionsTotal > 0 && (
            <div className="border-l border-current/20 pl-4">
              <span className="font-medium">Questions:</span>
              <span className="ml-1">
                {questionsCorrect}/{questionsTotal} correct
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Security Message */}
      <div className="text-xs text-[hsl(var(--muted-foreground))] mb-6 p-3 bg-[hsl(var(--muted))] rounded-lg">
        <Shield className="w-4 h-4 inline mr-2" />
        Your transaction data has been processed securely and will not be stored.
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {!isSuccess && (
          <Button
            onClick={onReset}
            className="w-full bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-dark))] text-[hsl(var(--primary-foreground))] rounded-xl py-3 transition-all duration-300"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
        
        {isSuccess && (
          <Button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-dark))] text-[hsl(var(--primary-foreground))] rounded-xl py-3 transition-all duration-300"
          >
            Continue to Banking
          </Button>
        )}
        
        <Button
          onClick={onReset}
          variant="outline"
          className="w-full border-[hsl(var(--border))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] rounded-xl py-3 transition-all duration-300"
        >
          Start New Verification
        </Button>
      </div>
    </div>
  );
};

export default AuthResult;