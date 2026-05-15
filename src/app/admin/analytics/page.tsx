
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  TrendingUp, TrendingDown, Users, Wallet, 
  CreditCard, Target, Calendar, Download, 
  Filter, RefreshCw, Loader2, Sparkles,
  DollarSign, Activity, BarChart3, LineChart,
  PieChart, ArrowUpRight, ArrowDownRight,
  Clock, CheckCircle, XCircle, AlertCircle,
  UserPlus, UserMinus, Award, Crown, Star
} from 'lucide-react';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';

interface AnalyticsData {
  overview: {
    totalUsers: number;
    newUsers: number;
    activeUsers: number;
    totalTransactions: number;
    totalIncome: number;
    totalExpense: number;
    profit: number;
    totalGoals: number;
    completedGoals: number;
    totalSubscriptions: number;
  };
  userGrowth: {
    date: string;
    count: number;
  }[];
  transactionTrend: {
    date: string;
    income: number;
    expense: number;
  }[];
  categoryBreakdown: {
    category: string;
    amount: number;
    percentage: number;
  }[];
  topUsers: {
    id: string;
    name: string;
    email: string;
    totalSaved: number;
    transactionCount: number;
  }[];
  monthlyStats: {
    month: string;
    users: number;
    transactions: number;
    revenue: number;
  }[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");
  const [selectedMetric, setSelectedMetric] = useState<string>("revenue");

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("Please login first");
        return;
      }
      
      const response = await api.get('/admin/analytics', {
        params: { period }
      });
      
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const overviewCards = [
    { 
      label: "Total Users", 
      value: data?.overview.totalUsers || 0, 
      change: "+12%", 
      icon: Users, 
      color: "blue",
      trend: "up"
    },
    { 
      label: "Total Revenue", 
      value: formatCurrency(data?.overview.profit || 0), 
      change: "+8%", 
      icon: DollarSign, 
      color: "emerald",
      trend: "up"
    },
    { 
      label: "Active Users", 
      value: data?.overview.activeUsers || 0, 
      change: "+5%", 
      icon: Activity, 
      color: "purple",
      trend: "up"
    },
    { 
      label: "Total Transactions", 
      value: data?.overview.totalTransactions || 0, 
      change: "+15%", 
      icon: CreditCard, 
      color: "orange",
      trend: "up"
    },
    { 
      label: "Goals Completed", 
      value: data?.overview.completedGoals || 0, 
      change: "+23%", 
      icon: Target, 
      color: "green",
      trend: "up"
    },
    { 
      label: "Total Savings", 
      value: formatCurrency(data?.overview.totalIncome || 0), 
      change: "+10%", 
      icon: Wallet, 
      color: "cyan",
      trend: "up"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-xl">
                <BarChart3 className="w-6 h-6 text-emerald-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Analytics Dashboard</h1>
              <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">Admin</span>
            </div>
            <p className="text-slate-400 ml-10">Platform performance and user insights</p>
          </div>
          <div className="flex gap-2">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last 12 Months</option>
            </select>
            <button
              onClick={loadAnalytics}
              className="p-2 bg-white/10 rounded-lg text-slate-400 hover:text-white hover:bg-white/20 transition"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              className="p-2 bg-white/10 rounded-lg text-slate-400 hover:text-white hover:bg-white/20 transition"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-emerald-500/20 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
              {overviewCards.map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <div className={`w-10 h-10 rounded-lg bg-${card.color}-500/20 flex items-center justify-center mb-2`}>
                    <card.icon className={`w-5 h-5 text-${card.color}-400`} />
                  </div>
                  <p className="text-2xl font-bold text-white">{card.value}</p>
                  <p className="text-slate-400 text-sm">{card.label}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {card.trend === "up" ? (
                      <ArrowUpRight className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3 text-red-400" />
                    )}
                    <span className={`text-xs ${card.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
                      {card.change}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* User Growth Chart */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-semibold">User Growth</h3>
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="space-y-3">
                  {data?.userGrowth?.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">{formatDate(item.date)}</span>
                        <span className="text-white">{item.count} users</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.count / Math.max(...(data?.userGrowth.map(d => d.count) || [1])) * 100})%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transaction Trend Chart */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-semibold">Transaction Trend</h3>
                  <LineChart className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="space-y-4">
                  {data?.transactionTrend?.slice(0, 7).map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">{formatDate(item.date)}</span>
                        <div className="flex gap-3">
                          <span className="text-emerald-400">+{formatCurrency(item.income)}</span>
                          <span className="text-red-400">-{formatCurrency(item.expense)}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.income / (item.income + item.expense)) * 100}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full bg-emerald-500 rounded-full"
                          />
                        </div>
                        <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.expense / (item.income + item.expense)) * 100}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full bg-red-500 rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Breakdown */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-semibold">Spending by Category</h3>
                  <PieChart className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="space-y-3">
                  {data?.categoryBreakdown?.map((cat, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">{cat.category}</span>
                        <span className="text-white">{formatCurrency(cat.amount)} ({cat.percentage}%)</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.percentage}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Users */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-semibold">Top Savers</h3>
                  <Award className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="space-y-3">
                  {data?.topUsers?.map((user, idx) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">{user.name?.charAt(0) || 'U'}</span>
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{user.name}</p>
                          <p className="text-slate-500 text-xs">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-400 font-bold text-sm">{formatCurrency(user.totalSaved)}</p>
                        <p className="text-slate-500 text-xs">{user.transactionCount} transactions</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Monthly Stats Table */}
            <div className="mt-6 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold">Monthly Performance</h3>
                <Calendar className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-3 text-slate-400 text-sm font-medium">Month</th>
                      <th className="text-left py-3 px-3 text-slate-400 text-sm font-medium">New Users</th>
                      <th className="text-left py-3 px-3 text-slate-400 text-sm font-medium">Transactions</th>
                      <th className="text-left py-3 px-3 text-slate-400 text-sm font-medium">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.monthlyStats?.map((stat, idx) => (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition">
                        <td className="py-3 px-3 text-white text-sm">{stat.month}</td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <UserPlus className="w-3 h-3 text-emerald-400" />
                            <span className="text-white text-sm">{stat.users}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-3 h-3 text-blue-400" />
                            <span className="text-white text-sm">{stat.transactions}</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-emerald-400 font-medium">{formatCurrency(stat.revenue)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
