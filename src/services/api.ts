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
  withCredentials: false, // Handle CORS
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Success:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error Details:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
    });
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.');
    }
    
    // CORS or network connectivity issues
    if (!error.response) {
      console.error('No response received - likely CORS or network issue');
      throw new Error('Network error. Please check your connection and ensure your backend allows CORS.');
    }
    
    // Handle specific HTTP status codes
    if (error.response.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    if (error.response.status === 404) {
      throw new Error('API endpoint not found. Please check your backend configuration.');
    }
    
    const message = error.response.data?.message || error.response.data?.error || 'An unexpected error occurred';
    throw new Error(message);
  }
);

export const authAPI = {
  // Upload CSV file
  uploadCSV: async (userId: string, file: File): Promise<UploadResponse> => {
    console.log('Uploading CSV:', { userId, fileName: file.name, fileSize: file.size });
    
    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('csv_file', file);
    
    try {
      const response = await api.post<UploadResponse>('/upload-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Upload successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
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