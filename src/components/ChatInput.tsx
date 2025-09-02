import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSubmit, 
  isLoading, 
  disabled = false,
  placeholder = "Type your answer..." 
}) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled && !isLoading) {
      inputRef.current?.focus();
    }
  }, [disabled, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    
    if (trimmedMessage && !isLoading && !disabled) {
      onSubmit(trimmedMessage);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-3 p-4 bg-[hsl(var(--card))] border-t border-[hsl(var(--border))] rounded-b-xl">
      <div className="flex-1 relative">
        <Input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={disabled ? "Please wait..." : placeholder}
          disabled={disabled || isLoading}
          className="pr-12 bg-[hsl(var(--background))] border-[hsl(var(--border))] focus:border-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))] rounded-xl"
        />
        
        {/* Character count for very long messages */}
        {message.length > 100 && (
          <div className="absolute -top-6 right-0 text-xs text-[hsl(var(--muted-foreground))]">
            {message.length}/500
          </div>
        )}
      </div>
      
      <Button
        type="submit"
        size="sm"
        disabled={!message.trim() || isLoading || disabled}
        className="rounded-xl bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-dark))] text-[hsl(var(--primary-foreground))] shadow-sm transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </Button>
    </form>
  );
};

export default ChatInput;