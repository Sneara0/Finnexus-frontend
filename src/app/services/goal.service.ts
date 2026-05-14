
import { api } from '@/lib/api';
import { 
  Goal, 
  CreateGoalDto, 
  UpdateGoalDto, 
  AddAmountDto,
  GoalDashboard,
  ApiResponse 
} from '@/types/goal.types';

export const goalService = {
  // POST /api/v1/goals - নতুন গোল তৈরি
  create: async (data: CreateGoalDto): Promise<ApiResponse<Goal>> => {
    const response = await api.post('/goals', data);
    return response.data;
  },

  // GET /api/v1/goals - সব গোল পাওয়া
  getAll: async (params?: { page?: number; limit?: number; status?: string }): Promise<ApiResponse<Goal[]>> => {
    const response = await api.get('/goals', { params });
    return response.data;
  },

  // GET /api/v1/goals/dashboard - গোল ড্যাশবোর্ড
  getDashboard: async (): Promise<ApiResponse<GoalDashboard>> => {
    const response = await api.get('/goals/dashboard');
    return response.data;
  },

  // GET /api/v1/goals/:id - নির্দিষ্ট গোল পাওয়া
  getById: async (id: string): Promise<ApiResponse<Goal>> => {
    const response = await api.get(`/goals/${id}`);
    return response.data;
  },

  // PATCH /api/v1/goals/:id/add - গোলে টাকা যোগ
  addAmount: async (id: string, amount: number): Promise<ApiResponse<Goal>> => {
    const response = await api.patch(`/goals/${id}/add`, { amount });
    return response.data;
  },

  // PATCH /api/v1/goals/:id/remove - গোল থেকে টাকা কমানো
  removeAmount: async (id: string, amount: number): Promise<ApiResponse<Goal>> => {
    const response = await api.patch(`/goals/${id}/remove`, { amount });
    return response.data;
  },

  // PATCH /api/v1/goals/:id/complete - গোল সম্পন্ন করা
  complete: async (id: string): Promise<ApiResponse<Goal>> => {
    const response = await api.patch(`/goals/${id}/complete`);
    return response.data;
  },

  // PATCH /api/v1/goals/:id - গোল আপডেট
  update: async (id: string, data: UpdateGoalDto): Promise<ApiResponse<Goal>> => {
    const response = await api.patch(`/goals/${id}`, data);
    return response.data;
  },

  // DELETE /api/v1/goals/:id - গোল ডিলিট
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  }
};

export default goalService;