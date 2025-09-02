import { useState, useCallback } from 'react';
import { authAPI } from '../services/api';
import type { AuthState, Message } from '../types/auth.types';

const generateUserId = () => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const initialState: AuthState = {
  step: 'upload',
  userId: generateUserId(),
  messages: [
    {
      id: generateMessageId(),
      type: 'bot',
      content: "Hi! I'm your secure banking assistant. To verify your identity, I'll ask some questions about your recent transactions. Please upload your transaction history CSV file to get started.",
      timestamp: new Date(),
    }
  ],
  isLoading: false,
};

export const useAuth = () => {
  const [state, setState] = useState<AuthState>(initialState);

  const addMessage = useCallback((message: Omit<Message, 'id' | 'timestamp'>) => {
    setState(prev => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          ...message,
          id: generateMessageId(),
          timestamp: new Date(),
        }
      ],
    }));
  }, []);

  const addTypingIndicator = useCallback(() => {
    const typingId = 'typing-indicator';
    setState(prev => ({
      ...prev,
      messages: [
        ...prev.messages.filter(m => m.id !== typingId),
        {
          id: typingId,
          type: 'bot',
          content: '',
          timestamp: new Date(),
          isTyping: true,
        }
      ],
    }));
  }, []);

  const removeTypingIndicator = useCallback(() => {
    setState(prev => ({
      ...prev,
      messages: prev.messages.filter(m => m.id !== 'typing-indicator'),
    }));
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: string | undefined) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const uploadFile = useCallback(async (file: File) => {
    try {
      setLoading(true);
      setError(undefined);
      addTypingIndicator();

      const response = await authAPI.uploadCSV(state.userId, file);
      
      removeTypingIndicator();
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          dataId: response.data_id,
          totalTransactions: response.total_transactions,
        }));

        addMessage({
          type: 'bot',
          content: `Great! I found ${response.total_transactions} transactions in your history. ${response.summary} Let me start the verification process.`,
        });

        // Start authentication automatically
        await startAuthentication(response.data_id);
      } else {
        throw new Error('Failed to process CSV file');
      }
    } catch (error) {
      removeTypingIndicator();
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';
      setError(errorMessage);
      addMessage({
        type: 'bot',
        content: `Sorry, there was an error processing your file: ${errorMessage}. Please try again with a valid CSV file.`,
      });
    } finally {
      setLoading(false);
    }
  }, [state.userId]);

  const startAuthentication = useCallback(async (dataId: string) => {
    try {
      setLoading(true);
      addTypingIndicator();

      const response = await authAPI.startAuth(dataId, state.userId);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          sessionId: response.session_id,
          step: 'auth',
        }));

        // Get first question
        await getNextQuestion(response.session_id);
      } else {
        throw new Error('Failed to start authentication');
      }
    } catch (error) {
      removeTypingIndicator();
      const errorMessage = error instanceof Error ? error.message : 'Failed to start authentication';
      setError(errorMessage);
      addMessage({
        type: 'bot',
        content: `Unable to start verification: ${errorMessage}`,
      });
    } finally {
      setLoading(false);
    }
  }, [state.userId]);

  const getNextQuestion = useCallback(async (sessionId: string) => {
    try {
      const response = await authAPI.getQuestions(sessionId);
      
      removeTypingIndicator();
      
      if (response.success && response.question) {
        const { question } = response;
        setState(prev => ({
          ...prev,
          currentQuestionId: `q_${question.question_number}`,
        }));

        addMessage({
          type: 'bot',
          content: question.question_text,
          metadata: {
            questionNumber: question.question_number,
            totalQuestions: question.total_questions,
          },
        });
      } else {
        throw new Error('No more questions available');
      }
    } catch (error) {
      removeTypingIndicator();
      const errorMessage = error instanceof Error ? error.message : 'Failed to get question';
      setError(errorMessage);
      addMessage({
        type: 'bot',
        content: `Error getting question: ${errorMessage}`,
      });
    }
  }, []);

  const submitAnswer = useCallback(async (answer: string) => {
    if (!state.sessionId || !state.currentQuestionId) return;

    try {
      setLoading(true);
      setError(undefined);

      // Add user message
      addMessage({
        type: 'user',
        content: answer,
      });

      addTypingIndicator();

      const response = await authAPI.verifyAnswer(
        state.currentQuestionId,
        state.sessionId,
        answer
      );

      removeTypingIndicator();

      if (response.success) {
        const { validation, authentication_status } = response;
        
        // Add validation feedback
        const feedbackContent = validation.is_correct 
          ? `✅ Correct! (${Math.round(validation.confidence)}% confidence) - ${validation.explanation}`
          : `❌ ${validation.explanation}`;

        addMessage({
          type: 'bot',
          content: feedbackContent,
          metadata: {
            confidence: validation.confidence,
            isCorrect: validation.is_correct,
          },
        });

        // Check if authentication is complete
        if (authentication_status.status !== 'in_progress') {
          setState(prev => ({
            ...prev,
            step: 'result',
            finalScore: authentication_status.score,
            authStatus: authentication_status.status,
          }));

          // Add final result message
          const finalMessage = authentication_status.status === 'success'
            ? `🎉 Authentication successful! You answered correctly with a score of ${authentication_status.score}%. Welcome back!`
            : `❌ Authentication failed. You scored ${authentication_status.score}%. Please try again with a new CSV file.`;

          setTimeout(() => {
            addMessage({
              type: 'bot',
              content: finalMessage,
            });
          }, 1000);
        } else {
          // Get next question
          setTimeout(() => {
            getNextQuestion(state.sessionId!);
          }, 1500);
        }
      } else {
        throw new Error('Failed to verify answer');
      }
    } catch (error) {
      removeTypingIndicator();
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit answer';
      setError(errorMessage);
      addMessage({
        type: 'bot',
        content: `Error verifying answer: ${errorMessage}`,
      });
    } finally {
      setLoading(false);
    }
  }, [state.sessionId, state.currentQuestionId]);

  const resetAuth = useCallback(() => {
    setState({
      ...initialState,
      userId: generateUserId(),
    });
  }, []);

  return {
    state,
    uploadFile,
    submitAnswer,
    resetAuth,
    addMessage,
  };
};