import React from 'react';
import { Button } from './ui/button';
import { Database, Upload } from 'lucide-react';

interface SampleDataUploadProps {
  onDataSelect: () => void;
  isLoading: boolean;
  error?: string;
}

const SampleDataUpload: React.FC<SampleDataUploadProps> = ({
  onDataSelect,
  isLoading,
  error
}) => {
  return (
    <div className="w-full max-w-md mx-auto p-6 border-2 border-dashed border-[hsl(var(--border))] rounded-lg bg-[hsl(var(--card))] transition-colors">
      <div className="text-center">
        <Database className="mx-auto h-12 w-12 text-[hsl(var(--muted-foreground))] mb-4" />
        
        <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">
          Sample Transaction Data
        </h3>
        
        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
          Use predefined transaction data for authentication testing
        </p>
        
        <Button 
          onClick={onDataSelect}
          disabled={isLoading}
          className="w-full mb-4"
        >
          {isLoading ? (
            <>
              <Upload className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Use Sample Data
            </>
          )}
        </Button>
        
        <div className="text-xs text-[hsl(var(--muted-foreground))] space-y-1">
          <p>• 44 sample transactions</p>
          <p>• Various categories (Food, Shopping, Bills, etc.)</p>
          <p>• Date range: July-August 2025</p>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-[hsl(var(--destructive-light))] border border-[hsl(var(--destructive))] rounded text-[hsl(var(--destructive))] text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default SampleDataUpload;