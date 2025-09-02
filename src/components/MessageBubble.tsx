import React from 'react';
import { Bot, User, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { Message } from '../types/auth.types';

interface MessageBubbleProps {
  message: Message;
}

const TypingIndicator = () => (
  <div className="typing-indicator">
    <div className="typing-dot"></div>
    <div className="typing-dot"></div>
    <div className="typing-dot"></div>
  </div>
);

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isBot = message.type === 'bot';
  const isUser = message.type === 'user';

  if (message.isTyping) {
    return (
      <div className="flex items-start space-x-3 mb-4 fade-in">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-[hsl(var(--primary))] flex items-center justify-center">
            <Bot className="w-4 h-4 text-[hsl(var(--primary-foreground))]" />
          </div>
        </div>
        <div className="message-bubble-bot">
          <TypingIndicator />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start space-x-3 mb-4 fade-in ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div className="flex-shrink-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isBot 
            ? 'bg-[hsl(var(--primary))]' 
            : 'bg-[hsl(var(--user-message))]'
        }`}>
          {isBot ? (
            <Bot className="w-4 h-4 text-[hsl(var(--primary-foreground))]" />
          ) : (
            <User className="w-4 h-4 text-[hsl(var(--user-message-foreground))]" />
          )}
        </div>
      </div>
      
      <div className={`${isBot ? 'message-bubble-bot' : 'message-bubble-user'} p-4`}>
        <p className="text-sm leading-relaxed">{message.content}</p>
        
        {/* Metadata for bot messages */}
        {isBot && message.metadata && (
          <div className="mt-3 flex items-center space-x-2 text-xs opacity-75">
            {message.metadata.questionNumber && (
              <span className="success-badge">
                Question {message.metadata.questionNumber} of {message.metadata.totalQuestions}
              </span>
            )}
            
            {message.metadata.confidence !== undefined && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                message.metadata.isCorrect 
                  ? 'success-badge' 
                  : 'error-badge'
              }`}>
                {message.metadata.isCorrect ? (
                  <CheckCircle className="w-3 h-3 inline mr-1" />
                ) : (
                  <XCircle className="w-3 h-3 inline mr-1" />
                )}
                {Math.round(message.metadata.confidence)}% confidence
              </span>
            )}
          </div>
        )}
        
        {/* Timestamp */}
        <div className="mt-2 flex items-center justify-end text-xs opacity-50">
          <Clock className="w-3 h-3 mr-1" />
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;