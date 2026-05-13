import { api } from '@/lib/api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ContentGenerationRequest {
  type: 'description' | 'summary' | 'blog' | 'caption' | 'email';
  topic: string;
  tone?: 'professional' | 'casual' | 'friendly' | 'formal';
  length?: 'short' | 'medium' | 'long';
}

export interface BudgetRecommendationRequest {
  monthlyIncome: number;
}

export interface AutoTagRequest {
  description: string;
  amount?: number;
}

export interface VoiceCommandRequest {
  text: string;
}

export interface RecommendationsRequest {
  limit?: number;
}

// ========================================
// AI সার্ভিস - সব API কল এখানে থাকবে
// ========================================

export const AIService = {
  
  // 1. চ্যাট সেশন লিস্ট পাওয়া
  getChatSessions: async () => {
    const response = await api.get('/ai/sessions');
    return response.data;
  },

  // 2. নির্দিষ্ট সেশনের চ্যাট হিস্টোরি পাওয়া
  getChatHistory: async (sessionId: string, page: number = 1, limit: number = 20) => {
    // ব্যাকএন্ডে validateRequest(AIValidation.chatHistorySchema) অনুযায়ী পাঠানো হচ্ছে
    const response = await api.get(`/ai/history/${sessionId}`, {
      params: { page, limit }
    });
    return response.data;
  },

  // 3. AI চ্যাট মেসেজ সেন্ড করা
  sendChatMessage: async (message: string, sessionId?: string) => {
    // ব্যাকএন্ডে validateRequest(AIValidation.chatSchema) অনুযায়ী
    const response = await api.post('/ai/chat', { message, sessionId });
    return response.data;
  },

  // 4. স্মার্ট রিকমেন্ডেশন পাওয়া (এটি POST মেথড হিসেবে রাখা হয়েছে)
  getRecommendations: async (limit: number = 4) => {
    const response = await api.post('/ai/recommendations', { limit });
    return response.data;
  },

  // 5. ফাইন্যান্সিয়াল অ্যানালাইসিস
  getFinancialAnalysis: async (period: 'week' | 'month' | 'year' = 'month') => {
    const response = await api.get('/ai/analyze', { params: { period } });
    return response.data;
  },

  // 6. কন্টেন্ট জেনারেট করা
  generateContent: async (data: ContentGenerationRequest) => {
    const response = await api.post('/ai/generate-content', data);
    return response.data;
  },

  // 7. অটো ট্যাগিং (ক্যাটাগরি ডিটেক্ট)
  autoTagTransaction: async (data: AutoTagRequest) => {
    const response = await api.post('/ai/auto-tag', data);
    return response.data;
  },

  // 8. বাজেট সুপারিশ
  getBudgetRecommendation: async (data: BudgetRecommendationRequest) => {
    const response = await api.post('/ai/budget-recommendation', data);
    return response.data;
  },

  // 9. ভয়েস কমান্ড প্রসেস
  processVoiceCommand: async (data: VoiceCommandRequest) => {
    const response = await api.post('/ai/voice-command', data);
    return response.data;
  },

  // 10. চ্যাট ডিলিট
  deleteChat: async (chatId: string) => {
    const response = await api.delete(`/ai/chat/${chatId}`);
    return response.data;
  },

  // 11. সেশন ডিলিট
  deleteSession: async (sessionId: string) => {
    const response = await api.delete(`/ai/session/${sessionId}`);
    return response.data;
  },

  // 12. নতুন সেশন তৈরি (Client-side helper)
  createNewSession: () => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('chatSessionId', newSessionId);
    return newSessionId;
  },
};

export default AIService;