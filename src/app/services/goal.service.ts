
import { api } from '@/lib/api';

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  note?: string;
  isCompleted: boolean;
  progress: number;
  remaining: number;
  daysRemaining: number;
  createdAt: string;
}

export interface CreateGoalDto {
  name: string;
  targetAmount: number;
  deadline: string;
  note?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const goalService = {
  // সব গোল পাওয়া
  getAll: async (params?: { page?: number; limit?: number; status?: string }): Promise<ApiResponse<Goal[]>> => {
    const response = await api.get('/goals', { params });
    return response.data;
  },

  // গোল ড্যাশবোর্ড
  getDashboard: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/goals/dashboard');
    return response.data;
  },

  // নতুন গোল তৈরি
  create: async (data: CreateGoalDto): Promise<ApiResponse<Goal>> => {
    const response = await api.post('/goals', data);
    return response.data;
  },

  // গোলে টাকা যোগ
  addAmount: async (id: string, amount: number): Promise<ApiResponse<Goal>> => {
    const response = await api.patch(`/goals/add-amount/${id}`, { amount });
    return response.data;
  },

  // গোল থেকে টাকা কমানো
  removeAmount: async (id: string, amount: number): Promise<ApiResponse<Goal>> => {
    const response = await api.patch(`/goals/remove-amount/${id}`, { amount });
    return response.data;
  },

  // গোল সম্পন্ন
  complete: async (id: string): Promise<ApiResponse<Goal>> => {
    const response = await api.patch(`/goals/complete/${id}`);
    return response.data;
  },

  // গোল আপডেট
  update: async (id: string, data: Partial<CreateGoalDto>): Promise<ApiResponse<Goal>> => {
    const response = await api.patch(`/goals/${id}`, data);
    return response.data;
  },

  // গোল ডিলিট
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  }
};

export default goalService;
