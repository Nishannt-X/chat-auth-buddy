import React, { useCallback, useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading, error }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      return 'Please upload a CSV file (.csv)';
    }
    
    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return 'File size must be less than 10MB';
    }
    
    return null;
  };

  const handleFileSelect = useCallback((file: File) => {
    const error = validateFile(file);
    if (error) {
      return;
    }
    
    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);
    
    onFileSelect(file);
    
    // Complete progress when done
    setTimeout(() => {
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
    }, 1500);
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  return (
    <div className="w-full max-w-md mx-auto fade-in">
      <div
        className={`upload-zone ${isDragOver ? 'drag-over' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
          disabled={isLoading}
        />
        
        <div className="flex flex-col items-center space-y-4">
          {/* Upload Icon */}
          <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
            isDragOver 
              ? 'bg-[hsl(var(--primary))] scale-110' 
              : 'bg-[hsl(var(--accent))]'
          }`}>
            {isLoading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--primary))]"></div>
            ) : (
              <Upload className={`w-8 h-8 transition-colors duration-300 ${
                isDragOver 
                  ? 'text-[hsl(var(--primary-foreground))]' 
                  : 'text-[hsl(var(--primary))]'
              }`} />
            )}
          </div>
          
          {/* Upload Text */}
          <div className="text-center">
            <p className="text-lg font-semibold text-[hsl(var(--foreground))] mb-2">
              {isLoading ? 'Processing your file...' : 'Upload Transaction History'}
            </p>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-4">
              Drag and drop your CSV file here, or{' '}
              <label 
                htmlFor="file-upload" 
                className="text-[hsl(var(--primary))] hover:underline cursor-pointer font-medium"
              >
                browse to upload
              </label>
            </p>
          </div>
          
          {/* File Requirements */}
          <div className="flex items-center space-x-2 text-xs text-[hsl(var(--muted-foreground))]">
            <FileText className="w-4 h-4" />
            <span>Supported: CSV files with transaction data (max 10MB)</span>
          </div>
          
          {/* Progress Bar */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2 text-center">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
          
          {/* Success State */}
          {uploadProgress === 100 && (
            <div className="flex items-center space-x-2 text-[hsl(var(--success))]">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">File uploaded successfully!</span>
            </div>
          )}
          
          {/* Error State */}
          {error && (
            <div className="flex items-center space-x-2 text-[hsl(var(--error))] bg-[hsl(var(--error-light))] p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;