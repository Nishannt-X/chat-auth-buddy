export interface UploadResponse {
  success: boolean;
  data_id: string;
  total_transactions: number;
  summary: string;
}

export interface StartAuthResponse {
  success: boolean;
  session_id: string;
}

export interface Question {
  question_text: string;
  question_number: number;
  total_questions: number;
}

export interface QuestionsResponse {
  success: boolean;
  question: Question;
}

export interface ValidationResult {
  is_correct: boolean;
  confidence: number;
  explanation: string;
}

export interface AuthenticationStatus {
  status: 'in_progress' | 'success' | 'failed';
  score: number;
}

export interface VerifyAnswerResponse {
  success: boolean;
  validation: ValidationResult;
  authentication_status: AuthenticationStatus;
}

export interface SessionStatusResponse {
  success: boolean;
  questions_asked: number;
  questions_correct: number;
  status: 'in_progress' | 'success' | 'failed';
}

export interface Message {
  id: string;
  type: 'bot' | 'user' | 'system';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  metadata?: {
    confidence?: number;
    questionNumber?: number;
    totalQuestions?: number;
    isCorrect?: boolean;
  };
}

export interface AuthState {
  step: 'upload' | 'auth' | 'result';
  userId: string;
  dataId?: string;
  sessionId?: string;
  currentQuestionId?: string;
  totalTransactions?: number;
  messages: Message[];
  isLoading: boolean;
  error?: string;
  finalScore?: number;
  authStatus?: 'in_progress' | 'success' | 'failed';
  questionsAsked: number;
  questionsCorrect: number;
}