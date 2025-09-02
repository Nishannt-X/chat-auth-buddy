import React, { useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import FileUpload from './FileUpload';
import ProgressBar from './ProgressBar';
import AuthResult from './AuthResult';
import { Shield, Lock } from 'lucide-react';

const ChatInterface: React.FC = () => {
  const { state, uploadFile, submitAnswer, resetAuth } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages]);

  // Calculate progress for questions
  const currentQuestion = state.messages
    .filter(m => m.type === 'bot' && m.metadata?.questionNumber)
    .pop();
  
  const questionProgress = currentQuestion?.metadata?.questionNumber || 0;
  const totalQuestions = currentQuestion?.metadata?.totalQuestions || 0;
  
  const questionsAsked = state.messages
    .filter(m => m.type === 'user' && m.content.length > 0).length;
  
  const questionsCorrect = state.messages
    .filter(m => m.type === 'bot' && m.metadata?.isCorrect === true).length;

  return (
    <div className="chat-container flex flex-col h-screen max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-[hsl(var(--card))] border-b border-[hsl(var(--border))] p-4 rounded-t-xl shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--primary-dark))] rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-[hsl(var(--primary-foreground))]" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-[hsl(var(--foreground))]">
                Smart Banking Authentication
              </h1>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Secure identity verification
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-[hsl(var(--muted-foreground))]">
            <Lock className="w-4 h-4" />
            <span>End-to-end encrypted</span>
          </div>
        </div>
      </div>

      {/* Progress Bar - Only show during auth step */}
      {state.step === 'auth' && totalQuestions > 0 && (
        <div className="p-4 bg-[hsl(var(--card))] border-b border-[hsl(var(--border))]">
          <ProgressBar
            currentStep={questionProgress}
            totalSteps={totalQuestions}
            questionsCorrect={questionsCorrect}
            questionsAsked={questionsAsked}
          />
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {state.messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {/* File Upload Section - Only show during upload step */}
        {state.step === 'upload' && (
          <div className="mt-8">
            <FileUpload
              onFileSelect={uploadFile}
              isLoading={state.isLoading}
              error={state.error}
            />
          </div>
        )}
        
        {/* Result Section - Only show during result step */}
        {state.step === 'result' && state.finalScore !== undefined && state.authStatus && (
          <div className="mt-8">
            <AuthResult
              status={state.authStatus === 'success' ? 'success' : 'failed'}
              score={state.finalScore}
              questionsCorrect={questionsCorrect}
              questionsTotal={totalQuestions}
              onReset={resetAuth}
            />
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input - Only show during auth step */}
      {state.step === 'auth' && (
        <ChatInput
          onSubmit={submitAnswer}
          isLoading={state.isLoading}
          disabled={state.step !== 'auth'}
          placeholder="Type your answer here..."
        />
      )}

      {/* Error Display */}
      {state.error && (
        <div className="p-4 bg-[hsl(var(--error-light))] border-t border-[hsl(var(--error))] text-[hsl(var(--error))] text-sm">
          <p>⚠️ {state.error}</p>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;