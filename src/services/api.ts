import axios from 'axios';
import type {
  UploadResponse,
  StartAuthResponse,
  QuestionsResponse,
  VerifyAnswerResponse,
  SessionStatusResponse
} from '../types/auth.types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
});

// Add request interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }
    
    if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    }
    
    const message = error.response.data?.message || 'An unexpected error occurred';
    throw new Error(message);
  }
);

export const authAPI = {
  // Upload CSV file
  uploadCSV: async (userId: string, file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('csv_file', file);
    
    const response = await api.post<UploadResponse>('/upload-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  // Start authentication session
  startAuth: async (dataId: string, userId: string): Promise<StartAuthResponse> => {
    const response = await api.post<StartAuthResponse>('/start-auth', {
      data_id: dataId,
      user_id: userId,
    });
    
    return response.data;
  },

  // Get next question
  getQuestions: async (sessionId: string): Promise<QuestionsResponse> => {
    const response = await api.get<QuestionsResponse>(`/questions?session_id=${sessionId}`);
    return response.data;
  },

  // Verify answer
  verifyAnswer: async (
    questionId: string,
    sessionId: string,
    answer: string
  ): Promise<VerifyAnswerResponse> => {
    const response = await api.post<VerifyAnswerResponse>(`/questions/${questionId}/verify`, {
      session_id: sessionId,
      answer: answer.trim(),
    });
    
    return response.data;
  },

  // Get session status
  getSessionStatus: async (sessionId: string): Promise<SessionStatusResponse> => {
    const response = await api.get<SessionStatusResponse>(`/session-status/${sessionId}`);
    return response.data;
  },
};

export default api;