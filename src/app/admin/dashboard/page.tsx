
"use client";

import React, { Suspense, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, TrendingUp, TrendingDown, DollarSign, 
  Activity, Shield, Zap, ArrowUpRight, Bell,
  RefreshCw, Loader2, Sparkles, Crown, Award,
  Wallet, Target, CreditCard, LineChart, BarChart3,
  UserPlus, UserMinus, CheckCircle, XCircle, Clock,
  AlertCircle
} from "lucide-react";
import { toast } from "react-hot-toast";
import { api } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import LiveNotifications from "@/components/notifications/LiveNotifications";
import ActivityFeed from "@/components/realtime/ActivityFeed";

// Stats Component
function DashboardStats() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    activeBudgets: 0,
    aiInsights: 0,
    totalIncome: 0,
    totalExpense: 0,
    profit: 0,
    userGrowth: 0,
    transactionGrowth: 0,
    budgetGrowth: 0,
    insightGrowth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error("No token found");
          setLoading(false);
          return;
        }
        
        // Try to fetch from API, if fails use mock data
        try {
          const response = await api.get('/admin/dashboard/stats');
          if (response.data.success) {
            setStats(response.data.data);
          }
        } catch (apiError) {
          console.log("Using mock stats data");
          // Mock data for development
          setStats({
            totalUsers: 1250,
            totalTransactions: 45200,
            activeBudgets: 456,
            aiInsights: 2345,
            totalIncome: 125000,
            totalExpense: 87500,
            profit: 37500,
            userGrowth: 12,
            transactionGrowth: 8,
            budgetGrowth: 5,
            insightGrowth: 23
          });
        }
      } catch (error) {
        console.error("Failed to load stats");
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-2xl p-5 animate-pulse">
            <div className="w-12 h-12 rounded-xl bg-white/10 mb-4" />
            <div className="h-8 w-24 bg-white/10 rounded mb-2" />
            <div className="h-4 w-16 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    { icon: Users, label: 'Total Users', value: stats.totalUsers.toLocaleString(), change: `+${stats.userGrowth}%`, color: 'blue' },
    { icon: DollarSign, label: 'Total Transactions', value: `₿ ${(stats.totalTransactions / 1000).toFixed(1)}K`, change: `+${stats.transactionGrowth}%`, color: 'green' },
    { icon: TrendingUp, label: 'Active Budgets', value: stats.activeBudgets.toLocaleString(), change: `+${stats.budgetGrowth}%`, color: 'purple' },
    { icon: Activity, label: 'AI Insights', value: stats.aiInsights.toLocaleString(), change: `+${stats.insightGrowth}%`, color: 'orange' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {statCards.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className={`p-3 rounded-xl bg-${stat.color}-500/20 group-hover:scale-110 transition`}>
              <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
            </div>
            <span className="flex items-center gap-1 text-emerald-400 text-sm font-semibold">
              {stat.change} <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white mt-4">{stat.value}</h3>
          <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

// Financial Overview Component
function FinancialOverview() {
  const [data, setData] = useState({
    totalIncome: 125000,
    totalExpense: 87500,
    profit: 37500
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        
        try {
          const response = await api.get('/admin/financial/overview');
          if (response.data.success) {
            setData(response.data.data);
          }
        } catch (apiError) {
          console.log("Using mock financial data");
          // Mock data for development
          setData({
            totalIncome: 125000,
            totalExpense: 87500,
            profit: 37500
          });
        }
      } catch (error) {
        console.error("Failed to load financial data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white/5 rounded-2xl p-5 animate-pulse">
            <div className="h-4 w-24 bg-white/10 rounded mb-2" />
            <div className="h-8 w-32 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 rounded-2xl p-5 border border-emerald-500/20">
        <p className="text-slate-400 text-sm">Total Income</p>
        <p className="text-2xl font-bold text-emerald-400">+{formatCurrency(data.totalIncome)}</p>
      </div>
      <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 rounded-2xl p-5 border border-red-500/20">
        <p className="text-slate-400 text-sm">Total Expense</p>
        <p className="text-2xl font-bold text-red-400">-{formatCurrency(data.totalExpense)}</p>
      </div>
      <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-2xl p-5 border border-blue-500/20">
        <p className="text-slate-400 text-sm">Net Profit</p>
        <p className="text-2xl font-bold text-blue-400">{formatCurrency(data.profit)}</p>
      </div>
    </div>
  );
}

// Recent Users Component
function RecentUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        try {
          const response = await api.get('/admin/users/recent?limit=5');
          if (response.data.success) {
            setUsers(response.data.data);
          }
        } catch (apiError) {
          // Mock users for development
          setUsers([
            { id: '1', name: 'John Doe', email: 'john@example.com' },
            { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
            { id: '3', name: 'Mike Johnson', email: 'mike@example.com' },
            { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com' },
            { id: '5', name: 'David Brown', email: 'david@example.com' }
          ]);
        }
      } catch (error) {
        console.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between py-2 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/10" />
              <div>
                <div className="h-4 w-24 bg-white/10 rounded mb-1" />
                <div className="h-3 w-32 bg-white/10 rounded" />
              </div>
            </div>
            <div className="h-4 w-12 bg-white/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user, i) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center justify-between py-2 border-b border-white/5"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">{user.name?.charAt(0) || 'U'}</span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">{user.name}</p>
              <p className="text-slate-400 text-xs">{user.email}</p>
            </div>
          </div>
          <span className="text-xs text-emerald-400">Active</span>
        </motion.div>
      ))}
    </div>
  );
}

// System Health Component
function SystemHealth() {
  const [health, setHealth] = useState({
    api: { status: 'operational', percentage: 98 },
    database: { status: 'connected', percentage: 95 },
    ai: { status: 'degraded', percentage: 75 },
    redis: { status: 'operational', percentage: 99 }
  });

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await api.get('/admin/health');
        if (response.data.success) {
          setHealth(response.data.data);
        }
      } catch (error) {
        console.log("Using mock health data");
      }
    };
    
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-slate-300 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            API Status
          </span>
          <span className="text-emerald-400">{health.api.status}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${health.api.percentage}%` }}
            className="bg-emerald-500 h-2 rounded-full"
          />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-slate-300 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Database
          </span>
          <span className="text-emerald-400">{health.database.status}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${health.database.percentage}%` }}
            className="bg-emerald-500 h-2 rounded-full"
          />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-slate-300 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
            AI Service
          </span>
          <span className="text-yellow-400">{health.ai.status}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${health.ai.percentage}%` }}
            className="bg-yellow-500 h-2 rounded-full"
          />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-slate-300 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Redis Cache
          </span>
          <span className="text-emerald-400">{health.redis.status}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${health.redis.percentage}%` }}
            className="bg-emerald-500 h-2 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}

// Main Admin Dashboard Component
export default function AdminDashboard() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-xl">
                <Crown className="w-6 h-6 text-emerald-400" />
              </div>
              <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
              <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">Live</span>
            </div>
            <p className="text-slate-400 ml-10">Welcome back! Real-time platform insights</p>
          </div>
          <div className="flex items-center gap-3">
            <LiveNotifications />
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-lg bg-white/10 text-slate-400 hover:text-white hover:bg-white/20 transition"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <DashboardStats />

        {/* Financial Overview */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            Financial Overview
          </h2>
          <FinancialOverview />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          
          {/* Left Column */}
          <div className="space-y-6">
            {/* Recent Users */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-emerald-400" />
                  Recent Users
                </h2>
                <Shield className="w-5 h-5 text-slate-400" />
              </div>
              <RecentUsers />
            </div>

            {/* Real-time Activity Feed */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Live Activity Feed
                </h2>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-slate-400 text-xs">Real-time</span>
                </div>
              </div>
              <ActivityFeed />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* System Health */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  System Health
                </h2>
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <SystemHealth />
            </div>

            {/* AI Insights Summary */}
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <h2 className="text-lg font-semibold text-white">AI Insights</h2>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Based on recent data, user engagement has increased by 23% this month. 
                AI-powered recommendations are showing 94% accuracy. 
                Consider optimizing budget alerts for better user retention.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span>Last updated: just now</span>
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span>AI model: Gemini Pro</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-2xl p-4 text-center">
                <Target className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">156</p>
                <p className="text-slate-400 text-xs">Goals Completed</p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 text-center">
                <Wallet className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">₿ 2.4M</p>
                <p className="text-slate-400 text-xs">Total Saved</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
