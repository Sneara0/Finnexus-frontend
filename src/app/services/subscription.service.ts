import api from '@/lib/api';

/**
 * Subscription সম্পর্কিত সকল API কল এখানে থাকবে।
 */
export const subscriptionService = {
  // ১. সাবস্ক্রিপশন সামারি (Stats) গেট করা
  getSummary: async () => {
    const response = await api.get('/subscriptions/summary');
    return response.data;
  },

  // ২. নতুন সাবস্ক্রিপশন তৈরি করা
  create: async (subscriptionData: {
    name: string;
    price: number;
    billingCycle: 'monthly' | 'yearly';
    nextBillingDate: string;
    category?: string;
  }) => {
    const response = await api.post('/subscriptions', subscriptionData);
    return response.data;
  },

  // ৩. সকল সাবস্ক্রিপশন লিস্ট দেখা (Pagination/Filtering সহ)
  getAll: async (params?: { page?: number; limit?: number; status?: string }) => {
    const response = await api.get('/subscriptions', { params });
    return response.data;
  },

  // ৪. নির্দিষ্ট আইডি অনুযায়ী সাবস্ক্রিপশন ডিটেইলস দেখা
  getById: async (id: string) => {
    const response = await api.get(`/subscriptions/${id}`);
    return response.data;
  },

  // ৫. সাবস্ক্রিপশন আপডেট করা
  update: async (id: string, updateData: any) => {
    const response = await api.put(`/subscriptions/${id}`, updateData);
    return response.data;
  },

  // ৬. সাবস্ক্রিপশন ক্যানসেল করা
  cancel: async (id: string) => {
    const response = await api.post(`/subscriptions/${id}/cancel`);
    return response.data;
  },

  // ৭. ক্যানসেল করা সাবস্ক্রিপশন আবার রি-অ্যাক্টিভেট করা
  reactivate: async (id: string) => {
    const response = await api.post(`/subscriptions/${id}/reactivate`);
    return response.data;
  },

  // ৮. সাবস্ক্রিপশন ডিলিট করা
  delete: async (id: string) => {
    const response = await api.delete(`/subscriptions/${id}`);
    return response.data;
  },

  // --- অ্যাডমিন স্পেসিফিক সার্ভিস ---

  // ৯. সকল রিনিউয়াল প্রসেস করা
  processAdminRenewals: async () => {
    const response = await api.post('/subscriptions/admin/process-renewals');
    return response.data;
  },

  // ১০. রিমাইন্ডার পাঠানো
  sendAdminReminders: async () => {
    const response = await api.post('/subscriptions/admin/send-reminders');
    return response.data;
  }
};

export default subscriptionService;