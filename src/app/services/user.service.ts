
import { api } from '@/lib/api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  phone?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

// ইউজার সার্ভিস
export const userService = {
  // নিজের প্রোফাইল পাওয়া
  getMyProfile: async (): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // প্রোফাইল আপডেট করা
  updateMyProfile: async (data: UpdateProfileData): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  // পাসওয়ার্ড পরিবর্তন
  changePassword: async (data: ChangePasswordData): Promise<ApiResponse<null>> => {
    const response = await api.post('/users/change-password', data);
    return response.data;
  },

  // সব ইউজার পাওয়া (শুধু অ্যাডমিন)
  getAllUsers: async (params?: { page?: number; limit?: number; search?: string; role?: string }): Promise<ApiResponse<{ users: User[]; pagination: any }>> => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  // নির্দিষ্ট ইউজার পাওয়া (শুধু অ্যাডমিন)
  getUserById: async (id: string): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // ইউজার রোল পরিবর্তন (শুধু অ্যাডমিন)
  changeUserRole: async (id: string, role: string): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.patch(`/users/${id}/role`, { role });
    return response.data;
  },

  // ইউজার নিষ্ক্রিয় করা (শুধু অ্যাডমিন)
  deactivateUser: async (id: string): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.patch(`/users/${id}/deactivate`);
    return response.data;
  },

  // ইউজার সক্রিয় করা (শুধু অ্যাডমিন)
  activateUser: async (id: string): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.patch(`/users/${id}/activate`);
    return response.data;
  },

  // ইউজার ডিলিট (শুধু অ্যাডমিন)
  deleteUser: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // ইউজার স্ট্যাটিস্টিক্স (শুধু অ্যাডমিন)
  getUserStats: async (): Promise<ApiResponse<any>> => {
    const response = await api.get('/users/stats');
    return response.data;
  },
};

export default userService;
