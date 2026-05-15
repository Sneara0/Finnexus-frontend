import { api } from '@/lib/api';

// --- Types & Interfaces ---
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
  updatedAt?: string;
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
}

// --- Service Logic ---
export const goalService = {
  // সব গোল পাওয়া
  getAll: async (params?: { page?: number; limit?: number; status?: string }): Promise<ApiResponse<Goal[]>> => {
    const response = await api.get('/goals', { params });
    if (response.data.success && response.data.data) {
      const transformedData = response.data.data.map((goal: any): Goal => ({
        id: goal.id,
        name: goal.name || goal.title,
        targetAmount: Number(goal.targetAmount),
        currentAmount: Number(goal.currentAmount),
        deadline: goal.deadline,
        note: goal.note,
        isCompleted: goal.isCompleted || goal.status === 'COMPLETED',
        createdAt: goal.createdAt,
        progress: (goal.currentAmount / goal.targetAmount) * 100 || 0,
        remaining: Math.max(goal.targetAmount - goal.currentAmount, 0),
        daysRemaining: Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
      }));
      return { ...response.data, data: transformedData };
    }
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

  // গোলে টাকা যোগ (Add Amount)
  addAmount: async (id: string, amount: number): Promise<ApiResponse<Goal>> => {
    const response = await api.patch(`/goals/add-amount/${id}`, { amount });
    return response.data;
  },

  // ✅ টাকা কমানো (Remove Amount) - এই ফাংশনটি মিসিং ছিল
  removeAmount: async (id: string, amount: number): Promise<ApiResponse<Goal>> => {
    const response = await api.patch(`/goals/remove-amount/${id}`, { amount });
    return response.data;
  },

  // ✅ গোল সম্পন্ন করা (Complete) - এই ফাংশনটি মিসিং ছিল
  complete: async (id: string): Promise<ApiResponse<Goal>> => {
    const response = await api.patch(`/goals/complete/${id}`);
    return response.data;
  },

  // ✅ গোল আপডেট (Update) - এটিও যোগ করে নিন
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