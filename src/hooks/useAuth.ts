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
      content: "Hi! I'm your secure banking assistant. To verify your identity, I'll ask some questions about your recent transactions. Click 'Use Sample Data' below to get started with our demo.",
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

  const uploadSampleData = useCallback(async () => {
    try {
      setLoading(true);
      setError(undefined);
      addTypingIndicator();

      // Hardcoded sample CSV data
      const sampleCsvData = `Date,Time,Transaction Details,Amount,Tags
15/08/2025,14:30:00,Paid to Dominos Pizza,-450.00,#🥘 Food
14/08/2025,09:15:20,Paid to Metro Cash & Carry,-1250.00,#🛒 Groceries
13/08/2025,19:45:10,Paid to BookMyShow,-300.00,#🎈 Entertainment
12/08/2025,11:20:30,Paid to Uber,-180.00,#🚗 Transport
11/08/2025,16:50:00,Paid to Starbucks Coffee,-220.00,#🥘 Food
10/08/2025,20:10:15,Paid to Big Bazaar,-850.00,#🛒 Groceries
09/08/2025,08:30:45,Paid to Indian Oil Petrol Pump,-2000.00,#⛽️ Fuel
08/08/2025,21:16:35,Paid to Cafe Coffee Day,-165.00,#🥘 Food
07/08/2025,15:23:54,Paid to Reliance Fresh,-322.00,#🛒 Groceries
06/08/2025,19:20:04,Paid to Swiggy,-340.00,#🥘 Food
05/08/2025,16:36:44,Money sent to John Smith,-5000.00,#💵 Transfers
04/08/2025,12:45:20,Paid to Apollo Pharmacy,-156.00,#🏥 Medical
03/08/2025,18:25:30,Paid to PVR Cinemas,-600.00,#🎈 Entertainment
02/08/2025,10:15:40,Paid to Spencer's Retail,-275.00,#🛒 Groceries
01/08/2025,22:30:15,Received from Salary Credit,75000.00,#💵 Income
31/07/2025,13:45:22,Paid to Zomato,-280.00,#🥘 Food
30/07/2025,17:20:18,Paid to Flipkart,-1200.00,#🛍️ Shopping
29/07/2025,11:35:45,Paid to Ola Cabs,-95.00,#🚗 Transport
28/07/2025,20:15:30,Paid to McDonald's,-320.00,#🥘 Food
27/07/2025,14:50:12,Paid to More Supermarket,-680.00,#🛒 Groceries
26/07/2025,16:25:40,Paid to Airtel Payments Bank,-399.00,#🧾 Bills
25/07/2025,09:18:55,Paid to BSNL Mobile,-249.00,#🧾 Bills
24/07/2025,19:42:33,Paid to Pizza Hut,-520.00,#🥘 Food
23/07/2025,12:30:15,Paid to Amazon,-890.00,#🛍️ Shopping
22/07/2025,15:55:28,Paid to HP Petrol Pump,-1800.00,#⛽️ Fuel
21/07/2025,18:40:50,Paid to KFC,-375.00,#🥘 Food
20/07/2025,10:22:35,Paid to D-Mart,-1050.00,#🛒 Groceries
19/07/2025,21:15:42,Received from Freelance Payment,12000.00,#💵 Income
18/07/2025,14:33:20,Paid to Myntra,-750.00,#🛍️ Shopping
17/07/2025,16:18:45,Paid to Burger King,-290.00,#🥘 Food
16/07/2025,11:45:30,Paid to Medplus Pharmacy,-225.00,#🏥 Medical
15/07/2025,20:35:18,Paid to Netflix,-649.00,#🎈 Entertainment
14/07/2025,13:28:42,Paid to BookMyShow,-450.00,#🎈 Entertainment
13/07/2025,17:52:15,Paid to Paytm Mall,-320.00,#🛍️ Shopping
12/07/2025,09:40:33,Paid to Uber Eats,-380.00,#🥘 Food
11/07/2025,15:25:50,Paid to Lifestyle Store,-1250.00,#🛍️ Shopping
10/07/2025,19:18:25,Paid to Subway,-180.00,#🥘 Food
09/07/2025,12:55:40,Paid to Shoppers Stop,-850.00,#🛍️ Shopping
08/07/2025,16:42:18,Paid to Haldiram's,-125.00,#🥘 Food
07/07/2025,20:30:55,Paid to Inox Cinemas,-500.00,#🎈 Entertainment
06/07/2025,11:15:32,Paid to Titan Showroom,-2500.00,#🛍️ Shopping
05/07/2025,18:48:20,Money sent to Sarah Johnson,-3000.00,#💵 Transfers
04/07/2025,14:22:45,Paid to Woodland,-1800.00,#🛍️ Shopping
03/07/2025,10:35:18,Paid to Cafe Mocha,-95.00,#🥘 Food
02/07/2025,17:28:35,Paid to Vodafone Idea,-299.00,#🧾 Bills
01/07/2025,21:45:20,Paid to Croma Electronics,-15000.00,#🛍️ Shopping`;

      // Create a File object from the sample data
      const blob = new Blob([sampleCsvData], { type: 'text/csv' });
      const file = new File([blob], 'sample_transactions.csv', { type: 'text/csv' });

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
          content: `Great! I found ${response.total_transactions} transactions in your sample data. ${response.summary} Let me start the verification process.`,
        });

        // Start authentication automatically
        await startAuthentication(response.data_id);
      } else {
        throw new Error('Failed to process sample data');
      }
    } catch (error) {
      removeTypingIndicator();
      const errorMessage = error instanceof Error ? error.message : 'Failed to process sample data';
      setError(errorMessage);
      addMessage({
        type: 'bot',
        content: `Sorry, there was an error processing the sample data: ${errorMessage}. Please try again.`,
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
    uploadSampleData,
    submitAnswer,
    resetAuth,
    addMessage,
  };
};