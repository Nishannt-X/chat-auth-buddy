import React, { useState } from 'react';
import { Button } from './ui/button';
import { AlertCircle, CheckCircle, Wifi } from 'lucide-react';

const DebugPanel: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testBackendConnection = async () => {
    setIsLoading(true);
    setTestResult('Testing backend connection...');
    
    try {
      // Test with actual endpoint that exists - try to get questions without session_id
      const response = await fetch('http://localhost:5000/api/questions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTestResult('✅ Backend is reachable and responding');
      } else {
        setTestResult(`❌ Backend responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Backend test failed:', error);
      if (error instanceof Error) {
        setTestResult(`❌ Backend connection failed: ${error.message}`);
      } else {
        setTestResult('❌ Backend connection failed: Unknown error');
      }
    }
    
    setIsLoading(false);
  };

  const testCORSUpload = async () => {
    setIsLoading(true);
    setTestResult('Testing CSV upload...');
    
    try {
      // Create test CSV with correct format matching your backend expectations
      const csvContent = 'Date,Time,Transaction Details,Amount,Tags\n15/08/2025,14:30:00,Test Transaction,-100.00,#Test';
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const file = new File([blob], 'test.csv', { type: 'text/csv' });
      
      const formData = new FormData();
      formData.append('user_id', 'debug_test_user');
      formData.append('csv_file', file);
      
      const response = await fetch('http://localhost:5000/api/upload-csv', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setTestResult(`✅ CSV upload successful. Data ID: ${data.data_id}`);
      } else {
        setTestResult(`❌ CSV upload failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('CSV upload test failed:', error);
      if (error instanceof Error) {
        setTestResult(`❌ CSV upload failed: ${error.message}`);
      } else {
        setTestResult('❌ CSV upload failed: Unknown error');
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-[hsl(var(--card))] border border-[hsl(var(--border))] rounded-lg p-4 max-w-md shadow-lg z-50">
      <div className="flex items-center space-x-2 mb-3">
        <Wifi className="w-4 h-4 text-[hsl(var(--primary))]" />
        <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">Debug Panel</h3>
      </div>
      
      <div className="space-y-2 mb-3">
        <Button
          onClick={testBackendConnection}
          disabled={isLoading}
          size="sm"
          variant="outline"
          className="w-full text-xs"
        >
          {isLoading ? 'Testing...' : 'Test Backend Connection'}
        </Button>
        
        <Button
          onClick={testCORSUpload}
          disabled={isLoading}
          size="sm"
          variant="outline"
          className="w-full text-xs"
        >
          {isLoading ? 'Testing...' : 'Test CSV Upload'}
        </Button>
      </div>
      
      {testResult && (
        <div className={`text-xs p-2 rounded border ${
          testResult.includes('✅') 
            ? 'bg-[hsl(var(--success-light))] border-[hsl(var(--success))] text-[hsl(var(--success))]'
            : 'bg-[hsl(var(--error-light))] border-[hsl(var(--error))] text-[hsl(var(--error))]'
        }`}>
          {testResult}
        </div>
      )}
    </div>
  );
};

export default DebugPanel;