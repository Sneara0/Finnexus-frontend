
import { api } from '@/lib/api';
import { 
  Transaction, 
  CreateTransactionDto, 
  UpdateTransactionDto, 
  TransactionFilters,
  TransactionSummary,
  CategoryAnalysis 
} from '@/types/transaction.types';

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

export const transactionService = {
  /**
   * POST /api/v1/transactions
   * নতুন ট্রানজেকশন তৈরি করা
   */
  create: async (data: CreateTransactionDto): Promise<ApiResponse<Transaction>> => {
    const response = await api.post('/transactions', data);
    return response.data;
  },

  /**
   * GET /api/v1/transactions
   * সব ট্রানজেকশন দেখা (ফিল্টার ও পেজিনেশন সহ)
   */
  getAll: async (filters: TransactionFilters = {}): Promise<ApiResponse<Transaction[]>> => {
    const response = await api.get('/transactions', { params: filters });
    return response.data;
  },

  /**
   * GET /api/v1/transactions/summary
   * ড্যাশবোর্ডের জন্য আয়-ব্যয়ের সামারি দেখা
   */
  getSummary: async (): Promise<ApiResponse<TransactionSummary>> => {
    const response = await api.get('/transactions/summary');
    return response.data;
  },

  /**
   * GET /api/v1/transactions/category-analysis
   * কোন ক্যাটাগরিতে কত খরচ হয়েছে তার বিশ্লেষণ
   */
  getCategoryAnalysis: async (startDate?: string, endDate?: string): Promise<ApiResponse<CategoryAnalysis>> => {
    const response = await api.get('/transactions/category-analysis', {
      params: { startDate, endDate }
    });
    return response.data;
  },

  /**
   * POST /api/v1/transactions/bulk-import
   * একসাথে অনেকগুলো ট্রানজেকশন আপলোড করা
   */
  bulkImport: async (transactions: CreateTransactionDto[]): Promise<ApiResponse<{ success: number; failed: number; errors: any[] }>> => {
    const response = await api.post('/transactions/bulk-import', { transactions });
    return response.data;
  },

  /**
   * GET /api/v1/transactions/:id
   * নির্দিষ্ট একটি ট্রানজেকশনের ডিটেইলস দেখা
   */
  getById: async (id: string): Promise<ApiResponse<Transaction>> => {
    const response = await api.get(`/transactions/${id}`);
    return response.data;
  },

  /**
   * PUT /api/v1/transactions/:id
   * নির্দিষ্ট ট্রানজেকশন আপডেট করা
   */
  update: async (id: string, data: UpdateTransactionDto): Promise<ApiResponse<Transaction>> => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data;
  },

  /**
   * DELETE /api/v1/transactions/:id
   * নির্দিষ্ট ট্রানজেকশন ডিলিট করা
   */
  delete: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  }
};

export default transactionService;
